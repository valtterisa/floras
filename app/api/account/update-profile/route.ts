import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
    fullName: z.string().min(2, "Name must be at least 2 characters"),
});

export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = profileSchema.safeParse({ fullName: body.fullName });
    if (!result.success) {
        return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    // Update user metadata
    const { error } = await supabase.auth.updateUser({
        data: { full_name: body.fullName },
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    revalidatePath("/dashboard/account", "layout");

    return NextResponse.json({ success: true });
} 