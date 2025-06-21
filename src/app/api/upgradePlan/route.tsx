import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Monthly price IDs
const stripeStarterMonthlyPriceId = process.env.STRIPE_STARTER_MONTHLY_PRICE_ID;
const stripeProMonthlyPriceId = process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
const stripeMaxMonthlyPriceId = process.env.STRIPE_MAX_MONTHLY_PRICE_ID;

// Yearly price IDs
const stripeStarterYearlyPriceId = process.env.STRIPE_STARTER_YEARLY_PRICE_ID;
const stripeProYearlyPriceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
const stripeMaxYearlyPriceId = process.env.STRIPE_MAX_YEARLY_PRICE_ID;

const stripe = new Stripe(stripeSecretKey as string, {
    apiVersion: '2025-01-27.acacia',
});

export async function POST(req: NextRequest) {
    try {
        const { clerkId, userId, email, plan, billing } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        if (!plan || !['starter', 'pro', 'max'].includes(plan)) {
            return NextResponse.json(
                { error: 'Valid plan is required (starter, pro, or max)' },
                { status: 400 }
            );
        }

        const billingPeriod = billing || 'monthly';
        if (!['monthly', 'yearly'].includes(billingPeriod)) {
            return NextResponse.json(
                { error: 'Valid billing period is required (monthly or yearly)' },
                { status: 400 }
            );
        }

        // Get the appropriate price ID based on plan and billing period
        let priceId: string | undefined;

        if (billingPeriod === 'monthly') {
            switch (plan) {
                case 'starter':
                    priceId = stripeStarterMonthlyPriceId;
                    break;
                case 'pro':
                    priceId = stripeProMonthlyPriceId;
                    break;
                case 'max':
                    priceId = stripeMaxMonthlyPriceId;
                    break;
            }
        } else { // yearly
            switch (plan) {
                case 'starter':
                    priceId = stripeStarterYearlyPriceId;
                    break;
                case 'pro':
                    priceId = stripeProYearlyPriceId;
                    break;
                case 'max':
                    priceId = stripeMaxYearlyPriceId;
                    break;
            }
        }

        if (!priceId) {
            return NextResponse.json(
                { error: `Price ID not found for ${plan} ${billingPeriod} plan` },
                { status: 500 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            customer_email: email,
            allow_promotion_codes: false,
            success_url: `${req.headers.get('origin')}/dashboard?success=true&plan=${plan}&billing=${billingPeriod}`,
            cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
            metadata: {
                clerk_user_id: clerkId,
                user_id: userId,
                plan: plan,
                billing_period: billingPeriod,
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
