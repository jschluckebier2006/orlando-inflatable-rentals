import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsBithlo() {
  return (
    <CityServicePage
      city="Bithlo"
      citySlug="bithlo"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Christmas", slug: "christmas" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
      ]}
      localContent={{
        intro: "Make a splash in Bithlo with a water slide rental from Orlando Inflatables! Bithlo's larger properties are perfect for our biggest water slides, giving your guests the ultimate summer party experience. Beat the Florida heat with exciting water slide fun delivered right to your Bithlo property.",
        about: "Bithlo's rural character and spacious lots make it an ideal location for water slide rentals. Unlike smaller suburban yards, many Bithlo properties have room for our largest slides – the ones that deliver the biggest thrills! The community's outdoor lifestyle means residents appreciate entertainment that takes advantage of Florida's beautiful weather.",
        whyChoose: "With more space to work with, Bithlo families can go big with their water slide selection! We offer delivery throughout Bithlo and understand the area's country roads. Our team ensures your water slide is properly set up with adequate water supply and safe anchoring.",
        events: "Summer in Bithlo calls for water slide fun! Our slides are perfect for birthday parties, Fourth of July celebrations, family reunions, and any hot-weather gathering. Take advantage of your property's space and give your guests an experience they'll remember!",
      }}
    />
  );
}
