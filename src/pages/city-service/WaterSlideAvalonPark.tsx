import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsAvalonPark() {
  return (
    <CityServicePage
      city="Avalon Park"
      citySlug="avalon-park"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Alafaya", slug: "alafaya" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Stoneybrook", slug: "stoneybrook" },
      ]}
      localContent={{
        intro: "Make a splash at your next Avalon Park party with a water slide rental from Orlando Inflatables! Our inflatable water slides are the ultimate summer entertainment for Avalon Park families, turning ordinary birthday parties and backyard gatherings into extraordinary splash-filled celebrations.",
        about: "Avalon Park's beautiful homes and well-maintained yards provide the perfect setting for water slide rentals. The community's family-oriented atmosphere means there are always birthday parties, summer celebrations, and neighborhood gatherings where a water slide would be the star attraction. Avalon Park's New Urbanism design creates close-knit neighborhoods where kids love to gather and play.",
        whyChoose: "Avalon Park families expect the best, and our water slides deliver! We provide clean, safe, and exciting water slides that meet the community's high standards. Our delivery team knows Avalon Park well and ensures your water slide is set up properly in your backyard, ready for hours of splashing fun.",
        events: "Summer in Avalon Park is perfect for water slide parties! Whether you're celebrating a birthday, hosting a pool party, or throwing a neighborhood gathering, our water slides keep guests cool and entertained. The community's spacious backyards are ideal for our various water slide sizes and styles.",
      }}
    />
  );
}
