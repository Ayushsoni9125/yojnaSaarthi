import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/next";

if (!process.env.ARCJET_KEY) {
  console.warn("⚠️ ARCJET_KEY is not set in environment variables. Arcjet protection will fail if invoked.");
}

// Initialize Arcjet Rate Limiter & Security Instance
export const aj = arcjet({
  key: process.env.ARCJET_KEY || "",
  rules: [
    // Protect against common attacks (SQLi, XSS, etc.)
    shield({
      mode: "LIVE",
    }),

    // Detect and manage automated bot traffic
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // Allow Google, Bing, etc.
    }),

    // Rate Limiting: Token Bucket algorithm (20 requests per minute per IP)
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip.src"],
      refillRate: 10,
      interval: 60,
      capacity: 20,
    }),
  ],
});
