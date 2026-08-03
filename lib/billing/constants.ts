export const AI_CREDITS_FEATURE = "ai_credits";
export const HOSTING_FEATURE = "hosting";

export const TOP_UP_PLAN_ID = "credit_top_up";

export const BYOK_PLAN_ID = "byok";
export const PRO_MONTHLY_PLAN_ID = "pro";
export const PRO_YEARLY_PLAN_ID = "pro_yearly";
export const ENTERPRISE_PLAN_ID = "enterprise";

export const PRO_PLAN_IDS = [PRO_MONTHLY_PLAN_ID, PRO_YEARLY_PLAN_ID] as const;
export const BYOK_PLAN_IDS = [BYOK_PLAN_ID] as const;
export const SUBSCRIBED_PLAN_IDS = [
  ...PRO_PLAN_IDS,
  ...BYOK_PLAN_IDS,
] as const;

export type ProPlanId = (typeof PRO_PLAN_IDS)[number];
export type ByokPlanId = (typeof BYOK_PLAN_IDS)[number];
export type SubscribedPlanId = (typeof SUBSCRIBED_PLAN_IDS)[number];

export function isProPlanId(planId: string | undefined | null): boolean {
  return Boolean(planId && PRO_PLAN_IDS.includes(planId as ProPlanId));
}

export function isByokPlanId(planId: string | undefined | null): boolean {
  return Boolean(planId && BYOK_PLAN_IDS.includes(planId as ByokPlanId));
}

export function isSubscribedPlanId(
  planId: string | undefined | null
): boolean {
  return Boolean(
    planId && SUBSCRIBED_PLAN_IDS.includes(planId as SubscribedPlanId)
  );
}

export const ENTERPRISE_CONTACT_HREF = "https://cal.com/valtterisa/15min";

export const MIN_CREDIT_BALANCE = 0.05;
export const LOW_CREDIT_WARNING = 1;

export type TopUpPack = {
  id: string;
  credits: number;
  priceLabel: string;
  hint?: string;
};

export const TOP_UP_PACKS: TopUpPack[] = [
  {
    id: "pack_5",
    credits: 5,
    priceLabel: "$5",
    hint: "Quick boost",
  },
  {
    id: "pack_20",
    credits: 20,
    priceLabel: "$20",
    hint: "Most popular",
  },
  {
    id: "pack_50",
    credits: 50,
    priceLabel: "$50",
    hint: "Best value",
  },
];

export function formatCredits(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount < 10 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
