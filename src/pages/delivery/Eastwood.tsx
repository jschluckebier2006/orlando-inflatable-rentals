import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const nearbyAreas = [
  { name: "Azalea Park", slug: "azalea-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Eastwood?",
    answer: "Bounce house rentals in Eastwood start at $199 for a full-day rental. We offer budget-friendly options for every family, plus combo units and water slides at various price points. All rentals include free delivery and setup.",
  },
  {
    question: "Is Eastwood within your delivery area?",
    answer: "Absolutely! Eastwood is one of our core East Orlando service areas. We provide free delivery, professional setup, and pickup to all Eastwood neighborhoods. You're right in the heart of our territory!",
  },
  {
    question: "What are your most popular rentals for Eastwood birthday parties?",
    answer: "Combo bounce houses with slides are the top choice for Eastwood birthdays! They offer multiple activities in one unit—bouncing plus sliding—perfect for entertaining kids of different ages at your party.",
  },
  {
    question: "Do you have budget-friendly options for Eastwood families?",
    answer: "Yes! We believe every family deserves great party entertainment. Our standard bounce houses offer excellent value, and we provide package deals when you combine multiple items. Quality fun doesn't have to break the bank.",
  },
  {
    question: "Can you set up in smaller Eastwood backyards?",
    answer: "Many Eastwood homes have varied yard sizes. We offer compact bounce houses designed for smaller spaces that still deliver big fun. Share your yard dimensions and we'll recommend the perfect fit.",
  },
  {
    question: "What time do you deliver to Eastwood?",
    answer: "We schedule deliveries based on your event time, typically arriving 1-2 hours before your party starts. You can request specific delivery windows when booking, and we'll accommodate your schedule.",
  },
  {
    question: "Do you offer same-day rentals to Eastwood?",
    answer: "Same-day rentals may be available depending on our schedule. Call us to check availability! For guaranteed selection, we recommend booking at least a few days ahead.",
  },
  {
    question: "What areas near Eastwood do you also serve?",
    answer: "We serve all surrounding communities including Azalea Park, Waterford Lakes, Avalon Park, and beyond. If you're planning a party anywhere in East Orlando, we've got you covered with free delivery.",
  },
];

export default function EastwoodDelivery() {
  return (
    <CityDeliveryPage
      cityName="Eastwood"
      citySlug="eastwood"
      metaTitle="Bounce House & Water Slide Rentals Eastwood FL | Orlando Inflatables"
      metaDescription="Affordable bounce house & water slide rentals in Eastwood FL. Budget-friendly party inflatables with free delivery. Call (407) 497-1840 for quotes!"
      nearbyAreas={nearbyAreas}
      cityDescription="Welcome to Eastwood, an established East Orlando neighborhood offering families a convenient, affordable location in the heart of it all! With easy access to major roads and employment centers, Eastwood residents enjoy the best of Orlando living. Orlando Inflatables is proud to serve this community with quality party rentals at prices that work for every budget."
      additionalCityInfo="Eastwood is a neighborhood in East Orlando, Orange County, Florida, known for its established residential character and convenient location. The area developed primarily in the latter half of the 20th century and offers a diverse mix of single-family homes. Residents appreciate Eastwood's proximity to East Colonial Drive and the 408 expressway, providing easy access to downtown Orlando, the airport, and attractions. It's a practical, family-friendly neighborhood where celebrations happen every weekend."
      localLandmarks="We deliver throughout Eastwood's established streets and residential areas. Popular party venues include private backyards of various sizes, community gathering spaces, local parks and recreational facilities, school grounds for special events, and church properties for celebrations. Our team knows the Eastwood area well and ensures prompt, professional delivery to your doorstep."
      faqs={faqs}
    />
  );
}
