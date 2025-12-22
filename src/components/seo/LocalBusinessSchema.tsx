import { Helmet } from "react-helmet-async";

interface LocalBusinessSchemaProps {
  pageName?: string;
  pageDescription?: string;
}

export function LocalBusinessSchema({ pageName, pageDescription }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://orlandoinflatables.com/#organization",
    name: "Orlando Inflatables",
    description: pageDescription || "Orlando Inflatables is your one-stop shop for bounce house and water slide rentals in East Orlando, Orange County, and Central Florida. We offer bounce houses, water slides, obstacle courses, interactive games, concessions, and table & chair rentals for birthday parties, school events, church events, corporate events, and graduations.",
    url: "https://orlandoinflatables.com",
    telephone: "+1-407-497-1840",
    email: "orlandoinflatablesllc@gmail.com",
    areaServed: [
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
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "08:00",
      closes: "20:00"
    },
    sameAs: []
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}
