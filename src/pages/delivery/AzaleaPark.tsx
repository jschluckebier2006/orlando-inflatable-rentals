import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const AzaleaPark = () => {
  return (
    <CityDeliveryPage
      cityName="Azalea Park"
      citySlug="azalea-park"
      metaTitle="Bounce House & Water Slide Rentals Azalea Park FL | Orlando Inflatables"
      metaDescription="Affordable bounce house & water slide rentals in Azalea Park FL. Party inflatables for East Orlando families. Free delivery! Call (407) 497-1840."
      cityDescription="A welcoming community in East Orlando with deep roots and a strong neighborhood spirit, Azalea Park offers families an affordable place to live with easy access to everything Orlando has to offer."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Azalea_Park,_Florida"
      additionalCityInfo="Azalea Park is a census-designated place in Orange County, Florida, known for its diverse, close-knit community and convenient location. The neighborhood developed primarily in the mid-20th century and has maintained its character as a welcoming place for families of all backgrounds."
      localLandmarks="We deliver throughout Azalea Park, from the established neighborhoods near Semoran Boulevard to the residential streets off East Colonial Drive. Popular venues include private backyards, community centers, and local parks."
      nearbyAreas={[
        { name: "Eastwood", slug: "eastwood" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Avalon Park", slug: "avalon-park" },
      ]}
      faqs={[
        {
          question: "Is delivery really free to Azalea Park?",
          answer: "Yes! We offer complimentary delivery, setup, and pickup for all rentals in Azalea Park. There are no hidden fees or surprise charges."
        },
        {
          question: "What are your most affordable bounce house options for Azalea Park?",
          answer: "Our standard bounce houses offer excellent value for Azalea Park families. We also offer package deals when you combine multiple items like a bounce house with tables and chairs."
        },
        {
          question: "Do you offer Spanish-speaking customer service?",
          answer: "Yes! We have Spanish-speaking team members available to assist you with your rental needs and answer any questions you may have."
        },
        {
          question: "Can I rent inflatables for a quinceañera in Azalea Park?",
          answer: "Absolutely! Our inflatables are perfect for quinceañeras, sweet 16 parties, and other milestone celebrations. We have elegant options that complement any party theme."
        },
        {
          question: "What payment methods do you accept for Azalea Park rentals?",
          answer: "We accept all major credit cards, debit cards, and cash. A deposit is required to secure your booking, with the balance due on the day of delivery."
        },
        {
          question: "How much space do I need for a bounce house in Azalea Park?",
          answer: "Most standard bounce houses require about 18x18 feet of flat space. We'll work with you to find the right size unit for your yard. Our team can assess your space during delivery."
        }
      ]}
    />
  );
};

export default AzaleaPark;
