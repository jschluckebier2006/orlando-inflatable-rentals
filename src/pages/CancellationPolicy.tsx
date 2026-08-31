import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export default function CancellationPolicy() {
  return (
    <Layout>
      <SEOHead
        title="Cancellation & Weather Policy | Orlando Inflatables"
        description="Our cancellation, rescheduling, and Florida weather policy for bounce house and water slide rentals in East Orlando."
        canonical="/cancellation-policy"
      />
      <BreadcrumbSchema items={[{ name: "Cancellation Policy", href: "/cancellation-policy" }]} />

      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
              Cancellation &amp; Weather Policy
            </h1>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Reservations and deposits
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              A deposit reserves your date and holds the specific equipment you selected. The
              deposit is credited toward your final balance. The remaining balance is due on or
              before the day of your event.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Cancelling your rental
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              You may cancel at any time by calling{" "}
              <a href="tel:4074971840" className="text-primary font-semibold hover:underline">
                (407) 497-1840
              </a>{" "}
              or emailing{" "}
              <a
                href="mailto:orlandoinflatablesllc@gmail.com"
                className="text-primary font-semibold hover:underline"
              >
                orlandoinflatablesllc@gmail.com
              </a>
              . Cancellations made more than 48 hours before your scheduled delivery receive a full
              rain-check credit good for 12 months. Cancellations inside 48 hours forfeit the
              deposit, since the date is typically no longer re-bookable.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If our crew has already arrived at the delivery address and the rental is refused or
              cannot be set up (no access, no suitable surface, no power, unsafe conditions on
              site), the full rental amount is due.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Florida weather
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              We know Central Florida weather changes fast. Inflatables cannot be operated safely in
              sustained winds above 15–20 mph, in lightning, or in heavy rain. If the forecast makes
              your event unsafe, contact us before the delivery window and we will reschedule to
              another available date at no charge or issue a rain-check credit valid for 12 months.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              If weather turns after setup is complete, the rental is considered fulfilled. Please
              stop use immediately, unplug the blower, and keep everyone off the unit until
              conditions improve. Never attempt to move or re-anchor equipment yourself.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Rescheduling
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Date changes are free when requested at least 48 hours before delivery and subject to
              availability. Your deposit and any payments transfer to the new date.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Cancellations by us
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              In the rare case we must cancel — equipment damage, driver emergency, or unsafe
              conditions — you will receive a full refund of everything you have paid, including any
              deposit and fees.
            </p>

            <h2 className="font-display text-xl font-semibold text-foreground mt-8 mb-4">
              Questions
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Call{" "}
              <a href="tel:4074971840" className="text-primary font-semibold hover:underline">
                (407) 497-1840
              </a>{" "}
              and a real person from our team will help you sort out your date.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
