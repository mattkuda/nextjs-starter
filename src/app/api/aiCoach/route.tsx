import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { encoding_for_model } from 'tiktoken';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions.mjs';
import { User } from '../../../types';
import { formatUserPromptDescription } from '../../../lib/utils';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

const model = "gpt-4o-mini";
const MAX_INPUT_TOKENS = 120000;
const MAX_OUTPUT_TOKENS = 8000;
const SAFE_THRESHOLD = MAX_INPUT_TOKENS - MAX_OUTPUT_TOKENS;

const encoding = encoding_for_model(model);

function countTokens(messages: ChatCompletionMessageParam[]) {
    return messages.reduce((total, message) => total + encoding.encode(message.content as string).length, 0);
}

function spliceMessages(messages: ChatCompletionMessageParam[]) {
    let totalTokens = countTokens(messages);

    while (totalTokens > SAFE_THRESHOLD) {
        messages.splice(1, 1); // Keep system prompt, remove oldest user/assistant message
        totalTokens = countTokens(messages);
    }

    return messages;
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
            .eq('clerk_id', userId)
            .single<User>();

        if (userError || !user) {
            console.error('Error fetching user data:', userError);
            return NextResponse.json({ error: 'Failed to fetch user data.' }, { status: 400 });
        }

        if (user.credits <= 0) {
            return NextResponse.json({ error: 'Insufficient credits. Upgrade your plan to continue.' }, { status: 403 });
        }

        const { message, conversationHistory } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Thread context is required' }, { status: 400 })
        }

        // Start with the system message
        let messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: `You are an expert professional development coach specializing in communication, and workplace dynamics. 
                ${formatUserPromptDescription(user)}
                Your responses should be:
                - Empathetic and supportive while maintaining professionalism
                - Concise and actionable
                - Focused on practical solutions
                - Based on best practices in professional development
                
                Avoid:
                - Generic advice without context
                - Overly theoretical responses
                - Making assumptions about the situation
                
                Format your responses in a clear, conversational manner.`
            }
        ]

        // Add conversation history if it exists
        if (conversationHistory?.length) {
            messages = [...messages, ...conversationHistory]
        }

        messages.push({
            role: "user",
            content: message
        })

        messages = spliceMessages(messages);

        const completion = await openai.chat.completions.create({
            model,
            messages,
            max_tokens: MAX_OUTPUT_TOKENS,
            temperature: 0.7,
            presence_penalty: 0.6,
            frequency_penalty: 0.5,
        });

        const response = completion.choices[0].message.content;

        if (!response) {
            throw new Error('No response generated');
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({ credits: user.credits - 1 })
            .eq('clerk_id', userId);

        if (updateError) {
            console.error('Error updating credits:', updateError);
            return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
        }

        return NextResponse.json({ response });
    } catch (error) {
        console.error('AI Coach error:', error);
        return NextResponse.json({ error: 'Failed to generate coaching response' }, { status: 500 });
    }
}
