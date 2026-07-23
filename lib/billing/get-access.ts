import { Autumn } from "autumn-js";
import {
  AI_CREDITS_FEATURE,
  MIN_CREDIT_BALANCE,
} from "@/lib/billing/constants";
import { hasActivePaidPlan } from "@/lib/billing/plan";

export type AccessResult = {
  hasPaidPlan: boolean;
  creditAllowed: boolean;
};

export async function getAccess(customerId: string): Promise<AccessResult> {
  const secretKey = process.env.AUTUMN_SECRET_KEY;
  if (!secretKey) {
    return { hasPaidPlan: true, creditAllowed: true };
  }

  try {
    const autumn = new Autumn({ secretKey });
    const customer = await autumn.customers.get({ customerId });
    const hasPaidPlan = hasActivePaidPlan(customer);

    if (!hasPaidPlan) {
      return { hasPaidPlan: false, creditAllowed: false };
    }

    try {
      const check = await autumn.check({
        customerId,
        featureId: AI_CREDITS_FEATURE,
        requiredBalance: MIN_CREDIT_BALANCE,
      });
      return {
        hasPaidPlan: true,
        creditAllowed: check.allowed !== false,
      };
    } catch {
      return { hasPaidPlan: true, creditAllowed: true };
    }
  } catch {
    return { hasPaidPlan: true, creditAllowed: true };
  }
}
