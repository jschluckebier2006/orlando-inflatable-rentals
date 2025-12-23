import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Waves, Check, Phone, Shield, Clock, Droplets, Sun } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Droplets, title: "Water-Ready Fun", description: "Beat the Florida heat in style" },
  { icon: Clock, title: "On-Time Delivery", description: "Professional setup included" },
  { icon: Sun, title: "Summer Perfect", description: "Ideal for hot Orlando days" },
];

const waterSlides = [
  { name: "Tropical Thunder Water Slide", height: "18 ft", length: "35 ft", age: "5-14 years", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop" },
  { name: "Blue Lagoon Dual Lane", height: "16 ft", length: "30 ft", age: "4-12 years", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop" },
  { name: "Paradise Plunge Slide", height: "20 ft", length: "40 ft", age: "6-16 years", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop" },
  { name: "Splash Zone Combo", height: "14 ft", length: "25 ft", age: "3-10 years", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop" },
];

const faqs = [
  { q: "Do I need to provide a water source?", a: "Yes, you'll need access to a standard garden hose within 100 feet of the setup location. Our water slides connect directly to your hose and use continuous water flow during operation." },
  { q: "How much water do water slides use?", a: "Our water slides typically use about the same amount of water as a garden sprinkler. The water recirculates, making them relatively efficient while keeping the slide surface wet and slippery for maximum fun." },
  { q: "What surface can water slides be set up on?", a: "Water slides work best on flat grass surfaces. We can also set up on concrete or asphalt with proper anchoring, though grass is preferred for softer landings in the splash zone." },
  { q: "Are water slides safe for younger children?", a: "We offer water slides specifically designed for younger children with gentler slopes and smaller heights. Our team can recommend the best option based on the ages of your guests." },
];

export default function WaterSlideRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Water Slide Rentals in Orlando FL",
    "provider": { "@type": "LocalBusiness", "name": "Orlando Inflatables", "telephone": "+1-407-497-1840" },
    "areaServed": { "@type": "City", "name": "Orlando", "containedInPlace": { "@type": "State", "name": "Florida" } },
    "description": "Premium inflatable water slide rentals for summer parties and events in East Orlando and Orange County."
  };

  return (
    <Layout>
      <SEOHead
        title="Water Slide Rentals Orlando FL | Inflatable Water Slides"
        description="Rent exciting inflatable water slides in Orlando FL for summer parties & events. Beat the Florida heat! Licensed & insured with free delivery. Call (407) 497-1840!"
        canonical="/water-slide-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Water Slide Rentals", href: "/water-slide-rentals" }]} />

      {/* Hero Section */}
      <section className="gradient-hero text-primary-foreground py-16 md:py-24">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-primary-foreground">Summer Favorite</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Water Slide Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Beat the Florida heat with our thrilling inflatable water slides. Perfect for summer parties, backyard celebrations, and hot-weather events!
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
              The Best Inflatable Water Slide Rentals in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When the Florida sun is blazing and you want to throw an unforgettable party, there's nothing better than a water slide rental from Orlando Inflatables. Our inflatable water slides bring the excitement of a water park right to your backyard, providing hours of splashing fun for kids and adults alike.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We specialize in premium water slide rentals throughout East Orlando, Orange County, and Central Florida. From towering slides that deliver an adrenaline rush to gentler options perfect for younger children, our inventory has something for every age group and every type of event.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Every water slide in our fleet is meticulously maintained, professionally cleaned after each rental, and inspected for safety before delivery. We're fully licensed and insured, giving you peace of mind while your guests enjoy the thrill of our water slides.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Rent a Water Slide for Your Orlando Event?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Orlando's subtropical climate means hot, sunny days are the norm, especially from spring through fall. A water slide rental transforms any outdoor event into a refreshing oasis of fun. Here's why our customers love our water slides:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Beat the Heat:</strong> Nothing cools down a hot Florida day like sliding into a refreshing splash pool.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>All-Day Entertainment:</strong> Water slides keep kids entertained for hours, giving parents a chance to relax and enjoy the party.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Memorable Experience:</strong> Guests will remember the thrill of your water slide party long after the event ends.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Affordable Fun:</strong> Bring water park excitement to your backyard at a fraction of the cost of admission tickets.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Perfect Photo Ops:</strong> Capture amazing action shots and smiles as guests zoom down the slide.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Water Slide Options for Every Event Size
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our water slide inventory includes options for every type of event. For smaller backyard birthday parties, our compact slides deliver big thrills in a manageable footprint. For larger events like school field days, church carnivals, or community festivals, our towering dual-lane slides allow multiple riders at once, keeping lines short and excitement high.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Many of our water slides feature vibrant tropical themes with palm trees, ocean waves, and bright colors that add a festive atmosphere to any celebration. We also offer combo units that combine water slides with bounce areas for the ultimate entertainment package.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Water Slide Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {waterSlides.map((item) => (
              <Card key={item.name} className="overflow-hidden card-hover">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Height: {item.height}</p>
                    <p>Length: {item.length}</p>
                    <p>Ages: {item.age}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
              Ideal for Summer Birthday Parties and Pool Parties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Summer birthday parties in Orlando call for water slide entertainment! Our inflatable water slides are the perfect addition to pool parties, providing an exciting alternative to the pool and keeping the party energy high all day long. Kids can take turns sliding, splashing, and racing each other down dual-lane options.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Even if you don't have a pool, our water slides with splash pools at the bottom create their own water play area. All you need is a flat grassy area, access to a garden hose, and the desire to throw the best party in the neighborhood!
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Professional Delivery Throughout East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables delivers water slides to homes, parks, schools, and event venues throughout East Orlando and Orange County. Our service area includes Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield, and surrounding communities.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our professional team handles all delivery, setup, and pickup. We'll ensure the water slide is properly anchored, connected to your water source, and ready for fun before your guests arrive. After the party, we return to carefully take down and remove everything.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Book Your Water Slide Rental Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Ready to make a splash at your next event? Contact Orlando Inflatables today to reserve your water slide rental. Call us at (407) 497-1840 or fill out our online quote form to check availability and pricing. Summer dates book quickly, so we recommend reserving at least 2 weeks in advance to ensure you get the water slide you want!
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
