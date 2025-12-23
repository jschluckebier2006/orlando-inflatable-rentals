import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Eastwood", slug: "eastwood" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Avalon Park", slug: "avalon-park" },
];

const faqs = [
  {
    question: "How much do bounce house rentals cost in Azalea Park?",
    answer: "Our Azalea Park bounce house rentals start at $199 for a full-day rental. We offer various sizes and styles to fit every budget. All prices include free delivery, professional setup, and pickup—no hidden fees or surprises.",
  },
  {
    question: "Is delivery really free to Azalea Park?",
    answer: "Yes! We provide complimentary delivery, setup, and pickup for all rentals in Azalea Park. Whether you're near Semoran Boulevard or East Colonial Drive, delivery is included at no extra cost.",
  },
  {
    question: "Do you offer Spanish-speaking customer service?",
    answer: "¡Sí! We have Spanish-speaking team members available to assist you with your rental needs. Call us and we'll be happy to help you plan your party in Spanish or English.",
  },
  {
    question: "Can I rent inflatables for a quinceañera in Azalea Park?",
    answer: "Absolutely! Our inflatables are perfect for quinceañeras, sweet 16 parties, and milestone celebrations. We have elegant combo units and fun options that complement any party theme beautifully.",
  },
  {
    question: "What size bounce house fits in an Azalea Park yard?",
    answer: "Most Azalea Park yards can accommodate our standard 15x15 bounce houses. We also have compact options for smaller spaces. Tell us your yard dimensions and we'll recommend the perfect fit for your celebration.",
  },
  {
    question: "How early should I book for an Azalea Park party?",
    answer: "We recommend booking 1-2 weeks ahead for the best selection. Weekend dates and summer months fill up quickly. For last-minute needs, call us—we often have same-week availability.",
  },
  {
    question: "Do you serve Azalea Park schools and churches?",
    answer: "Yes! We regularly provide inflatables for Azalea Park elementary schools, local churches, and community organizations. We carry full insurance and can provide certificates upon request for your venue.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and cash. A deposit secures your booking, with the remaining balance due on delivery day. Payment is easy and flexible for Azalea Park families.",
  },
];

export default function AzaleaParkDelivery() {
  return (
    <CityDeliveryPage
      cityName="Azalea Park"
      citySlug="azalea-park"
      metaTitle="Bounce House & Water Slide Rentals Azalea Park FL | Orlando Inflatables"
      metaDescription="Affordable bounce house & water slide rentals in Azalea Park FL. Bilingual service, free delivery. Perfect for birthdays & quinceañeras! Call (407) 497-1840."
      nearbyAreas={nearbyAreas}
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Azalea_Park,_Florida"
      cityDescription="Welcome to Azalea Park, a welcoming and diverse East Orlando community with deep roots and strong neighborhood spirit! Located conveniently near major corridors, Azalea Park offers families an affordable place to live with easy access to everything Orlando has to offer. Orlando Inflatables is proud to serve this vibrant community with top-quality party rentals at prices that work for every family."
      additionalCityInfo="Azalea Park is a census-designated place in Orange County, Florida, established primarily in the mid-20th century. The neighborhood has maintained its character as a welcoming place for families of all backgrounds. Known for its diverse, close-knit community, Azalea Park residents take pride in their neighborhood. The area's convenient location near Semoran Boulevard and East Colonial Drive provides easy access to shopping, dining, and entertainment while maintaining a residential, family-friendly atmosphere."
      localLandmarks="We deliver throughout all of Azalea Park, from the established neighborhoods near Semoran Boulevard to the quiet residential streets off East Colonial Drive. Popular party locations include private backyards of all sizes, community centers and gathering spaces, local churches for celebrations, school facilities for events, and neighborhood parks. Our team navigates Azalea Park's streets with ease to ensure on-time delivery for your special occasion."
      faqs={faqs}
    />
  );
}
