import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsWedgefield() {
  return (
    <CityServicePage
      city="Wedgefield"
      citySlug="wedgefield"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Bithlo", slug: "bithlo" },
        { name: "Chuluota", slug: "chuluota" },
      ]}
      localContent={{
        intro: "Orlando Inflatables delivers premium bounce house rentals to Wedgefield, Florida's beautiful golf course community. Wedgefield's larger lots and family-oriented atmosphere make it perfect for bounce house parties, and we're proud to serve this peaceful East Orange County neighborhood.",
        about: "Wedgefield is a census-designated place centered around the Wedgefield Golf & Country Club. The community is known for its peaceful atmosphere, spacious properties (many with golf course views), and strong sense of neighborhood. Families choose Wedgefield for its quality of life and access to recreational amenities, making it a wonderful place to host memorable celebrations.",
        whyChoose: "Wedgefield's larger properties mean more room for party fun! Our bounce houses fit perfectly on Wedgefield lots, and our delivery team is familiar with the community's layout. We provide the same professional service to Wedgefield that has made us East Orlando's trusted party rental company.",
        events: "Wedgefield families celebrate in style! Birthday parties, graduation celebrations, and family reunions are all enhanced with our colorful bounce houses. The community's spacious yards allow for larger inflatables or even multiple units for a complete carnival experience.",
      }}
    />
  );
}
