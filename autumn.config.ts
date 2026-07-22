import { feature, item, plan } from "atmn";

// Features
export const siteGenerations = feature({
  id: "site_generations",
  name: "Site generations",
  type: "metered",
  consumable: true,
});

// Plans
export const free = plan({
  id: "free",
  name: "Free",
  autoEnable: true,
  items: [
    item({
      featureId: siteGenerations.id,
      included: 5,
      reset: { interval: "month" },
    }),
  ],
});

export const pro = plan({
  id: "pro",
  name: "Pro",
  price: {
    amount: 20,
    interval: "month",
  },
  items: [
    item({
      featureId: siteGenerations.id,
      included: 200,
      reset: { interval: "month" },
    }),
  ],
});
