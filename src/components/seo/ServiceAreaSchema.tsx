import { Helmet } from "react-helmet-async";

interface NearbyArea {
  name: string;
  slug: string;
}

interface ServiceAreaSchemaProps {
  cityName: string;
  citySlug: string;
  nearbyAreas: NearbyArea[];
}

export function ServiceAreaSchema({ cityName, citySlug, nearbyAreas }: ServiceAreaSchemaProps) {
  const baseUrl = "https://orlandoinflatables.com";

  // Service schema for the specific city
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/water-slide-and-bounce-house-rental-${citySlug}#service`,
    name: `Bounce House & Water Slide Rentals in ${cityName}`,
    description: `Professional bounce house rentals, water slide rentals, and party inflatables in ${cityName}, Florida. Includes free delivery, professional setup, and pickup.`,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${baseUrl}/#organization`,
      name: "Orlando Inflatables"
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Orange County",
        containedInPlace: {
          "@type": "State",
          name: "Florida"
        }
      }
    },
    serviceType: [
      "Bounce House Rental",
      "Water Slide Rental",
      "Party Inflatable Rental",
      "Event Equipment Rental"
    ],
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "USD",
        minPrice: "199",
        price: "199"
      },
      availability: "https://schema.org/InStock",
      areaServed: {
        "@type": "City",
        name: cityName
      }
    },
    termsOfService: "Free delivery, setup, and pickup included"
  };

  // GeoCircle for service area coverage
  const geoSchema = {
    "@context": "https://schema.org",
    "@type": "GeoCircle",
    "@id": `${baseUrl}/water-slide-and-bounce-house-rental-${citySlug}#serviceArea`,
    name: `${cityName} Service Area`,
    description: `Orlando Inflatables delivery and service area covering ${cityName} and nearby communities including ${nearbyAreas.map(a => a.name).join(", ")}.`,
    geoMidpoint: {
      "@type": "GeoCoordinates",
      addressCountry: "US",
      addressRegion: "FL"
    }
  };

  // ItemList for nearby service areas (helps with internal linking SEO)
  const nearbyAreasSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/water-slide-and-bounce-house-rental-${citySlug}#nearbyAreas`,
    name: `Party Rental Delivery Areas Near ${cityName}`,
    description: `Orlando Inflatables also delivers bounce houses and water slides to these areas near ${cityName}`,
    numberOfItems: nearbyAreas.length,
    itemListElement: nearbyAreas.map((area, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "City",
        name: area.name,
        url: `${baseUrl}/water-slide-and-bounce-house-rental-${area.slug}`
      }
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(geoSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(nearbyAreasSchema)}
      </script>
    </Helmet>
  );
}
