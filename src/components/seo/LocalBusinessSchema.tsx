import { Helmet } from "react-helmet-async";

interface LocalBusinessSchemaProps {
  pageName?: string;
  pageDescription?: string;
  cityName?: string;
  citySlug?: string;
}

export function LocalBusinessSchema({ pageName, pageDescription, cityName, citySlug }: LocalBusinessSchemaProps) {
  const baseUrl = "https://orlandoinflatables.com";
  
  // City-specific canonical URL
  const cityUrl = citySlug 
    ? `${baseUrl}/water-slide-and-bounce-house-rental-${citySlug}`
    : baseUrl;

  // Enhanced description for city pages
  const description = cityName
    ? `Orlando Inflatables provides professional bounce house and water slide rentals in ${cityName}, Florida. Serving ${cityName} with clean, safe party inflatables for birthday parties, school events, church events, and community celebrations. Free delivery and setup included.`
    : pageDescription || "Orlando Inflatables is your one-stop shop for bounce house and water slide rentals in East Orlando, Orange County, and Central Florida. We offer bounce houses, water slides, obstacle courses, interactive games, concessions, and table & chair rentals for birthday parties, school events, church events, corporate events, and graduations.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": cityName ? `${baseUrl}/#${citySlug}-location` : `${baseUrl}/#organization`,
    name: cityName ? `Orlando Inflatables - ${cityName}` : "Orlando Inflatables",
    alternateName: "Orlando Inflatable Rentals LLC",
    description: description,
    url: cityUrl,
    telephone: "+1-407-497-1840",
    email: "orlandoinflatablesllc@gmail.com",
    image: `${baseUrl}/logo.png`,
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Debit Card"],
    currenciesAccepted: "USD",
    areaServed: cityName ? {
      "@type": "City",
      name: cityName,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Orange County",
        containedInPlace: {
          "@type": "State",
          name: "Florida",
          containedInPlace: {
            "@type": "Country",
            name: "United States"
          }
        }
      }
    } : [
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: cityName ? `Party Rentals in ${cityName}` : "Party Rental Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bounce House Rental",
            description: cityName 
              ? `Professional bounce house rentals in ${cityName}, FL with free delivery and setup`
              : "Professional bounce house rentals with free delivery and setup"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Water Slide Rental",
            description: cityName
              ? `Exciting water slide rentals in ${cityName}, FL for summer parties and events`
              : "Exciting water slide rentals for summer parties and events"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Obstacle Course Rental",
            description: "Commercial-grade obstacle courses for school events and large gatherings"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Interactive Game Rental",
            description: "Fun interactive inflatable games for parties and events"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Concession Rental",
            description: "Cotton candy, popcorn, and snow cone machine rentals"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Table and Chair Rental",
            description: "Tables and chairs for party seating"
          }
        }
      ]
    },
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
