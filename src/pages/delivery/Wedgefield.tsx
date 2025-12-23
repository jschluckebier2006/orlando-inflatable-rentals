import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver bounce houses to Wedgefield?",
    answer: "Yes! Wedgefield is within our delivery area and we provide free delivery, setup, and pickup to all Wedgefield residents. Our team is familiar with the golf course community and surrounding areas.",
  },
  {
    question: "How much does it cost to rent a bounce house in Wedgefield?",
    answer: "Bounce house rentals in Wedgefield start at $199 for a full-day rental. With Wedgefield's larger lots, many families opt for our bigger units. All prices include free delivery—no extra fees.",
  },
  {
    question: "What large inflatables work well on Wedgefield properties?",
    answer: "Wedgefield's spacious lots are perfect for our mega obstacle courses, tall water slides, and large combo units. Take advantage of your yard space and go big—these are the inflatables suburban yards can't fit!",
  },
  {
    question: "Can you set up near the golf course?",
    answer: "We can set up in your backyard even if it borders the Wedgefield Golf Course. We position inflatables away from course areas with proper staking. Your golf course view makes a beautiful party backdrop!",
  },
  {
    question: "Do you serve events at Wedgefield Golf & Country Club?",
    answer: "If you're hosting an event at the club, we can coordinate with management for setup requirements. Private residence parties are also very popular in Wedgefield—easy to arrange with more flexibility.",
  },
  {
    question: "What events do you serve in Wedgefield?",
    answer: "We serve all types of Wedgefield celebrations—birthday parties, graduation events, family reunions, holiday gatherings, golf tournament after-parties, and neighborhood block parties. Whatever you're celebrating!",
  },
  {
    question: "How far in advance should Wedgefield residents book?",
    answer: "We recommend 1-2 weeks ahead, especially for weekends. Wedgefield is popular for our larger inflatables, which book quickly during peak party season. Early booking ensures the best selection.",
  },
  {
    question: "What power source do I need for inflatables in Wedgefield?",
    answer: "Each inflatable requires a standard 110V outlet within 100 feet. Wedgefield's larger properties sometimes require longer runs—let us know and we can discuss generator rental options if needed.",
  },
];

export default function WedgefieldDelivery() {
  return (
    <CityDeliveryPage
      cityName="Wedgefield"
      citySlug="wedgefield"
      metaTitle="Bounce House & Water Slide Rentals Wedgefield FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Wedgefield FL. Large inflatables for golf course community properties. Free delivery! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Wedgefield,_Florida"
      cityDescription="Welcome to Wedgefield, a beautiful golf course community in eastern Orange County! Centered around the Wedgefield Golf & Country Club, this peaceful, family-oriented neighborhood offers larger lots, stunning golf course views, and a relaxed Florida lifestyle. Wedgefield's spacious properties are perfect for our biggest inflatables—bring the water park experience right to your backyard!"
      additionalCityInfo="Wedgefield is a census-designated place in Orange County, Florida, developed as a golf course community around the Wedgefield Golf & Country Club. The community maintains its character as a peaceful, family-friendly neighborhood where residents enjoy larger lots, many with beautiful golf course views. Wedgefield offers a perfect blend of recreational amenities and natural Florida beauty. The community's location provides convenient access to Orlando while maintaining a quiet, residential atmosphere ideal for raising families and hosting celebrations."
      localLandmarks="Wedgefield's larger lots and golf course setting provide excellent venues for party rentals. Popular locations include private residences with spacious backyards, homes with scenic golf course views, the Wedgefield Golf & Country Club for coordinated events, neighborhood gathering spaces, and properties throughout the community's tree-lined streets. Whether you're hosting an intimate birthday or a large family reunion, Wedgefield has the space."
      faqs={faqs}
    />
  );
}
