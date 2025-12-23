import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Waterford Lakes?",
    answer: "Bounce house rentals in Waterford Lakes start at $199 for an 8-hour rental. Pricing varies by size and features—combo units and water slides may cost more. All rentals include free delivery, setup, and pickup.",
  },
  {
    question: "How quickly can you deliver to Waterford Lakes?",
    answer: "Waterford Lakes is one of our closest and busiest service areas! We can often accommodate short-notice requests, though booking 1-2 weeks ahead guarantees the best selection of inflatables.",
  },
  {
    question: "What's most popular for Waterford Lakes summer parties?",
    answer: "Water slides are in huge demand during Waterford Lakes summers! Our dual-lane racing slides and tall water slides are favorites. Book early for summer dates—these fill up fast in the Florida heat!",
  },
  {
    question: "Do you deliver to The Villages at Waterford Lakes?",
    answer: "Yes! We serve all Waterford Lakes communities including The Villages, established Waterford Lakes neighborhoods, and newer developments. Wherever you are in Waterford Lakes, delivery is free.",
  },
  {
    question: "Can you set up at Waterford Lakes parks?",
    answer: "We can set up at local parks if you've obtained necessary permits from Orange County. Many Waterford Lakes residents prefer backyard parties—simpler, more private, and just as fun!",
  },
  {
    question: "What's included with Waterford Lakes rentals?",
    answer: "Every rental includes free delivery, professional setup, safety instructions, all necessary equipment (stakes or sandbags), and pickup after your event. Just provide a power outlet and we handle everything else!",
  },
  {
    question: "Do you offer package deals for Waterford Lakes parties?",
    answer: "Absolutely! Combine a bounce house with tables, chairs, and concession machines for special package pricing. Ask about our party packages when requesting a quote—save money and simplify planning!",
  },
  {
    question: "How far in advance should Waterford Lakes residents book?",
    answer: "We recommend 1-2 weeks for weekends, 2-3 weeks for summer dates and holidays. Waterford Lakes is one of our most popular areas, so early booking ensures you get your first-choice inflatable.",
  },
];

export default function WaterfordLakesDelivery() {
  return (
    <CityDeliveryPage
      cityName="Waterford Lakes"
      citySlug="waterford-lakes"
      metaTitle="Bounce House & Water Slide Rentals Waterford Lakes FL | Orlando Inflatables"
      metaDescription="Premium bounce house & water slide rentals in Waterford Lakes FL. Near Town Center with free delivery! Call (407) 497-1840 for your party quote."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Waterford_Lakes,_Florida"
      cityDescription="Welcome to Waterford Lakes, one of East Orlando's most popular and vibrant communities! Anchored by the bustling Waterford Lakes Town Center, this thriving area is home to thousands of families who appreciate quality, convenience, and community. Whether you're celebrating near the shops or in your beautiful backyard, Orlando Inflatables delivers the party excitement Waterford Lakes families love."
      additionalCityInfo="Waterford Lakes is a census-designated place in Orange County, Florida, centered around the Waterford Lakes Town Center—one of the largest open-air shopping centers in the Orlando area. The community has experienced tremendous growth since the 1990s and now hosts a diverse, dynamic population of families and young professionals. Multiple neighborhoods make up the greater Waterford Lakes area, including The Villages at Waterford Lakes and surrounding developments. Excellent schools, abundant shopping, and easy access to major roads make Waterford Lakes one of East Orlando's most desirable places to live and celebrate."
      localLandmarks="Popular event locations throughout Waterford Lakes include spacious backyards in established neighborhoods, The Villages at Waterford Lakes community areas, neighborhood parks and common spaces, HOA clubhouses for larger gatherings, and convenient locations near the Town Center for easy guest access. Whether your party is intimate or large-scale, Waterford Lakes has the perfect setting and we'll deliver the perfect inflatable."
      faqs={faqs}
    />
  );
}
