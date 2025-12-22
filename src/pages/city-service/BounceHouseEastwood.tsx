import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsEastwood() {
  return (
    <CityServicePage
      city="Eastwood"
      citySlug="eastwood"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Azalea Park", slug: "azalea-park" },
        { name: "Alafaya", slug: "alafaya" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
      ]}
      localContent={{
        intro: "Orlando Inflatables serves the Eastwood community with quality, affordable bounce house rentals. Whether you're planning a birthday party, block party, or community event in Eastwood, our bounce houses bring hours of entertainment for guests of all ages.",
        about: "Eastwood is an established neighborhood in East Orlando known for its convenient location and diverse community. The area offers affordable housing options with easy access to major roads, shopping, and employment centers. Eastwood families are known for coming together to celebrate life's milestones, making bounce houses a popular choice for parties.",
        whyChoose: "Eastwood families choose Orlando Inflatables for reliable service and fair prices. We believe every family deserves quality party entertainment, and we're committed to making bounce house fun accessible to the Eastwood community. Our clean, safe inflatables and professional delivery make party planning easy.",
        events: "From backyard birthday parties to neighborhood block parties, Eastwood knows how to celebrate! Our bounce houses are a hit at all types of events in the community. We've served many Eastwood families and take pride in helping create memorable celebrations.",
      }}
    />
  );
}
