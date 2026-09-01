import process from "node:process";
import { loadEnv } from "vite";

const env = loadEnv("production", process.cwd(), "");
const errors = [];

const apiBaseUrl = env.VITE_API_BASE_URL?.trim();
if (!apiBaseUrl) {
  errors.push("VITE_API_BASE_URL is required for production builds.");
} else {
  try {
    const url = new URL(apiBaseUrl);
    const hostname = url.hostname.toLowerCase();
    const isLocalhost =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "::1" ||
      hostname === "[::1]";

    if (!["http:", "https:"].includes(url.protocol)) {
      errors.push("VITE_API_BASE_URL must use HTTP or HTTPS.");
    }
    if (isLocalhost) {
      errors.push("VITE_API_BASE_URL must not target localhost in production.");
    }
    if (!url.pathname.replace(/\/+$/, "").endsWith("/api/v1")) {
      errors.push("VITE_API_BASE_URL must include the /api/v1 path.");
    }
  } catch {
    errors.push("VITE_API_BASE_URL must be a valid absolute URL.");
  }
}

const turnstileSiteKey = env.VITE_TURNSTILE_SITE_KEY?.trim();
const turnstileTestKeyPattern = /^[123]x0{18,}/i;
const allowTurnstileTestKey =
  process.env.CI === "true" && env.ALLOW_TURNSTILE_TEST_KEY === "true";
if (!turnstileSiteKey) {
  errors.push("VITE_TURNSTILE_SITE_KEY is required for production builds.");
} else if (/replace|placeholder|your[-_ ]|example/i.test(turnstileSiteKey)) {
  errors.push("VITE_TURNSTILE_SITE_KEY must not be a placeholder value.");
} else if (
  turnstileTestKeyPattern.test(turnstileSiteKey) &&
  !allowTurnstileTestKey
) {
  errors.push("VITE_TURNSTILE_SITE_KEY must not be a Turnstile test key.");
}

if (errors.length > 0) {
  console.error("Production build environment validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Production build environment validation passed.");
