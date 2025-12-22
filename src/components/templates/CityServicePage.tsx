import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Phone, Check, Castle, Waves } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";

interface CityServicePageProps {
  city: string;
  citySlug: string;
  serviceType: "bounce-house" | "water-slide";
  nearbyAreas: { name: string; slug: string }[];
  localContent: {
    intro: string;
    about: string;
    whyChoose: string;
    events: string;
  };
}

export function CityServicePage({ city, citySlug, serviceType, nearbyAreas, localContent }: CityServicePageProps) {
  const [showJotform, setShowJotform] = useState(false);
  
  const isBounceHouse = serviceType === "bounce-house";
  const serviceName = isBounceHouse ? "Bounce House" : "Water Slide";
  const servicePath = isBounceHouse ? "/bounce-house-rentals" : "/water-slide-rentals";
  const pageSlug = isBounceHouse ? `bounce-house-rentals-${citySlug}` : `water-slide-rentals-${citySlug}`;
  
  const title = `${serviceName} Rentals ${city} FL | Orlando Inflatables`;
  const description = `${serviceName} rentals in ${city}, FL. Premium inflatable ${serviceName.toLowerCase()}s for birthday parties, events & celebrations. Free delivery! Call (407) 497-1840.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${serviceName} Rentals in ${city} FL`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "+1-407-497-1840"
    },
    "areaServed": {
      "@type": "City",
      "name": city,
      "containedInPlace": { "@type": "State", "name": "Florida" }
    },
    "description": description
  };

  return (
    <Layout>
      <SEOHead title={title} description={description} canonical={`/${pageSlug}`} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[
        { name: isBounceHouse ? "Bounce House Rentals" : "Water Slide Rentals", href: servicePath },
        { name: city, href: `/${pageSlug}` }
      ]} />

      {/* Hero */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-20">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isBounceHouse ? <Castle className="h-6 w-6" /> : <Waves className="h-6 w-6" />}
              <span className="text-lg">Serving {city}</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {serviceName} Rentals in {city}, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Premium {serviceName.toLowerCase()} rentals delivered to {city}. Safe, clean, and perfect for birthday parties, school events, and celebrations!
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
              {serviceName} Rentals Delivered to {city}, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {localContent.intro}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Orlando Inflatables is your trusted local provider of premium {serviceName.toLowerCase()} rentals in {city}. We deliver clean, safe, and exciting inflatables right to your doorstep, whether you're hosting a backyard birthday party, organizing a school event, or planning a community celebration.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Choose Our {serviceName} Rentals in {city}?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {localContent.whyChoose}
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground"><strong>Free Delivery to {city}:</strong> We deliver, set up, and pick up at no extra charge throughout the {city} area.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground"><strong>Clean & Sanitized:</strong> Every {serviceName.toLowerCase()} is professionally cleaned with hospital-grade disinfectants after each rental.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground"><strong>Licensed & Insured:</strong> Full liability coverage for your peace of mind. Safety is our top priority.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground"><strong>On-Time Arrival:</strong> We know {city} and always arrive when promised so your party starts on schedule.</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground"><strong>Wide Selection:</strong> Multiple {serviceName.toLowerCase()} styles and sizes to match your event theme and guest count.</span>
              </li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About {city}, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {localContent.about}
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for {city} Events & Celebrations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {localContent.events}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our {serviceName.toLowerCase()}s are perfect for birthday parties, graduation celebrations, family reunions, church gatherings, school field days, corporate picnics, and any other special occasion in {city}. We've helped hundreds of {city} families create unforgettable memories with our premium inflatable rentals.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Book Your {city} {serviceName} Rental Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ready to add a {serviceName.toLowerCase()} to your {city} event? Booking is easy! Simply call us at (407) 497-1840 or fill out our online quote form. We recommend booking 1-2 weeks in advance to ensure availability, especially during peak season.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our friendly team will help you select the perfect {serviceName.toLowerCase()} for your event, confirm your delivery details, and answer any questions you have. We're committed to making your {city} celebration a success!
            </p>

            {/* Related Links */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Link to={`/delivery-area/${citySlug}`}>
                <Card className="h-full card-hover">
                  <CardContent className="p-4 flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="font-medium text-foreground">All Party Rentals in {city}</span>
                  </CardContent>
                </Card>
              </Link>
              <Link to={servicePath}>
                <Card className="h-full card-hover">
                  <CardContent className="p-4 flex items-center gap-3">
                    {isBounceHouse ? <Castle className="h-6 w-6 text-primary" /> : <Waves className="h-6 w-6 text-primary" />}
                    <span className="font-medium text-foreground">All {serviceName} Rentals</span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            {serviceName} Rentals in Nearby Areas
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {nearbyAreas.map((area) => (
              <Link key={area.slug} to={`/${isBounceHouse ? 'bounce-house' : 'water-slide'}-rentals-${area.slug}`}>
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
