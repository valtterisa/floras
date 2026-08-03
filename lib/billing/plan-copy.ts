export const BYOK_FEATURES = [
  "Bring your own Anthropic key",
  "Live preview sandboxes",
  "Export ZIP (self-host)",
  "No Floras hosting",
] as const;

export const PRO_FEATURES = [
  "$20 of AI credits every month",
  "Hosting included",
  "Top up credits to keep editing",
  "SEO-ready Astro that ranks",
] as const;

export const PRO_FEATURES_EXTENDED = [
  ...PRO_FEATURES,
  "Export ZIP anytime",
] as const;
