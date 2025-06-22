import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey as string, {
    apiVersion: '2025-01-27.acacia',
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { subscriptionId } = await req.json();

        if (!subscriptionId) {
            return NextResponse.json(
                { error: 'Missing subscriptionId' },
                { status: 400 }
            );
        }

        // Cancel the subscription at the end of the billing period
        const canceledSubscription = await stripe.subscriptions.update(
            subscriptionId,
            { cancel_at_period_end: true }
        );

        // Update the subscription in our database
        const { error: dbError } = await supabase
            .from('subscriptions')
            .update({
                cancel_at_period_end: true
            })
            .eq('stripe_subscription_id', subscriptionId);

        if (dbError) {
            console.error('Error updating subscription in database:', dbError);
            // Don't fail the request if database update fails, as Stripe cancellation succeeded
        }

        // Update user table to reflect cancellation status
        const { error: userError } = await supabase
            .from('users')
            .update({
                is_cancel_scheduled: true
            })
            .eq('clerk_user_id', userId);

        if (userError) {
            console.error('Error updating user cancellation status:', userError);
        }

        return NextResponse.json({
            message: 'Subscription cancellation scheduled.',
            subscription: canceledSubscription,
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        return NextResponse.json(
            { error: 'Failed to cancel subscription' },
            { status: 500 }
        );
    }
}
