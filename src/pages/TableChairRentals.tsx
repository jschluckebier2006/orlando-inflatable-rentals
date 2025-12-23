import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { getTablesChairs } from "@/data/inventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Armchair, Check, Phone, Shield, Clock, Users, Package } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";
import { siteImages } from "@/components/home/ContentImages";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Package, title: "Bulk Quantities", description: "Rent as many as you need" },
  { icon: Clock, title: "On-Time Delivery", description: "Setup and pickup included" },
  { icon: Users, title: "Any Event Size", description: "From small to large gatherings" },
];


const faqs = [
  { q: "What is the minimum rental for tables and chairs?", a: "We have a 10-chair minimum for chair rentals. Tables can be rented individually with no minimum. Delivery fees may apply for smaller orders." },
  { q: "Do you set up the tables and chairs?", a: "Yes! Our team delivers, sets up, and picks up all tables and chairs. Just tell us where you want them placed and we'll handle the rest." },
  { q: "Can I rent tables and chairs with inflatables?", a: "Absolutely! Most of our inflatable rental customers add tables and chairs to their order. We offer package deals when you combine rentals." },
  { q: "How far in advance should I book?", a: "We recommend booking 1-2 weeks in advance, especially during peak season. Large orders for weddings or corporate events should book even earlier." },
];

export default function TableChairRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Table and Chair Rentals in Orlando FL",
    "provider": { "@type": "LocalBusiness", "name": "Orlando Inflatables", "telephone": "+1-407-497-1840" },
    "areaServed": { "@type": "City", "name": "Orlando", "containedInPlace": { "@type": "State", "name": "Florida" } },
    "description": "Table and chair rentals for parties, events, and gatherings in East Orlando and Orange County."
  };

  return (
    <Layout>
      <SEOHead
        title="Table & Chair Rentals Orlando FL | Party Seating"
        description="Rent tables and chairs in Orlando FL for parties, weddings & events. Folding chairs, banquet tables & more. Free delivery! Call (407) 497-1840!"
        canonical="/table-chair-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Table & Chair Rentals", href: "/table-chair-rentals" }]} />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24"
        style={{
          backgroundImage: `url(${siteImages.toddlerBounce1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Event Essentials</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Table & Chair Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Comfortable seating and sturdy tables for any event size. Perfect for birthday parties, graduations, corporate events, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setShowJotform(true)} size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8">
                Get a Free Quote
              </Button>
              <a href="tel:4074971840">
                <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 btn-bounce text-lg px-8 font-semibold">
                  <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Quality Table and Chair Rentals in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Every great event needs comfortable seating for guests to relax, eat, and socialize. Orlando Inflatables provides table and chair rentals throughout East Orlando and Orange County for events of all sizes – from intimate backyard birthday parties to large corporate gatherings and everything in between.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our table and chair inventory is carefully maintained to ensure every piece looks clean and professional at your event. We offer a variety of table sizes and styles to accommodate different event layouts and guest counts. Combined with our inflatable rentals and concession machines, we can provide everything you need for a complete party setup.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Planning a party shouldn't be stressful. When you rent tables and chairs from Orlando Inflatables, we handle delivery, setup, and pickup – giving you one less thing to worry about on your big day.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Our Table and Chair Selection
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We offer a variety of tables and chairs to meet your event needs:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>White Folding Chairs:</strong> Classic, clean, and comfortable chairs perfect for any event. These sturdy chairs support up to 300 lbs and feature a contoured seat for guest comfort.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>6-Foot Rectangular Tables:</strong> Our most popular table size, perfect for buffet lines, gift tables, or seating 6-8 guests for dinner.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>8-Foot Rectangular Tables:</strong> Larger banquet tables that seat 8-10 guests comfortably. Ideal for family-style dining or larger display areas.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>60-Inch Round Tables:</strong> Elegant round tables perfect for weddings, formal events, or any occasion where you want a more refined seating arrangement.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Delivery and Setup Included
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you rent tables and chairs from Orlando Inflatables, our professional team handles everything. We'll deliver your rental items at your requested time, set up tables and chairs according to your layout preferences, and return after your event for pickup.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Need help figuring out how many tables and chairs you need? Just tell us your guest count and event type, and we'll provide a recommendation. For sit-down meals, plan for one chair per guest. For casual events where some guests will be standing or playing on inflatables, you may need fewer.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Table & Chair Inventory</h2>
          <ProductGrid products={getTablesChairs()} />
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* More Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for Birthday Parties and Family Events
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Birthday parties are one of our most common requests for table and chair rentals. Parents love having extra seating for guests, a dedicated table for cake and presents, and space for adults to relax while kids enjoy the bounce house or water slide.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For backyard birthday parties, we typically recommend 1-2 rectangular tables for food and presents, plus enough chairs for adult guests to sit comfortably. Kids usually prefer running around and playing, so you may not need as many chairs as your total headcount.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Corporate and Large Event Rentals
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Planning a company picnic, employee appreciation event, or community gathering? We have the inventory to handle large events with hundreds of guests. Our team has experience setting up for schools, churches, community organizations, and businesses throughout East Orlando.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For large orders, we recommend booking well in advance to ensure availability. Contact us with your event details and expected guest count, and we'll provide a custom quote with our best pricing.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Reserve Your Tables and Chairs Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Ready to ensure comfortable seating for all your guests? Contact Orlando Inflatables at (407) 497-1840 or complete our online quote form. We provide table and chair rentals throughout East Orlando including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <CTASection />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </Layout>
  );
}
