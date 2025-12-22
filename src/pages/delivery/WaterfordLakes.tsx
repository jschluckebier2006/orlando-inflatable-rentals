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
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Eastwood", slug: "eastwood" },
];

export default function WaterfordLakesDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Waterford Lakes FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Waterford Lakes FL. Premium party inflatables near Town Center. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/waterford-lakes"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Waterford Lakes", href: "/delivery-area/waterford-lakes" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Waterford Lakes, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Your local party rental experts near Waterford Lakes Town Center. Premium bounce houses, water slides, and more!
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
              Party Rental Delivery to Waterford Lakes, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is proud to be the go-to party rental company for{" "}
              <a href="https://en.wikipedia.org/wiki/Waterford_Lakes,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Waterford Lakes <ExternalLink className="h-3 w-3" />
              </a>
              , one of East Orlando's most popular and vibrant communities. Located near the bustling Waterford Lakes Town Center, this area is home to thousands of families who appreciate quality, convenience, and community.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Waterford Lakes residents love to celebrate, and we're here to help make every event special. From birthday parties in beautiful backyards to community events at local parks, our bounce houses, water slides, and party equipment bring the fun that keeps guests entertained for hours.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our delivery team knows Waterford Lakes inside and out. Whether you live in the established Waterford Lakes community, The Villages at Waterford Lakes, or any of the surrounding developments, we provide prompt, professional service for your party rental needs.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Waterford Lakes, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Waterford Lakes is a census-designated place in Orange County, Florida, anchored by the{" "}
              <a href="https://www.simon.com/mall/the-shoppes-at-waterford-lakes" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Waterford Lakes Town Center <ExternalLink className="h-3 w-3" />
              </a>
              , one of the largest open-air shopping centers in the Orlando area. The community has grown rapidly since the 1990s and is now home to a diverse population of families, young professionals, and retirees.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Families are attracted to Waterford Lakes for its excellent schools in the{" "}
              <a href="https://www.ocps.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Orange County Public Schools <ExternalLink className="h-3 w-3" />
              </a>{" "}
              district, abundant shopping and dining options, and convenient access to major roads including SR 408 and SR 417. The area offers a suburban lifestyle with urban conveniences just minutes away.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Community life thrives in Waterford Lakes, with residents frequently hosting backyard parties, birthday celebrations, and neighborhood gatherings. The area's numerous HOA communities and parks provide plenty of venues for events of all sizes.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Waterford Lakes
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
              Waterford Lakes' Favorite Party Rentals
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Waterford Lakes families consistently choose our combo bounce houses and water slides for their events. The community's beautiful homes and well-maintained yards are perfect settings for our inflatables. During summer months, our water slides are in high demand – book early to ensure availability for your Waterford Lakes celebration!
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
