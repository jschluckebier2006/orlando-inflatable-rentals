import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsEastwood() {
  return (
    <CityServicePage
      city="Eastwood"
      citySlug="eastwood"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Azalea Park", slug: "azalea-park" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
      ]}
      localContent={{
        intro: "Beat the heat at your next Eastwood event with an affordable water slide rental from Orlando Inflatables! Our water slides bring refreshing summer fun to Eastwood birthday parties, family gatherings, and neighborhood celebrations.",
        about: "Eastwood's location in East Orlando means plenty of hot, sunny days perfect for water slide fun. The community's established neighborhoods and family-friendly atmosphere make it a great place to host summer parties. Eastwood families appreciate quality entertainment at reasonable prices, which is exactly what our water slides provide.",
        whyChoose: "We offer Eastwood families quality water slide rentals at prices that fit their budgets. Our slides are professionally cleaned, safely maintained, and delivered by a friendly team. We're committed to making water slide fun accessible to every Eastwood family.",
        events: "Summer parties in Eastwood are better with a water slide! Whether it's a birthday celebration, family reunion, or neighborhood cookout, our water slides keep guests cool and entertained. We've proudly served many Eastwood families and look forward to serving yours!",
      }}
    />
  );
}
