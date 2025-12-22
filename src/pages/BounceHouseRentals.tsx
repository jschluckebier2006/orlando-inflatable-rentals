import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Castle, Check, Star, Phone, Shield, Clock, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage for your peace of mind" },
  { icon: Sparkles, title: "Clean & Sanitized", description: "Thoroughly cleaned after every rental" },
  { icon: Clock, title: "On-Time Delivery", description: "Professional setup and pickup included" },
  { icon: Users, title: "All Ages Welcome", description: "Options for toddlers to adults" },
];

const bounceHouses = [
  { name: "Classic Castle Bounce House", capacity: "8-10 kids", age: "3-12 years", size: "15x15 ft", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
  { name: "Princess Palace Bouncer", capacity: "8-10 kids", age: "3-10 years", size: "15x15 ft", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=300&fit=crop" },
  { name: "Sports Arena Bounce House", capacity: "10-12 kids", age: "4-14 years", size: "18x18 ft", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop" },
  { name: "Tropical Paradise Bouncer", capacity: "8-10 kids", age: "3-12 years", size: "15x15 ft", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
];

const faqs = [
  { q: "How much space do I need for a bounce house?", a: "Most standard bounce houses require a flat area of approximately 20x20 feet to allow for proper setup and safety clearance. We recommend measuring your space before booking and our team will confirm the requirements for your specific rental." },
  { q: "Are your bounce houses safe for young children?", a: "Absolutely! We offer bounce houses specifically designed for toddlers and younger children with lower walls, softer surfaces, and age-appropriate features. We also provide safety guidelines with every rental." },
  { q: "What happens if it rains on my event day?", a: "Safety is our priority. If weather conditions are unsafe for inflatable use, we'll work with you to reschedule at no additional charge. Light rain typically isn't an issue, but we monitor conditions closely." },
  { q: "Do you set up and take down the bounce house?", a: "Yes! Our professional team handles all delivery, setup, and pickup. We'll arrive early to ensure everything is ready before your guests arrive and return afterward for takedown." },
];

export default function BounceHouseRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Bounce House Rentals in Orlando FL",
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
    "description": "Premium bounce house rentals for birthday parties, school events, and celebrations in East Orlando and Orange County."
  };

  return (
    <Layout>
      <SEOHead
        title="Bounce House Rentals Orlando FL | Party Inflatables"
        description="Rent clean, safe bounce houses in Orlando FL for birthday parties, school events & celebrations. Licensed & insured with free delivery to East Orlando. Call (407) 497-1840!"
        canonical="/bounce-house-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Bounce House Rentals", href: "/bounce-house-rentals" }]} />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-primary-foreground">Most Popular Rental</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Bounce House Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Make your next party unforgettable with our premium bounce house rentals. Safe, clean, and fun for all ages!
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
              The Best Bounce House Rentals in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Looking for the perfect bounce house rental in Orlando, Florida? Orlando Inflatables is your trusted local provider of premium inflatable bounce houses for birthday parties, school events, church gatherings, corporate picnics, and backyard celebrations throughout East Orlando and Orange County.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our bounce houses are more than just inflatables – they're the centerpiece of unforgettable memories. Every bounce house in our inventory is meticulously maintained, thoroughly cleaned and sanitized after each use, and inspected for safety before every rental. We understand that when you're planning an event, you want peace of mind knowing that your entertainment is safe, reliable, and will arrive on time.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              As a licensed and insured bounce house rental company serving East Orlando, we pride ourselves on exceptional customer service. From your first phone call to the moment we pick up the equipment, our team is dedicated to making your event planning stress-free and your celebration spectacular.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Choose Orlando Inflatables for Your Bounce House Rental?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When it comes to bounce house rentals in Orlando, you have options. Here's why families, schools, churches, and event planners across East Orlando consistently choose Orlando Inflatables:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Safety First:</strong> All our inflatables meet or exceed safety standards. We're fully licensed and carry comprehensive liability insurance for your protection.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Impeccably Clean:</strong> Every bounce house is professionally cleaned and sanitized using hospital-grade disinfectants after each rental.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Free Delivery & Setup:</strong> We deliver, set up, and pick up your bounce house at no extra charge throughout our East Orlando service area.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Variety of Options:</strong> From princess castles to sports arenas, we have bounce houses to match any party theme.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Reliable Service:</strong> We show up on time, every time, with professional, courteous staff who ensure everything runs smoothly.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Bounce House Options for Every Occasion
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              No matter what type of event you're planning, we have the perfect bounce house to match. Our extensive inventory includes classic castle designs perfect for princess or knight-themed parties, sports arena bounce houses for athletic celebrations, tropical-themed inflatables for summer parties, and combo units that feature slides and climbing walls for extra excitement.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Each bounce house is designed with safety features including reinforced seams, secure anchor points, and mesh windows for visibility. We also offer toddler-specific bounce houses with lower walls and softer surfaces for our youngest guests.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Bounce House Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bounceHouses.map((item) => (
              <Card key={item.name} className="overflow-hidden card-hover">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Capacity: {item.capacity}</p>
                    <p>Ages: {item.age}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for Birthday Parties and Special Events
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Birthday parties are our specialty! There's nothing quite like watching children's faces light up when they see a colorful bounce house set up and ready for fun. Our bounce houses transform ordinary backyard parties into extraordinary celebrations that kids will talk about for weeks.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Beyond birthday parties, our bounce houses are perfect for school field days, church festivals, community events, graduation celebrations, family reunions, and corporate company picnics. Whatever the occasion, a bounce house adds an element of excitement and entertainment that guests of all ages can enjoy.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Serving East Orlando and Surrounding Communities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables proudly serves East Orlando and the greater Orange County area. Our delivery territory includes Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield, and surrounding communities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We know East Orlando like the back of our hand. Whether you're hosting a party in a Waterford Lakes backyard, setting up for a school carnival in Avalon Park, or organizing a church event in Alafaya, we'll get your bounce house delivered and set up safely and on time.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              How to Book Your Bounce House Rental
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Booking your bounce house rental with Orlando Inflatables is easy! Simply give us a call at (407) 497-1840 or fill out our online quote form. Our friendly team will help you select the perfect bounce house for your event, confirm availability, and schedule delivery.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We recommend booking at least 1-2 weeks in advance, especially during peak season (spring and summer). However, we do our best to accommodate last-minute requests when possible. Contact us today to reserve your bounce house and start planning an amazing event!
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
