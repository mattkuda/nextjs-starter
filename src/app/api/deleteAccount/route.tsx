import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
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

export async function POST() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user data from database
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_user_id', userId)
            .single();

        if (userError || !user) {
            console.error('Error fetching user:', userError);
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Cancel any active subscriptions
        if (user.stripe_subscription_id) {
            try {
                await stripe.subscriptions.cancel(user.stripe_subscription_id);
            } catch (stripeError) {
                console.error('Error canceling subscription:', stripeError);
                // Continue with deletion even if subscription cancellation fails
            }
        }


        // Delete credit usage logs
        const { error: creditLogError } = await supabase
            .from('credit_usage_log')
            .delete()
            .eq('user_id', user.id);

        if (creditLogError) {
            console.error('Error deleting credit usage logs:', creditLogError);
        }

        // Delete credit usage records
        const { error: creditUsageError } = await supabase
            .from('credit_usage')
            .delete()
            .eq('user_id', user.id);

        if (creditUsageError) {
            console.error('Error deleting credit usage:', creditUsageError);
        }

        // Delete subscriptions
        const { error: subscriptionError } = await supabase
            .from('subscriptions')
            .delete()
            .eq('user_id', user.id);

        if (subscriptionError) {
            console.error('Error deleting subscriptions:', subscriptionError);
        }

        // Delete user record
        const { error: deleteUserError } = await supabase
            .from('users')
            .delete()
            .eq('clerk_user_id', userId);

        if (deleteUserError) {
            console.error('Error deleting user:', deleteUserError);
            return NextResponse.json(
                { error: 'Failed to delete user data' },
                { status: 500 }
            );
        }

        // Delete user from Clerk
        try {
            const client = await clerkClient();
            await client.users.deleteUser(userId);
        } catch (clerkError) {
            console.error('Error deleting user from Clerk:', clerkError);
            // User data is already deleted from our database, so this is not critical
        }


        return NextResponse.json({
            message: 'Account deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}
