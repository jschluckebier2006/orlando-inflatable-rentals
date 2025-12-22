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
  { name: "Chuluota", slug: "chuluota" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

export default function ChristmasDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Christmas FL | Orlando Inflatables"
        description="Bounce house & water slide rentals in Christmas FL. Party inflatables for this unique Florida community. Free delivery! Call (407) 497-1840."
        canonical="/delivery-area/christmas"
      />
      <BreadcrumbSchema items={[{ name: "Delivery Areas", href: "/delivery-area" }, { name: "Christmas", href: "/delivery-area/christmas" }]} />

      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Christmas, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Party rentals for Florida's most festive community! Bounce houses, water slides, and more delivered to Christmas and surrounding areas.
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
              Party Rental Delivery to Christmas, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables delivers party rentals to{" "}
              <a href="https://en.wikipedia.org/wiki/Christmas,_Florida" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                Christmas, Florida <ExternalLink className="h-3 w-3" />
              </a>
              , one of the most uniquely named communities in the United States! Located in eastern Orange County along State Road 50, Christmas offers a rural Florida lifestyle with a special festive spirit that lasts all year long.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Whether you're celebrating a birthday, holiday gathering, or any special occasion, our bounce houses and inflatables add extra fun to your Christmas, Florida celebration. With the community's larger properties, there's plenty of room for even our biggest water slides and obstacle courses.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We serve Christmas and the surrounding rural areas of eastern Orange County. Our delivery team is experienced with the area's country roads and will ensure your party equipment arrives safely and on time.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About Christmas, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Christmas is a small, unincorporated community in Orange County, Florida, famous for its year-round holiday theme. The town gets its name from Fort Christmas, a{" "}
              <a href="https://www.orangecountyfl.net/CultureParks/Parks.aspx?m=dtlvw&d=39" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                historic site and park <ExternalLink className="h-3 w-3" />
              </a>{" "}
              that commemorates a Second Seminole War fort established on Christmas Day in 1837.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The community is home to the famous Christmas Post Office, where people from around the world send their holiday mail to receive the special "Christmas, FL" postmark. Fort Christmas Historical Park offers nature trails, a pioneer village, and hosts community events throughout the year.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Residents of Christmas enjoy spacious properties, natural Florida surroundings, and a strong sense of community. The area's rural character and festive name make every celebration feel extra special – and our party rentals add to the fun!
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Services in Christmas
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
              Celebrate Every Occasion in Christmas
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Living in a town called Christmas means every party has a little extra magic! Whether it's a summer birthday, a holiday gathering, or just a weekend get-together, our inflatables help make your celebration memorable. The spacious properties in Christmas are perfect for our larger inflatables – go big and make it a party to remember!
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
