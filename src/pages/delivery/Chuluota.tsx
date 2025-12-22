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
  { name: "Christmas", slug: "christmas" },
  { name: "Bithlo", slug: "bithlo" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

export default function ChuluotaDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Chuluota FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Chuluota FL. Serving Seminole County with party inflatables. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/chuluota"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Chuluota", href: "/delivery-area/chuluota" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Chuluota, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Quality party rentals for Chuluota families. Bounce houses, water slides, and games delivered to your door!
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
              Party Rental Delivery to Chuluota, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables serves{" "}
              <a href="https://en.wikipedia.org/wiki/Chuluota,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Chuluota, Florida <ExternalLink className="h-3 w-3" />
              </a>
              , a charming rural community on the border of Seminole and Orange Counties. Known for its peaceful atmosphere, historic character, and close-knit community, Chuluota is a wonderful place to raise a family and celebrate life's special moments.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Chuluota's spacious properties are ideal for party rentals. Whether you're hosting a birthday party, graduation celebration, or family reunion, our bounce houses and water slides fit perfectly in Chuluota backyards. We deliver professional service to match the quality of life residents enjoy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our delivery team is familiar with Chuluota's roads and neighborhoods, ensuring your party equipment arrives on time and is set up properly. From the historic downtown area to the newer developments, we proudly serve the entire Chuluota community.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Chuluota, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Chuluota is an unincorporated community primarily located in Seminole County, Florida, with portions extending into Orange County. The town's name comes from the Seminole word meaning "pine island," reflecting the area's natural beauty and Native American heritage.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The community is served by{" "}
              <a href="https://www.scps.k12.fl.us/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Seminole County Public Schools <ExternalLink className="h-3 w-3" />
              </a>
              , offering excellent educational opportunities for local families. Chuluota maintains a rural character with larger lots, horse properties, and a strong equestrian community, while still providing convenient access to Orlando's urban amenities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Residents appreciate Chuluota's slower pace of life, natural surroundings, and sense of community. Neighborhood events, church gatherings, and family celebrations are cornerstones of life here – and our party rentals help make these occasions even more special.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Chuluota
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
              Perfect for Country Living
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Chuluota's rural properties mean you have room to go big with your party rentals! Our large obstacle courses, dual-lane water slides, and combo units are especially popular with Chuluota families who have the space to accommodate them. Let us help you make the most of your property for your next celebration!
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
