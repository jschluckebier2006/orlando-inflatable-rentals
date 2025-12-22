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
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

export default function AlafayaDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Alafaya FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Alafaya FL. Serving UCF area with party inflatables, obstacle courses & more. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/alafaya"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Alafaya", href: "/delivery-area/alafaya" }]} />

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Alafaya, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Your trusted party rental company serving the Alafaya and UCF community. Free delivery on bounce houses, water slides, and more!
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

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Party Rental Delivery to Alafaya, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is proud to offer party rental delivery throughout{" "}
              <a href="https://en.wikipedia.org/wiki/Alafaya,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Alafaya, Florida <ExternalLink className="h-3 w-3" />
              </a>
              , one of the fastest-growing communities in East Orlando. Located in Orange County near the University of Central Florida, Alafaya is home to thousands of families, students, and young professionals who know how to throw a great party!
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're planning a birthday party in your Alafaya backyard, organizing a UCF tailgate celebration, or hosting a community event at one of the area's beautiful parks, we have the perfect inflatable rentals to make your event unforgettable. Our delivery team knows Alafaya's neighborhoods well, from the established communities near Alafaya Trail to the newer developments along Innovation Way.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              As your local party rental company, we understand the unique needs of the Alafaya community. Many of our customers are UCF families celebrating graduations, young professionals hosting backyard gatherings, or parents planning birthday parties for their kids. Whatever your occasion, we provide clean, safe, and exciting party equipment with professional delivery and setup.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Alafaya, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Alafaya is a census-designated place (CDP) in Orange County, Florida, situated in the heart of East Orlando. The community has experienced tremendous growth over the past two decades, largely driven by its proximity to the{" "}
              <a href="https://www.ucf.edu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                University of Central Florida <ExternalLink className="h-3 w-3" />
              </a>
              , one of the largest universities in the nation.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The area features excellent schools, family-friendly neighborhoods, and convenient access to major employers in the Research Park corridor. Residents enjoy a suburban lifestyle with easy access to Orlando's attractions, shopping centers, and dining options along the Alafaya Trail and East Colonial Drive corridors.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Popular gathering spots in Alafaya include community parks, HOA clubhouses, and the many residential neighborhoods with spacious backyards perfect for party rentals. The community's young, active population makes it one of our most popular delivery areas for bounce houses, water slides, and interactive games.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Alafaya
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
              Why Choose Orlando Inflatables in Alafaya?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you book with Orlando Inflatables for your Alafaya event, you get:
            </p>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li>• Free delivery and setup throughout Alafaya</li>
              <li>• Clean, sanitized equipment inspected before every rental</li>
              <li>• Licensed and insured for your peace of mind</li>
              <li>• On-time arrival – we know Alafaya traffic patterns!</li>
              <li>• Local customer service from people who know your community</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
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
