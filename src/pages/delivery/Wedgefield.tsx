import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Wedgefield = () => {
  return (
    <CityDeliveryPage
      cityName="Wedgefield"
      citySlug="wedgefield"
      metaTitle="Bounce House & Water Slide Rentals Wedgefield FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Wedgefield FL. Party inflatables for this East Orange County golf community. Free delivery! Call (407) 497-1840."
      cityDescription="A beautiful golf course community in eastern Orange County, known for the Wedgefield Golf Course and its peaceful, family-oriented atmosphere. Enjoy a perfect blend of recreational amenities and Florida's natural beauty."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Wedgefield,_Florida"
      additionalCityInfo="Wedgefield is a census-designated place in Orange County, Florida, centered around the Wedgefield Golf & Country Club. The community developed as a golf course community and maintains its character as a peaceful, family-friendly neighborhood."
      localLandmarks="Wedgefield's larger lots and golf course setting provide excellent venues for party rentals. We regularly deliver to private residences, homes with golf course views, community clubhouse events, and neighborhood gatherings."
      nearbyAreas={[
        { name: "Bithlo", slug: "bithlo" },
        { name: "Christmas", slug: "christmas" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      faqs={[
        {
          question: "Do you deliver bounce houses to Wedgefield?",
          answer: "Yes! Wedgefield is within our delivery area and we provide free delivery and setup to all Wedgefield residents. Our team is familiar with the community."
        },
        {
          question: "What large inflatables work well on Wedgefield properties?",
          answer: "Wedgefield's larger lots are perfect for our mega obstacle courses, tall water slides, and large combo units. Take advantage of your space and go big for your next party!"
        },
        {
          question: "Can you set up near the golf course?",
          answer: "We can set up in your backyard even if it borders the golf course. We just need to ensure the inflatable is properly positioned away from any course areas and properly staked."
        },
        {
          question: "What events do you serve in Wedgefield?",
          answer: "We serve all types of Wedgefield events including birthday parties, graduation celebrations, family reunions, holiday gatherings, and neighborhood block parties."
        },
        {
          question: "Is there a country club we can set up at?",
          answer: "If you're hosting an event at the Wedgefield Golf & Country Club, we can coordinate with club management for setup. Private residence events are also very popular and easy to arrange."
        },
        {
          question: "How far in advance should Wedgefield residents book?",
          answer: "We recommend booking 1-2 weeks ahead, especially for weekend events. Wedgefield is a popular area and our best inflatables book quickly during peak party season."
        }
      ]}
    />
  );
};

export default Wedgefield;
