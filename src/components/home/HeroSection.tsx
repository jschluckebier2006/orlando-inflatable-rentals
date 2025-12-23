import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { JotformModal } from "@/components/JotformModal";

export function HeroSection() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[600px] md:min-h-[700px]">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Gradient overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-transparent to-black/50" />

        <div className="container-page relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 animate-fade-in border border-white/30">
              <span className="text-sm font-medium text-white drop-shadow-md">Serving East Orlando & Orange County</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in text-white drop-shadow-lg">
              Your One-Stop Shop for{" "}
              <span className="text-secondary drop-shadow-lg">Bounce House</span> &{" "}
              <span className="text-secondary drop-shadow-lg">Water Slide</span> Rentals in Orlando
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto animate-fade-in drop-shadow-md font-medium" style={{ animationDelay: "0.2s" }}>
              Make your next event unforgettable with our premium inflatable rentals. 
              Birthday parties, school events, church gatherings, and more!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Button
                onClick={() => setShowJotform(true)}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8 py-6 shadow-xl"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a href="tel:4074971840">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8 py-6 font-semibold shadow-xl"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  (407) 497-1840
                </Button>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-white animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                <svg className="h-5 w-5 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Same-Day Setup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
