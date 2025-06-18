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
async function determineSubscriptionStatus(user: { id: string; stripe_subscription_id?: string }): Promise<SubscriptionStatus> {
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
        return SubscriptionStatus.FREE;
    }
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

        // Add subscription status to user data
        const userWithSubscription = {
            ...user,
            subscription_status: subscriptionStatus
        };

        return NextResponse.json(userWithSubscription)
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
