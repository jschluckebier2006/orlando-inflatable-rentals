import { useEffect, useState } from "react";
import { resolveStripeEnvironment } from "@/lib/stripe";

const isPreview = typeof window !== "undefined" && window.location.hostname.includes("id-preview--");

export function PaymentTestModeBanner() {
  const [env, setEnv] = useState<"sandbox" | "live" | null>(null);
  useEffect(() => {
    if (!isPreview) return;
    resolveStripeEnvironment().then(setEnv).catch(() => setEnv(null));
  }, []);
  if (!isPreview || env !== "sandbox") return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-sm text-orange-800">
      Test mode — payments in the preview do not charge a real card. Use card 4242 4242 4242 4242.
    </div>
  );
}
