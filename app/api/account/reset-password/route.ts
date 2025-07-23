import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Always use the authenticated user's email
    const email = user.user_metadata?.email || user.email;
    if (!email) {
        return NextResponse.json({ error: "No email found for user." }, { status: 400 });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `/dashboard/account`,
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
} 