import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Alafaya?",
    answer: "Bounce house rentals in Alafaya start at $199 for a standard 8-hour rental. Prices vary based on size and features. Combo units with slides and themed bounce houses may cost more. All rentals include free delivery, setup, and pickup in Alafaya.",
  },
  {
    question: "Do you deliver bounce houses to UCF area?",
    answer: "Yes! We provide free delivery to all of Alafaya including the UCF campus area, Research Park, and surrounding neighborhoods. We're very familiar with the area and can accommodate setups at residential homes, apartment complexes, and event venues.",
  },
  {
    question: "What size water slide is best for an Alafaya backyard party?",
    answer: "For most Alafaya backyards, we recommend our 15-18 foot water slides. They provide plenty of excitement while fitting in standard-sized yards. We'll help you choose the right size based on your space and the ages of your guests.",
  },
  {
    question: "How far in advance should I book party rentals in Alafaya?",
    answer: "We recommend booking at least 1-2 weeks in advance, especially for weekend events. During peak season (spring and summer), popular items book up quickly. For large events or specific themed inflatables, booking 3-4 weeks ahead is ideal.",
  },
  {
    question: "Do you set up bounce houses at Alafaya community parks?",
    answer: "Yes, we regularly set up at community parks, HOA common areas, and clubhouses throughout Alafaya. You may need a permit from the venue or HOA. We can provide insurance certificates if required for your location.",
  },
  {
    question: "What happens if it rains on my party day in Alafaya?",
    answer: "Florida weather can be unpredictable! If there's rain in the forecast, we'll work with you to reschedule at no additional charge. Light rain is usually fine, but we'll take down equipment during lightning for safety.",
  },
  {
    question: "Can I rent multiple inflatables for a large Alafaya event?",
    answer: "Absolutely! We offer package deals for multiple rentals. Many Alafaya customers combine a bounce house, water slide, and concession machines for complete party packages. Contact us for custom quotes on multi-item rentals.",
  },
  {
    question: "What power source do I need for inflatables in Alafaya?",
    answer: "Each inflatable requires a standard 110V electrical outlet within 100 feet. If you're setting up in a park or area without power, we offer generator rentals. Our team will ensure everything is properly powered during setup.",
  },
];

export default function AlafayaDelivery() {
  return (
    <CityDeliveryPage
      cityName="Alafaya"
      citySlug="alafaya"
      metaTitle="Bounce House & Water Slide Rentals Alafaya FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Alafaya FL. Serving UCF area with party inflatables, obstacle courses & more. Free delivery! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Alafaya,_Florida"
      cityDescription="Located in Orange County near the University of Central Florida, Alafaya is home to thousands of families, students, and young professionals who know how to celebrate! Whether you're hosting a birthday party, graduation celebration, or community event, we have the perfect inflatable rentals for your occasion."
      additionalCityInfo="Alafaya is a census-designated place (CDP) in Orange County, Florida, situated in the heart of East Orlando. The community has experienced tremendous growth over the past two decades, largely driven by its proximity to the University of Central Florida, one of the largest universities in the nation. The area features excellent schools, family-friendly neighborhoods, and convenient access to major employers in the Research Park corridor."
      localLandmarks="Popular gathering spots in Alafaya include community parks, HOA clubhouses, UCF campus venues, and the many residential neighborhoods with spacious backyards. The community's young, active population makes it one of our most popular delivery areas. We frequently set up at locations near Alafaya Trail, Innovation Way, and the Research Park area."
      faqs={faqs}
    />
  );
}
