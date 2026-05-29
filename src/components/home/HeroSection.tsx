import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight, Star } from "lucide-react";
import { JotformModal } from "@/components/JotformModal";
import { BOOKING_ENABLED } from "@/config/featureFlags";
import heroBackground from "@/assets/orlando-inflatables-hero.webp";

export function HeroSection() {
  const [showJotform, setShowJotform] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[600px] md:min-h-[700px]">
        {/* Hero Background Image */}
        <img
          src={heroBackground}
          alt="Orlando inflatable rentals fleet — water slides and bounce houses available for rent in Orlando FL"
          className="absolute inset-0 w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="container-page relative z-10 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <span className="text-sm font-medium drop-shadow-lg">Serving East Orlando & Orange County</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-4 leading-tight animate-fade-in drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              Your One-Stop Shop for{" "}
              <span className="text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Bounce House</span> &{" "}
              <span className="text-accent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">Water Slide</span> Rentals in Orlando
            </h1>

            {/* Google Review Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in drop-shadow-lg">
              <div className="flex items-center gap-0.5" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                ))}
              </div>
              <span className="font-bold text-white text-sm md:text-base">5.0</span>
              <span className="text-white/80 text-sm md:text-base">—</span>
              <a
                href="https://www.google.com/maps/place/Orlando+Inflatable+Rentals+LLC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm md:text-base font-medium underline underline-offset-2 hover:text-accent transition-colors"
              >
                63 Google Reviews
              </a>
            </div>

            {/* Subheading */}
            <p className="text-lg md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto animate-fade-in drop-shadow-lg font-medium" style={{ animationDelay: "0.2s" }}>
              Make your next event unforgettable with our premium inflatable rentals. 
              Birthday parties, school events, church gatherings, and more!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-3 w-full sm:max-w-sm sm:mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <button
                onClick={() => navigate("/water-slide-rentals")}
                className="w-full rounded-full p-1 btn-bounce transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60"
                style={{ background: "#FFBF00" }}
              >
                <div
                  className="relative overflow-hidden rounded-full flex flex-col items-center justify-center gap-0.5 py-4 px-5 w-full"
                  style={{ background: "linear-gradient(90deg, #FF6B00 0%, #FFD000 100%)" }}
                >
                  <span
                    className="relative z-10 uppercase tracking-widest font-bold text-white"
                    style={{ fontSize: "11px", textShadow: "0 1px 3px rgba(0,0,0,0.55)" }}
                  >
                    ☀️ This Summer's #1 Choice
                  </span>
                  <span
                    className="relative z-10 font-black text-white leading-tight text-lg"
                    style={{ textShadow: "0 2px 6px rgba(0,0,0,0.55)" }}
                  >
                    Cool Off This Summer — Orlando Water Slide Rentals →
                  </span>
                </div>
              </button>
              <a href="tel:4074971840" className="w-full">
                <Button
                  size="lg"
                  className="w-full rounded-full bg-white text-slate-900 hover:bg-white/90 btn-bounce text-lg px-8 py-6 font-semibold shadow-xl"
                >
                  <Phone className="mr-2 h-5 w-5 text-slate-900" />
                  (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto" aria-hidden="true">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
