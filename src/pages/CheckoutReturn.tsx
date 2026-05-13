import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, AlertCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";

type ReturnState = "loading" | "ok" | "pending" | "missing" | "error";

export default function CheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const { clear } = useCart();
  const [state, setState] = useState<ReturnState>(sessionId ? "loading" : "missing");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    clear();
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    let attempts = 0;
    let consecutiveErrors = 0;
    const maxAttempts = 10;
    const maxConsecutiveErrors = 3;

    const schedule = () => {
      if (!cancelled) setTimeout(tick, 1000);
    };

    const tick = async () => {
      if (cancelled) return;
      attempts++;
      try {
        const { data, error } = await supabase.functions.invoke("check-booking-status", {
          body: { session_id: sessionId, attempt: attempts },
        });
        if (cancelled) return;
        if (error) throw error;
        consecutiveErrors = 0;
        if (data?.confirmed) { setState("ok"); return; }
        if (attempts >= maxAttempts) { setState("pending"); return; }
        schedule();
      } catch (e) {
        if (cancelled) return;
        consecutiveErrors++;
        console.error(`[CheckoutReturn] poll error (attempt ${attempts})`, e, "session:", sessionId);
        if (consecutiveErrors >= maxConsecutiveErrors) { setState("error"); return; }
        if (attempts >= maxAttempts) { setState("pending"); return; }
        schedule();
      }
    };

    tick();
    return () => { cancelled = true; };
  }, [sessionId, retryKey]);

  const handleRetry = () => {
    setState("loading");
    setRetryKey((k) => k + 1);
  };

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
        {state === "pending" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h1 className="font-display text-2xl font-bold">Payment received</h1>
            <p className="text-muted-foreground">
              We're finalizing your reservation. You'll get an email confirmation shortly, and our team will reach out to confirm delivery details.
            </p>
            <p className="text-xs text-muted-foreground">
              Reference: <span className="font-mono">{sessionId?.slice(-12)}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button asChild><Link to="/">Back to home</Link></Button>
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
        {state === "error" && (
          <>
            <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
            <h1 className="font-display text-2xl font-bold">We're having trouble confirming your reservation</h1>
            <p className="text-muted-foreground">
              If you completed payment, your reservation is still being processed and you'll receive a confirmation email shortly. Our team has been notified.
            </p>
            <p className="text-sm text-muted-foreground">
              If you were charged, no action is needed — we'll honor your booking.
            </p>
            <p className="text-xs text-muted-foreground">
              Reference: <span className="font-mono break-all">{sessionId}</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
              <Button onClick={handleRetry}>Try again</Button>
              <Button asChild variant="outline">
                <a href="tel:4074971840"><Phone className="mr-2 h-4 w-4" />Call (407) 497-1840</a>
              </Button>
              <Button asChild variant="ghost"><Link to="/">Back to home</Link></Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
