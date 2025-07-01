import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from "@supabase/supabase-js";
import { SubscriptionStatus } from '@/lib/constants';
import Stripe from 'stripe';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Use the service role key for full table access
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
async function determineSubscriptionStatus(user: { id: string; stripe_subscription_id?: string }, retryCount = 0): Promise<SubscriptionStatus> {
    try {
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
            // If this is the first attempt and we're checking soon after signup,
            // wait a bit and retry to allow webhook processing time
            if (retryCount === 0) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
                return determineSubscriptionStatus(user, retryCount + 1);
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
        console.error("Error determining subscription status:", error);

        // If this is a Stripe API error and we haven't retried yet, try once more
        if (retryCount === 0 && error instanceof Error && error.message.includes('No such subscription')) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return determineSubscriptionStatus(user, retryCount + 1);
        }

        return SubscriptionStatus.FREE;
    }
}

async function getCurrentCreditsUsage(userId: string, subscriptionStatus: SubscriptionStatus): Promise<{ remaining: number; used: number; maxCredits: number }> {
    // Import credits limits
    const { CREDITS_LIMITS } = await import('@/lib/constants');
    const maxCredits = CREDITS_LIMITS[subscriptionStatus] || 0;

    if (subscriptionStatus === SubscriptionStatus.FREE) {
        // For free users, check total usage from credit_usage_log
        const { data: totalUsage } = await supabase
            .from('credit_usage_log')
            .select('credits_used')
            .eq('user_id', userId);

        const used = totalUsage?.reduce((sum, log) => sum + log.credits_used, 0) || 0;
        const remaining = Math.max(0, maxCredits - used);

        return { remaining, used, maxCredits };
    }

    // For paid users, get current billing window usage
    const now = new Date();
    const { data: currentUsage } = await supabase
        .from('credit_usage')
        .select('credits_used')
        .eq('user_id', userId)
        .lte('usage_window_start', now.toISOString().split('T')[0])
        .gte('usage_window_end', now.toISOString().split('T')[0])
        .single();

    const used = currentUsage?.credits_used || 0;
    const remaining = Math.max(0, maxCredits - used);

    return { remaining, used, maxCredits };
}

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_user_id', userId)
            .single()

        if (error) {
            return new NextResponse(error.message, { status: 500 })
        }

        // Determine subscription status
        const subscriptionStatus = await determineSubscriptionStatus(user);

        // Get current credits usage
        const creditsInfo = await getCurrentCreditsUsage(user.id, subscriptionStatus);

        // Get enhanced subscription details if user has a subscription
        let enhancedUser = {
            ...user,
            subscription_status: subscriptionStatus,
            credits: creditsInfo.remaining,
            credits_used: creditsInfo.used,
            max_credits: creditsInfo.maxCredits
        };

        if (user.stripe_subscription_id) {
            try {
                const stripeSubscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
                enhancedUser = {
                    ...enhancedUser,
                    subscription_end_date: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
                    is_cancel_scheduled: stripeSubscription.cancel_at_period_end || user.is_cancel_scheduled || false
                };
            } catch (stripeError) {
                console.error('Error fetching Stripe subscription details:', stripeError);
                // Continue with existing data if Stripe fails
            }
        }

        return NextResponse.json(enhancedUser)
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 400 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await request.json()

        const { data, error } = await supabase
            .from('users')
            .update(body)
            .eq('clerk_user_id', userId)
            .select()
            .single()

        if (error) {
            return new NextResponse(error.message, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json(
            { error: "Failed to update user data" },
            { status: 400 }
        );
    }
}
