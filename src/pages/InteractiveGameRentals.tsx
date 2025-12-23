import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Phone, Shield, Clock, Users, Target } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { siteImages } from "@/components/home/ContentImages";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { getInteractiveGames } from "@/data/inventory";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Target, title: "Skill-Based Fun", description: "Test accuracy and coordination" },
  { icon: Clock, title: "On-Time Delivery", description: "Professional setup included" },
  { icon: Users, title: "All Ages", description: "Games for every skill level" },
];


const faqs = [
  { q: "What types of interactive games do you offer?", a: "We offer a wide variety including basketball shootouts, soccer darts, jousting, wrecking ball, human foosball, and more. Each game provides a unique competitive experience for your guests." },
  { q: "Are interactive games suitable for adults?", a: "Absolutely! Most of our interactive games are designed for all ages and are especially popular at corporate events, graduation parties, and adult birthday celebrations." },
  { q: "How many people can play at once?", a: "It varies by game. Some games accommodate 2-4 players at a time, while team games like human foosball can have 10-12 players competing simultaneously." },
  { q: "Do interactive games require special setup?", a: "Our team handles all setup and breakdown. Some games may require a power source for inflatable blowers. We'll confirm requirements when you book." },
];

export default function InteractiveGameRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const faqItems = faqs.map(faq => ({ question: faq.q, answer: faq.a }));

  return (
    <Layout>
      <SEOHead
        title="Interactive Game Rentals Orlando FL | Party Games"
        description="Rent exciting interactive games in Orlando FL for parties & events. Basketball, soccer darts, jousting & more! Licensed & insured. Call (407) 497-1840!"
        canonical="/interactive-game-rentals"
      />
      <ServiceSchema
        serviceName="Interactive Game Rentals in Orlando FL"
        description="Interactive inflatable game rentals for parties, carnivals, and corporate events in East Orlando."
        areaServed="Orlando"
        url="/interactive-game-rentals"
      />
      <FAQPageSchema faqs={faqItems} />
      <BreadcrumbSchema items={[{ name: "Interactive Game Rentals", href: "/interactive-game-rentals" }]} />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24"
        style={{
          backgroundImage: `url(${siteImages.girlsJumping1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Competitive Fun</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Interactive Game Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Engage your guests with our exciting interactive inflatable games. Perfect for parties, carnivals, and corporate events where competition meets fun!
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
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Interactive Game Inventory</h2>
          <ProductGrid products={getInteractiveGames()} columns={4} />
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
              Exciting Interactive Game Rentals in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Take your event to the next level with interactive game rentals from Orlando Inflatables! Our collection of inflatable interactive games brings the excitement of carnival-style competition to your backyard, school, church, or corporate venue. These games are designed to engage guests of all ages in friendly competition that creates lasting memories.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Unlike traditional bounce houses, interactive games challenge participants to test their skills, accuracy, strength, and coordination. From giant inflatable basketball hoops to human foosball arenas, our interactive games add a unique entertainment element that keeps guests engaged throughout your entire event.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're hosting a birthday party, school carnival, church festival, or corporate team building event, our interactive games provide the perfect combination of physical activity, competition, and pure fun.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Types of Interactive Games We Offer
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our interactive game inventory includes a diverse selection of inflatable games and activities:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Sports Games:</strong> Giant basketball shootouts, football throw, baseball speed pitch, and soccer penalty kick games that let guests show off their athletic skills.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Target Games:</strong> Inflatable soccer darts, archery tag, and ring toss games that test accuracy and precision.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Action Games:</strong> Wrecking ball, jousting, and gladiator-style games for thrilling head-to-head competition.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Team Games:</strong> Human foosball, tug of war, and relay-style games that encourage teamwork and collaboration.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for Carnivals and Large Events
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our interactive games are carnival favorites! Schools, churches, and community organizations throughout East Orlando rent our games for their annual festivals and fundraising events. The competitive nature of these games naturally draws crowds and keeps participants coming back for another try.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              For large events, we recommend combining multiple interactive games to create a complete carnival atmosphere. Add a basketball game, a soccer darts station, and a wrecking ball arena for an unforgettable experience that gives guests plenty of options for fun.
            </p>
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
              Corporate Events and Team Building
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Interactive games are outstanding choices for corporate events focused on team building and employee engagement. Games like human foosball require communication and coordination, while competitive sports games let departments face off in friendly rivalry.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Companies throughout Orlando have discovered that interactive game rentals transform standard company picnics into memorable experiences that boost morale and strengthen team bonds. Contact us to discuss packages tailored specifically for corporate events.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Birthday Party Entertainment That Stands Out
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Want to throw a birthday party that kids will be talking about for months? Interactive games provide an exciting alternative to traditional bounce houses. Older kids and teens especially love the competitive aspect – organize tournaments and award prizes to the winners!
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Interactive games also work great alongside bounce houses and water slides. Combine a bounce house for the younger kids with an interactive game for older children and you've got entertainment that keeps everyone happy.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Book Your Interactive Games Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Ready to add competitive excitement to your next event? Contact Orlando Inflatables at (407) 497-1840 or fill out our online quote form. We deliver interactive games throughout East Orlando including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield.
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
