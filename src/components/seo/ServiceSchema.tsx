import { Helmet } from "react-helmet-async";

interface ServiceSchemaProps {
  serviceName: string;
  description: string;
  areaServed?: string;
  url: string;
}

export function ServiceSchema({
  serviceName,
  description,
  areaServed = "Orlando",
  url,
}: ServiceSchemaProps) {
  const baseUrl = "https://orlandoinflatables.com";
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "url": `${baseUrl}${url}`,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "+1-407-497-1840",
      "email": "orlandoinflatablesllc@gmail.com",
      "url": baseUrl
    },
    "areaServed": {
      "@type": "City",
      "name": areaServed,
      "containedInPlace": {
        "@type": "State",
        "name": "Florida"
      }
    },
    "serviceType": "Party Equipment Rental",
    "termsOfService": `${baseUrl}/privacy-policy`
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
