import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createClient } from "@supabase/supabase-js";
import { WORKER_TYPES } from '../../../lib/constants';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

// Define the ticket schema
const TicketSchema = z.object({
    title: z.string().describe("A clear, concise title for the ticket"),
    desc: z.string().describe("Detailed description including background and acceptance criteria"),
    points: z.number().optional().describe("Story points estimate (if requested)"),
});

// Define the response schema using Zod
const ResponseSchema = z.object({
    tickets: z.array(TicketSchema).describe("Array of generated tickets"),
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
            .eq('clerk_id', userId)
            .single();

        if (userError || !user) {
            return NextResponse.json({ error: "Failed to fetch user data." }, { status: 400 });
        }

        if (user.credits <= 0) {
            return NextResponse.json({ error: "Insufficient credits. Upgrade your plan to continue." }, { status: 403 });
        }

        // Parse request body
        const {
            projectContext,
            ticketPreferences,
            workerType,
            numberOfTickets,
            includePoints,
        } = await req.json();

        // Validate required inputs
        if (!projectContext) {
            return NextResponse.json({ error: "Project context is required." }, { status: 400 });
        }

        const workerTypeInfo = Object.values(WORKER_TYPES).find(w => w.value === workerType);
        if (!workerTypeInfo) {
            return NextResponse.json({ error: "Invalid worker type." }, { status: 400 });
        }

        // Generate the enhanced prompt
        const prompt = `
You are an expert product manager and technical writer who creates clear, actionable tickets for development teams.

Project Context:
${projectContext}

Ticket Formatting Preferences:
${ticketPreferences || "Follow standard ticket format with clear descriptions and acceptance criteria."}

Additional Parameters:
- Assigned to: ${workerTypeInfo.label}
- Number of tickets: ${numberOfTickets}
${includePoints ? "- Include story point estimates (using Fibonacci: 1, 2, 3, 5, 8, 13)" : "Do not give tickets points"}

Create ${numberOfTickets} well-structured tickets that:
1. Break down the work into logical, manageable pieces
2. Have clear, specific titles
3. Include detailed descriptions with any necessary background
4. List specific acceptance criteria
5. Are appropriate for the assigned worker type (${workerTypeInfo.label})
${includePoints ? "6. Include reasonable story point estimates" : "Do not give tickets points"}

Output Format:
{
  "tickets": [
    {
      "title": "Clear ticket title",
      "desc": "Detailed description with background and acceptance criteria",
      ${includePoints ? '"points": <story point estimate>,' : '"points": null,'}
    },
    ...
  ]
}`;

        const response = await openai.beta.chat.completions.parse({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You must output a JSON object strictly following the provided schema. Each ticket should be comprehensive yet concise.`,
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            response_format: zodResponseFormat(ResponseSchema, "ticketResponse"),
        });

        // Deduct credits
        const { error: updateError } = await supabase
            .from('users')
            .update({ credits: user.credits - 1 })
            .eq('clerk_id', userId);

        if (updateError) {
            console.error("Error updating credits:", updateError);
            return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
        }

        return NextResponse.json(response.choices[0].message.parsed);
    } catch (error) {
        console.error("Error generating tickets:", error);
        return NextResponse.json(
            // @ts-expect-error don't care
            { error: "Failed to generate tickets.", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: "NextJS Starter Ticket Creator API",
        supportedParams: [
            "projectContext (required)",
            "ticketPreferences (optional)",
            "workerType (required)",
            "numberOfTickets (required)",
            "includePoints (optional)",
        ],
    });
} 