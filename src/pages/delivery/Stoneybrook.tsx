import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Stoneybrook = () => {
  return (
    <CityDeliveryPage
      cityName="Stoneybrook"
      citySlug="stoneybrook"
      metaTitle="Bounce House & Water Slide Rentals Stoneybrook FL | Orlando Inflatables"
      metaDescription="Premium bounce house & water slide rentals in Stoneybrook FL. Party inflatables for this East Orlando community. Free delivery! Call (407) 497-1840."
      cityDescription="This established, family-oriented neighborhood is known for its beautiful homes, well-maintained common areas, and active community life. Stoneybrook families know how to celebrate!"
      additionalCityInfo="Stoneybrook is a master-planned community in East Orlando, known for its family-friendly atmosphere, community amenities, and convenient location. The neighborhood features well-designed homes, tree-lined streets, and common areas that foster a strong sense of community."
      localLandmarks="Stoneybrook offers excellent venues for party rentals including spacious backyards, community clubhouses, HOA facilities, and neighborhood common areas. We also serve nearby schools and churches for larger events."
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Eastwood", slug: "eastwood" },
      ]}
      faqs={[
        {
          question: "Are inflatables allowed by Stoneybrook HOA?",
          answer: "Most Stoneybrook HOAs permit temporary inflatable rentals for private parties. We recommend checking with your specific HOA for any guidelines, but we've successfully served many Stoneybrook residents."
        },
        {
          question: "What's popular for Stoneybrook pool parties?",
          answer: "Our water slides are extremely popular for Stoneybrook summer parties! Set up near (but not in) your pool area, they provide hours of splashing fun that complements your pool."
        },
        {
          question: "Do you serve Stoneybrook community events?",
          answer: "Yes! We work with Stoneybrook HOAs and community groups for neighborhood events, holiday celebrations, and block parties. Contact us for special pricing on larger community gatherings."
        },
        {
          question: "What combo units fit well in Stoneybrook yards?",
          answer: "Our medium combo units (around 20x15 feet) are ideal for most Stoneybrook backyards. These offer bouncing plus a slide in one compact unit, maximizing fun while fitting your space."
        },
        {
          question: "How do I book for a Stoneybrook birthday party?",
          answer: "Booking is easy! Call us at (407) 497-1840 or submit an online quote request. We'll confirm availability, discuss your needs, and schedule your delivery time."
        },
        {
          question: "What safety measures do you take for Stoneybrook rentals?",
          answer: "Safety is our priority! All inflatables are cleaned and inspected before delivery, properly anchored during setup, and we provide complete safety guidelines. We're fully licensed and insured."
        }
      ]}
    />
  );
};

export default Stoneybrook;
