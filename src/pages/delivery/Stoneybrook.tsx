import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Stoneybrook?",
    answer: "Bounce house rentals in Stoneybrook start at $199 for a full-day rental. Premium combo units and water slides are also available. All rentals include free delivery, professional setup, and pickup throughout Stoneybrook.",
  },
  {
    question: "Are inflatables allowed by Stoneybrook HOA rules?",
    answer: "Most Stoneybrook HOAs permit temporary inflatable rentals for private parties. We recommend confirming with your specific HOA, but we've successfully served countless Stoneybrook residents without issues.",
  },
  {
    question: "What's popular for Stoneybrook summer pool parties?",
    answer: "Water slides are extremely popular for Stoneybrook summers! Set up on the grass near your pool area, they provide hours of refreshing fun that complements your pool. Perfect for beating the Florida heat!",
  },
  {
    question: "Do you serve Stoneybrook community events and HOA gatherings?",
    answer: "Yes! We work with Stoneybrook HOAs and community groups for neighborhood events, holiday celebrations, and block parties. Contact us for special pricing on larger community gatherings.",
  },
  {
    question: "What size combo units fit well in Stoneybrook backyards?",
    answer: "Our medium combo units (around 20x15 feet) are ideal for most Stoneybrook backyards. These offer bouncing plus a slide in one compact unit—maximizing fun while fitting your space perfectly.",
  },
  {
    question: "How do I book a bounce house for a Stoneybrook birthday party?",
    answer: "Booking is easy! Call us at (407) 497-1840 or submit an online quote request. We'll confirm availability, discuss your needs, help you choose the perfect inflatable, and schedule your delivery time.",
  },
  {
    question: "What safety measures do you take for Stoneybrook rentals?",
    answer: "Safety is our priority! All inflatables are commercially rated, regularly inspected, and cleaned with hospital-grade disinfectants. We provide proper anchoring, complete safety guidelines, and are fully licensed and insured.",
  },
  {
    question: "How early should Stoneybrook residents book?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends. Stoneybrook is a popular area and our best inflatables book quickly. For summer dates and holidays, 3 weeks ahead is even better!",
  },
];

export default function StoneybrookDelivery() {
  return (
    <CityDeliveryPage
      cityName="Stoneybrook"
      citySlug="stoneybrook"
      metaTitle="Bounce House & Water Slide Rentals Stoneybrook FL | Orlando Inflatables"
      metaDescription="Premium bounce house & water slide rentals in Stoneybrook FL. HOA-friendly party inflatables with free delivery. Call (407) 497-1840 today!"
      nearbyAreas={nearbyAreas}
      cityDescription="Welcome to Stoneybrook, one of East Orlando's most desirable master-planned communities! Known for beautiful homes, well-maintained common areas, and an active community life, Stoneybrook families know how to celebrate in style. Orlando Inflatables delivers premium party rentals that match the quality and care Stoneybrook residents expect."
      additionalCityInfo="Stoneybrook is a master-planned community in East Orlando renowned for its family-friendly atmosphere, excellent amenities, and convenient location. The neighborhood features thoughtfully designed homes, tree-lined streets, and community spaces that foster connection among residents. Active HOAs maintain the community's beautiful appearance, and neighbors often gather for block parties, holiday events, and celebrations. Stoneybrook's culture of community and quality living makes it a perfect place to throw memorable parties."
      localLandmarks="Stoneybrook offers excellent venues for party rentals throughout the community. Popular locations include spacious backyards in established Stoneybrook neighborhoods, community clubhouses and HOA facilities for larger gatherings, neighborhood common areas and parks, nearby schools for carnivals and field days, and church properties for celebrations. Our team is familiar with Stoneybrook and delivers with professionalism."
      faqs={faqs}
    />
  );
}
