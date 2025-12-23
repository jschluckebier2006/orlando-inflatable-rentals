import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const AvalonPark = () => {
  return (
    <CityDeliveryPage
      cityName="Avalon Park"
      citySlug="avalon-park"
      metaTitle="Bounce House & Water Slide Rentals Avalon Park FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Avalon Park FL. Family-friendly party inflatables with free delivery. Licensed & insured. Call (407) 497-1840!"
      cityDescription="Known for its New Urbanism design, tree-lined streets, and strong sense of community, Avalon Park is the perfect setting for memorable celebrations."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Avalon_Park,_Florida"
      additionalCityInfo="Avalon Park is a master-planned community in East Orlando, developed with New Urbanism principles that emphasize walkability, community gathering spaces, and traditional neighborhood design. The community features a charming downtown area with shops, restaurants, and event spaces."
      localLandmarks="We regularly deliver to parties throughout Avalon Park, including the Downtown Avalon Park Town Center, community clubhouses, local parks, school events at Avalon Park area schools, and private residences throughout all Avalon Park villages."
      nearbyAreas={[
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Stoneybrook", slug: "stoneybrook" },
        { name: "Eastwood", slug: "eastwood" },
      ]}
      faqs={[
        {
          question: "Do you deliver bounce houses to all of Avalon Park?",
          answer: "Yes! We provide free delivery to all villages and neighborhoods within Avalon Park. Our team is familiar with the entire community and will ensure on-time delivery to your location."
        },
        {
          question: "What size bounce house fits in an Avalon Park backyard?",
          answer: "Most Avalon Park homes can accommodate our standard bounce houses (15x15) and many can fit our larger combo units. We recommend measuring your yard and discussing options with our team to find the perfect fit."
        },
        {
          question: "Can I rent a water slide for my Avalon Park pool party?",
          answer: "Absolutely! Our water slides are perfect for Avalon Park pool parties. They're set up on grass near the pool area and provide hours of refreshing fun for guests of all ages."
        },
        {
          question: "How early should I book for an Avalon Park event?",
          answer: "We recommend booking at least 1-2 weeks in advance, especially for weekend events. Avalon Park is one of our busiest areas, so early booking ensures you get your preferred inflatable."
        },
        {
          question: "Do you set up at Avalon Park community clubhouses?",
          answer: "Yes, we frequently set up at HOA facilities and community clubhouses throughout Avalon Park. Just confirm with your HOA that inflatables are permitted and we'll handle the rest."
        },
        {
          question: "What's included in my Avalon Park bounce house rental?",
          answer: "Every rental includes free delivery, professional setup, safety instructions, and pickup after your event. We also provide stakes or sandbags as needed for your specific location."
        }
      ]}
    />
  );
};

export default AvalonPark;
