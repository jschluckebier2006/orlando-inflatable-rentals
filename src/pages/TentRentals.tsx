import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { DeliveryAreaLinks } from "@/components/home/DeliveryAreaLinks";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ProductGrid } from "@/components/inventory/ProductGrid";
import { useCategory } from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Phone, Shield, Clock, Sparkles, Sun } from "lucide-react";
import { RESERVE_PHONE, RESERVE_PHONE_HREF, trackCallToReserve } from "@/lib/analytics";
import tentImg from "@/assets/tents-category.jpg";

const TENT = { slug: "20x20-high-peak-frame-tent", name: "20x20 High Peak Frame Tent" };

const features = [
  { icon: Shield, title: "Licensed & Insured", description: "Full liability coverage included" },
  { icon: Sparkles, title: "Clean White Canopy", description: "Inspected before every event" },
  { icon: Clock, title: "Delivery & Setup", description: "Our crew installs and picks up" },
  { icon: Sun, title: "Shade & Shelter", description: "Comfort for your guests all day" },
];

const faqs = [
  {
    q: "Do you deliver and set up tent rentals in Orlando?",
    a: "Yes. Our crew delivers the tent, installs the frame and canopy, and returns after your event to take it down. You don't need to lift or assemble anything — just show us where you'd like it and make sure the area is clear.",
  },
  {
    q: "Can a tent be set up on grass, concrete, or pavement?",
    a: "Both. A frame tent is free-standing, so it can be installed on grass, on a driveway, or on a patio. Grass installs are staked; hard surfaces are secured with weights. Let us know your surface when you call so we bring the right anchoring hardware.",
  },
  {
    q: "How many guests fit under a 20x20 tent?",
    a: "As planning guidance, a 20x20 canopy comfortably covers a seated dinner layout of around 40 guests with tables, or roughly 67 guests standing and mingling without tables. Those figures describe what fits comfortably underneath — they are not a capacity or occupancy rating, and seating is not included.",
  },
  {
    q: "Can I rent a tent for a backyard party or graduation?",
    a: "Absolutely. Backyard birthdays, graduation parties, showers, church gatherings, and small weddings are exactly what this tent is built for. We just need enough clear, level space around the footprint for our crew to work.",
  },
  {
    q: "Do I need a permit or HOA approval for a tent?",
    a: "Requirements vary by venue, neighborhood, and municipality. Check with your venue, HOA, or local parks department about tent permits before your event date, and let us know about any restrictions when you call.",
  },
  {
    q: "Does the tent rental include tables and chairs?",
    a: "No — the 20x20 High Peak Frame Tent is the tent only. Tables and chairs can be added to your reservation for an additional fee. Just let us know what you need when you call and we'll quote it with your tent.",
  },
  {
    q: "How do I reserve the tent?",
    a: "By phone. The tent isn't booked online — call us at 407-497-1840 with your date, address, and setup surface and we'll confirm availability and walk you through the details.",
  },
];

export default function TentRentals() {
  const { products: catProducts, loading: catLoading } = useCategory("tents");
  const faqItems = faqs.map((f) => ({ question: f.q, answer: f.a }));
  const onCallClick = () => trackCallToReserve(TENT);

  return (
    <Layout>
      <SEOHead
        title="Tent Rentals in Orlando, FL | 20x20 High Peak Frame Tent | Orlando Inflatables"
        description="Tent rentals Orlando: our 20x20 high peak frame tent with delivery and setup across East Orlando. Reserve by phone at 407-497-1840."
        canonical="/tent-rentals"
      />
      <ServiceSchema
        serviceName="Tent Rentals in Orlando FL"
        description="Party tent rentals in East Orlando and Orange County, including a 20x20 high peak frame tent with delivery and setup."
        areaServed="Orlando"
        url="/tent-rentals"
      />
      <FAQPageSchema faqs={faqItems} />
      <BreadcrumbSchema items={[{ name: "Tent Rentals", href: "/tent-rentals" }]} />

      {/* Hero */}
      <section
        className="relative text-white py-16 md:py-24"
        style={{ backgroundImage: `url(${tentImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">Phone Reservations Only</Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Tent Rentals in Orlando, FL
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Shade, shelter, and a clean white canopy for weddings, graduations, and backyard parties — delivered and
              set up by our team across East Orlando.
            </p>
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8"
              >
                <a
                  href={RESERVE_PHONE_HREF}
                  onClick={onCallClick}
                  aria-label="Call Orlando Inflatables at 407-497-1840 to reserve the 20x20 high peak tent"
                >
                  <Phone className="mr-2 h-5 w-5" /> Call to Reserve
                </a>
              </Button>
            </div>
            <p className="mt-3 text-white/90 font-semibold">{RESERVE_PHONE}</p>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">
            20x20 High Peak Frame Tent Rental
          </h2>
          <div className="max-w-4xl mx-auto text-muted-foreground leading-relaxed mb-8 space-y-4">
            <p>
              Our 20x20 high peak frame tent is a white, elegantly peaked canopy that turns an open lawn or driveway
              into a finished event space. The high peak gives the tent an airy, wedding-ready silhouette, and because
              the frame carries the load, there are no center poles getting in the way of your layout — the entire 400
              square feet of floor is usable for dining, dancing, a dessert table, or a DJ.
            </p>
            <p>
              This is the one item on our site that isn't booked online. Tent installs depend on your surface, access,
              and layout, so we quote and schedule them over the phone.
            </p>
          </div>
          <ProductGrid products={catProducts} loading={catLoading} columns={3} />
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

      {/* Copy */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Frame Tent vs. Pole Tent — What's the Difference?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A pole tent gets its shape from tall center poles pushing up the middle of the canopy, with ropes and
              stakes pulling the edges out well beyond the covered area. A frame tent, like ours, is built on a rigid
              metal frame that holds the canopy from the perimeter. That difference matters in two practical ways: your
              guests get a completely clear interior with nothing to walk around, and the tent is free-standing, so it
              can be installed where staking a wide rope line isn't realistic. High peak frame tents combine the two —
              the sculpted peaks of a pole tent with the open floor and flexible siting of a frame.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">What Size Tent Do You Need?</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Use guest count and layout as your starting point. As planning guidance, a 20x20 canopy comfortably covers
              a seated meal for about 40 guests once tables are in place, or around 67 guests standing and mingling with
              the floor left open. Those numbers describe what fits comfortably under the canopy — they aren't a
              capacity limit or an occupancy figure, and seating isn't included with the tent. If you want the shade to
              cover a dining area, plan on adding{" "}
              <Link to="/table-chair-rentals" className="text-primary hover:underline">
                table and chair rentals
              </Link>{" "}
              alongside it, and tell us your headcount when you call so we can size the layout with you.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Tent Delivery and Setup Across Orlando
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We deliver, install, and pick up every tent ourselves — you never handle hardware. The tent can go on
              grass or on a hard surface such as a driveway or patio, with staking on turf and weights on pavement, so
              tell us your surface when you call and we'll bring the right anchoring. Requirements vary by venue,
              neighborhood, and municipality: check with your venue, HOA, or local parks department about tent permits
              before your event date, and let us know about any restrictions when you call. We watch the forecast in the
              days leading up to your event and will work with you on scheduling if conditions look unfavorable.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We bring tents to homes, parks, churches, and venues throughout East Orlando and Orange County, including{" "}
              <Link to="/water-slide-and-bounce-house-rental-alafaya" className="text-primary hover:underline">Alafaya</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-avalon-park" className="text-primary hover:underline">Avalon Park</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-azalea-park" className="text-primary hover:underline">Azalea Park</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-bithlo" className="text-primary hover:underline">Bithlo</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-christmas" className="text-primary hover:underline">Christmas</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-chuluota" className="text-primary hover:underline">Chuluota</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-eastwood" className="text-primary hover:underline">Eastwood</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-stoneybrook" className="text-primary hover:underline">Stoneybrook</Link>,{" "}
              <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="text-primary hover:underline">Waterford Lakes</Link>, and{" "}
              <Link to="/water-slide-and-bounce-house-rental-wedgefield" className="text-primary hover:underline">Wedgefield</Link>.
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Weddings, Graduations, and Backyard Parties
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A white high peak tent reads formal enough for a wedding ceremony or reception and casual enough for a
              graduation cookout in the backyard. Couples use it to frame a head table or a dance floor; families use it
              to keep a buffet, a cake table, and grandparents out of the Florida sun; churches and schools use it as a
              check-in or refreshment area beside the inflatables. Because the interior is unobstructed, you can
              rearrange the layout on the day without working around poles.
            </p>
          </div>
        </div>
      </section>

      <ReviewsSection />

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-8 text-center">Tent Rental FAQs</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-lg border border-border px-6">
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">Reserve the Tent by Phone</h2>
            <p className="text-muted-foreground mb-6">
              Tell us your date, address, and setup surface and we'll confirm availability right away.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8"
            >
              <a
                href={RESERVE_PHONE_HREF}
                onClick={onCallClick}
                aria-label="Call Orlando Inflatables at 407-497-1840 to reserve the 20x20 high peak tent"
              >
                <Phone className="mr-2 h-5 w-5" /> Call to Reserve
              </a>
            </Button>
            <p className="mt-3 text-sm text-muted-foreground">{RESERVE_PHONE}</p>
          </div>
        </div>
      </section>

      <DeliveryAreaLinks />
    </Layout>
  );
}