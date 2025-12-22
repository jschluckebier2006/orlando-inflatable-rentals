import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsWedgefield() {
  return (
    <CityServicePage
      city="Wedgefield"
      citySlug="wedgefield"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Bithlo", slug: "bithlo" },
        { name: "Chuluota", slug: "chuluota" },
      ]}
      localContent={{
        intro: "Make a splash at your next Wedgefield party with an exciting water slide rental! Orlando Inflatables delivers premium water slides to this beautiful golf course community, perfect for summer celebrations on Wedgefield's spacious properties.",
        about: "Wedgefield's location in East Orange County means plenty of hot Florida sunshine – ideal weather for water slide fun! The community's larger lots, many with golf course views, provide excellent settings for our water slides. Wedgefield families appreciate quality entertainment, and our water slides deliver the excitement your guests are looking for.",
        whyChoose: "With Wedgefield's larger properties, you can choose from our biggest and most exciting water slides! We deliver throughout Wedgefield and ensure proper setup with adequate water supply and safe anchoring. Our team knows the community and will have your water slide ready for an unforgettable party.",
        events: "Summer in Wedgefield is perfect for water slide parties! Whether you're celebrating a birthday, hosting a golf outing after-party, or throwing a neighborhood gathering, our water slides keep guests cool and entertained. Take advantage of your property's space for maximum splash-filled fun!",
      }}
    />
  );
}
