import {
  isByokPlanId,
  isProPlanId,
  isSubscribedPlanId,
} from "@/lib/billing/constants";

type SubscriptionLike = {
  status?: string | null;
  planId?: string | null;
  autoEnable?: boolean | null;
};

type CustomerLike = {
  subscriptions?: SubscriptionLike[] | null;
} | null | undefined;

function activeSubscriptions(customer: CustomerLike): SubscriptionLike[] {
  if (!customer?.subscriptions?.length) return [];
  return customer.subscriptions.filter(
    (s) => s.status === "active" && !s.autoEnable
  );
}

export function hasActiveProPlan(customer: CustomerLike): boolean {
  return activeSubscriptions(customer).some((s) => isProPlanId(s.planId));
}

export function hasActiveByokPlan(customer: CustomerLike): boolean {
  return activeSubscriptions(customer).some((s) => isByokPlanId(s.planId));
}

export function hasActiveSubscription(customer: CustomerLike): boolean {
  return activeSubscriptions(customer).some((s) =>
    isSubscribedPlanId(s.planId)
  );
}

export type GenerationDenyReason = "no_plan" | "no_credits" | "no_api_key";
