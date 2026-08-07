import { Autumn } from "autumn-js";
import {
  AI_CREDITS_FEATURE,
  MIN_CREDIT_BALANCE,
} from "@/lib/billing/constants";
import {
  hasActiveByokPlan,
  hasActiveProPlan,
  hasActiveSubscription,
} from "@/lib/billing/plan";

export type AccessResult = {
  hasProPlan: boolean;
  hasByokPlan: boolean;
  hasSubscription: boolean;
  creditAllowed: boolean;
  canGenerate: boolean;
  canPublish: boolean;
};

function billingFailOpen(): boolean {
  if (process.env.BILLING_FAIL_OPEN === "1") return true;
  if (process.env.VERCEL_ENV === "production") return false;
  return process.env.NODE_ENV === "development";
}

function denyAll(): AccessResult {
  return {
    hasProPlan: false,
    hasByokPlan: false,
    hasSubscription: false,
    creditAllowed: false,
    canGenerate: false,
    canPublish: false,
  };
}

function allowAll(): AccessResult {
  return {
    hasProPlan: true,
    hasByokPlan: false,
    hasSubscription: true,
    creditAllowed: true,
    canGenerate: true,
    canPublish: true,
  };
}

export async function getAccess(customerId: string): Promise<AccessResult> {
  const secretKey = process.env.AUTUMN_SECRET_KEY;
  if (!secretKey) {
    if (billingFailOpen()) {
      console.warn("[billing] AUTUMN_SECRET_KEY missing — fail-open");
      return allowAll();
    }
    console.error("[billing] AUTUMN_SECRET_KEY missing — fail-closed");
    return denyAll();
  }

  try {
    const autumn = new Autumn({ secretKey });
    const customer = await autumn.customers.get({ customerId });
    const hasProPlan = hasActiveProPlan(customer);
    const hasByokPlan = hasActiveByokPlan(customer);
    const hasSubscription = hasActiveSubscription(customer);

    if (!hasSubscription) {
      return {
        hasProPlan: false,
        hasByokPlan: false,
        hasSubscription: false,
        creditAllowed: false,
        canGenerate: false,
        canPublish: false,
      };
    }

    if (hasByokPlan && !hasProPlan) {
      return {
        hasProPlan: false,
        hasByokPlan: true,
        hasSubscription: true,
        creditAllowed: false,
        canGenerate: true,
        canPublish: false,
      };
    }

    try {
      const check = await autumn.check({
        customerId,
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: MIN_CREDIT_BALANCE,
      });
      const creditAllowed = check.allowed !== false;
      return {
        hasProPlan: true,
        hasByokPlan: false,
        hasSubscription: true,
        creditAllowed,
        canGenerate: creditAllowed,
        canPublish: true,
      };
    } catch (error) {
      if (billingFailOpen()) {
        console.warn("[billing] credit check failed — fail-open", error);
        return allowAll();
      }
      console.error("[billing] credit check failed — fail-closed", error);
      return {
        hasProPlan: true,
        hasByokPlan: false,
        hasSubscription: true,
        creditAllowed: false,
        canGenerate: false,
        canPublish: true,
      };
    }
  } catch (error) {
    if (billingFailOpen()) {
      console.warn("[billing] customer fetch failed — fail-open", error);
      return allowAll();
    }
    console.error("[billing] customer fetch failed — fail-closed", error);
    return denyAll();
  }
}
