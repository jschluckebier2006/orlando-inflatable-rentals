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
  { name: "Bithlo", slug: "bithlo" },
  { name: "Eastwood", slug: "eastwood" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
];

export default function AzaleaParkDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Azalea Park FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Azalea Park FL. Affordable party inflatables for East Orlando families. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/azalea-park"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Azalea Park", href: "/delivery-area/azalea-park" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Azalea Park, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Quality party rentals for the Azalea Park community. Affordable bounce houses, water slides, and games with free delivery!
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
              Party Rental Delivery to Azalea Park, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables proudly serves{" "}
              <a href="https://en.wikipedia.org/wiki/Azalea_Park,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Azalea Park <ExternalLink className="h-3 w-3" />
              </a>
              , a welcoming community in East Orlando with deep roots and a strong neighborhood spirit. Located just east of downtown Orlando, Azalea Park offers families an affordable place to live with easy access to everything the Orlando area has to offer.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're hosting a quinceañera, birthday party, family reunion, or community celebration, Orlando Inflatables has the perfect party rentals for your Azalea Park event. We offer competitive pricing without compromising on quality or safety.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our delivery team knows the Azalea Park area well, from the established neighborhoods near Semoran Boulevard to the residential streets off East Colonial Drive. We provide prompt, friendly service and ensure your party equipment is set up safely and on time.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Azalea Park, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Azalea Park is a census-designated place in Orange County, Florida, known for its diverse, close-knit community and convenient location. The neighborhood developed primarily in the mid-20th century and has maintained its character as a welcoming place for families of all backgrounds.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The community is served by Orange County Public Schools and offers residents easy access to shopping, dining, and entertainment along the East Colonial Drive and Semoran Boulevard corridors. Orlando International Airport is just a short drive away, making Azalea Park convenient for families with frequent travelers.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Azalea Park residents celebrate life's milestones with enthusiasm, and we're honored to be part of so many family celebrations in this vibrant community. From first birthday parties to graduation celebrations, our inflatables bring smiles to faces across Azalea Park.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Azalea Park
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
              Affordable Party Rentals for Azalea Park Families
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We believe every family deserves access to quality party entertainment. That's why we offer competitive pricing and flexible rental packages for Azalea Park residents. Contact us for a free quote and discover how affordable it can be to add a bounce house or water slide to your next celebration!
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
