import { NextRequest, NextResponse } from "next/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { validateEvent } from "@polar-sh/sdk/webhooks";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers = Object.fromEntries(request.headers.entries());

    const event = validateEvent(
      body,
      headers,
      process.env.NODE_ENV === "production"
        ? process.env.POLAR_WEBHOOK_SECRET!
        : process.env.POLAR_WEBHOOK_SECRET_SANDBOX!
    );

    // Handle different webhook events
    switch (event.type) {
      case "subscription.created":
      case "subscription.updated":
        await handleSubscriptionEvent(event.data);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data);
        break;

      default:
        console.log("Unhandled webhook event type:", event.type);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionEvent(subscription: any) {
  // Use service role client for webhook operations to bypass RLS
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Get customer external ID (this IS our auth.users.id)
    const externalId = subscription.customer?.external_id;

    if (!externalId) {
      // Fallback: try to find user by email if external ID is missing
      const customerEmail = subscription.customer?.email;
      if (customerEmail) {
        const { data: userByEmail, error: emailError } =
          await supabase.auth.admin.listUsers();
        const foundUser = userByEmail?.users?.find(
          (u: any) => u.email === customerEmail
        );

        if (!emailError && foundUser) {
          // Continue processing with the found user ID
          await processSubscriptionUpdate(supabase, foundUser.id, subscription);
          return;
        }
      }

      return;
    }

    // Process with external ID
    await processSubscriptionUpdate(supabase, externalId, subscription);
  } catch (error) {
    console.error("Error handling subscription event:", error);
  }
}

async function processSubscriptionUpdate(
  supabase: any,
  userId: string,
  subscription: any
) {
  try {
    // Map Polar product to our plan names
    const productName = subscription.product?.name?.toLowerCase();
    let planName: string | null = null;

    if (productName?.includes("hobby")) {
      planName = "hobby";
    } else if (productName?.includes("pro")) {
      planName = "pro";
    } else if (productName?.includes("enterprise")) {
      planName = "enterprise";
    }

    if (!planName) {
      console.error("Could not map product to plan:", productName);
      return;
    }

    // Update user's plan in Supabase
    // profiles.id IS the auth.users.id (confirmed by database inspection)
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: planName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update user plan:", error);
      // Log more details about the error for debugging
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    } else {
      // Verify the update by fetching the updated record
      const { data: verifyData, error: verifyError } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", userId)
        .single();

      if (verifyError) {
        console.error("Failed to verify plan update:", verifyError);
      } else {
      }
    }
  } catch (error) {
    console.error("Error in processSubscriptionUpdate:", error);
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  // Use service role client for webhook operations to bypass RLS
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    const externalId = subscription.customer?.external_id;
    if (!externalId) {
      return;
    }

    // Set plan to null when subscription is canceled
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", externalId);

    if (error) {
      console.error("Failed to update user plan on cancellation:", error);
      // Log more details about the error for debugging
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    } else {
    }
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
  }
}
