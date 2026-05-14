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
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStage("welcome")}
              className="w-fit -ml-2 mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <DialogTitle>Custom Quote</DialogTitle>
            <div className="mt-4">
              {/* Custom quote form content */}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
