import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { CTASection } from "@/components/home/CTASection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Phone, Shield, Clock, Users, Zap } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import { Helmet } from "react-helmet-async";
import { siteImages } from "@/components/home/ContentImages";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { getObstacleCourses } from "@/data/inventory";

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Zap, title: "High Energy Fun", description: "Keeps guests active and engaged" },
  { icon: Clock, title: "On-Time Delivery", description: "Professional setup included" },
  { icon: Users, title: "Team Building", description: "Perfect for groups and competitions" },
];


const faqs = [
  { q: "How much space is needed for an obstacle course?", a: "Obstacle courses require significant space - typically 50-70 feet in length and 15-20 feet in width, depending on the unit. We'll help you determine if your venue can accommodate your chosen obstacle course." },
  { q: "Can adults use the obstacle courses?", a: "Absolutely! Many of our obstacle courses are designed to accommodate adults up to 200-250 lbs. They're perfect for corporate team building events and adult parties." },
  { q: "Are obstacle courses safe for children?", a: "Yes! All our obstacle courses feature safety netting, padded obstacles, and secure entrance/exit points. We also offer junior courses specifically designed for younger children." },
  { q: "Can multiple people race at the same time?", a: "Many of our obstacle courses feature dual lanes, allowing two or more participants to race head-to-head. This adds exciting competition to any event!" },
];

export default function ObstacleCourseRentals() {
  const [showJotform, setShowJotform] = useState(false);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Obstacle Course Rentals in Orlando FL",
    "provider": { "@type": "LocalBusiness", "name": "Orlando Inflatables", "telephone": "+1-407-497-1840" },
    "areaServed": { "@type": "City", "name": "Orlando", "containedInPlace": { "@type": "State", "name": "Florida" } },
    "description": "Inflatable obstacle course rentals for parties, school events, and corporate team building in East Orlando."
  };

  return (
    <Layout>
      <SEOHead
        title="Obstacle Course Rentals Orlando FL | Inflatable Obstacles"
        description="Rent thrilling inflatable obstacle courses in Orlando FL for parties, school field days & corporate events. Dual-lane racing fun! Call (407) 497-1840 for free delivery!"
        canonical="/obstacle-course-rentals"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
      </Helmet>
      <BreadcrumbSchema items={[{ name: "Obstacle Course Rentals", href: "/obstacle-course-rentals" }]} />

      {/* Hero Section */}
      <section 
        className="relative text-white py-16 md:py-24"
        style={{
          backgroundImage: `url(${siteImages.slideTunnel1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90"></div>
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">High-Energy Entertainment</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Obstacle Course Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Challenge your guests with our exciting inflatable obstacle courses. Perfect for competitive fun at parties, school events, and corporate gatherings!
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
              Premier Inflatable Obstacle Course Rentals in East Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Looking for an exciting challenge that will get your guests moving, laughing, and competing? Orlando Inflatables offers the best inflatable obstacle course rentals in East Orlando and Orange County. Our obstacle courses are the ultimate entertainment solution for high-energy events where you want guests of all ages to stay active and engaged.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our inflatable obstacle courses feature a variety of challenging elements including climbing walls, tunnels, squeeze-throughs, pop-up obstacles, slides, and more. Participants navigate through the course as quickly as possible, competing against the clock or racing head-to-head against other challengers.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Whether you're planning a school field day, church carnival, corporate team building event, or action-packed birthday party, our obstacle courses deliver non-stop entertainment that appeals to kids, teens, and adults alike.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Choose an Obstacle Course for Your Event?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Obstacle courses offer unique advantages that make them stand out from other party rentals:
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Competitive Fun:</strong> Dual-lane courses allow head-to-head racing, adding an exciting competitive element to any event.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>All Ages Welcome:</strong> From junior courses for little ones to adult-sized challenges, everyone can participate.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>High Throughput:</strong> Obstacle courses move participants through quickly, minimizing wait times and maximizing fun.</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Physical Activity:</strong> Get guests moving with climbing, crawling, jumping, and running – great exercise disguised as fun!</span></li>
              <li className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" /><span className="text-muted-foreground"><strong>Team Building:</strong> Perfect for corporate events focused on teamwork, communication, and friendly competition.</span></li>
            </ul>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Obstacle Course Options for Any Event
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our obstacle course inventory includes options ranging from 30 feet to over 65 feet in length. Smaller courses are perfect for backyard birthday parties and smaller gatherings, while our mega courses are ideal for school carnivals, community events, and large corporate functions.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Many of our obstacle courses feature exciting themes and vibrant colors that add visual appeal to any event. From military-style boot camp courses to tropical adventure themes, we have options to match your event's atmosphere.
            </p>
          </div>
        </div>
      </section>

      {/* Inventory Grid */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Our Obstacle Course Inventory</h2>
          <ProductGrid products={getObstacleCourses()} columns={3} />
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* More Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Perfect for School Events and Field Days
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our obstacle courses are a huge hit at school field days, end-of-year celebrations, and PTA fundraisers throughout East Orlando. Teachers and administrators love how obstacle courses keep students active and entertained while promoting friendly competition and teamwork.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The dual-lane design of many of our courses allows for organized races, making it easy to run class competitions or grade-level challenges. Students can race their classmates while spectators cheer them on – creating an exciting, memorable event.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Corporate Team Building with Obstacle Courses
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Looking for a unique way to build team morale and encourage collaboration among employees? Our obstacle courses provide the perfect team building activity for corporate events, company picnics, and employee appreciation days.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Organize department vs. department races, time trials with prizes for top performers, or relay-style team challenges. The physical nature of obstacle courses breaks down barriers and gets people laughing and working together in ways that traditional team building activities simply can't match.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Reserve Your Obstacle Course Today
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Ready to add some competitive excitement to your next event? Contact Orlando Inflatables at (407) 497-1840 or complete our online quote form to check availability. We serve Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, Wedgefield, and surrounding East Orlando communities with free delivery and professional setup.
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
