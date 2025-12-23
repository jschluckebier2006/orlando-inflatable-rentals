import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver party rentals to Christmas, Florida year-round?",
    answer: "Yes! While our town has a festive name, we deliver bounce houses and water slides to Christmas all year long. Summer birthday parties are just as popular as holiday gatherings in Florida's most uniquely named community!",
  },
  {
    question: "How much does a bounce house rental cost in Christmas, FL?",
    answer: "Bounce house rentals in Christmas start at $199 for a full-day rental. All prices include free delivery to Christmas—no extra mileage charges. Larger water slides and combo units are also available at competitive rates.",
  },
  {
    question: "Can you set up near Fort Christmas Historical Park?",
    answer: "We can deliver to private events near the park area. For events within Fort Christmas Historical Park itself, coordinate with Orange County Parks for permits. We're happy to work with any venue requirements they may have.",
  },
  {
    question: "What size water slides are popular for Christmas properties?",
    answer: "Christmas properties often have generous space, making our larger 18-22 foot water slides popular choices. These bigger slides provide maximum thrills and take full advantage of your available yard space.",
  },
  {
    question: "Do you have holiday-themed inflatables for Christmas, FL parties?",
    answer: "We carry various themed inflatables throughout the year, including festive options during the holiday season. Contact us to see what themed units are currently available—Christmas deserves the perfect party theme!",
  },
  {
    question: "Is there an extra delivery charge to Christmas?",
    answer: "No! Delivery to Christmas is included free with your rental. We serve all of East Orange County without additional delivery fees, including the Christmas and surrounding rural areas.",
  },
  {
    question: "How far in advance should I book for a Christmas, FL party?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends and holidays. The actual Christmas holiday season books up quickly in our festively-named town, so plan ahead for December events!",
  },
  {
    question: "What events do you serve in the Christmas area?",
    answer: "We serve all types of Christmas celebrations—birthday parties, family reunions, church gatherings, community events, graduation parties, and yes, actual Christmas holiday parties! Whatever you're celebrating, we bring the fun.",
  },
];

export default function ChristmasDelivery() {
  return (
    <CityDeliveryPage
      cityName="Christmas"
      citySlug="christmas"
      metaTitle="Bounce House & Water Slide Rentals Christmas FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Christmas FL. Party inflatables for Florida's most festive town! Free delivery year-round. Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Christmas,_Florida"
      cityDescription="Welcome to Christmas, Florida—one of the most uniquely named communities in the United States! Located in eastern Orange County along State Road 50, Christmas offers a rural Florida lifestyle with a special festive spirit that lasts all year long. Whether it's July or December, Orlando Inflatables delivers the excitement and fun to make your Christmas celebration unforgettable."
      additionalCityInfo="Christmas is a small, unincorporated community famous for its year-round holiday theme and the beloved Christmas Post Office, which attracts visitors from around the world seeking that special postmark. The town gets its name from Fort Christmas, established on Christmas Day in 1837 during the Second Seminole War. Today, Fort Christmas Historical Park preserves this history with nature trails and a pioneer village. The community's residents enjoy rural Florida living with spacious properties and a tight-knit neighborhood feel."
      localLandmarks="Popular party locations in Christmas include the area near Fort Christmas Historical Park, spacious residential properties along State Road 50 and surrounding roads, church grounds for community gatherings, and the many private acreages perfect for large celebrations. Christmas's rural character means bigger yards and more room for our largest inflatables—take advantage of the space and throw an epic outdoor party!"
      faqs={faqs}
    />
  );
}
