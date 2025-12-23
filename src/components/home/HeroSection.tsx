import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { JotformModal } from "@/components/JotformModal";

export function HeroSection() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <>
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 animate-bounce-gentle" />
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-white/20 animate-bounce-gentle" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-white/20 animate-bounce-gentle" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container-page relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="text-sm font-medium">Serving East Orlando & Orange County</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Your One-Stop Shop for{" "}
              <span className="text-accent">Bounce House</span> &{" "}
              <span className="text-accent">Water Slide</span> Rentals in Orlando
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Make your next event unforgettable with our premium inflatable rentals. 
              Birthday parties, school events, church gatherings, and more!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button
                onClick={() => setShowJotform(true)}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8 py-6"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a href="tel:4074971840">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8 py-6 font-semibold"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  (407) 497-1840
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-primary-foreground/80 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Same-Day Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
