import { loadStripe, Stripe } from "@stripe/stripe-js";
import { supabase } from "@/integrations/supabase/client";

type StripeEnv = "sandbox" | "live";

// Build-time fallback (sandbox/test publishable key bundled with the app).
const fallbackToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string | undefined;

let configPromise: Promise<{ publishableKey: string; environment: StripeEnv }> | null = null;
let stripePromise: Promise<Stripe | null> | null = null;
let cachedEnv: StripeEnv = fallbackToken?.startsWith("pk_live_") ? "live" : "sandbox";

function loadConfig() {
  if (!configPromise) {
    configPromise = (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-payments-config", { method: "GET" });
        if (error || !data?.publishableKey) throw error ?? new Error("no publishable key");
        cachedEnv = data.environment === "live" ? "live" : "sandbox";
        return { publishableKey: data.publishableKey as string, environment: cachedEnv };
      } catch {
        if (!fallbackToken) throw new Error("Payments are not configured");
        cachedEnv = fallbackToken.startsWith("pk_live_") ? "live" : "sandbox";
        return { publishableKey: fallbackToken, environment: cachedEnv };
      }
    })();
  }
  return configPromise;
}

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    stripePromise = loadConfig().then((c) => loadStripe(c.publishableKey));
  }
  return stripePromise;
}

/** Synchronous best-effort env (defaults to sandbox until config has loaded). */
export function getStripeEnvironment(): StripeEnv {
  return cachedEnv;
}

/** Awaitable env once the runtime config has been fetched. */
export async function resolveStripeEnvironment(): Promise<StripeEnv> {
  const c = await loadConfig();
  return c.environment;
}
