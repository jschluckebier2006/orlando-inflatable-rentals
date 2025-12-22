import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    question: "What areas do you deliver to?",
    answer: "We proudly serve East Orlando, Orange County, and Central Florida including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield. Contact us to confirm delivery to your specific location!",
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 1-2 weeks in advance to ensure availability, especially during peak season (spring and summer). However, we do accommodate last-minute bookings when possible - just give us a call!",
  },
  {
    question: "Is setup and delivery included?",
    answer: "Yes! We offer free delivery, professional setup, and pickup within our service area. Our trained staff will ensure everything is safely installed and ready for your guests.",
  },
  {
    question: "Are your inflatables safe and clean?",
    answer: "Absolutely! Safety is our top priority. All equipment is thoroughly cleaned and sanitized after each use. We are fully licensed and insured, and our inflatables meet all safety standards.",
  },
  {
    question: "What happens if it rains on my event day?",
    answer: "We understand Florida weather! If rain prevents safe use of the equipment, we'll work with you to reschedule. Please see our cancellation policy for full details.",
  },
];

export function FAQSection() {
  return (
    <section className="section-padding section-alt">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Got questions? We've got answers!
            </p>
          </div>

          {/* FAQ Accordion */}
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

          {/* CTA */}
          <div className="text-center mt-8">
            <Link to="/faq">
              <Button variant="outline" className="btn-bounce">
                View All FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
