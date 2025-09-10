"use client";

// Hook for managing user subscription state
// Supports new plan structure: null (no plan), 'hobby', 'pro', 'enterprise'
// Provides hasAccess and requiresUpgrade flags for feature gating

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "trialing"
  | "past_due"
  | null;

export interface UserSubscription {
  plan: "hobby" | "pro" | "enterprise" | null;
  status: SubscriptionStatus;
  periodEnd: Date | null;
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
  hasAccess: boolean; // Whether user can access paid features
  requiresUpgrade: boolean; // Whether user should be prompted to upgrade
  aiUsageLimits?: {
    monthly_chat_requests: number;
    monthly_content_generation_requests: number;
    monthly_code_generation_requests: number;
    monthly_image_generation_requests: number;
    monthly_token_limit: number;
  };
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: null,
    status: null,
    periodEnd: null,
    isActive: false,
    isLoading: true,
    error: null,
    hasAccess: false,
    requiresUpgrade: false,
  });

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const supabase = createClient();

  const fetchUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      setUser(user);
    } catch (err) {
      console.error("Error in fetchUser:", err);
    }
  };

  const fetchSubscription = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      // Get user's plan from their profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw new Error(
          `Database error: ${profileError.message || JSON.stringify(profileError)}`
        );
      }

      const userPlan = profile?.plan as "hobby" | "pro" | "enterprise" | null;

      // If user has a plan, try to get subscription details from Polar
      if (userPlan) {
        try {
          // Try to get subscription details for users with plans
          const response = await fetch(
            `/api/polar-subscription?externalId=${user.id}`
          );
          if (response.ok) {
            const { subscription: polarSubscription } = await response.json();

            const isSubscriptionActive =
              polarSubscription?.status === "active" ||
              polarSubscription?.status === "trialing";
            setSubscription({
              plan: userPlan,
              status: polarSubscription?.status || "active",
              periodEnd: polarSubscription?.current_period_end
                ? new Date(polarSubscription.current_period_end)
                : null,
              isActive: isSubscriptionActive,
              isLoading: false,
              error: null,
              hasAccess: isSubscriptionActive,
              requiresUpgrade: !isSubscriptionActive,
            });
          } else {
            // User has plan in profile but no Polar subscription (may be in transition)
            setSubscription({
              plan: userPlan,
              status: "active",
              periodEnd: null,
              isActive: true,
              isLoading: false,
              error: null,
              hasAccess: true,
              requiresUpgrade: false,
            });
          }
        } catch (polarError) {
          console.warn(
            "Could not fetch Polar subscription details:",
            polarError
          );
          // User has plan in profile, assume active
          setSubscription({
            plan: userPlan,
            status: "active",
            periodEnd: null,
            isActive: true,
            isLoading: false,
            error: null,
            hasAccess: true,
            requiresUpgrade: false,
          });
        }
      } else {
        // User has no plan selected
        setSubscription({
          plan: null,
          status: null,
          periodEnd: null,
          isActive: false,
          isLoading: false,
          error: null,
          hasAccess: false,
          requiresUpgrade: true,
        });
      }
    } catch (err) {
      console.error("Error fetching subscription:", err);
      // Set default values if we can't fetch subscription data
      setSubscription({
        plan: null, // Default to no plan
        status: null,
        periodEnd: null,
        isActive: false,
        isLoading: false,
        error: err instanceof Error ? err : new Error(String(err)),
        hasAccess: false,
        requiresUpgrade: true,
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [user, supabase]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user, fetchSubscription]);

  useEffect(() => {
    let authSubscription: any;

    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null);
      });
      authSubscription = data.subscription;
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(
        err instanceof Error
          ? err
          : new Error(`Auth listener error: ${String(err)}`)
      );
      setIsLoading(false);
    }

    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [supabase.auth]);

  return {
    ...subscription,
    isLoading,
    error,
  };
}
