import { SubscriptionStatus } from './lib/constants'

export type User = {
    id: string;
    clerk_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    job_title?: string;
    organization_name?: string;
    subscription_status: SubscriptionStatus;
    subscription_end_date?: string;
    credits: number;
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