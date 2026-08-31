import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import promoImage from "@/assets/labor-day-promo.jpg.asset.json";

/** Offer end: September 6, 2026, 11:59 PM Eastern (UTC-4) — edit here to change the run window. */
const PROMO_END = new Date("2026-09-07T03:59:59Z");
const SESSION_KEY = "laborDay2026PopupSeen";
const PHONE_TEL = "tel:+14074971840";
const PHONE_SMS = "sms:+14074971840";

export function LaborDayPromoModal() {
  const [open, setOpen] = useState(false);

  const expired = Date.now() > PROMO_END.getTime();

  useEffect(() => {
    if (expired) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* storage blocked — still show once */
    }
    const t = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(t);
  }, [expired]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  if (expired) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(v) => !v && dismiss()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          aria-label="Labor Day weekend special: free overnight inflatable rental"
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-background shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 motion-reduce:animate-none"
        >
          <DialogPrimitive.Title className="sr-only">
            Labor Day weekend special — free overnight rental
          </DialogPrimitive.Title>

          <div className="relative">
            <img
              src={promoImage.url}
              alt="Free overnight rental this weekend only — rent any inflatable and keep it overnight at no extra charge."
              className="block w-full rounded-t-2xl object-cover object-top max-h-[min(60vh,420px)] [@media(max-height:500px)]:max-h-[38vh]"
            />
            <DialogPrimitive.Close
              onClick={dismiss}
              aria-label="Close promotion"
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          <div className="bg-background p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={PHONE_TEL}
                onClick={dismiss}
                className="flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-primary px-4 text-center text-sm font-bold text-primary-foreground shadow-md transition hover:opacity-90 sm:text-base"
              >
                📞 Call to Book — 407-497-1840
              </a>
              <a
                href={PHONE_SMS}
                onClick={dismiss}
                className="flex min-h-[52px] items-center justify-center rounded-xl border-2 border-primary/40 bg-transparent px-6 text-center text-sm font-semibold text-primary transition hover:bg-primary/5 sm:text-base"
              >
                Text Us
              </a>
            </div>
            <p className="mt-3 text-center text-xs font-medium text-muted-foreground">
              Phone bookings only · Subject to availability
            </p>
            <p className="mt-1 text-center text-[10px] leading-snug text-muted-foreground">
              Valid 09/04/26–09/06/26. Exclusions apply. Call for offer details and limitations.
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export default LaborDayPromoModal;
