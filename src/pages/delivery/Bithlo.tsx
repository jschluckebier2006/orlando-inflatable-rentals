import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";

const Bithlo = () => {
  return (
    <CityDeliveryPage
      cityName="Bithlo"
      citySlug="bithlo"
      metaTitle="Bounce House & Water Slide Rentals Bithlo FL | Orlando Inflatables"
      metaDescription="Bounce house & water slide rentals in Bithlo FL. Serving rural East Orange County with party inflatables. Free delivery! Call (407) 497-1840."
      cityDescription="Bithlo's larger properties and country atmosphere make it an ideal location for bounce houses, water slides, and inflatable games. Enjoy plenty of space for outdoor parties and celebrations."
      cityWikipediaUrl="https://en.wikipedia.org/wiki/Bithlo,_Florida"
      additionalCityInfo="Bithlo is an unincorporated community in eastern Orange County, Florida, located along State Road 50 between Orlando and Christmas. The area has a rich history dating back to the early 20th century and maintains a rural, country character that distinguishes it from more developed areas."
      localLandmarks="Bithlo's spacious properties and outdoor-oriented lifestyle make it perfect for large inflatables. We regularly set up at private acreages, church picnic grounds, community gathering spaces, and residential properties throughout the Bithlo area."
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      faqs={[
        {
          question: "Do you really deliver all the way to Bithlo?",
          answer: "Absolutely! Bithlo is within our delivery area and we're happy to serve the Bithlo community. Delivery is free for all Bithlo customers."
        },
        {
          question: "What large inflatables do you recommend for Bithlo properties?",
          answer: "With Bithlo's larger lots, you can go big! We recommend our mega obstacle courses, 22-foot water slides, and large combo units. These are often too big for suburban yards but perfect for Bithlo properties."
        },
        {
          question: "Can you set up on uneven terrain in Bithlo?",
          answer: "Our team is experienced with rural setups. While we need relatively flat ground, we can work with minor variations. We'll assess your property during delivery and find the best spot."
        },
        {
          question: "What power source do I need for inflatables in Bithlo?",
          answer: "Our inflatables require a standard 110V outlet within 100 feet. If you're setting up far from your home, we can provide generator rentals to power the blower."
        },
        {
          question: "Are your inflatables safe for outdoor Bithlo events?",
          answer: "Yes! All our inflatables are commercial-grade and designed for outdoor use. We use heavy-duty stakes to secure units on grass and provide complete safety instructions."
        },
        {
          question: "What if I live on a dirt road in Bithlo?",
          answer: "No problem! Our delivery trucks can handle dirt and gravel roads. Just let us know when booking so we can plan accordingly and ensure on-time arrival."
        }
      ]}
    />
  );
};

export default Bithlo;
