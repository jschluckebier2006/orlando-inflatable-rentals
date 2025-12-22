import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsStoneybrook() {
  return (
    <CityServicePage
      city="Stoneybrook"
      citySlug="stoneybrook"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Avalon Park", slug: "avalon-park" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
        { name: "Alafaya", slug: "alafaya" },
      ]}
      localContent={{
        intro: "Orlando Inflatables is the trusted bounce house rental company for Stoneybrook families. This family-oriented East Orlando community is home to countless birthday parties, graduation celebrations, and neighborhood gatherings – and our bounce houses are a favorite entertainment choice.",
        about: "Stoneybrook is a master-planned community in East Orlando known for its beautiful homes, well-maintained common areas, and active community life. Families choose Stoneybrook for its excellent schools, community amenities, and family-friendly atmosphere. The neighborhood's spacious yards and engaged residents make it a perfect community for bounce house parties.",
        whyChoose: "Stoneybrook families expect quality, and we deliver. Our bounce houses are meticulously maintained, thoroughly cleaned, and delivered by a professional team familiar with the Stoneybrook community. We understand the community's standards and take pride in exceeding them.",
        events: "Stoneybrook's active community means there's always a celebration happening! Our bounce houses are popular at birthday parties, holiday gatherings, neighborhood events, and HOA-sponsored functions. The community's beautiful homes and manicured yards provide perfect settings for our colorful inflatables.",
      }}
    />
  );
}
