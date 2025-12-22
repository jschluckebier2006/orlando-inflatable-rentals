import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsBithlo() {
  return (
    <CityServicePage
      city="Bithlo"
      citySlug="bithlo"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
      ]}
      localContent={{
        intro: "Orlando Inflatables delivers bounce house rentals to Bithlo, Florida, bringing party fun to this rural East Orange County community. Bithlo's spacious properties are perfect for our larger bounce houses and combo units, giving your guests plenty of room to bounce, jump, and play.",
        about: "Bithlo is a rural community in eastern Orange County along State Road 50, known for its country atmosphere and larger properties. The area maintains a close-knit community feel while offering residents more space than typical suburban neighborhoods. Bithlo's outdoor lifestyle and spacious lots make it an ideal location for bounce house parties where kids can spread out and enjoy.",
        whyChoose: "Bithlo's rural setting means families often have more space for party rentals, and we love delivering to properties where we can set up our biggest and best inflatables. Our delivery team is experienced with country roads and ensures your bounce house arrives safely and on time, no matter where you're located in Bithlo.",
        events: "Bithlo families celebrate in style with our bounce houses! Birthday parties, family reunions, church gatherings, and neighborhood events are all enhanced with a colorful bounce house. Take advantage of your property's space and create an unforgettable party experience for your guests.",
      }}
    />
  );
}
