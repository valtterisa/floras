"use client";

import { useConvexAuth } from "convex/react";
import { useCustomer } from "autumn-js/react";
import {
  AI_CREDITS_FEATURE,
  MIN_CREDIT_BALANCE,
} from "@/lib/billing/constants";

export { AI_CREDITS_FEATURE, GENERATION_FEATURE } from "@/lib/billing/constants";

export function useGenerationAccess() {
  const { isAuthenticated } = useConvexAuth();
  const { check, refetch, data } = useCustomer({
    errorOnNotFound: false,
    queryOptions: { enabled: isAuthenticated },
  });

  const balance = data?.balances?.[AI_CREDITS_FEATURE]?.remaining ?? null;

  const assertCanGenerate = (): boolean => {
    if (!isAuthenticated || !data) return true;
    try {
      const { allowed } = check({
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: MIN_CREDIT_BALANCE,
      });
      return allowed !== false;
    } catch {
      return true;
    }
  };

  return { assertCanGenerate, refetch, balance, data, isAuthenticated };
}
