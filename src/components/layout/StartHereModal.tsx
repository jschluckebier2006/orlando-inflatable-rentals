import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface StartHereModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StartHereModal({ open, onOpenChange }: StartHereModalProps) {
  const [stage, setStage] = useState<"welcome" | "quote">("welcome");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setStage("welcome"), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleReserveOnline = () => {
    onOpenChange(false);
    navigate("/rentals");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {stage === "welcome" ? (
          <>
            <DialogHeader>
              <DialogTitle>Let's get your party started.</DialogTitle>
              <DialogDescription>
                Two quick ways to book — pick what fits your event.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 mt-4">
              <Button
                onClick={handleReserveOnline}
                className="w-full text-left rounded-xl p-5 h-auto flex items-center justify-between bg-primary hover:bg-primary/90 text-white group"
              >
                <div>
                  <div className="font-semibold text-lg">Browse & Reserve →</div>
                  <div className="text-white/80 text-sm mt-1">
                    Pick your inflatables, see availability, book online.
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>

              <button
                onClick={() => setStage("quote")}
                className="w-full text-left rounded-xl border-2 border-accent/30 hover:border-accent bg-accent/5 hover:bg-accent/10 transition-colors p-5 group flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-lg text-foreground">Get a Custom Quote →</div>
                  <div className="text-muted-foreground text-sm mt-1">
                    Personalized guidance & package for your event.
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Let's plan your event</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Tap below to reach us — your message will be pre-filled.
              </p>
            </div>

            <div className="grid gap-3">
              <Button
                asChild
                onClick={() => onOpenChange(false)}
                className="w-full text-left rounded-xl p-5 h-auto flex flex-col items-start bg-primary hover:bg-primary/90 text-white"
              >
                <a href="sms:+14074971840?&body=Hi%20Orlando%20Inflatables!%20I'd%20like%20a%20custom%20quote.%0A%0AEvent%20date%3A%0AEvent%20location%20(city%2Fzip)%3A%0AWhat%20I'm%20interested%20in%20(bounce%20house%2C%20water%20slide%2C%20combo%2C%20etc.)%3A%0A%0AThanks!">
                  <span className="font-semibold text-base">Text Us — (407) 497-1840</span>
                  <span className="text-white/80 text-sm mt-0.5">Fastest reply — pre-filled message</span>
                </a>
              </Button>

              <Button
                asChild
                onClick={() => onOpenChange(false)}
                variant="secondary"
                className="w-full text-left rounded-xl p-5 h-auto flex flex-col items-start"
              >
                <a href="tel:+14074971840">
                  <span className="font-semibold text-base">Call Us — (407) 497-1840</span>
                  <span className="text-muted-foreground text-sm mt-0.5">Talk to a real person</span>
                </a>
              </Button>

              <Button
                asChild
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="w-full text-left rounded-xl p-5 h-auto flex flex-col items-start"
              >
                <a href="mailto:orlandoinflatablesllc@gmail.com?subject=Custom%20Quote%20Request&body=Hi%20Orlando%20Inflatables!%20I'd%20like%20a%20custom%20quote.%0A%0AEvent%20date%3A%0AEvent%20location%20(city%2Fzip)%3A%0AWhat%20I'm%20interested%20in%20(bounce%20house%2C%20water%20slide%2C%20combo%2C%20etc.)%3A%0A%0AThanks!">
                  <span className="font-semibold text-base">Email Us</span>
                  <span className="text-muted-foreground text-sm mt-0.5">orlandoinflatablesllc@gmail.com</span>
                </a>
              </Button>
            </div>

            <button
              onClick={() => setStage("welcome")}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground flex items-center self-start transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
