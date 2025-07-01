import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from "@supabase/supabase-js";
import { SubscriptionStatus } from '@/lib/constants';
import Stripe from 'stripe';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

// Map Stripe price IDs to subscription tiers
const PRICE_ID_TO_TIER: Record<string, SubscriptionStatus> = {
    [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!]: SubscriptionStatus.STARTER,
    [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: SubscriptionStatus.PRO,
    [process.env.STRIPE_MAX_MONTHLY_PRICE_ID!]: SubscriptionStatus.MAX,
    [process.env.STRIPE_STARTER_YEARLY_PRICE_ID!]: SubscriptionStatus.STARTER,
    [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: SubscriptionStatus.PRO,
    [process.env.STRIPE_MAX_YEARLY_PRICE_ID!]: SubscriptionStatus.MAX,
};

async function checkSubscriptionStatusWithRetry(userId: string, maxRetries = 3): Promise<SubscriptionStatus> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            // Get user from database
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id, stripe_subscription_id')
                .eq('clerk_user_id', userId)
                .single();

            if (userError || !user) {
                console.error("Error fetching user:", userError);
                return SubscriptionStatus.FREE;
            }

            let stripeSubscriptionId = user.stripe_subscription_id;

            // If no subscription ID in user table, check subscriptions table
            if (!stripeSubscriptionId) {
                const { data: subscription } = await supabase
                    .from('subscriptions')
                    .select('stripe_subscription_id')
                    .eq('user_id', user.id)
                    .eq('is_active', true)
                    .single();

                stripeSubscriptionId = subscription?.stripe_subscription_id;
            }

            if (!stripeSubscriptionId) {
                // If this is not the last attempt, wait and retry
                if (attempt < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); // Exponential backoff
                    continue;
                }
                return SubscriptionStatus.FREE;
            }

            // Get subscription details from Stripe to find the price ID
            const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

            // Check if subscription is actually active
            if (!['active', 'trialing'].includes(stripeSubscription.status)) {
                return SubscriptionStatus.FREE;
            }

            const priceId = stripeSubscription.items.data[0]?.price.id;

            if (!priceId) {
                return SubscriptionStatus.FREE;
            }

            // Map price ID to subscription tier
            return PRICE_ID_TO_TIER[priceId] || SubscriptionStatus.FREE;

        } catch (error) {
            console.error(`Error checking subscription status (attempt ${attempt + 1}):`, error);

            // If this is not the last attempt, wait and retry
            if (attempt < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1)));
                continue;
            }

            return SubscriptionStatus.FREE;
        }
    }

    return SubscriptionStatus.FREE;
}

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const subscriptionStatus = await checkSubscriptionStatusWithRetry(userId);

        return NextResponse.json({
            subscription_status: subscriptionStatus,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error in subscription status check:", error);
        return NextResponse.json(
            {
                subscription_status: SubscriptionStatus.FREE,
                error: "Failed to check subscription status",
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
}
