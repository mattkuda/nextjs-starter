import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(stripeSecretKey as string, {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
    try {
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
