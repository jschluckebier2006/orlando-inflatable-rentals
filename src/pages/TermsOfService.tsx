import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export default function TermsOfService() {
  return (
    <Layout>
      <SEOHead
        title="Terms of Service | Orlando Inflatables"
        description="Rental terms, safety rules, and customer responsibilities for bounce house, water slide, and party equipment rentals from Orlando Inflatable Rentals, LLC."
        canonical="/terms-of-service"
      />
      <BreadcrumbSchema items={[{ name: "Terms of Service", href: "/terms-of-service" }]} />

      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Terms of Service
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              These terms apply to all rentals from Orlando Inflatable Rentals, LLC. By reserving
              equipment with us, you agree to the terms below.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              1. Reservations and payment
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A deposit confirms your reservation and is credited toward your balance. The balance
              is due on or before the day of delivery. Card payments may include an online payment
              convenience fee, which is displayed before you confirm. Applicable Florida sales tax
              is added to your order.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              2. Delivery, setup, and pickup
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              An adult 18 or older must be present at delivery and pickup. Please make sure the
              setup area is clear of debris, pet waste, sprinklers, and low branches, and that there
              is a clear path at least 3 feet wide to the setup location. A grounded 110V outlet
              must be within roughly 100 feet, or you must rent a generator from us.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              3. Safety rules
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed mb-6">
              <li>Adult supervision is required at all times while the unit is in use.</li>
              <li>No shoes, glasses, jewelry, sharp objects, food, drinks, gum, or silly string.</li>
              <li>No flips, roughhousing, or climbing on walls or netting.</li>
              <li>Separate riders by size and keep within the posted rider limits.</li>
              <li>Stop use and exit immediately in high wind, lightning, or heavy rain.</li>
              <li>Never unplug, move, or re-anchor equipment yourself.</li>
            </ul>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              4. Customer responsibility and damage
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You are responsible for the equipment from delivery until pickup. Normal wear is
              expected, but you may be charged for damage caused by misuse, negligence, vandalism,
              theft, or excessive cleaning needs. An optional damage waiver is available at checkout
              and covers accidental damage; it does not cover theft, intentional damage, or missing
              equipment.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              5. Assumption of risk
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Use of inflatable equipment involves inherent risk. By renting, you accept
              responsibility for the safe use of the equipment by all participants and agree to hold
              Orlando Inflatable Rentals, LLC harmless for injury or loss arising from use that does
              not follow the safety rules and instructions provided at setup.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              6. Cancellations and weather
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Cancellations, rescheduling, and weather situations are governed by our{" "}
              <a href="/cancellation-policy" className="text-primary font-semibold hover:underline">
                Cancellation Policy
              </a>
              .
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              7. Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Information you share with us is handled according to our{" "}
              <a href="/privacy-policy" className="text-primary font-semibold hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              8. Changes and contact
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We may update these terms from time to time; the version posted here applies to your
              rental. Questions? Call{" "}
              <a href="tel:4074971840" className="text-primary font-semibold hover:underline">
                (407) 497-1840
              </a>{" "}
              or email{" "}
              <a
                href="mailto:orlandoinflatablesllc@gmail.com"
                className="text-primary font-semibold hover:underline"
              >
                orlandoinflatablesllc@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
