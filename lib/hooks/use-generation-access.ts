"use client";

import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import { api } from "@/convex/_generated/api";
import {
  AI_CREDITS_FEATURE,
  MIN_CREDIT_BALANCE,
} from "@/lib/billing/constants";
import {
  hasActiveByokPlan,
  hasActiveProPlan,
  hasActiveSubscription,
  type GenerationDenyReason,
} from "@/lib/billing/plan";

export function useGenerationAccess() {
  const { isAuthenticated } = useConvexAuth();
  const { check, refetch, data } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated },
  });
  const keyMeta = useQuery(
    api.users.getAnthropicKeyMeta,
    isAuthenticated ? {} : "skip"
  );

  const balance = data?.balances?.[AI_CREDITS_FEATURE]?.remaining ?? null;
  const billingReady = Boolean(isAuthenticated && data);
  const hasProPlan = billingReady ? hasActiveProPlan(data) : false;
  const hasByokPlan = billingReady ? hasActiveByokPlan(data) : false;
  const hasSubscription = billingReady ? hasActiveSubscription(data) : false;
  const hasApiKey = Boolean(keyMeta?.configured);
  const canPublish = hasProPlan;

  const getDenyReason = (): GenerationDenyReason | null => {
    if (!isAuthenticated || !data) return null;
    if (!hasActiveSubscription(data)) return "no_plan";
    if (hasActiveByokPlan(data) && !hasActiveProPlan(data)) {
      if (keyMeta === undefined) return null;
      if (!keyMeta?.configured) return "no_api_key";
      return null;
    }
    try {
      const { allowed } = check({
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: MIN_CREDIT_BALANCE,
      });
      if (allowed === false) return "no_credits";
    } catch {
      return "no_credits";
    }
    return null;
  };

  return {
    assertCanGenerate: () => getDenyReason() === null,
    getDenyReason,
    hasProPlan,
    hasByokPlan,
    hasSubscription,
    hasApiKey,
    canPublish,
    billingReady,
    refetch,
    balance,
    data,
    isAuthenticated,
  };
}
