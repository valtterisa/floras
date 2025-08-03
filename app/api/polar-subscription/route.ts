import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPolarSubscriptionByExternalId } from "@/lib/polar";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const externalId = searchParams.get("externalId");

    if (!externalId) {
        return NextResponse.json({ error: "Missing externalId" }, { status: 400 });
    }

    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify the externalId matches the current user
        if (user.id !== externalId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        try {
            const result = await getPolarSubscriptionByExternalId(externalId);
            return NextResponse.json({ subscription: result?.subscription || null });
        } catch (error: any) {
            // If user doesn't have a subscription yet, return null instead of error
            if (error.statusCode === 404) {
                console.log("User doesn't have a subscription yet");
                return NextResponse.json({ subscription: null });
            }
            throw error;
        }
    } catch (error) {
        console.error("Error fetching polar subscription:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscription" },
            { status: 500 }
        );
    }
} 