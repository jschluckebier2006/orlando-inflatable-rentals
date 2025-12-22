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
  { name: "Chuluota", slug: "chuluota" },
  { name: "Alafaya", slug: "alafaya" },
];

export default function WedgefieldDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Wedgefield FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Wedgefield FL. Party inflatables for this East Orange County golf community. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/wedgefield"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Wedgefield", href: "/delivery-area/wedgefield" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Wedgefield, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Premium party rentals for the Wedgefield golf community. Bounce houses, water slides, and more with free delivery!
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
              Party Rental Delivery to Wedgefield, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables extends our services to{" "}
              <a href="https://en.wikipedia.org/wiki/Wedgefield,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Wedgefield, Florida <ExternalLink className="h-3 w-3" />
              </a>
              , a beautiful golf course community in eastern Orange County. Known for the Wedgefield Golf Course and its peaceful, family-oriented atmosphere, Wedgefield offers residents a perfect blend of recreational amenities and Florida's natural beauty.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Wedgefield's larger lots and community amenities make it an ideal location for party rentals. Whether you're celebrating a birthday, hosting a graduation party, or organizing a community event, our bounce houses and water slides add excitement that guests of all ages will enjoy.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We deliver throughout Wedgefield and understand the unique character of this community. Our professional team ensures your party equipment is delivered safely and set up properly, so you can focus on enjoying your celebration.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Wedgefield, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Wedgefield is a census-designated place in Orange County, Florida, centered around the Wedgefield Golf & Country Club. The community developed as a golf course community and has maintained its character as a peaceful, family-friendly neighborhood away from the bustle of urban Orlando.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Residents enjoy larger-than-average lots, many with golf course views, as well as access to the club's amenities. The area is served by{" "}
              <a href="https://www.ocps.net/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Orange County Public Schools <ExternalLink className="h-3 w-3" />
              </a>{" "}
              and offers a quieter lifestyle while maintaining convenient access to employment centers and shopping areas in greater Orlando.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The Wedgefield community values family and neighborhood connections. Residents frequently host celebrations and gatherings, taking advantage of their spacious properties and the community's relaxed atmosphere. Our party rentals are a popular choice for making these events even more memorable.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Wedgefield
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
              Take Advantage of Your Space
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Wedgefield's larger lots mean you have room for our biggest and best inflatables! Consider our mega obstacle courses or large water slides for your next party. With more space to work with, you can create an unforgettable experience for your guests. Contact us to discuss the best options for your Wedgefield property!
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
