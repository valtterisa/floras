import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { polar, getPolarSubscriptionByExternalId } from "@/lib/polar";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reason, comment } = body;

    if (!polar) {
      return NextResponse.json(
        { success: false, error: "Polar not configured" },
        { status: 500 }
      );
    }

    // Get user's subscription from Polar
    const polarSubscription = await getPolarSubscriptionByExternalId(user.id);

    if (!polarSubscription?.subscription?.id) {
      return NextResponse.json(
        { success: false, error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel the subscription at period end
    const result = await polar.subscriptions.update({
      id: polarSubscription.subscription.id,
      subscriptionUpdate: {
        cancel_at_period_end: true,
        customer_cancellation_reason: reason || "other",
        customer_cancellation_comment: comment || null,
      },
    });

    // Update user plan in Supabase profiles table to null when cancelled
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ plan: null })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update user plan:", updateError);
      // Don't fail the cancellation if profile update fails
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
      subscription: result,
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel subscription",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
