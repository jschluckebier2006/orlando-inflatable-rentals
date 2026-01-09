import { Helmet } from "react-helmet-async";

interface AggregateRatingSchemaProps {
  ratingValue?: string;
  reviewCount?: string;
  bestRating?: string;
  worstRating?: string;
}

export function AggregateRatingSchema({
  ratingValue = "5.0",
  reviewCount = "97",
  bestRating = "5",
  worstRating = "1",
}: AggregateRatingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Orlando Inflatables",
    "url": "https://orlandoinflatables.com",
    "telephone": "+1-407-497-1840",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": ratingValue,
      "reviewCount": reviewCount,
      "bestRating": bestRating,
      "worstRating": worstRating
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
