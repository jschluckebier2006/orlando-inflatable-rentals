import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Phone, ExternalLink, Castle, Waves, Trophy, Gamepad2, Popcorn, Armchair } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const services = [
  { name: "Bounce Houses", href: "/bounce-house-rentals", icon: Castle },
  { name: "Water Slides", href: "/water-slide-rentals", icon: Waves },
  { name: "Obstacle Courses", href: "/obstacle-course-rentals", icon: Trophy },
  { name: "Interactive Games", href: "/interactive-game-rentals", icon: Gamepad2 },
  { name: "Concessions", href: "/concession-rentals", icon: Popcorn },
  { name: "Tables & Chairs", href: "/table-chair-rentals", icon: Armchair },
];

const nearbyAreas = [
  { name: "Azalea Park", slug: "azalea-park" },
  { name: "Bithlo", slug: "bithlo" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
];

export default function EastwoodDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Eastwood FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Eastwood FL. Affordable party inflatables for East Orlando. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/eastwood"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Eastwood", href: "/delivery-area/eastwood" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Eastwood, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Party rentals for the Eastwood community. Quality bounce houses, water slides, and more with free delivery!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowJotform(true)} size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8">
                Get a Free Quote
              </Button>
              <a href="tel:4074971840">
                <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-white/10 btn-bounce text-lg px-8">
                  <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Party Rental Delivery to Eastwood, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is proud to serve the Eastwood community in East Orlando. This established neighborhood offers families an affordable, convenient location with easy access to major employment centers, shopping, and entertainment throughout the greater Orlando area.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're celebrating a birthday, hosting a block party, or organizing a community event, we deliver quality party rentals right to your Eastwood home. Our bounce houses, water slides, and games provide hours of entertainment for guests of all ages.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Eastwood's central location in East Orlando makes it one of our core service areas. We know the neighborhood well and provide prompt, reliable delivery for all your party rental needs.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Eastwood, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Eastwood is a neighborhood in East Orlando, Orange County, Florida, known for its established residential streets and convenient location. The area developed primarily in the latter half of the 20th century and offers a mix of single-family homes at various price points.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Residents enjoy proximity to major roads including East Colonial Drive and the 408 expressway, making commutes to downtown Orlando and other employment centers convenient. The area is served by{" "}
              <a href="https://www.ocps.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Orange County Public Schools <ExternalLink className="h-3 w-3" />
              </a>{" "}
              and offers access to local parks and recreation facilities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The Eastwood community is known for its diversity and family-friendly atmosphere. Neighbors often come together for celebrations, and our party rentals help make these gatherings extra special. From backyard birthday parties to neighborhood cookouts, we're here to help Eastwood families create lasting memories.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Eastwood
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {services.map((service) => (
                <Link key={service.name} to={service.href}>
                  <Card className="h-full card-hover">
                    <CardContent className="p-4 flex items-center gap-3">
                      <service.icon className="h-6 w-6 text-primary" />
                      <span className="font-medium text-foreground">{service.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Affordable Party Rentals for Eastwood Families
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We believe every family deserves a great party! Our competitive pricing makes quality party rentals accessible for Eastwood families. Contact us for a free quote and see how affordable it can be to add a bounce house or water slide to your next celebration.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding section-alt">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            We Also Serve Nearby Areas
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {nearbyAreas.map((area) => (
              <Link key={area.slug} to={`/delivery-area/${area.slug}`}>
                <Button variant="outline" className="btn-bounce">
                  <MapPin className="mr-2 h-4 w-4" /> {area.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </Layout>
  );
}
