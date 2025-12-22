import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsAvalonPark() {
  return (
    <CityServicePage
      city="Avalon Park"
      citySlug="avalon-park"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Alafaya", slug: "alafaya" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Stoneybrook", slug: "stoneybrook" },
      ]}
      localContent={{
        intro: "Avalon Park is one of East Orlando's premier family communities, and Orlando Inflatables is proud to be the go-to bounce house rental company for Avalon Park families. Our premium bounce houses are perfect for birthday parties in beautiful Avalon Park backyards, community events at Downtown Avalon Park, and celebrations throughout this charming New Urbanism neighborhood.",
        about: "Avalon Park is a master-planned community designed with New Urbanism principles, featuring tree-lined streets, walkable neighborhoods, and a vibrant downtown area. The community is known for its strong sense of neighborhood, excellent schools, and family-focused amenities. Avalon Park residents take pride in their homes and love to celebrate with style – making bounce house parties a popular choice.",
        whyChoose: "Avalon Park families expect quality, and that's exactly what we deliver. Our bounce houses are meticulously cleaned, carefully maintained, and delivered by a team that knows Avalon Park's villages inside and out. We're familiar with the community's layout and can navigate to any address quickly and efficiently.",
        events: "Avalon Park's community spirit means there's always a celebration happening! From birthday parties in spacious backyards to events at the Downtown Avalon Park pavilion, our bounce houses add excitement to every occasion. The neighborhood's active families appreciate our reliable service and premium equipment.",
      }}
    />
  );
}
