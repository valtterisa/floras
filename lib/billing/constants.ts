export const AI_CREDITS_FEATURE = "ai_credits";
/** @deprecated Use AI_CREDITS_FEATURE */
export const GENERATION_FEATURE = AI_CREDITS_FEATURE;

export const TOP_UP_PLAN_ID = "credit_top_up";

export const PRO_MONTHLY_PLAN_ID = "pro";
export const PRO_YEARLY_PLAN_ID = "pro_yearly";
export const ENTERPRISE_PLAN_ID = "enterprise";

export const PAID_PLAN_IDS = [PRO_MONTHLY_PLAN_ID, PRO_YEARLY_PLAN_ID] as const;

export type PaidPlanId = (typeof PAID_PLAN_IDS)[number];

export function isPaidPlanId(planId: string | undefined | null): boolean {
  return Boolean(planId && PAID_PLAN_IDS.includes(planId as PaidPlanId));
}

export const ENTERPRISE_CONTACT_HREF = "https://cal.com/valtterisa/15min";

/** Minimum dollar balance required to start a generation. */
export const MIN_CREDIT_BALANCE = 0.05;

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
