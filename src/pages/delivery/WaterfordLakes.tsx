import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const WaterfordLakes = () => {
  return (
    <CityDeliveryPage
      cityName="Waterford Lakes"
      citySlug="waterford-lakes"
      metaTitle="Bounce House & Water Slide Rentals Waterford Lakes FL | Orlando Inflatables"
      metaDescription="Premium bounce house & water slide rentals in Waterford Lakes FL. Party inflatables near Town Center. Free delivery! Call (407) 497-1840."
      cityDescription="One of East Orlando's most popular and vibrant communities, located near the bustling Waterford Lakes Town Center. Home to thousands of families who appreciate quality, convenience, and community."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Waterford_Lakes,_Florida"
      additionalCityInfo="Waterford Lakes is a census-designated place in Orange County, Florida, anchored by the Waterford Lakes Town Center, one of the largest open-air shopping centers in the Orlando area. The community has grown rapidly since the 1990s and now hosts a diverse population of families."
      localLandmarks="Popular event locations in Waterford Lakes include private backyards throughout the community, The Villages at Waterford Lakes, neighborhood parks, HOA clubhouses, and spaces near the Town Center area."
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Stoneybrook", slug: "stoneybrook" },
        { name: "Eastwood", slug: "eastwood" },
      ]}
      faqs={[
        {
          question: "How quickly can you deliver to Waterford Lakes?",
          answer: "Waterford Lakes is one of our closest and busiest service areas! We can often accommodate short-notice requests, though we recommend booking 1-2 weeks ahead for guaranteed availability."
        },
        {
          question: "What's most popular for Waterford Lakes summer parties?",
          answer: "Our water slides are in high demand during Waterford Lakes summers! The dual-lane racing slides and tall water slides are favorites. Book early for summer dates as these fill up fast."
        },
        {
          question: "Do you deliver to The Villages at Waterford Lakes?",
          answer: "Yes! We serve all Waterford Lakes communities including The Villages, established Waterford Lakes neighborhoods, and newer developments in the area."
        },
        {
          question: "Can you set up at a Waterford Lakes park?",
          answer: "We can set up at local parks if you've obtained the necessary permits from Orange County. Many Waterford Lakes residents host parties in their backyards, which is simpler and just as fun!"
        },
        {
          question: "What's included with Waterford Lakes rentals?",
          answer: "Every rental includes free delivery, professional setup and takedown, safety instructions, and all necessary equipment like stakes or sandbags. Just provide a power outlet!"
        },
        {
          question: "Do you offer package deals for Waterford Lakes parties?",
          answer: "Absolutely! Combine a bounce house with tables, chairs, and a concession machine for special package pricing. Ask about our party packages when requesting a quote."
        }
      ]}
    />
  );
};

export default WaterfordLakes;
