import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN!,
    server: "sandbox", // Use this option if you're using the sandbox environment - else use 'production' or omit the parameter
});

// integrate to pricing options -> get priduct ids straight
// Need to sync with supabase per customer using external id. 
// We can query with the externalId and polar.sh tracks the usage.
// No need for us to track the usage.
// Finally: just test it. 