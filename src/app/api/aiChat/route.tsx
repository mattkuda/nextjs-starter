import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { User } from '../../../types';
import { formatUserPromptDescription, deductCredits } from '../../../lib/utils';
import { SubscriptionStatus } from '../../../lib/constants';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

const model = "gpt-4o-mini";
const MAX_OUTPUT_TOKENS = 8000;

// Determine subscription status helper function
async function determineSubscriptionStatus(user: User): Promise<SubscriptionStatus> {
    if (!user.stripe_subscription_id) {
        return SubscriptionStatus.FREE;
    }

    const { data: subscription } = await supabase
        .from('subscriptions')
        .select('tier, is_active')
        .eq('stripe_subscription_id', user.stripe_subscription_id)
        .eq('is_active', true)
        .single();

    if (!subscription) {
        return SubscriptionStatus.FREE;
    }

    // Map database tier to SubscriptionStatus enum
    switch (subscription.tier) {
        case 'starter':
            return SubscriptionStatus.STARTER;
        case 'pro':
            return SubscriptionStatus.PRO;
        case 'max':
            return SubscriptionStatus.MAX;
        default:
            return SubscriptionStatus.FREE;
    }
}

// Get current credits usage helper function
async function getCurrentCreditsUsage(userId: string, subscriptionStatus: SubscriptionStatus): Promise<{ remaining: number; used: number; maxCredits: number }> {
    const { CREDITS_LIMITS } = await import('@/lib/constants');
    const maxCredits = CREDITS_LIMITS[subscriptionStatus] || 0;


    if (subscriptionStatus === SubscriptionStatus.FREE) {
        // For free users, check total usage from credit_usage_log
        const { data: totalUsage } = await supabase
            .from('credit_usage_log')
            .select('credits_used')
            .eq('user_id', userId);

        const used = totalUsage?.reduce((sum, log) => sum + log.credits_used, 0) || 0;
        const remaining = Math.max(0, maxCredits - used);

        return { remaining, used, maxCredits };
    }

    // For paid users, get current billing window usage
    const now = new Date();
    const { data: currentUsage } = await supabase
        .from('credit_usage')
        .select('credits_used')
        .eq('user_id', userId)
        .lte('usage_window_start', now.toISOString().split('T')[0])
        .gte('usage_window_end', now.toISOString().split('T')[0])
        .single();

    const used = currentUsage?.credits_used || 0;
    const remaining = Math.max(0, maxCredits - used);

    return { remaining, used, maxCredits };
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_user_id', userId)
            .single<User>();

        if (userError || !user) {
            console.error('Error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data.' }, { status: 400 });
        }

        // Determine subscription status and check credits
        const subscriptionStatus = await determineSubscriptionStatus(user);
        const creditsInfo = await getCurrentCreditsUsage(user.id, subscriptionStatus);

        if (creditsInfo.remaining <= 0) {
            return NextResponse.json({ error: 'Insufficient credits. Upgrade your plan to continue.' }, { status: 403 });
        }

        const { message, conversationHistory } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Start with the system message - updated for Next.js starter kit context
        let messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are an expert AI assistant specializing in Next.js development, modern web development, and starter kit best practices.
                ${formatUserPromptDescription(user)}
                
                Your expertise includes:
                - Next.js 14+ with App Router
                - React Server Components and Client Components
                - TypeScript best practices
                - Tailwind CSS and modern UI libraries
                - Database integration (Supabase, Prisma)
                - Authentication (Clerk, NextAuth)
                - Deployment and performance optimization
                - Modern development workflows
                
                Your responses should be:
                - Technically accurate and up-to-date
                - Practical and actionable
                - Well-structured with code examples when relevant
                - Focused on modern best practices
                - Helpful for both beginners and experienced developers
                
                Format your responses clearly with proper markdown when including code examples.`
            }
        ];

        // Add conversation history if it exists
        if (conversationHistory?.length) {
            messages = [...messages, ...conversationHistory];
        }

        messages.push({
            role: "user",
            content: message
        });

        // Create streaming response
        const completion = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: MAX_OUTPUT_TOKENS,
            temperature: 0.7,
            stream: true,
        });

        // Deduct credits before streaming starts
        const creditResult = await deductCredits(
            user.id,
            subscriptionStatus,
            'ai_chat',
            1
        );

        if (!creditResult.success) {
            console.error('Error deducting credits:', creditResult.error);
            return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
        }

        // Create a readable stream for the response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                        }
                    }
                    controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    controller.error(error);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('AI Chat error:', error);
        return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
}
