import Stripe from "stripe";

// Ensure the Stripe secret key is available
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error("Missing STRIPE_SECRET_KEY environment variable");
// }

// Initialize Stripe with your secret key
export const stripe = new Stripe("sk_test_51R7g3uGWWj6eMRDBzAMysbAyWVh0OEOyW6gTX18X7oIJ7OT8Vixxct2j3Pq8kNcxLJcq9gYHnrYoNoIrwuush00b00UFl0kTB3", {
  apiVersion: "2025-03-31.basil",
});

// Update the PLANS object with price IDs from environment variables
export const PLANS = {
  PRO: {
    name: "Pro",
    yearly: {
      price: 29,
      // Use environment variable for yearly subscription price ID
      priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
      interval: "year",
    },
    monthly: {
      price: 5,
      // Use environment variable for monthly subscription price ID
      priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || process.env.STRIPE_PRO_PRICE_ID,
      interval: "month",
    },
    features: [
      "Custom domains",
      "Contact forms",
      "Testimonials section",
      "Basic analytics",
      "Email integrations",
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    yearly: {
      price: null, // Custom pricing
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      interval: "year",
    },
    monthly: {
      price: null, // Custom pricing
      priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
      interval: "month",
    },
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated account manager",
      "Priority support",
      "Advanced analytics",
    ],
  },
};

export async function createStripeCustomer(email: string, name?: string) {
  return stripe.customers.create({
    email,
    name,
    metadata: {
      source: "website-generator",
    },
  });
}

export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
  metadata = {},
}: {
  customerId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  return stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
) {
  return stripe.subscriptions.retrieve(subscriptionId).then((subscription) => {
    return stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
  });
}
