import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver to Chuluota even though it's near Seminole County?",
    answer: "Yes! Chuluota sits right on the Orange/Seminole County border and is absolutely within our service area. We provide the same free delivery and professional setup to Chuluota as all our other communities.",
  },
  {
    question: "How much do bounce house rentals cost in Chuluota?",
    answer: "Chuluota bounce house rentals start at $199 for a full-day rental. With Chuluota's larger properties, many families opt for our bigger combo units and obstacle courses. All prices include free delivery and setup.",
  },
  {
    question: "What inflatables are popular on Chuluota's larger properties?",
    answer: "Chuluota customers love our large obstacle courses, dual-lane racing water slides, and mega combo units. The spacious lots in Chuluota are perfect for our biggest and most exciting inflatables—go big!",
  },
  {
    question: "Can you set up on a horse property in Chuluota?",
    answer: "Absolutely! We're experienced with rural and equestrian property setups. We just need a flat grassy area positioned away from where horses are present. Our team will find the perfect spot on your property.",
  },
  {
    question: "Do you serve Chuluota schools and churches?",
    answer: "Yes! We work with Seminole County schools in the Chuluota area for field days, carnivals, and PTA events. We also serve local churches for community gatherings. Full insurance and certificates available upon request.",
  },
  {
    question: "What's the rental period for Chuluota deliveries?",
    answer: "Our standard rental is up to 8 hours—plenty of time for most parties. Need your inflatable longer? Ask about our extended rental options when booking. We're flexible to accommodate your celebration.",
  },
  {
    question: "How early should Chuluota residents book?",
    answer: "We recommend booking 1-2 weeks ahead for weekends. Chuluota's popularity and larger properties mean our big inflatables are in high demand. For specific themed units or peak season dates, book 3-4 weeks out.",
  },
  {
    question: "What makes Chuluota great for inflatable parties?",
    answer: "Chuluota's rural character means bigger lots, more privacy, and room for multiple inflatables. Many families rent several units for large gatherings. The peaceful atmosphere is perfect for memorable outdoor celebrations.",
  },
];

export default function ChuluotaDelivery() {
  return (
    <CityDeliveryPage
      cityName="Chuluota"
      citySlug="chuluota"
      metaTitle="Bounce House & Water Slide Rentals Chuluota FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Chuluota FL. Large inflatables for horse properties & spacious lots. Free delivery! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Chuluota,_Florida"
      cityDescription="Welcome to Chuluota, a charming rural community on the border of Seminole and Orange Counties! Known for its peaceful atmosphere, historic character, and thriving equestrian community, Chuluota is a wonderful place to raise a family and celebrate life's special moments. With larger lots and a country feel, Chuluota properties are perfect for our biggest and most exciting inflatables."
      additionalCityInfo="Chuluota's name comes from the Seminole word meaning 'pine island,' reflecting the area's natural beauty and Native American heritage. The community maintains a distinctly rural character with larger lots, horse properties, and a strong equestrian presence while providing convenient access to Orlando and surrounding areas. The historic downtown area adds charm, and residents enjoy a close-knit community feel that's increasingly rare in Central Florida. Chuluota offers the best of both worlds—country living with city convenience."
      localLandmarks="Chuluota offers wonderful venues for party rentals, from spacious residential backyards to multi-acre horse properties with room to spare. Popular locations include the historic downtown area for community events, church grounds for gatherings of all sizes, school facilities for Seminole County events, and private properties throughout Chuluota's beautiful neighborhoods. Our team is familiar with the area's rural roads and delivers with care."
      faqs={faqs}
    />
  );
}
