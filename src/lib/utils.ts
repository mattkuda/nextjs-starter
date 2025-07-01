import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { User } from "../types";

// Map Stripe price IDs to subscription tiers and billing cycles
const PRICE_ID_TO_PLAN: Record<string, { tier: string; billing_cycle: string }> = {
  [process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!]: { tier: 'starter', billing_cycle: 'monthly' },
  [process.env.STRIPE_PRO_MONTHLY_PRICE_ID!]: { tier: 'pro', billing_cycle: 'monthly' },
  [process.env.STRIPE_MAX_MONTHLY_PRICE_ID!]: { tier: 'max', billing_cycle: 'monthly' },
  [process.env.STRIPE_STARTER_YEARLY_PRICE_ID!]: { tier: 'starter', billing_cycle: 'yearly' },
  [process.env.STRIPE_PRO_YEARLY_PRICE_ID!]: { tier: 'pro', billing_cycle: 'yearly' },
  [process.env.STRIPE_MAX_YEARLY_PRICE_ID!]: { tier: 'max', billing_cycle: 'yearly' },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extract tier and billing cycle from Stripe price ID
 * @param priceId - Stripe price ID
 * @returns Object with tier and billing_cycle, or null if not found
 */
export function getPlanFromPriceId(priceId: string): { tier: string; billing_cycle: string } | null {
  return PRICE_ID_TO_PLAN[priceId] || null;
}

export function formatUserPromptDescription(user: User): string {
  let description = '';
  if (user?.first_name) {
    description += `You're assistant to ${user.first_name}${user?.last_name ? ` ${user.last_name}` : ''}.`;
  }
  if (user?.additional_context) {
    description += ` Additional context about the user: ${user.additional_context}`;
  }
  return description;
}

export function getReplyLengthInstructions(length: string, customSentences: string): string {
  if (customSentences) {
    return `STRICT RULE: Each variation must be exactly ${customSentences} ${customSentences.length > 1 ? "sentences" : "sentence"} long.`;
  }
  switch (length) {
    case "short":
      return "1-2 sentences: concise and focused.";
    case "medium":
      return "3-5 sentences: balanced and comprehensive.";
    case "long":
      return "5-10 sentences: detailed and thorough.";
    default:
      return "Default reply length.";
  }
}

export function getDocLengthInstructions(length: string, customParagraphs: string): string {
  if (customParagraphs) {
    return `STRICT RULE: The document must be exactly ${customParagraphs} ${customParagraphs.length > 1 ? "paragraphs" : "paragraph"} long.`;
  }
  switch (length) {
    case "short":
      return "1-4 paragraphs: concise and focused.";
    case "medium":
      return "5-9 paragraphs: balanced and comprehensive.";
    case "long":
      return "10-15 paragraphs: detailed and thorough.";
    default:
      return "Default document length.";
  }
}

/**
 * Deducts credits from user account and logs the usage
 * SERVER-SIDE ONLY - Do not call from client components
 * @param userId - The user's database ID (not Clerk ID)
 * @param subscriptionStatus - The user's subscription status
 * @param featureId - Identifier for the feature consuming credits
 * @param creditsToDeduct - Number of credits to deduct (default: 1)
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deductCredits(
  userId: string,
  subscriptionStatus: string,
  featureId: string,
  creditsToDeduct: number = 1
): Promise<{ success: boolean; error?: string }> {
  try {
    // Import server-side dependencies
    const { createClient } = await import('@supabase/supabase-js');
    const { SubscriptionStatus } = await import('./constants');

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );

    // Log the credit usage in audit table
    const { error: logError } = await supabase
      .from('credit_usage_log')
      .insert({
        user_id: userId,
        feature_id: featureId,
        credits_used: creditsToDeduct
      });

    if (logError) {
      console.error('Error logging credit usage:', logError);
      return { success: false, error: 'Failed to log credit usage' };
    }

    // Update the appropriate usage table based on subscription status
    if (subscriptionStatus === SubscriptionStatus.FREE) {
      // For free users, credits are tracked via the audit log only
      // No additional updates needed as credits are calculated from the log
      return { success: true };
    } else {
      // For paid users, update the current billing window usage
      const now = new Date();

      // First get the current usage
      const { data: currentUsage, error: fetchError } = await supabase
        .from('credit_usage')
        .select('credits_used')
        .eq('user_id', userId)
        .lte('usage_window_start', now.toISOString().split('T')[0])
        .gte('usage_window_end', now.toISOString().split('T')[0])
        .single();

      if (fetchError) {
        console.error('Error fetching current usage:', fetchError);
        return { success: false, error: 'Failed to fetch current usage' };
      }

      // Update with the new total
      const newTotal = (currentUsage?.credits_used || 0) + creditsToDeduct;
      const { error: updateError } = await supabase
        .from('credit_usage')
        .update({ credits_used: newTotal })
        .eq('user_id', userId)
        .lte('usage_window_start', now.toISOString().split('T')[0])
        .gte('usage_window_end', now.toISOString().split('T')[0]);

      if (updateError) {
        console.error('Error updating credit usage:', updateError);
        return { success: false, error: 'Failed to update credit usage' };
      }

      return { success: true };
    }
  } catch (error) {
    console.error('Error in deductCredits:', error);
    return { success: false, error: 'Failed to deduct credits' };
  }
}