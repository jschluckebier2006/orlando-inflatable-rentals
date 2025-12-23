import { Helmet } from "react-helmet-async";

export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Orlando Inflatables",
    "alternateName": "Orlando Inflatable Rentals LLC",
    "url": "https://orlandoinflatables.com",
    "logo": "https://orlandoinflatables.com/logo.png",
    "description": "Orlando Inflatables is your one-stop shop for bounce house and water slide rentals in East Orlando, Orange County, and Central Florida.",
    "telephone": "+1-407-497-1840",
    "email": "orlandoinflatablesllc@gmail.com",
    "foundingDate": "2019",
    "areaServed": {
      "@type": "State",
      "name": "Florida"
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61563048615864",
      "https://www.instagram.com/orlandoinflatablesllc/",
      "https://x.com/orlandoinflata1",
      "https://www.youtube.com/channel/UCD2cpuw-rM8k9RM5yc4IpEg",
      "https://www.yelp.com/biz/orlando-inflatable-rentals-orlando"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-407-497-1840",
      "contactType": "customer service",
      "email": "orlandoinflatablesllc@gmail.com",
      "availableLanguage": ["English", "Spanish"],
      "areaServed": "US"
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
