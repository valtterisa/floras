"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Subscription, Plan } from "@/lib/database";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "past_due"
  | "trialing"
  | "unpaid"
  | "paused"
  | null;

export interface UserSubscription {
  plan: "starter" | "pro" | "enterprise";
  status: SubscriptionStatus;
  periodEnd: Date | null;
  isActive: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function useSubscription(): UserSubscription {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<
    Omit<UserSubscription, "isLoading" | "error">
  >({
    plan: "starter",
    status: null,
    periodEnd: null,
    isActive: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Get the current user
  useEffect(() => {
    const supabase = createClient();

    // Get the current user
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error);
          setError(new Error(`Authentication error: ${error.message}`));
        } else {
          setUser(user);
        }
      } catch (err) {
        console.error("Exception when fetching user:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        // If we don't have a user after the fetch attempt, we're not loading anymore
        if (!user) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();

    // Set up auth state listener
    let authSubscription: { unsubscribe: () => void } | undefined;

    try {
      const { data } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user || null);
        }
      );
      authSubscription = data.subscription;
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err instanceof Error ? err : new Error(`Auth listener error: ${String(err)}`));
      setIsLoading(false);
    }

    return () => {
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  // Fetch subscription data when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        // First get websites owned by user
        const { data: websites, error: websitesError } = await supabase
          .from("websites")
          .select("id")
          .eq("user_id", user.id)
          .is("deleted_at", null);

        if (websitesError) {
          throw new Error(`Database error: ${websitesError.message || JSON.stringify(websitesError)}`);
        }

        if (!websites || websites.length === 0) {
          // No websites, default to starter plan
          setSubscription({
            plan: "starter",
            status: null,
            periodEnd: null,
            isActive: false,
          });
          setIsLoading(false);
          return;
        }

        const websiteIds = websites.map(website => website.id);

        // Get active subscription for any of user's websites
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select(`
            id,
            status,
            current_period_end,
            plan_id,
            plans:plan_id (
              name
            )
          `)
          .in("website_id", websiteIds)
          .eq("status", "active")
          .order("created_at", { ascending: false })
          .maybeSingle();

        if (subscriptionError) {
          throw new Error(`Database error: ${subscriptionError.message || JSON.stringify(subscriptionError)}`);
        }

        if (!subscriptionData) {
          // No active subscription, default to starter plan
          setSubscription({
            plan: "starter",
            status: null,
            periodEnd: null,
            isActive: false,
          });
        } else {
          // Determine plan from subscription data
          const planName = subscriptionData.plans?.name?.toLowerCase() || "starter";
          const periodEnd = subscriptionData.current_period_end
            ? new Date(subscriptionData.current_period_end)
            : null;

          setSubscription({
            plan: (planName === "pro" || planName === "enterprise")
              ? planName
              : "starter",
            status: subscriptionData.status as SubscriptionStatus,
            periodEnd,
            isActive: subscriptionData.status === "active" || subscriptionData.status === "trialing",
          });
        }
      } catch (err) {
        console.error("Error fetching subscription:", err);
        // Set default values if we can't fetch subscription data
        setSubscription({
          plan: "starter", // Default to starter plan
          status: null,
          periodEnd: null,
          isActive: false,
        });
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return {
    ...subscription,
    isLoading,
    error,
  };
}
