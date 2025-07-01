import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY! // Use the service role key for full table access
);

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return NextResponse.json(
            { error: "Clerk Webhook Secret is missing in environment variables." },
            { status: 500 }
        );
    }

    const headerPayload = req.headers;
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json(
            { error: "Missing webhook headers from Clerk." },
            { status: 400 }
        );
    }

    const body = await req.text();
    const wh = new Webhook(WEBHOOK_SECRET);

    let event;
    try {
        event = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        });
    } catch (error) {
        console.error("Webhook verification failed:", error);
        return NextResponse.json(
            { error: "Webhook verification failed." },
            { status: 400 }
        );
    }

    const payload = JSON.parse(body);
    // @ts-expect-error any error from clerk
    const { type } = event;

    try {
        switch (type) {
            case "user.created":
                await handleUserCreated(payload.data);
                break;

            case "user.updated":
                await handleUserUpdated(payload.data);
                break;

            case "user.deleted":
                await handleUserDeleted(payload.data);
                break;

            default:
                console.warn(`Unhandled event type: ${type}`);
                return NextResponse.json(
                    { message: `Unhandled event type: ${type}` },
                    { status: 200 }
                );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Error handling webhook:", error);
        // @ts-expect-error any error from clerk
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

async function handleUserCreated(data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
}) {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;

    const { error } = await supabase.from("users").insert({
        clerk_user_id: id,
        email,
        first_name,
        last_name,
    });

    if (error) {
        console.error("Error inserting user:", error);
        throw new Error("Failed to insert user into database.");
    }
}

async function handleUserUpdated(data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name?: string;
    last_name?: string;
}) {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;

    const { error } = await supabase
        .from("users")
        .update({
            email,
            first_name,
            last_name,
        })
        .eq("clerk_user_id", id);

    if (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user in database.");
    }
}

async function handleUserDeleted(data: { id: string }) {
    const { id } = data;

    const { error } = await supabase
        .from("users")
        .delete()
        .eq("clerk_user_id", id);

    if (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user from database.");
    }
}
