import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Phone, Check, Castle, Waves, Star, Clock, Shield, Truck, Users, Calendar, HelpCircle } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cityServiceImages, cityServiceImages2, getHeroBackground } from "@/components/home/ContentImages";
import { ContentImageWithText } from "@/components/home/ContentImageWithText";

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
  const serviceNamePlural = isBounceHouse ? "Bounce Houses" : "Water Slides";
  const servicePath = isBounceHouse ? "/bounce-house-rentals" : "/water-slide-rentals";
  const pageSlug = isBounceHouse ? `bounce-house-rentals-${citySlug}` : `water-slide-rentals-${citySlug}`;
  
  const title = `${serviceName} Rentals ${city} FL | Orlando Inflatables`;
  const description = `${serviceName} rentals in ${city}, FL. Premium inflatable ${serviceName.toLowerCase()}s for birthday parties, events & celebrations. Free delivery! Call (407) 497-1840.`;

  // FAQ items for schema
  const faqItems = [
    {
      question: `How much does it cost to rent a ${serviceName.toLowerCase()} in ${city}?`,
      answer: `${serviceName} rental prices in ${city} start at $199 for a full-day rental. Pricing varies based on the size and style you choose. We offer competitive rates with free delivery to ${city}!`
    },
    {
      question: `Do you deliver ${serviceName.toLowerCase()}s to ${city}, FL?`,
      answer: `Yes! We provide free delivery, setup, and pickup throughout ${city} and surrounding areas. Our team handles everything so you can focus on your party.`
    },
    {
      question: `How far in advance should I book a ${serviceName.toLowerCase()} rental in ${city}?`,
      answer: `We recommend booking 1-2 weeks in advance to ensure availability, especially during peak season (spring and summer). However, we can often accommodate last-minute bookings if availability allows.`
    },
    {
      question: `Are your ${serviceName.toLowerCase()}s safe for children?`,
      answer: `Absolutely! Safety is our top priority. All our ${serviceName.toLowerCase()}s are commercially rated, regularly inspected, and cleaned with hospital-grade disinfectants. We're fully licensed and insured.`
    },
    {
      question: `What do I need to set up a ${serviceName.toLowerCase()} at my ${city} home?`,
      answer: `You'll need a flat area large enough for the ${serviceName.toLowerCase()} (dimensions vary by unit), access to a standard electrical outlet within 100 feet, and a water source ${isBounceHouse ? 'for optional water features' : 'for the slide'}. We handle the rest!`
    },
    {
      question: `Can I rent a ${serviceName.toLowerCase()} for a school or church event in ${city}?`,
      answer: `Yes! We regularly serve schools, churches, and community organizations in ${city}. We offer special rates for non-profit events and can provide certificates of insurance upon request.`
    }
  ];

  return (
    <Layout>
      <SEOHead title={title} description={description} canonical={`/${pageSlug}`} />
      <ServiceSchema
        serviceName={`${serviceName} Rentals in ${city} FL`}
        description={description}
        areaServed={city}
        url={`/${pageSlug}`}
      />
      <FAQPageSchema faqs={faqItems} />
      <LocalBusinessSchema cityName={city} />
      <BreadcrumbSchema items={[
        { name: isBounceHouse ? "Bounce House Rentals" : "Water Slide Rentals", href: servicePath },
        { name: city, href: `/${pageSlug}` }
      ]} />

      {/* Hero with Background Image */}
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getHeroBackground(citySlug)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isBounceHouse ? <Castle className="h-6 w-6" /> : <Waves className="h-6 w-6" />}
              <span className="text-lg drop-shadow-lg">Serving {city}, Florida</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              {serviceName} Rentals in {city}, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Premium {serviceName.toLowerCase()} rentals delivered to {city}. Safe, clean, and perfect for birthday parties, school events, and celebrations!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowJotform(true)} size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8">
                Get a Free Quote
              </Button>
              <a href="tel:4074971840">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8 font-semibold">
                  <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* H2: Party Rental Equipment Rentals City - Image Right */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <ContentImageWithText
              src={cityServiceImages[0]}
              alt={`${city} bounce house party`}
              imagePosition="right"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Party Rental Equipment Rentals {city}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
                {localContent.intro}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Orlando Inflatables is your trusted local provider of premium {serviceName.toLowerCase()} rentals in {city}. We deliver clean, safe, and exciting inflatables right to your doorstep.
              </p>
            </ContentImageWithText>

            {/* Full-Width Section 1a: Your Event, Our Priority */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Your {city} Event, Our Priority
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Planning a {serviceName.toLowerCase()} party in {city}? We make it easy! From the moment you request a quote to the final pickup, our team is dedicated to ensuring your event is a success. We handle all the heavy lifting so you can focus on celebrating.
              </p>
            </div>

            {/* Full-Width Section 1b: Professional Service */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Professional Service You Can Trust
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Our experienced team has delivered thousands of successful {serviceName.toLowerCase()} rentals throughout {city} and the surrounding Orlando area. We show up on time, every time, with spotless equipment ready for your celebration.
              </p>
            </div>

            {/* H3: Best Bounce Houses/Water Slides - Image Left */}
            <ContentImageWithText
              src={cityServiceImages[1]}
              alt={`Kids enjoying inflatables in ${city}`}
              imagePosition="left"
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Best {serviceNamePlural} for {city} Parties
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our selection of {serviceName.toLowerCase()}s includes something for every age group and event size.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong>{isBounceHouse ? 'Standard Bounce Houses' : 'Single Lane Water Slides'}:</strong> Perfect for smaller gatherings.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong>{isBounceHouse ? 'Combo Bounce Houses' : 'Dual Lane Racing Slides'}:</strong> Great for larger parties.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground"><strong>{isBounceHouse ? 'Themed Bounce Houses' : 'Tropical Water Slides'}:</strong> Add a special touch to your party.</span>
                </li>
              </ul>
            </ContentImageWithText>
          </div>
        </div>
      </section>

      {/* H2: Why Choose Our Service */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why Choose Our {serviceName} Rentals in {city}?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {localContent.whyChoose}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="h-8 w-8 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Free Delivery to {city}</h3>
                  </div>
                  <p className="text-muted-foreground">We deliver, set up, and pick up at no extra charge throughout the {city} area. Just enjoy your party!</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Licensed & Insured</h3>
                  </div>
                  <p className="text-muted-foreground">Full liability coverage for your peace of mind. All equipment is commercially rated and regularly inspected.</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Star className="h-8 w-8 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Clean & Sanitized</h3>
                  </div>
                  <p className="text-muted-foreground">Every {serviceName.toLowerCase()} is professionally cleaned with hospital-grade disinfectants after each rental.</p>
                </CardContent>
              </Card>

              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-8 w-8 text-primary" />
                    <h3 className="font-display text-xl font-bold text-foreground">On-Time Every Time</h3>
                  </div>
                  <p className="text-muted-foreground">We know {city} and always arrive when promised so your party starts on schedule.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* H2: About City Florida - Image Right */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <ContentImageWithText
              src={cityServiceImages[2]}
              alt={`${city} party rental fun`}
              imagePosition="right"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                About {city}, Florida
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {localContent.about}
              </p>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Serving Families Throughout {city}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                As a locally-owned business, we take pride in serving the {city} community. We've helped countless {city} families create lasting memories.
              </p>
            </ContentImageWithText>

            {/* Full-Width Section 2a: Safe & Clean Equipment */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Safe & Clean Equipment Guaranteed
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Every {serviceName.toLowerCase()} we deliver to {city} is thoroughly cleaned, sanitized with hospital-grade disinfectants, and inspected before each rental. Your children's safety is our top priority, and we're fully licensed and insured.
              </p>
            </div>

            {/* Full-Width Section 2b: Inspected Before Every Rental */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Inspected Before Every Rental
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Before any {serviceName.toLowerCase()} leaves our facility for {city}, it undergoes a comprehensive safety inspection. We check all seams, anchor points, blower systems, and safety features to ensure everything meets our rigorous standards.
              </p>
            </div>

            {/* Additional Image Section - Image Left */}
            <ContentImageWithText
              src={cityServiceImages2[0]}
              alt={`Fun ${serviceName.toLowerCase()} in ${city}`}
              imagePosition="left"
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Your Local Party Rental Experts
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our team knows the {city} area well and provides personalized service to every customer. We understand local HOA requirements, neighborhood layouts, and the best setup practices for your area.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Local Knowledge:</strong> We know {city} streets and neighborhoods</li>
                <li>• <strong>HOA Friendly:</strong> Clean, professional equipment and respectful setup</li>
                <li>• <strong>Community Focused:</strong> Proudly serving {city} families</li>
              </ul>
            </ContentImageWithText>

            {/* Full-Width Section 3a: Book with Confidence */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Book with Confidence
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                When you choose Orlando Inflatables for your {city} event, you're choosing reliability. We offer transparent pricing with no hidden fees, flexible scheduling, and a 100% satisfaction guarantee. Join thousands of happy {city} customers!
              </p>
            </div>

            {/* Full-Width Section 3b: Simple Booking Process */}
            <div className="py-12 text-center border-b border-border/50">
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Simple & Easy Booking Process
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Getting your {serviceName.toLowerCase()} rental in {city} is quick and hassle-free. Browse our inventory, pick your date, and request a quote. We'll confirm availability and handle all the logistics so you can focus on planning the perfect event.
              </p>
            </div>

            {/* Third Image Section - Image Right */}
            <ContentImageWithText
              src={cityServiceImages2[1]}
              alt={`${city} celebration`}
              imagePosition="right"
            >
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Making Memories in {city}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every event in {city} is an opportunity to create lasting memories. Whether it's a child's first birthday or a neighborhood block party, our {serviceName.toLowerCase()}s bring smiles to faces of all ages.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We've served hundreds of {city} families and look forward to being part of your next celebration!
              </p>
            </ContentImageWithText>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* H2: Perfect for Events & Celebrations */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Perfect for {city} Events & Celebrations
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {localContent.events}
            </p>

            {/* H3: Popular Event Types */}
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              Popular Event Types in {city}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">Birthday Parties</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">Family Reunions</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">School Events</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">Church Gatherings</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">Graduation Celebrations</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-background rounded-lg border">
                <Users className="h-6 w-6 text-primary" />
                <span className="text-foreground font-medium">Community Festivals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H2: Affordable Pricing */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Affordable {serviceName} Rental Prices in {city}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We believe every {city} family deserves access to premium party rentals at fair prices. Our {serviceName.toLowerCase()} rentals include free delivery, professional setup, and pickup—no hidden fees or surprises.
            </p>

            {/* H3: What's Included */}
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              What's Included With Your Rental
            </h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Free delivery and setup to your {city} location</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Full-day rental (up to 8 hours)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Professional pickup and breakdown</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Safety instructions and supervision tips</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground">Liability insurance coverage</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* H2: Book Your Rental Today */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Book Your {city} {serviceName} Rental Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ready to add a {serviceName.toLowerCase()} to your {city} event? Booking is easy! Simply call us at (407) 497-1840 or fill out our online quote form. We recommend booking 1-2 weeks in advance to ensure availability, especially during peak season.
            </p>

            {/* H3: How to Book */}
            <h3 className="font-display text-2xl font-bold text-foreground mb-4">
              How to Book Your Rental
            </h3>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-primary mb-2">1</div>
                <h4 className="font-semibold text-foreground mb-2">Get a Quote</h4>
                <p className="text-muted-foreground text-sm">Call or submit our online form for a free quote</p>
              </div>
              <div className="text-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-primary mb-2">2</div>
                <h4 className="font-semibold text-foreground mb-2">Choose Your Date</h4>
                <p className="text-muted-foreground text-sm">Select your event date and {serviceName.toLowerCase()}</p>
              </div>
              <div className="text-center p-6 bg-background rounded-lg border">
                <div className="text-4xl font-bold text-primary mb-2">3</div>
                <h4 className="font-semibold text-foreground mb-2">Enjoy Your Party</h4>
                <p className="text-muted-foreground text-sm">We deliver, you celebrate!</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowJotform(true)} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground btn-bounce text-lg px-8">
                Get a Free Quote
              </Button>
              <a href="tel:4074971840">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 btn-bounce text-lg px-8 font-semibold">
                  <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with H4 and H5 */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                {serviceName} Rental FAQs for {city}
              </h2>
            </div>
            <p className="text-muted-foreground mb-8">
              Have questions about renting a {serviceName.toLowerCase()} in {city}? Here are answers to the most common questions we receive from {city} customers.
            </p>

            <Accordion type="single" collapsible className="mb-8">
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left">
                    <h4 className="font-semibold text-foreground text-lg">{faq.question}</h4>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2">
                      <h5 className="sr-only">Answer</h5>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Additional FAQ Sub-sections */}
            <div className="bg-muted/30 rounded-lg p-6 mb-8">
              <h4 className="font-display text-xl font-bold text-foreground mb-4">
                Still Have Questions About {serviceName} Rentals in {city}?
              </h4>
              <h5 className="font-semibold text-foreground mb-2">Contact Our {city} Team</h5>
              <p className="text-muted-foreground mb-4">
                Our friendly team is happy to answer any questions about {serviceName.toLowerCase()} rentals in {city}. Call us at (407) 497-1840 or send us a message through our contact form.
              </p>
              <h5 className="font-semibold text-foreground mb-2">Same-Day Bookings</h5>
              <p className="text-muted-foreground">
                Need a {serviceName.toLowerCase()} last minute? We often have availability for same-day and next-day rentals in {city}. Give us a call to check!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
              Explore More Party Rentals
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Link to={`/water-slide-and-bounce-house-rental-${citySlug}`}>
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
      <section className="section-padding">
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
