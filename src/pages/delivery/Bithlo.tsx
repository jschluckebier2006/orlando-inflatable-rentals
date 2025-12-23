import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you really deliver bounce houses all the way to Bithlo?",
    answer: "Absolutely! Bithlo is part of our core East Orange County service area. We provide free delivery, setup, and pickup to all Bithlo properties. Our team is experienced with rural routes and country roads.",
  },
  {
    question: "What large inflatables work best on Bithlo's bigger properties?",
    answer: "Bithlo's spacious lots are perfect for our largest equipment! We recommend mega obstacle courses, 22-foot water slides, and large combo units that are often too big for suburban yards. Take advantage of your space and go big!",
  },
  {
    question: "How much does it cost to rent a bounce house in Bithlo?",
    answer: "Bounce house rentals in Bithlo start at $199 for a full-day rental. Larger units and water slides may cost more. All prices include free delivery to Bithlo—no extra mileage fees for our rural customers.",
  },
  {
    question: "Can you set up on uneven or sloped terrain in Bithlo?",
    answer: "Our team is experienced with rural property setups. While we need relatively flat ground for safe operation, we can work with minor terrain variations. We'll assess your property on arrival and find the ideal spot.",
  },
  {
    question: "What if I live on a dirt road in Bithlo?",
    answer: "No problem at all! Our delivery trucks can handle dirt roads, gravel driveways, and rural access routes. Just let us know when booking so we can plan accordingly and ensure on-time arrival.",
  },
  {
    question: "What power source do I need for inflatables in Bithlo?",
    answer: "Each inflatable requires a standard 110V outlet within 100 feet. If you're setting up far from your home or don't have nearby power, we offer generator rentals to keep everything running perfectly.",
  },
  {
    question: "Do you serve Bithlo church and community events?",
    answer: "Yes! We love serving Bithlo's churches, community groups, and family gatherings. We've set up at church picnics, community fundraisers, and large family reunions throughout the Bithlo area.",
  },
  {
    question: "How far in advance should Bithlo residents book?",
    answer: "We recommend booking 1-2 weeks ahead for weekends. Bithlo's larger properties are great for our biggest inflatables, which are popular and book quickly during peak season. Call early for the best selection!",
  },
];

export default function BithloDelivery() {
  return (
    <CityDeliveryPage
      cityName="Bithlo"
      citySlug="bithlo"
      metaTitle="Bounce House & Water Slide Rentals Bithlo FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Bithlo FL. Large inflatables for spacious country properties. Free delivery on rural routes! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Bithlo,_Florida"
      cityDescription="Welcome to Bithlo, where country living meets Florida sunshine! This unincorporated community in eastern Orange County offers the space and freedom that make outdoor celebrations truly special. Bithlo's larger properties are ideal for our biggest bounce houses, tallest water slides, and most exciting obstacle courses. If you've got the space, we've got the inflatables to fill it with fun!"
      additionalCityInfo="Bithlo is an unincorporated community located along State Road 50 between Orlando and Christmas. The area has a rich history dating back to the early 20th century and maintains its rural, country character that distinguishes it from more developed areas of Orange County. Residents enjoy larger lots, agricultural properties, and a peaceful lifestyle while remaining within reach of Orlando's amenities. The community's outdoor-oriented culture makes it perfect for big celebrations under the Florida sky."
      localLandmarks="Bithlo's spacious properties and outdoor lifestyle make it ideal for large inflatables that need room to shine. We regularly set up at private acreages with plenty of yard space, church picnic grounds for community gatherings, family properties hosting reunions and celebrations, community event spaces, and residential lots along Bithlo's country roads. Whether you're on a multi-acre spread or a generous residential lot, we'll bring the party to you."
      faqs={faqs}
    />
  );
}
