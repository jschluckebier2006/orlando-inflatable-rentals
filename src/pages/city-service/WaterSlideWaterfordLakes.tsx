import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsWaterfordLakes() {
  return (
    <CityServicePage
      city="Waterford Lakes"
      citySlug="waterford-lakes"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Stoneybrook", slug: "stoneybrook" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      localContent={{
        intro: "Beat the Florida heat with an exciting water slide rental in Waterford Lakes! Orlando Inflatables delivers premium water slides to this vibrant East Orlando community, perfect for summer birthday parties, pool parties, and hot-weather celebrations.",
        about: "Waterford Lakes' location in East Orlando means hot, sunny weather for much of the year – perfect conditions for water slide fun! The community's beautiful homes and well-maintained yards provide excellent settings for our water slides. Waterford Lakes families love to entertain, and a water slide party is always a hit with guests of all ages.",
        whyChoose: "Waterford Lakes residents expect the best, and our water slides deliver! We offer the area's most exciting selection of inflatable water slides, professionally cleaned and maintained. Our delivery team knows Waterford Lakes inside and out, ensuring on-time arrival and proper setup.",
        events: "Summer in Waterford Lakes is water slide season! Our slides are extremely popular for birthday parties, graduation celebrations, and neighborhood gatherings. The community's active families book our water slides throughout the warm months – reserve early to ensure availability for your date!",
      }}
    />
  );
}
