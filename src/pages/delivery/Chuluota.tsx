import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Chuluota = () => {
  return (
    <CityDeliveryPage
      cityName="Chuluota"
      citySlug="chuluota"
      metaTitle="Bounce House & Water Slide Rentals Chuluota FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Chuluota FL. Serving Seminole County with party inflatables. Free delivery! Call (407) 497-1840."
      cityDescription="A charming rural community on the border of Seminole and Orange Counties, known for its peaceful atmosphere, historic character, and close-knit community. Chuluota is a wonderful place to raise a family and celebrate life's special moments."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Chuluota,_Florida"
      additionalCityInfo="Chuluota's name comes from the Seminole word meaning 'pine island,' reflecting the area's natural beauty and Native American heritage. The community maintains a rural character with larger lots, horse properties, and a strong equestrian community while providing convenient access to Orlando."
      localLandmarks="Chuluota offers wonderful venues for party rentals including spacious residential backyards, the historic downtown area, community gathering spaces, church grounds, and the many horse properties with ample room for large inflatables."
      nearbyAreas={[
        { name: "Bithlo", slug: "bithlo" },
        { name: "Christmas", slug: "christmas" },
        { name: "Wedgefield", slug: "wedgefield" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      faqs={[
        {
          question: "Do you deliver to Chuluota even though it's in Seminole County?",
          answer: "Yes! Chuluota is within our service area. We regularly deliver to Chuluota and surrounding areas, providing the same free delivery and setup service."
        },
        {
          question: "What inflatables are popular on Chuluota's larger properties?",
          answer: "Chuluota customers love our large obstacle courses, dual-lane water slides, and mega combo units. The spacious properties in Chuluota are perfect for our biggest and most exciting inflatables."
        },
        {
          question: "Can you set up on a horse property in Chuluota?",
          answer: "Absolutely! We're experienced with rural property setups. We just need a flat grassy area away from any areas where horses are present. Our team will find the perfect spot."
        },
        {
          question: "What schools do you serve in the Chuluota area?",
          answer: "We work with Seminole County Public Schools in the Chuluota area for field days, carnivals, and PTA events. We're familiar with school setup requirements and carry full insurance."
        },
        {
          question: "How do I book a bounce house for a Chuluota church event?",
          answer: "Simply call us or use our online quote form. Church events are some of our favorites! We offer package deals for larger church gatherings and can accommodate multiple inflatables."
        },
        {
          question: "What's the rental period for Chuluota deliveries?",
          answer: "Our standard rental is for up to 8 hours, which is perfect for most parties. Need more time? Just ask about our extended rental options when booking."
        }
      ]}
    />
  );
};

export default Chuluota;
