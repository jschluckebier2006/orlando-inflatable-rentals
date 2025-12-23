import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JotformModal } from "@/components/JotformModal";

export function StickyBookButton() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowJotform(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce px-6 py-6 h-auto flex items-center gap-2 animate-fade-in"
        aria-label="Book Now"
      >
        <CalendarCheck className="h-5 w-5" />
        <span className="font-semibold">Book Now</span>
      </Button>
      
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
