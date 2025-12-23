import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Avalon Park?",
    answer: "Bounce house rentals in Avalon Park start at $199 for an 8-hour rental. Pricing depends on the size and style—combo units with slides and themed inflatables may cost more. All rentals include free delivery, setup, and pickup throughout Avalon Park.",
  },
  {
    question: "Do you deliver to all Avalon Park villages and neighborhoods?",
    answer: "Yes! We deliver to every village within Avalon Park including East Park, West Park, and all surrounding neighborhoods. Our team knows the community well and provides on-time delivery to your exact location.",
  },
  {
    question: "Can I rent a water slide for my Avalon Park pool party?",
    answer: "Absolutely! Water slides are perfect for Avalon Park summer parties. We set them up on the grass near your pool area for hours of refreshing fun. Our 15-18 foot slides are ideal for most Avalon Park backyards.",
  },
  {
    question: "How far in advance should I book party rentals in Avalon Park?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends. Avalon Park is one of our busiest service areas, and popular inflatables book quickly. For major holidays or themed units, 3-4 weeks notice is ideal.",
  },
  {
    question: "Do you set up at Avalon Park Town Center events?",
    answer: "Yes, we serve events at Downtown Avalon Park and Town Center venues. You may need venue approval for commercial locations. For private backyard parties, simply book directly with us and we handle everything.",
  },
  {
    question: "What happens if it rains on my Avalon Park party day?",
    answer: "Florida weather is unpredictable! If rain threatens your event, we'll work with you to reschedule at no extra charge. Light showers are usually fine, but we'll take down equipment during lightning for everyone's safety.",
  },
  {
    question: "Can I rent tables, chairs, and concessions with my Avalon Park bounce house?",
    answer: "Yes! We offer complete party packages including tables, chairs, cotton candy machines, snow cone makers, and popcorn poppers. Bundle items together for special package pricing on your Avalon Park celebration.",
  },
  {
    question: "What safety measures do you take for Avalon Park rentals?",
    answer: "Every inflatable is commercially rated, regularly inspected, and cleaned with hospital-grade disinfectants. We're fully licensed and insured. Our team provides proper anchoring and complete safety instructions at every delivery.",
  },
];

export default function AvalonParkDelivery() {
  return (
    <CityDeliveryPage
      cityName="Avalon Park"
      citySlug="avalon-park"
      metaTitle="Bounce House & Water Slide Rentals Avalon Park FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Avalon Park FL. Serving Downtown Avalon Park & all villages with party inflatables. Free delivery! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Avalon_Park,_Florida"
      cityDescription="Welcome to Avalon Park, one of East Orlando's most beloved master-planned communities! Known for its charming New Urbanism design, tree-lined boulevards, and vibrant Downtown center, Avalon Park is home to thousands of families who know how to celebrate in style. Whether you're hosting a birthday party, graduation celebration, or community gathering, Orlando Inflatables delivers the excitement."
      additionalCityInfo="Avalon Park was developed with New Urbanism principles that emphasize walkability, community gathering spaces, and traditional neighborhood design. The community features a charming downtown area with shops, restaurants, and event venues. Multiple villages make up this thriving community, including East Park, West Park, and surrounding neighborhoods. Avalon Park's family-oriented culture, excellent schools, and active HOAs create the perfect environment for memorable celebrations."
      localLandmarks="We regularly deliver to parties throughout Avalon Park's beautiful neighborhoods. Popular venues include Downtown Avalon Park near the Town Center shops and restaurants, community clubhouses and HOA facilities, Avalon Park area schools for field days and carnivals, neighborhood parks and common areas, and the many spacious backyards throughout all Avalon Park villages. Our team is familiar with every corner of this wonderful community."
      faqs={faqs}
    />
  );
}
