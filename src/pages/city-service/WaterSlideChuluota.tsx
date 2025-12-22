import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsChuluota() {
  return (
    <CityServicePage
      city="Chuluota"
      citySlug="chuluota"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Bithlo", slug: "bithlo" },
        { name: "Wedgefield", slug: "wedgefield" },
      ]}
      localContent={{
        intro: "Cool off at your next Chuluota celebration with a water slide rental from Orlando Inflatables! Chuluota's spacious rural properties are ideal for our exciting water slides, providing plenty of room for splashing fun at birthday parties, summer gatherings, and family celebrations.",
        about: "Chuluota's rural character means larger lots and more space for water slide fun! The community's peaceful atmosphere and family-oriented neighborhoods make it a wonderful place to host summer parties. When the Florida heat kicks in, Chuluota families love to cool down with our refreshing water slides.",
        whyChoose: "With bigger properties come bigger possibilities! Chuluota residents can choose from our largest water slides, creating water park-style fun right in their backyards. We deliver throughout Chuluota and ensure your slide is properly set up with adequate water supply and safe operation.",
        events: "Summer in Chuluota is water slide season! Our slides are perfect for birthday parties, Fourth of July celebrations, graduation parties, and any hot-weather gathering. Take advantage of your property's space and create an unforgettable splash zone for your guests!",
      }}
    />
  );
}
