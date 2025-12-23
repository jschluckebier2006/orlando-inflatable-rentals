import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { JotformModal } from "@/components/JotformModal";

export function CTASection() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <>
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Book Your Party?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Get a free quote today and let us help make your next event unforgettable!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => setShowJotform(true)}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8"
            >
              Get a Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a href="tel:4074971840">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8 font-semibold"
              >
                <Phone className="mr-2 h-5 w-5" />
                (407) 497-1840
              </Button>
            </a>
          </div>
        </div>
      </section>

      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
