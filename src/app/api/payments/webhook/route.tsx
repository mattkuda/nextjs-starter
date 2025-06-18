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
    console.log("Webhook received");
    console.log(req);
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

    // Store plan info from Stripe metadata or price ID for reference
    const priceId = subscription.items.data[0].price.id;
    console.log("Processing subscription for price ID:", priceId);

    if (type === "created" || type === "updated") {
        // Update or create subscription
        const { data: subData, error: subError } = await supabase
            .from("subscriptions")
            .upsert({
                user_id: user.id,
                stripe_subscription_id: subscription.id,
                start_date: new Date(subscription.current_period_start * 1000).toISOString().split('T')[0],
                end_date: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
                is_active: ['active', 'trialing'].includes(subscription.status), // Include trialing status
                cancel_at_period_end: subscription.cancel_at_period_end,
            }, {
                onConflict: 'stripe_subscription_id'
            })
            .select()
            .single();

        // Also update the user table with the subscription ID for easier lookups
        if (subData && !subError) {
            await supabase
                .from("users")
                .update({ stripe_subscription_id: subscription.id })
                .eq("id", user.id);
        }

        if (subError) {
            console.error("Error updating subscription:", subError);
            return NextResponse.json({
                status: 500,
                error: "Error updating subscription",
            });
        }

        // Initialize credit usage window for new subscriptions
        if (type === "created" && subData) {
            const startDate = new Date(subscription.current_period_start * 1000);
            const endDate = new Date(subscription.current_period_end * 1000);

            // Ensure end date is after start date to satisfy database constraint
            if (endDate <= startDate) {
                endDate.setDate(startDate.getDate() + 1);
            }

            const { error: creditError } = await supabase
                .from("credit_usage")
                .insert({
                    user_id: user.id,
                    subscription_id: subData.id, // Use the database subscription ID, not Stripe ID
                    usage_window_start: startDate.toISOString().split('T')[0],
                    usage_window_end: endDate.toISOString().split('T')[0],
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
        // Mark subscription as inactive and clear user's subscription ID
        const { error: subError } = await supabase
            .from("subscriptions")
            .update({
                is_active: false,
                end_date: new Date().toISOString().split('T')[0],
            })
            .eq("stripe_subscription_id", subscription.id);

        if (subError) {
            console.error("Error deactivating subscription:", subError);
            return NextResponse.json({
                status: 500,
                error: "Error deactivating subscription",
            });
        }

        // Clear subscription ID from user table
        await supabase
            .from("users")
            .update({ stripe_subscription_id: null })
            .eq("id", user.id);
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
        // Get the subscription from our database using the Stripe subscription ID
        const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("id")
            .eq("stripe_subscription_id", invoice.subscription as string)
            .single();

        if (subError || !subscription) {
            console.error("Error fetching subscription:", subError);
            return NextResponse.json({
                status: 500,
                error: "Subscription not found",
            });
        }

        // Reset credit usage for the new billing period
        const startDate = new Date(invoice.period_start * 1000);
        const endDate = new Date(invoice.period_end * 1000);

        // Ensure end date is after start date to satisfy database constraint
        if (endDate <= startDate) {
            endDate.setDate(startDate.getDate() + 1);
        }

        const { error: creditError } = await supabase
            .from("credit_usage")
            .insert({
                user_id: user.id,
                subscription_id: subscription.id, // Use the database subscription ID
                usage_window_start: startDate.toISOString().split('T')[0],
                usage_window_end: endDate.toISOString().split('T')[0],
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
