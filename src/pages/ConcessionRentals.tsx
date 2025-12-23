import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Popcorn, Check, Phone, Shield, Clock, Utensils, Sparkles } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";
import { siteImages } from "@/components/home/ContentImages";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Utensils, title: "Easy to Operate", description: "Simple instructions provided" },
  { icon: Clock, title: "On-Time Delivery", description: "Setup and supplies included" },
  { icon: Sparkles, title: "Fresh Supplies", description: "Quality ingredients provided" },
];

const concessions = [
  { name: "Popcorn Machine", servings: "50+ servings", includes: "Kernels, oil, bags", rental: "Full Day", image: "https://images.unsplash.com/photo-1585647347483-22b66260dfff?w=400&h=300&fit=crop" },
  { name: "Snow Cone Machine", servings: "75+ servings", includes: "Ice, syrup, cups", rental: "Full Day", image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop" },
  { name: "Cotton Candy Machine", servings: "50+ servings", includes: "Sugar, cones, bags", rental: "Full Day", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop" },
  { name: "Nacho Cheese Warmer", servings: "40+ servings", includes: "Cheese, chips, trays", rental: "Full Day", image: "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop" },
];

const faqs = [
  { q: "Do you provide the supplies for concession machines?", a: "Yes! All our concession rentals include supplies for the number of servings listed. Additional supply packages can be purchased if you're expecting a larger crowd." },
  { q: "Are the machines easy to operate?", a: "Absolutely! Our concession machines are designed for easy operation. We provide simple written instructions and can demonstrate operation at setup if needed." },
  { q: "Do I need to provide electricity?", a: "Yes, concession machines require access to standard electrical outlets. Most machines can run on a standard 15-amp household circuit." },
  { q: "Can I rent multiple concession machines?", a: "Of course! Many customers rent 2-3 machines to create a complete carnival snack experience. We offer package deals for multiple rentals." },
];

export default function ConcessionRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Concession Machine Rentals in Orlando FL",
    "provider": { "@type": "LocalBusiness", "name": "Orlando Inflatables", "telephone": "+1-407-497-1840" },
    "areaServed": { "@type": "City", "name": "Orlando", "containedInPlace": { "@type": "State", "name": "Florida" } },
    "description": "Popcorn, snow cone, cotton candy, and concession machine rentals for parties and events in East Orlando."
  };

  return (
    <Layout>
      <SEOHead
        title="Concession Rentals Orlando FL | Popcorn & Snow Cones"
        description="Rent popcorn, snow cone, cotton candy machines & more in Orlando FL. Perfect for parties & events! Supplies included. Call (407) 497-1840 for free delivery!"
        canonical="/concession-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Concession Rentals", href: "/concession-rentals" }]} />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24"
        style={{
          backgroundImage: `url(${siteImages.kidsSmilingBounce1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Carnival Treats</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Concession Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Add delicious carnival-style treats to your event with our concession machine rentals. Popcorn, snow cones, cotton candy, and more!
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
              Delicious Concession Rentals for East Orlando Events
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nothing says "party" quite like the smell of fresh popcorn or the sight of fluffy cotton candy! Orlando Inflatables offers a complete selection of concession machine rentals that bring the carnival experience to your event. Our concession rentals are the perfect complement to bounce houses and water slides, creating a complete party atmosphere that guests will love.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              All our concession rentals include the supplies you need to serve your guests. From popcorn kernels and butter to snow cone syrup and cotton candy sugar, we provide everything required for a successful snack station. Our machines are commercial-grade, professionally cleaned, and easy to operate.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're hosting a birthday party, school carnival, church festival, or corporate event, our concession machines add a special touch that transforms ordinary gatherings into memorable celebrations.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Popular Concession Machine Rentals
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our concession inventory includes all the classic carnival favorites:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Popcorn Machines:</strong> Nothing beats the aroma of freshly popped popcorn! Our commercial popcorn machines produce delicious theater-style popcorn that guests can't resist.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Snow Cone Machines:</strong> Perfect for hot Florida days! Our snow cone machines produce fluffy shaved ice that you top with delicious flavored syrups.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Cotton Candy Machines:</strong> Watch as sugar transforms into colorful, fluffy clouds of sweetness. Cotton candy is always a hit with kids and adults alike!</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Nacho Cheese Warmers:</strong> Warm, gooey cheese with crispy chips – a savory option that balances out all the sweet treats.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Supplies Included with Every Rental
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When you rent a concession machine from Orlando Inflatables, we include enough supplies to serve 50-75 guests depending on the machine. This takes the guesswork out of party planning – just set up the machine and start serving!
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Expecting a larger crowd? We offer additional supply packages that you can add to your rental. Let us know your expected guest count and we'll make sure you have plenty of supplies for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Concession Inventory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {concessions.map((item) => (
              <Card key={item.name} className="overflow-hidden card-hover">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-foreground mb-2">{item.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Servings: {item.servings}</p>
                    <p>Includes: {item.includes}</p>
                    <p>Rental: {item.rental}</p>
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
              Perfect Addition to Any Party
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Concession machines are incredibly versatile and work well at virtually any type of event. Birthday parties feel extra special when kids can enjoy fresh popcorn while watching the fun. School carnivals and church festivals become authentic when you add multiple concession stations.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For a complete party package, combine our concession rentals with bounce houses, water slides, or interactive games. Many customers create a "carnival zone" with games and snacks that keeps guests entertained and satisfied throughout the event.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Easy Setup and Operation
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our concession machines are designed for easy operation by anyone. We provide clear written instructions with each rental, and our delivery team can demonstrate how to use the equipment during setup. All you need is access to a standard electrical outlet and a table to place the machine on.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              At the end of your rental, simply turn off the machine and our team will handle cleanup and pickup. It's hassle-free party planning at its best!
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Reserve Your Concession Rental Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Add some delicious fun to your next event! Contact Orlando Inflatables at (407) 497-1840 or complete our online quote form to check availability. We deliver throughout East Orlando including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield.
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
