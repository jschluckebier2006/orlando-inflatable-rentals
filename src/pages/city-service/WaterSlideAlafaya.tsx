import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsAlafaya() {
  return (
    <CityServicePage
      city="Alafaya"
      citySlug="alafaya"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Stoneybrook", slug: "stoneybrook" },
      ]}
      localContent={{
        intro: "Beat the Florida heat with a water slide rental in Alafaya! Orlando Inflatables delivers exciting inflatable water slides throughout the Alafaya community, perfect for summer birthday parties, pool parties, and hot-weather celebrations. Our water slides bring the excitement of a water park right to your Alafaya backyard.",
        about: "Alafaya's location in East Orlando means hot, sunny days are the norm for much of the year. The community's family-friendly neighborhoods, many with spacious backyards, are ideal for water slide rentals. Whether you're near UCF, in the Research Park area, or in one of the many residential subdivisions, a water slide party is the perfect way to cool down and have fun.",
        whyChoose: "Alafaya residents love our water slides because they transform ordinary backyard parties into extraordinary splash events. Our slides are perfect for the Florida climate, and we know the Alafaya area well enough to ensure on-time delivery and professional setup every time.",
        events: "Summer in Alafaya calls for water slide fun! Our slides are popular for birthday parties, end-of-school celebrations, graduation parties, and neighborhood cookouts. UCF families especially love our water slides for hot-weather gatherings that need extra cooling entertainment.",
      }}
    />
  );
}
