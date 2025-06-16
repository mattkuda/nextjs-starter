"use server";

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import { MAX_DOCUMENT_INSTRUCTIONS_LENGTH } from '../../../lib/constants';
import { DocumentationResponse } from '../../../types';
import { formatUserPromptDescription, getDocLengthInstructions } from '../../../lib/utils';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Define the response schema using Zod
const ResponseSchema = z.object({
    document: z.string().describe("The AI-generated document as a single string."),
});

export async function POST(req: Request) {
    try {
        // Check authentication
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user data and check credits
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_user_id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "Failed to fetch user data." }, { status: 400 });
        }

        if (user.credits <= 0) {
            return NextResponse.json({ error: "Insufficient credits. Upgrade your plan to continue." }, { status: 403 });
        }

        // Parse request body
        const {
            instructions,
            docType,
            tone,
            docLength,
            customSections,
            useCustomSections,
            customParagraphs
        } = await req.json();

        // Validate required inputs
        if (!instructions || instructions.length > MAX_DOCUMENT_INSTRUCTIONS_LENGTH) {
            return NextResponse.json(
                { error: `Instructions must not exceed ${MAX_DOCUMENT_INSTRUCTIONS_LENGTH} characters.` },
                { status: 400 }
            );
        }

        // Generate the prompt
        const prompt = `
        You are a highly skilled writer specialized in creating structured and professional documentation.
        ${formatUserPromptDescription(user)}
        Based on the following user inputs, generate a complete document with appropriate sections and formatting:

        User Instructions: ${instructions}
        Document Type: ${docType}
        You must write in the following tone: ${tone}
        Length: ${getDocLengthInstructions(docLength, customParagraphs)}
        ${customSections && `These sections are required to be included in the document: ${customSections}`}
        ${customSections && useCustomSections ? `Do not include any other sections.` : 'Feel free to include any other sections that are relevant to the document.'}

        Other guidelines:
        1. Maintain clarity and a logical flow.
        2. Use the tone specified by the user.
        3. If custom sections are provided, use them. Otherwise, generate sections based on best practices.
        4. Structure the document with headings and concise paragraphs.

        Output the document as a plain string.`;

        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You must output a JSON object strictly following this schema:
{
  "document": "string"
}
Do not include any extraneous text.`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: zodResponseFormat(ResponseSchema, "documentationResponse"),
        });

        // Deduct credits
        const { error: updateError } = await supabase
            .from('users')
            .update({ credits: user.credits - 1 })
            .eq('clerk_user_id', userId);

        if (updateError) {
            console.error("Error updating credits:", updateError);
            return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
        }

        const result = response.choices[0].message.parsed as DocumentationResponse;
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error generating document:", error);
        return NextResponse.json(
            // @ts-expect-error asdf
            { error: "Failed to generate document.", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Documentation Writer API",
        supportedParams: [
            "instructions (required)",
            "docType (required)",
            "tone",
            "docLength",
            "customSections (optional)",
        ],
    });
}
