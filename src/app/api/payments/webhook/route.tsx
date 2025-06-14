import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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

async function handleSubscriptionEvent(
    event: Stripe.Event,
    type: "created" | "updated" | "deleted"
) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Get the customer to find the user
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = (customer as Stripe.Customer).email;

    if (!userEmail) {
        return NextResponse.json({
            status: 500,
            error: "Customer email could not be fetched",
        });
    }

    // Get the user from our database
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .single();

    if (userError || !user) {
        console.error("Error fetching user:", userError);
        return NextResponse.json({
            status: 500,
            error: "User not found",
        });
    }

    // Get the plan from our database using the price ID
    const priceId = subscription.items.data[0].price.id;
    const { data: plan, error: planError } = await supabase
        .from("plans")
        .select("id")
        .eq("stripe_price_id", priceId)
        .single();

    if (planError || !plan) {
        console.error("Error fetching plan:", planError);
        return NextResponse.json({
            status: 500,
            error: "Plan not found",
        });
    }

    if (type === "created" || type === "updated") {
        // Update or create subscription
        const { error: subError } = await supabase
            .from("subscriptions")
            .upsert({
                user_id: user.id,
                plan_id: plan.id,
                stripe_subscription_id: subscription.id,
                start_date: new Date(subscription.current_period_start * 1000),
                end_date: new Date(subscription.current_period_end * 1000),
                is_active: subscription.status === "active",
                cancel_at_period_end: subscription.cancel_at_period_end,
            });

        if (subError) {
            console.error("Error updating subscription:", subError);
            return NextResponse.json({
                status: 500,
                error: "Error updating subscription",
            });
        }

        // Initialize credit usage window for new subscriptions
        if (type === "created") {
            const { error: creditError } = await supabase
                .from("credit_usage")
                .insert({
                    user_id: user.id,
                    subscription_id: subscription.id,
                    usage_window_start: new Date(subscription.current_period_start * 1000),
                    usage_window_end: new Date(subscription.current_period_end * 1000),
                    credits_used: 0,
                });

            if (creditError) {
                console.error("Error initializing credit usage:", creditError);
                return NextResponse.json({
                    status: 500,
                    error: "Error initializing credit usage",
                });
            }
        }
    } else if (type === "deleted") {
        // Mark subscription as inactive
        const { error: subError } = await supabase
            .from("subscriptions")
            .update({
                is_active: false,
                end_date: new Date(),
            })
            .eq("stripe_subscription_id", subscription.id);

        if (subError) {
            console.error("Error deactivating subscription:", subError);
            return NextResponse.json({
                status: 500,
                error: "Error deactivating subscription",
            });
        }
    }

    return NextResponse.json({
        status: 200,
        message: `Subscription ${type} handled successfully`,
    });
}

async function handleInvoiceEvent(event: Stripe.Event, status: "succeeded" | "failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer as string;

    // Get the customer to find the user
    const customer = await stripe.customers.retrieve(customerId);
    const userEmail = (customer as Stripe.Customer).email;

    if (!userEmail) {
        return NextResponse.json({
            status: 500,
            error: "Customer email could not be fetched",
        });
    }

    // Get the user from our database
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail)
        .single();

    if (userError || !user) {
        console.error("Error fetching user:", userError);
        return NextResponse.json({
            status: 500,
            error: "User not found",
        });
    }

    if (status === "succeeded") {
        // Reset credit usage for the new billing period
        const { error: creditError } = await supabase
            .from("credit_usage")
            .insert({
                user_id: user.id,
                subscription_id: invoice.subscription,
                usage_window_start: new Date(invoice.period_start * 1000),
                usage_window_end: new Date(invoice.period_end * 1000),
                credits_used: 0,
            });

        if (creditError) {
            console.error("Error resetting credit usage:", creditError);
            return NextResponse.json({
                status: 500,
                error: "Error resetting credit usage",
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
            // Subscription events
            case "customer.subscription.created":
                return handleSubscriptionEvent(event, "created");
            case "customer.subscription.updated":
                return handleSubscriptionEvent(event, "updated");
            case "customer.subscription.deleted":
                return handleSubscriptionEvent(event, "deleted");

            // Invoice events
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
