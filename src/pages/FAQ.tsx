import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "What areas do you deliver to?",
    answer:
      "We deliver throughout East Orlando, Orange County, and Central Florida, including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield. Give us a call at (407) 497-1840 and we'll confirm delivery to your exact location.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "One to two weeks ahead is ideal, especially in spring and summer when weekends fill up fast. That said, we do our best to accommodate last-minute requests — call us and we'll check what's still open for your date.",
  },
  {
    question: "Is delivery and setup included in the price?",
    answer:
      "Yes. Delivery, professional setup, and pickup are included within our standard service area. Our team anchors and inspects every unit before your guests arrive. A small delivery fee may apply for addresses on the outer edge of our zone, and it is always shown before you check out.",
  },
  {
    question: "How long is a rental period?",
    answer:
      "Our standard Day Rental (7-Hours) lets you choose a delivery window between 8:00 AM and 1:00 PM, with pickup exactly seven hours later. Need a longer window or an overnight? Call (407) 497-1840 and we'll build a custom schedule.",
  },
  {
    question: "What surface can the inflatable be set up on?",
    answer:
      "Grass is best because we can stake the unit securely. We can also set up on concrete or asphalt using sandbags. Let us know your surface when you reserve so we bring the right anchoring equipment.",
  },
  {
    question: "What kind of power do I need?",
    answer:
      "Each inflatable needs a standard 110V grounded outlet within about 100 feet of the setup spot. If power isn't available, we rent generators — just add one to your order.",
  },
  {
    question: "Are your inflatables cleaned and inspected?",
    answer:
      "Every unit is cleaned and sanitized after each rental and inspected before it goes back out. We are fully licensed and insured, and our equipment meets Florida safety standards.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes. A small deposit reserves your date and equipment, and it is credited toward your balance. The remaining balance is due on or before your event day.",
  },
  {
    question: "What happens if it rains on my event day?",
    answer:
      "Florida weather happens. If wind or rain makes the equipment unsafe, we will work with you to reschedule to another available date. See our cancellation policy for full details.",
  },
  {
    question: "Can I get a water slide without water?",
    answer:
      "Absolutely. Most of our slides run wet or dry. Just tell us which you prefer when you book so we set it up correctly.",
  },
  {
    question: "Do you rent tents, tables, and chairs?",
    answer:
      "Yes. We rent folding tables, chairs, and a 20x20 high peak frame tent. The tent is reservation by phone only — call (407) 497-1840 to check availability.",
  },
  {
    question: "How do I pay?",
    answer:
      "You can pay by card online or with cash on delivery. Card payments include a small online payment convenience fee; paying cash on delivery avoids it.",
  },
];

export default function FAQ() {
  return (
    <Layout>
      <SEOHead
        title="Bounce House Rental FAQ | Orlando Inflatables"
        description="Answers to common questions about bounce house and water slide rentals in East Orlando: delivery, setup, pricing, weather policy, payment, and more."
        canonical="/faq"
      />
      <BreadcrumbSchema items={[{ name: "FAQ", href: "/faq" }]} />
      <FAQPageSchema faqs={faqs} />

      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground text-lg mb-10">
              Everything you need to know about renting bounce houses, water slides, and party
              equipment in East Orlando. Still have a question? Call{" "}
              <a href="tel:4074971840" className="text-primary font-semibold hover:underline">
                (407) 497-1840
              </a>
              .
            </p>

            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card rounded-lg border border-border px-6"
                >
                  <AccordionTrigger className="text-left font-display font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center mt-10">
              <Link to="/rentals">
                <Button size="lg" className="btn-bounce">
                  Check Availability
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
