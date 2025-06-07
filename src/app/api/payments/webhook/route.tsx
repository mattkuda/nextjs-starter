import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CREDITS_LIMITS, SubscriptionStatus } from "../../../../lib/constants";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(stripeSecretKey!);

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
    const reqText = await req.text();
    return webhooksHandler(reqText, req);
}

async function getCustomerEmail(customerId: string): Promise<string | null> {
    try {
        const customer = await stripe.customers.retrieve(customerId);
        return (customer as Stripe.Customer).email;
    } catch (error) {
        console.error("Error fetching customer email:", error);
        return null;
    }
}

async function handleSubscriptionEvent(
    event: Stripe.Event,
    type: "created" | "updated" | "deleted"
) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerEmail = await getCustomerEmail(subscription.customer as string);

    if (!customerEmail) {
        return NextResponse.json({
            status: 500,
            error: "Customer email could not be fetched",
        });
    }

    // Determine subscription status and updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        subscription_status: type === "deleted" ? SubscriptionStatus.FREE : SubscriptionStatus.PRO,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        subscription_end_date: type === "deleted"
            ? new Date().toISOString()
            : new Date(subscription.current_period_end * 1000).toISOString(),
    };

    // Manage is_cancel_scheduled flag
    updateData.is_cancel_scheduled = subscription.cancel_at_period_end || false;

    // Initialize credits for new Pro subscriptions or reset them for updated ones
    if (type === "created" || (type === "updated" && subscription.status === "active")) {
        updateData.credits = CREDITS_LIMITS[SubscriptionStatus.PRO];
    } else if (type === "deleted") {
        // Reset free users' credits
        updateData.credits = CREDITS_LIMITS[SubscriptionStatus.FREE];
    }

    const { error } = await supabase
        .from("users")
        .update(updateData)
        .eq("email", customerEmail);

    if (error) {
        console.error(`Error updating user during subscription ${type}:`, error);
        return NextResponse.json({
            status: 500,
            error: `Error updating user during subscription ${type}`,
        });
    }

    return NextResponse.json({
        status: 200,
        message: `User subscription ${type} handled successfully`,
    });
}

async function handleInvoiceEvent(event: Stripe.Event, status: "succeeded" | "failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerEmail = await getCustomerEmail(invoice.customer as string);

    if (!customerEmail) {
        return NextResponse.json({
            status: 500,
            error: "Customer email could not be fetched",
        });
    }

    if (status === "succeeded") {
        // Reset Pro users' credits on successful payment
        const { error } = await supabase
            .from("users")
            .update({
                credits: CREDITS_LIMITS[SubscriptionStatus.PRO],
                subscription_end_date: new Date(
                    (invoice.lines.data[0]?.period?.end || 0) * 1000
                ).toISOString(), // Sync with Stripe's `current_period_end`
            })
            .eq("email", customerEmail);

        if (error) {
            console.error("Error resetting credits on payment success:", error);
            return NextResponse.json({
                status: 500,
                error: "Error resetting credits on payment success",
            });
        }
    }

    return NextResponse.json({
        status: 200,
        message: `Invoice payment ${status} handled successfully`,
    });
}

async function webhooksHandler(
    reqText: string,
    request: NextRequest
): Promise<NextResponse> {
    const sig = request.headers.get("Stripe-Signature");

    try {
        const event = await stripe.webhooks.constructEventAsync(
            reqText,
            sig!,
            stripeWebhookSecret!
        );

        switch (event.type) {
            case "customer.subscription.created":
                return handleSubscriptionEvent(event, "created");
            case "customer.subscription.updated":
                return handleSubscriptionEvent(event, "updated");
            case "customer.subscription.deleted":
                return handleSubscriptionEvent(event, "deleted");
            case "invoice.payment_succeeded":
                return handleInvoiceEvent(event, "succeeded");
            case "invoice.payment_failed":
                return handleInvoiceEvent(event, "failed");
            default:
                return NextResponse.json({
                    status: 400,
                    error: "Unhandled event type",
                });
        }
    } catch (err) {
        console.error("Error constructing Stripe event:", err);
        return NextResponse.json({
            status: 500,
            error: "Webhook Error: Invalid Signature",
        });
    }
}
