import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsStoneybrook() {
  return (
    <CityServicePage
      city="Stoneybrook"
      citySlug="stoneybrook"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      localContent={{
        intro: "Make a splash at your next Stoneybrook party with a premium water slide rental from Orlando Inflatables! Stoneybrook's beautiful homes and spacious backyards are perfect settings for our exciting water slides, providing refreshing summer fun for guests of all ages.",
        about: "Stoneybrook's family-oriented atmosphere and well-maintained properties make it an ideal community for water slide parties. The neighborhood's engaged residents love to celebrate, and our water slides are a favorite for summer birthdays, pool parties, and hot-weather gatherings. Stoneybrook's spacious yards accommodate our various slide sizes perfectly.",
        whyChoose: "Stoneybrook families appreciate quality, and our water slides deliver! We provide clean, safe, exciting slides that meet the community's high standards. Our delivery team knows Stoneybrook well and ensures your water slide is set up properly for maximum fun and safety.",
        events: "Summer in Stoneybrook means water slide season! Our slides are popular for birthday parties, end-of-school celebrations, Fourth of July gatherings, and neighborhood pool parties. The community's beautiful backyards provide the perfect backdrop for splashing fun!",
      }}
    />
  );
}
