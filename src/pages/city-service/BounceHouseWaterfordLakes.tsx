import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsWaterfordLakes() {
  return (
    <CityServicePage
      city="Waterford Lakes"
      citySlug="waterford-lakes"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Stoneybrook", slug: "stoneybrook" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      localContent={{
        intro: "Orlando Inflatables is the premier bounce house rental company for Waterford Lakes, one of East Orlando's most vibrant communities. Located near the bustling Waterford Lakes Town Center, this area is home to thousands of families who love to celebrate – and our bounce houses are the entertainment of choice!",
        about: "Waterford Lakes is a thriving census-designated place in Orange County, anchored by the Waterford Lakes Town Center shopping destination. The community has grown rapidly since the 1990s and is now home to diverse families who appreciate the area's excellent schools, abundant amenities, and convenient location. Waterford Lakes residents take pride in their homes and love hosting memorable parties.",
        whyChoose: "Waterford Lakes families choose Orlando Inflatables because we understand their community. We know the neighborhoods, navigate the streets efficiently, and deliver the premium service that Waterford Lakes residents expect. Our bounce houses are the cleanest, safest, and most fun in East Orlando!",
        events: "Waterford Lakes hosts countless celebrations! From birthday parties in beautiful backyards to community events at local parks, our bounce houses are a popular choice. The neighborhood's active families appreciate our reliable service and wide selection of themed inflatables.",
      }}
    />
  );
}
