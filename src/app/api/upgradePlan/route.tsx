import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripeProPlanPriceId = process.env.STRIPE_PRO_PLAN_PRICE_ID;
const stripe = new Stripe(stripeSecretKey as string, {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
    try {
        const { clerkId, userId, email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: stripeProPlanPriceId!,
                    quantity: 1,
                },
            ],
            customer_email: email,
            allow_promotion_codes: false,
            success_url: `${req.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
            metadata: {
                clerk_id: clerkId,
                user_id: userId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Error creating subscription session:', error);
        return NextResponse.json(
            { error: 'Failed to create subscription session' },
            { status: 500 }
        );
    }
}
