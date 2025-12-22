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
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Eastwood", slug: "eastwood" },
];

export default function StoneybrookDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Stoneybrook FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Stoneybrook FL. Premium party inflatables for this East Orlando community. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/stoneybrook"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Stoneybrook", href: "/delivery-area/stoneybrook" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Stoneybrook, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Premium party rentals for the Stoneybrook community. Bounce houses, water slides, and more with free delivery!
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
              Party Rental Delivery to Stoneybrook, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is delighted to serve the Stoneybrook community in East Orlando. This established, family-oriented neighborhood is known for its beautiful homes, well-maintained common areas, and active community life. Stoneybrook families know how to celebrate, and we're honored to be part of so many special occasions here.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're hosting a pool party, birthday celebration, or neighborhood gathering, our bounce houses and water slides are perfect for Stoneybrook events. The community's spacious yards and community amenities provide excellent venues for inflatable fun.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We deliver throughout Stoneybrook and surrounding East Orlando neighborhoods. Our team is familiar with the community layout and will ensure your party rental is set up properly and on time for your event.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Stoneybrook, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Stoneybrook is a master-planned community in East Orlando, known for its family-friendly atmosphere, community amenities, and convenient location. The neighborhood features well-designed homes, tree-lined streets, and common areas that foster a strong sense of community among residents.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Families are drawn to Stoneybrook for its excellent schools within the{" "}
              <a href="https://www.ocps.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Orange County Public Schools <ExternalLink className="h-3 w-3" />
              </a>{" "}
              system, as well as its proximity to shopping, dining, and entertainment at nearby Waterford Lakes Town Center and along Colonial Drive.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The community's active HOA sponsors events and maintains beautiful common areas where neighbors come together. This community spirit extends to private celebrations, where residents frequently host birthday parties, graduation celebrations, and holiday gatherings that feature our party rentals.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Stoneybrook
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
              Popular with Stoneybrook Families
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Stoneybrook residents frequently rent our combo bounce houses with slides, which offer multiple activities in one unit – perfect for parties with kids of varying ages. Our water slides are also extremely popular during hot Florida summers! Contact us to find the perfect rental for your Stoneybrook celebration.
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
