import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsChristmas() {
  return (
    <CityServicePage
      city="Christmas"
      citySlug="christmas"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Bithlo", slug: "bithlo" },
        { name: "Chuluota", slug: "chuluota" },
        { name: "Wedgefield", slug: "wedgefield" },
      ]}
      localContent={{
        intro: "Celebrate in Florida's most festive community with a bounce house rental in Christmas, FL! Orlando Inflatables delivers premium bounce houses to Christmas and surrounding areas, adding extra fun to every celebration in this uniquely named community. Every party feels special when you're in Christmas!",
        about: "Christmas, Florida is famous for its year-round holiday spirit and unique name. The community is home to Fort Christmas Historical Park and the beloved Christmas Post Office, where people worldwide send their holiday mail for that special postmark. Beyond its festive name, Christmas offers rural Florida living with spacious properties and a strong sense of community.",
        whyChoose: "Living in Christmas means every celebration has a little extra magic, and our bounce houses add to that spirit! We deliver to Christmas and understand the area's rural character. Our team ensures your bounce house is set up properly on your property, ready for a party that matches Christmas's festive atmosphere.",
        events: "From summer birthdays to actual Christmas celebrations, every party in Christmas, FL is special! Our bounce houses are popular for birthday parties, holiday gatherings, community events at Fort Christmas Park, and family celebrations. Let us help make your Christmas celebration even more memorable!",
      }}
    />
  );
}
