import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";

export default function ThankYou() {
  return (
    <Layout>
      <SEOHead
        title="Thank You"
        description="Thank you for reaching out to Orlando Inflatables. We'll be in touch shortly to confirm your booking."
        canonical="/thank-you"
        noindex={true}
      />
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold mb-4 md:text-5xl">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Thank you for reaching out! We'll be in touch shortly.
          </p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </Layout>
  );
}
