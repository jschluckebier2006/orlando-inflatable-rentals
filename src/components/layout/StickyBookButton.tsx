import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StartHereModal } from "@/components/layout/StartHereModal";

export function StickyBookButton() {
  const [showStartHere, setShowStartHere] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowStartHere(true)}
        size="lg"
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 rounded-full shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce px-4 py-3 md:px-6 md:py-6 h-auto flex items-center gap-2 animate-fade-in group"
        aria-label="Start Here"
      >
        <span className="absolute inset-0 rounded-full bg-secondary animate-ping opacity-15"></span>
        <CalendarCheck className="h-5 w-5 relative z-10" />
        <span className="font-semibold relative z-10">Start Here</span>
      </Button>

      <StartHereModal open={showStartHere} onOpenChange={setShowStartHere} />
    </>
  );
}
