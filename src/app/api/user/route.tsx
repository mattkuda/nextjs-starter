import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Use the service role key for full table access
);
export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('clerk_id', userId)
            .single()

        if (error) {
            return new NextResponse(error.message, { status: 500 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error("Error fetching user data:", error);
        return NextResponse.json(
            { error: "Failed to fetch user data" },
            { status: 400 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await request.json()

        const { data, error } = await supabase
            .from('users')
            .update(body)
            .eq('clerk_id', userId)
            .select()
            .single()

        if (error) {
            return new NextResponse(error.message, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error("Error updating user data:", error);
        return NextResponse.json(
            { error: "Failed to update user data" },
            { status: 400 }
        );
    }
}
