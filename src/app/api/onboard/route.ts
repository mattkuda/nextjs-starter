import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
)

interface OnboardingRequestBody {
    firstName: string
    lastName: string
    jobTitle: string
    organizationName: string
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await req.json() as OnboardingRequestBody
        const client = await clerkClient();

        // 1. Save user details to Supabase
        const { error: supabaseError } = await supabase
            .from('users')
            .update({
                first_name: body.firstName,
                last_name: body.lastName,
                organization_name: body.organizationName,
                job_title: body.jobTitle,
            })
            .eq('clerk_user_id', userId);

        if (supabaseError) {
            console.error('Supabase error:', supabaseError)
            return new NextResponse("Database error", { status: 500 })
        }

        // 2. Update Clerk metadata to mark onboarding as complete
        await client.users.updateUser(userId, {
            publicMetadata: {
                hasCompletedOnboarding: true
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Onboarding error:', error)
        return new NextResponse("Internal error", { status: 500 })
    }
} 