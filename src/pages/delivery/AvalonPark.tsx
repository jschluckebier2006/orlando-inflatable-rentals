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
  { name: "Alafaya", slug: "alafaya" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

export default function AvalonParkDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Avalon Park FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Avalon Park FL. Family-friendly party inflatables with free delivery. Licensed & insured. Call (407) 497-1840!"
        canonical="/delivery-area/avalon-park"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Avalon Park", href: "/delivery-area/avalon-park" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Avalon Park, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Premier party rental service for the Avalon Park community. Bounce houses, water slides, and more with free delivery!
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
              Party Rental Delivery to Avalon Park, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is thrilled to serve the beautiful{" "}
              <a href="https://en.wikipedia.org/wiki/Avalon_Park,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Avalon Park community <ExternalLink className="h-3 w-3" />
              </a>
              , one of East Orlando's most sought-after master-planned neighborhoods. Known for its New Urbanism design, tree-lined streets, and strong sense of community, Avalon Park is the perfect setting for memorable celebrations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              From birthday parties in spacious Avalon Park backyards to community events at the Downtown Avalon Park Town Center, we provide top-quality inflatable rentals that families love. Our delivery team is familiar with all of Avalon Park's villages and neighborhoods, ensuring prompt, reliable service for your special event.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Avalon Park residents have come to trust Orlando Inflatables for their party rental needs. We understand the family-focused culture of this community and provide clean, safe entertainment that parents can trust and kids will love.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Avalon Park, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Avalon Park is a{" "}
              <a href="https://www.avalonpark.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                master-planned community <ExternalLink className="h-3 w-3" />
              </a>{" "}
              located in East Orlando, developed with New Urbanism principles that emphasize walkability, community gathering spaces, and traditional neighborhood design. The community features a charming downtown area with shops, restaurants, and event spaces.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Families are drawn to Avalon Park for its excellent schools, including those in the Orange County Public School system, as well as its numerous parks, playgrounds, and community amenities. The neighborhood hosts regular community events, farmers markets, and festivals that bring residents together.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              With its focus on community and family life, Avalon Park is one of our busiest delivery areas. Birthday parties, graduation celebrations, and neighborhood block parties keep our inflatables bouncing throughout the community year-round!
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Avalon Park
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
              Popular Avalon Park Party Locations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We regularly deliver to parties and events throughout Avalon Park, including:
            </p>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li>• Private residences and backyards throughout all Avalon Park villages</li>
              <li>• Community clubhouses and HOA facilities</li>
              <li>• Downtown Avalon Park Town Center events</li>
              <li>• Local parks and recreational areas</li>
              <li>• School events and PTA functions at Avalon Park area schools</li>
            </ul>
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
