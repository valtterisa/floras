import { Polar } from "@polar-sh/sdk";

// Validate environment variables
const accessToken =
  process.env.NODE_ENV === "production"
    ? process.env.POLAR_ACCESS_TOKEN
    : process.env.POLAR_SANDBOX_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    "Polar access token not configured - Polar integration will be disabled"
  );
}

export const polar = accessToken
  ? new Polar({
      accessToken,
      server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    })
  : null;

// Create a Polar customer without assigning any plan
export async function createPolarCustomer(
  externalId: string,
  email: string,
  fullName?: string
) {
  // Check if Polar is configured
  if (!polar) {
    console.warn("Polar not configured - skipping customer creation");
    return null;
  }

  // Validate inputs
  if (!externalId || !email) {
    console.error("Invalid parameters for Polar customer creation:", {
      externalId,
      email,
    });
    return null;
  }

  try {
    console.log("Creating Polar customer with:", {
      externalId,
      email,
      name: fullName || email,
    });

    const customer = await polar.customers.create({
      externalId: externalId,
      email: email,
      name: fullName || email,
    });

    console.log("Successfully created Polar customer:", customer?.id);
    return customer;
  } catch (error) {
    console.error("Polar customer creation failed with error:", error);

    // If customer already exists, try to get existing one
    if (
      error &&
      typeof error === "object" &&
      "error" in error &&
      (error.error === "Conflict" || error.error === "ResourceAlreadyExists")
    ) {
      console.log("Customer already exists, attempting to retrieve...");
      try {
        const existingCustomer = await polar.customers.getStateExternal({
          externalId: externalId,
        });
        console.log("Retrieved existing Polar customer:", existingCustomer?.id);
        return existingCustomer;
      } catch (getError) {
        console.error("Failed to get existing Polar customer:", getError);
        return null;
      }
    }

    // Log the full error for debugging
    if (error && typeof error === "object") {
      console.error(
        "Full Polar error details:",
        JSON.stringify(error, null, 2)
      );
    }

    return null;
  }
}

// Fetch the current user's subscription by externalId (e.g., Supabase user id or email)
export async function getPolarSubscriptionByExternalId(externalId: string) {
  if (!polar) {
    console.warn("Polar not configured - returning null subscription");
    return null;
  }

  try {
    const customer = await polar.customers.getStateExternal({
      externalId: externalId,
    });
    if (!customer || !customer.id) return null;

    const subscriptionId = customer?.activeSubscriptions?.[0]?.id;

    if (!subscriptionId) return null;

    const subscription = await polar.subscriptions.get({
      id: subscriptionId,
    });

    return { subscription };
  } catch (error) {
    // Handle ResourceNotFound errors gracefully for users without Polar subscriptions
    if (
      error &&
      typeof error === "object" &&
      "error" in error &&
      error.error === "ResourceNotFound"
    ) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

export async function getPolarProducts() {
  if (!polar) {
    console.warn("Polar not configured - returning empty products");
    return [];
  }

  const products = await polar.products.list({
    isArchived: false,
  });

  for await (const page of products) {
    return page.result.items;
  }
}

export async function managePolarSubscription(externalId: string) {
  if (!polar) {
    console.warn("Polar not configured - cannot manage subscription");
    return null;
  }

  try {
    const customer = await polar.customerSessions.create({
      externalCustomerId: externalId,
    });

    return customer.customerPortalUrl;
  } catch (error) {
    // Handle errors gracefully for users without Polar accounts
    if (
      error &&
      typeof error === "object" &&
      "error" in error &&
      error.error === "ResourceNotFound"
    ) {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}
