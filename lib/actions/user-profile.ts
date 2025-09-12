"use server";

import { createClient } from "@/lib/supabase/server";
import {
  getPolarSubscriptionByExternalId,
  managePolarSubscription,
} from "@/lib/polar";
import { Website } from "@/lib/database";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  plan: "hobby" | "pro" | "enterprise" | null;
  created_at: string;
  updated_at: string;
}

export interface UserSubscriptionData {
  profile: UserProfile;
  subscription: {
    plan: "hobby" | "pro" | "enterprise" | null;
    status: string | null;
    isActive: boolean;
    hasAccess: boolean;
    requiresUpgrade: boolean;
  };
}

/**
 * Server action to get user profile and subscription data
 * This is the secure server-side way to get user data
 */
export async function getUserProfileAndSubscription(): Promise<{
  data: UserSubscriptionData | null;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        data: null,
        error: "Not authenticated",
      };
    }

    // Get user profile data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Failed to fetch user profile:", profileError);
      return {
        data: null,
        error: "Failed to fetch profile",
      };
    }

    const userPlan = profile?.plan as "hobby" | "pro" | "enterprise" | null;

    // Try to get Polar subscription details if user has a plan
    let subscriptionStatus = "active";
    let isActive = true;

    if (userPlan) {
      try {
        const polarSubscription = await getPolarSubscriptionByExternalId(
          user.id
        );
        if (polarSubscription?.subscription) {
          subscriptionStatus = polarSubscription.subscription.status;
          isActive =
            subscriptionStatus === "active" ||
            subscriptionStatus === "trialing";
        }
      } catch (polarError) {
        console.warn("Could not fetch Polar subscription details:", polarError);
        // Keep defaults (active/true) if Polar fetch fails
      }
    } else {
      isActive = false;
    }

    const userData: UserSubscriptionData = {
      profile,
      subscription: {
        plan: userPlan,
        status: userPlan ? subscriptionStatus : null,
        isActive,
        hasAccess: isActive && userPlan !== null,
        requiresUpgrade: !isActive || userPlan === null,
      },
    };

    return {
      data: userData,
    };
  } catch (error) {
    console.error("Error fetching user profile and subscription:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Server action to create customer portal URL
 * This is the secure server-side way to get portal URLs
 */
export async function createCustomerPortalUrl(): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "Not authenticated",
      };
    }

    // Get the customer portal URL for this user
    const portalUrl = await managePolarSubscription(user.id);

    if (!portalUrl) {
      return {
        error:
          "No active subscription found or unable to create portal session",
      };
    }

    return {
      url: portalUrl,
    };
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return {
      error: "Failed to create customer portal session",
    };
  }
}

/**
 * Server action to create checkout URL
 * This is the secure server-side way to create checkout sessions
 */
export async function createCheckoutUrl(productId: string): Promise<{
  url?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || !user.email) {
      return {
        error: "Not authenticated",
      };
    }

    if (!productId) {
      return {
        error: "Missing productId",
      };
    }

    // Import polar and other dependencies here to avoid client-side imports
    const { polar, createPolarCustomer } = await import("@/lib/polar");
    const { getPublicUrl } = await import("@/lib/env-config");

    // Ensure customer exists first
    const customer = await createPolarCustomer(
      user.id,
      user.email,
      user.user_metadata?.full_name || user.email
    );

    if (!customer?.id) {
      console.error("Failed to create or retrieve Polar customer");
      return {
        error: "Failed to create customer",
      };
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      customerEmail: user.email,
      customerId: customer.id,
      successUrl: `${getPublicUrl()}/checkout/success`,
    });

    return {
      url: checkout.url,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    return {
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Server action to get user websites
 * This is the secure server-side way to get website data
 */
export async function getUserWebsites(): Promise<{
  websites: Website[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        websites: [],
        error: "Not authenticated",
      };
    }

    // Get user's websites
    const { data: websitesData, error: websitesError } = await supabase
      .from("websites")
      .select("*")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (websitesError) {
      console.error("Failed to fetch websites:", websitesError);
      return {
        websites: [],
        error: "Failed to fetch websites",
      };
    }

    // Mark websites as active if they are deployed or deploying
    const processedWebsites: Website[] = (websitesData || []).map((site) => ({
      ...site,
      is_active: site.status === "deployed" || site.status === "deploying",
    }));

    return {
      websites: processedWebsites,
    };
  } catch (error) {
    console.error("Error fetching user websites:", error);
    return {
      websites: [],
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
