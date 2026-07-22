import { feature, item, plan } from "atmn";

export const siteGenerations = feature({
	id: "site_generations",
	name: "Site generations",
	type: "metered",
	consumable: true,
	archived: true,
});

export const tokenUsage = feature({
	id: "token_usage",
	name: "token usage",
	type: "metered",
	consumable: true,
	archived: true,
});

export const aiCredits = feature({
	id: "ai_credits",
	name: "AI Credits",
	type: "ai_credit_system",
	defaultMarkup: 30,
	modelMarkups: {
		"anthropic/claude-sonnet-5": { markup: 30 },
		"anthropic/claude-opus-4-8": { markup: 30 },
		"anthropic/claude-fable-5": { markup: 30 },
		"anthropic/claude-sonnet-4-5": { markup: 30 },
		"anthropic/claude-sonnet-4-5-20250929": { markup: 30 },
	},
});

export const pro = plan({
	id: "pro",
	name: "Pro",
	addOn: false,
	autoEnable: false,
	price: {
		amount: 20,
		interval: "month",
	},
	items: [
		item({
			featureId: aiCredits.id,
			included: 20,
			reset: {
				interval: "month",
			},
		}),
	],
});

export const proYearly = plan({
	id: "pro_yearly",
	name: "Pro Yearly",
	addOn: false,
	autoEnable: false,
	price: {
		amount: 192,
		interval: "year",
	},
	items: [
		item({
			featureId: aiCredits.id,
			included: 20,
			reset: {
				interval: "month",
			},
		}),
	],
});

export const creditTopUp = plan({
	id: "credit_top_up",
	name: "Credit top-up",
	addOn: true,
	autoEnable: false,
	items: [
		item({
			featureId: aiCredits.id,
			price: {
				amount: 1,
				billingUnits: 1,
				billingMethod: "prepaid",
				interval: "one_off",
			},
		}),
	],
});
