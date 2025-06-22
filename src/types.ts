import { SubscriptionStatus } from './lib/constants'

export type User = {
    id: string;
    clerk_user_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    additional_context?: string;
    subscription_status: SubscriptionStatus;
    subscription_end_date?: string;
    credits: number; // remaining credits
    credits_used?: number; // credits used in current period
    max_credits?: number; // maximum credits for current plan
    created_at: string;
    updated_at: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    is_cancel_scheduled?: boolean;
};

export interface ThreadInsightsResponse {
    summary: string;
    recommendedAction: string;
    replies: string[];
}

export interface ThreadStarterResponse {
    suggestedStarters: string[];
}
export interface ToneConverterResponse {
    convertedTexts: string[];
}

export interface DocumentationResponse {
    document: string;
}