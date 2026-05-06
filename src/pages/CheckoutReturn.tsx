import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

export default function CheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [state, setState] = useState<"loading" | "ok" | "missing">(sessionId ? "loading" : "missing");

  useEffect(() => {
    if (!sessionId) return;
    // Webhook does the actual booking creation. Just give it a beat and clear the cart.
    clear();
    const t = setTimeout(() => setState("ok"), 1500);
    return () => clearTimeout(t);
  }, [sessionId, clear]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-4 bg-card border border-border rounded-xl p-8 shadow-sm">
        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
            <h1 className="font-display text-2xl font-bold">Confirming your reservation...</h1>
            <p className="text-muted-foreground text-sm">Hang tight — this only takes a moment.</p>
          </>
        )}
        {state === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="font-display text-2xl font-bold">Reservation confirmed!</h1>
            <p className="text-muted-foreground">
              Thanks — we received your deposit and your date is locked in. Our team will call you to finalize delivery details.
            </p>
            <p className="text-xs text-muted-foreground">
              Reference: <span className="font-mono">{sessionId?.slice(-12)}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild><Link to="/">Back to home</Link></Button>
              <Button asChild variant="outline"><Link to="/rentals">Browse more rentals</Link></Button>
            </div>
          </>
        )}
        {state === "missing" && (
          <>
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
            <h1 className="font-display text-2xl font-bold">No checkout session found</h1>
            <Button asChild><Link to="/">Back to home</Link></Button>
          </>
        )}
      </div>
    </div>
  );
}
