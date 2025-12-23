import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Eastwood = () => {
  return (
    <CityDeliveryPage
      cityName="Eastwood"
      citySlug="eastwood"
      metaTitle="Bounce House & Water Slide Rentals Eastwood FL | Orlando Inflatables"
      metaDescription="Affordable bounce house & water slide rentals in Eastwood FL. Party inflatables for East Orlando. Free delivery! Call (407) 497-1840."
      cityDescription="This established neighborhood offers families an affordable, convenient location with easy access to major employment centers, shopping, and entertainment throughout the greater Orlando area."
      additionalCityInfo="Eastwood is a neighborhood in East Orlando, Orange County, Florida, known for its established residential streets and convenient location. The area developed primarily in the latter half of the 20th century and offers a mix of single-family homes at various price points."
      localLandmarks="Eastwood residents enjoy proximity to major roads including East Colonial Drive and the 408 expressway. We deliver to private backyards, community centers, local parks, and recreational facilities throughout the Eastwood neighborhood."
      nearbyAreas={[
        { name: "Azalea Park", slug: "azalea-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      faqs={[
        {
          question: "Is Eastwood in your delivery area?",
          answer: "Absolutely! Eastwood is one of our core East Orlando service areas. We provide free delivery and setup to all Eastwood neighborhoods."
        },
        {
          question: "What are your most popular rentals for Eastwood birthday parties?",
          answer: "Our combo bounce houses with slides are the top choice for Eastwood birthday parties. They offer multiple activities in one unit, perfect for entertaining kids of all ages."
        },
        {
          question: "Do you have budget-friendly options for Eastwood families?",
          answer: "Yes! We believe every family deserves great party entertainment. Our standard bounce houses are very affordable, and we offer package deals to help you save even more."
        },
        {
          question: "Can you set up in smaller Eastwood backyards?",
          answer: "Many Eastwood yards can accommodate our standard and medium-sized inflatables. We have compact options specifically designed for smaller spaces. Let us know your yard dimensions and we'll recommend the best fit."
        },
        {
          question: "What time do you deliver to Eastwood?",
          answer: "We schedule deliveries based on your event time, typically arriving 1-2 hours before your party starts. You can request specific delivery windows when booking."
        },
        {
          question: "Do you offer same-day rentals to Eastwood?",
          answer: "Same-day rentals may be available depending on our schedule. Call us to check availability, though we recommend booking at least a few days in advance to ensure you get your preferred inflatable."
        }
      ]}
    />
  );
};

export default Eastwood;
