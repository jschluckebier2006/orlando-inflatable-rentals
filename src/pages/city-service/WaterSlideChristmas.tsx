import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsChristmas() {
  return (
    <CityServicePage
      city="Christmas"
      citySlug="christmas"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Bithlo", slug: "bithlo" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
      ]}
      localContent={{
        intro: "Make a splash in Christmas, FL with an exciting water slide rental! Orlando Inflatables delivers water slides to this uniquely named community, perfect for beating the Florida heat at birthday parties, summer celebrations, and family gatherings. Who says Christmas can't be a splash?",
        about: "Christmas, Florida may have a wintry name, but it experiences plenty of hot Florida sunshine! The community's rural properties and country atmosphere make it perfect for water slide fun. Residents enjoy spacious lots where our water slides can be set up with plenty of room for splashing and playing.",
        whyChoose: "Christmas's larger properties mean you can choose from our biggest water slides for maximum fun! We deliver throughout the Christmas area and ensure your slide is set up safely with proper water supply. Our team knows the area and will get your water slide ready for an unforgettable party.",
        events: "Summer in Christmas (the town, not the holiday!) is perfect for water slide parties. Whether you're celebrating a birthday, hosting a summer cookout, or just want to cool down with friends and family, our water slides deliver refreshing fun in Florida's most festively named community.",
      }}
    />
  );
}
