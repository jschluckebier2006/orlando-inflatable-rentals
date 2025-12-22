import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsAlafaya() {
  return (
    <CityServicePage
      city="Alafaya"
      citySlug="alafaya"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Stoneybrook", slug: "stoneybrook" },
      ]}
      localContent={{
        intro: "Looking for bounce house rentals in Alafaya, Florida? You've come to the right place! Orlando Inflatables delivers premium bounce houses throughout the Alafaya community, from neighborhoods near UCF to the growing developments along Innovation Way. Our bounce houses bring smiles to kids' faces and create lasting memories at birthday parties, graduation celebrations, and family gatherings.",
        about: "Alafaya is one of East Orlando's most dynamic communities, located near the University of Central Florida. The area has experienced tremendous growth and is home to thousands of families, students, and young professionals. With its excellent schools, convenient location, and family-friendly neighborhoods, Alafaya is the perfect place to host a bounce house party. The community's mix of established neighborhoods and new developments means there are plenty of backyard celebrations happening every weekend.",
        whyChoose: "Alafaya families choose Orlando Inflatables because we understand the local community. Whether you're near the UCF campus, in the Research Park corridor, or in one of the many residential neighborhoods along Alafaya Trail, we know how to get your bounce house delivered safely and on time.",
        events: "Alafaya hosts countless celebrations throughout the year – UCF tailgate parties, student apartment gatherings, family birthday parties in suburban backyards, and community events at local parks. Our bounce houses are perfect for all of these occasions, providing safe, clean fun for guests of all ages.",
      }}
    />
  );
}
