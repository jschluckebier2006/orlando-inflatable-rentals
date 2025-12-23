import { Helmet } from "react-helmet-async";

interface LocalBusinessSchemaProps {
  pageName?: string;
  pageDescription?: string;
  cityName?: string;
}

export function LocalBusinessSchema({ pageName, pageDescription, cityName }: LocalBusinessSchemaProps) {
  const baseUrl = "https://orlandoinflatables.com";
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#organization`,
    name: "Orlando Inflatables",
    alternateName: "Orlando Inflatable Rentals LLC",
    description: pageDescription || "Orlando Inflatables is your one-stop shop for bounce house and water slide rentals in East Orlando, Orange County, and Central Florida. We offer bounce houses, water slides, obstacle courses, interactive games, concessions, and table & chair rentals for birthday parties, school events, church events, corporate events, and graduations.",
    url: baseUrl,
    telephone: "+1-407-497-1840",
    email: "orlandoinflatablesllc@gmail.com",
    image: `${baseUrl}/logo.png`,
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    currenciesAccepted: "USD",
    areaServed: cityName ? [
      {
        "@type": "City",
        name: cityName,
        containedInPlace: {
          "@type": "State",
          name: "Florida"
        }
      }
    ] : [
      {
        "@type": "City",
        name: "Orlando",
        containedInPlace: {
          "@type": "State",
          name: "Florida"
        }
      },
      { "@type": "City", name: "Alafaya" },
      { "@type": "City", name: "Avalon Park" },
      { "@type": "City", name: "Azalea Park" },
      { "@type": "City", name: "Bithlo" },
      { "@type": "City", name: "Christmas" },
      { "@type": "City", name: "Chuluota" },
      { "@type": "City", name: "Eastwood" },
      { "@type": "City", name: "Stoneybrook" },
      { "@type": "City", name: "Waterford Lakes" },
      { "@type": "City", name: "Wedgefield" }
    ],
    serviceType: [
      "Bounce House Rental",
      "Water Slide Rental",
      "Obstacle Course Rental",
      "Interactive Game Rental",
      "Concession Rental",
      "Table and Chair Rental"
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: "89",
      bestRating: "5",
      worstRating: "1"
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61563048615864",
      "https://www.instagram.com/orlandoinflatablesllc/",
      "https://x.com/orlandoinflata1",
      "https://www.youtube.com/channel/UCD2cpuw-rM8k9RM5yc4IpEg",
      "https://www.yelp.com/biz/orlando-inflatable-rentals-orlando"
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
