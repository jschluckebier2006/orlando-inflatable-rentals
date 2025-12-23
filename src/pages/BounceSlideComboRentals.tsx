import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Phone, Shield, Clock, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";
import { siteImages } from "@/components/home/ContentImages";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { getBounceSlidesCombos } from "@/data/inventory";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage for your peace of mind" },
  { icon: Sparkles, title: "Clean & Sanitized", description: "Thoroughly cleaned after every rental" },
  { icon: Clock, title: "On-Time Delivery", description: "Professional setup and pickup included" },
  { icon: Users, title: "All Ages Welcome", description: "Options for toddlers to adults" },
];


const faqs = [
  { q: "What's the difference between a bounce house and a combo unit?", a: "Combo units combine the fun of a bounce house with an attached slide, giving kids two activities in one inflatable. They typically include a bounce area, climbing wall, and slide for more variety and entertainment value." },
  { q: "How much space do I need for a combo unit?", a: "Combo units are larger than standard bounce houses. Most require a flat area of approximately 25x20 feet to allow for proper setup, the slide landing area, and safety clearance. We recommend measuring your space before booking." },
  { q: "Are combo units safe for young children?", a: "Yes! We offer combo units designed for various age groups. Our team will help you select an age-appropriate unit with safety features like enclosed slides and proper wall heights for younger children." },
  { q: "Do you set up and take down the combo unit?", a: "Absolutely! Our professional team handles all delivery, setup, and pickup. We'll arrive early to ensure everything is ready before your guests arrive and return afterward for takedown." },
];

export default function BounceSlideComboRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bounce & Slide Combo Rentals in Orlando FL",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "+1-407-497-1840"
    },
    "areaServed": {
      "@type": "City",
      "name": "Orlando",
      "containedInPlace": { "@type": "State", "name": "Florida" }
    },
    "description": "Premium bounce house and slide combo rentals for birthday parties, school events, and celebrations in East Orlando and Orange County."
  };

  return (
    <Layout>
      <SEOHead
        title="Bounce & Slide Combo Rentals Orlando FL | 2-in-1 Party Inflatables"
        description="Rent bounce house & slide combos in Orlando FL for birthday parties & events. Double the fun with 2-in-1 inflatables! Licensed & insured with free delivery. Call (407) 497-1840!"
        canonical="/bounce-slide-combo-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Bounce & Slide Combos", href: "/bounce-slide-combo-rentals" }]} />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24"
        style={{
          backgroundImage: `url(${siteImages.kidsSlide1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">2-in-1 Fun!</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Bounce & Slide Combo Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get double the fun with our combo units that feature both a bounce area and an exciting slide! Perfect for parties of all sizes.
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

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Combo Unit Inventory</h2>
          <ProductGrid products={getBounceSlidesCombos()} columns={4} />
        </div>
      </section>

      {/* Features */}
      <section className="section-padding section-alt">
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
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              The Best Bounce & Slide Combos in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Why choose between a bounce house and a slide when you can have both? Our bounce and slide combo rentals offer the ultimate party entertainment experience, combining the jumping fun of a bounce house with the thrill of a slide – all in one incredible inflatable unit.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Combo units are perfect for larger parties or when you want to keep kids entertained for longer. With multiple activities built into one inflatable, children can bounce, climb, and slide to their heart's content. Our combos feature bounce areas, climbing walls, and attached slides that provide hours of non-stop fun.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every combo unit in our inventory is meticulously maintained, thoroughly cleaned and sanitized after each use, and inspected for safety before every rental. As a licensed and insured rental company, we prioritize your peace of mind alongside your party's success.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Choose a Combo Unit for Your Event?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Combo units offer more value and entertainment than standard bounce houses:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>More Activities:</strong> Bounce, climb, and slide – three activities in one unit keeps kids engaged longer.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Better Value:</strong> Get more entertainment per dollar compared to renting multiple separate units.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Larger Capacity:</strong> Combo units typically accommodate more children at once than standard bounce houses.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Visual Impact:</strong> Combo units create an impressive centerpiece for your party that wows guests.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Less Wait Time:</strong> With multiple activity zones, kids don't have to wait as long for their turn.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* More Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for Any Celebration
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our bounce and slide combos are the ultimate party entertainment for birthday parties, school field days, church festivals, community events, and corporate picnics. The combination of activities means kids of different ages can all find something fun to do, making combos ideal for mixed-age group events.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're celebrating a milestone birthday, organizing a school carnival, or hosting a neighborhood block party, a combo unit creates excitement that draws a crowd and keeps kids entertained for hours.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Serving East Orlando and Surrounding Communities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables proudly delivers combo units throughout East Orlando and Orange County. Our delivery area includes Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield, and surrounding communities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Free delivery, setup, and pickup is included with every combo rental in our service area. Our experienced team will ensure your combo unit is properly installed and ready for action before your party begins.
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
