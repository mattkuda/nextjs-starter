import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from "@supabase/supabase-js"
import Stripe from 'stripe'

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
})

export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        // Get user from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_user_id', userId)
            .single()

        if (userError || !user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        // If user has no subscription, return basic info
        if (!user.stripe_subscription_id) {
            return NextResponse.json({
                subscription_status: user.subscription_status || 'free',
                credits: user.credits || 5,
                subscription_end_date: null,
                next_billing_date: null,
                is_cancel_scheduled: false,
                billing_cycle_anchor: null
            })
        }

        try {
            // Get detailed subscription info from Stripe
            const stripeSubscription = await stripe.subscriptions.retrieve(user.stripe_subscription_id, {
                expand: ['latest_invoice', 'customer']
            })

            // Calculate next billing date
            const nextBillingDate = new Date(stripeSubscription.current_period_end * 1000)
            
            // Calculate credits reset date (same as next billing date for monthly subscriptions)
            const creditsResetDate = nextBillingDate

            return NextResponse.json({
                subscription_status: user.subscription_status,
                credits: user.credits,
                subscription_end_date: nextBillingDate.toISOString(),
                next_billing_date: nextBillingDate.toISOString(),
                credits_reset_date: creditsResetDate.toISOString(),
                is_cancel_scheduled: stripeSubscription.cancel_at_period_end || user.is_cancel_scheduled || false,
                billing_cycle_anchor: new Date(stripeSubscription.billing_cycle_anchor * 1000).toISOString(),
                stripe_status: stripeSubscription.status,
                current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
                current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString()
            })

        } catch (stripeError) {
            console.error('Error fetching Stripe subscription:', stripeError)
            
            // Fallback to database info if Stripe fails
            return NextResponse.json({
                subscription_status: user.subscription_status || 'free',
                credits: user.credits || 5,
                subscription_end_date: user.subscription_end_date,
                next_billing_date: user.subscription_end_date,
                is_cancel_scheduled: user.is_cancel_scheduled || false,
                error: 'Could not fetch detailed subscription info'
            })
        }

    } catch (error) {
        console.error('Error in subscription details endpoint:', error)
        return NextResponse.json(
            { error: 'Failed to fetch subscription details' },
            { status: 500 }
        )
    }
}
