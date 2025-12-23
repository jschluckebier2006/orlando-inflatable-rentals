import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Christmas = () => {
  return (
    <CityDeliveryPage
      cityName="Christmas"
      citySlug="christmas"
      metaTitle="Bounce House & Water Slide Rentals Christmas FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Christmas FL. Party inflatables for Florida's most festive community. Free delivery! Call (407) 497-1840."
      cityDescription="One of the most uniquely named communities in the United States! Located in eastern Orange County along State Road 50, Christmas offers a rural Florida lifestyle with a special festive spirit that lasts all year long."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Christmas,_Florida"
      additionalCityInfo="Christmas is a small, unincorporated community famous for its year-round holiday theme. The town gets its name from Fort Christmas, a historic site commemorating a Second Seminole War fort established on Christmas Day in 1837. The famous Christmas Post Office attracts visitors from around the world."
      localLandmarks="Popular party locations in Christmas include Fort Christmas Historical Park with its nature trails and pioneer village, community event spaces, churches, and the spacious residential properties throughout the area."
      nearbyAreas={[
        { name: "Bithlo", slug: "bithlo" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      faqs={[
        {
          question: "Do you provide party rentals year-round in Christmas, FL?",
          answer: "Yes! While our town is named Christmas, we deliver bounce houses and water slides all year long. Summer birthday parties and holiday gatherings are both popular in our area."
        },
        {
          question: "Can you set up near Fort Christmas Historical Park?",
          answer: "We can deliver to private events near the park. For events within the park itself, you'll need to coordinate with Orange County Parks, and we're happy to work with their requirements."
        },
        {
          question: "What's the delivery time to Christmas from Orlando?",
          answer: "Our team is experienced with Christmas deliveries. We schedule ample time to ensure your equipment is set up and ready before your event starts, regardless of the drive time."
        },
        {
          question: "Do you have Christmas-themed bounce houses?",
          answer: "We have various themed inflatables throughout the year. During the holiday season, we often have festive options. Contact us to see what themed units are currently available."
        },
        {
          question: "What size water slides work best for Christmas properties?",
          answer: "Christmas properties typically have generous space, so our larger 18-22 foot water slides are popular choices. These provide maximum fun and take advantage of your available yard space."
        },
        {
          question: "Is there an extra charge for delivery to Christmas?",
          answer: "No! Delivery to Christmas is included free with your rental. We serve the entire East Orange County area without additional delivery fees."
        }
      ]}
    />
  );
};

export default Christmas;
