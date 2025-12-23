import { Helmet } from "react-helmet-async";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageSchemaProps {
  faqs: FAQItem[];
}

export function FAQPageSchema({ faqs }: FAQPageSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
