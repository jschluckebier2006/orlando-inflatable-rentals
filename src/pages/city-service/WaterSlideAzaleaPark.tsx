import { CityServicePage } from "@/components/templates/CityServicePage";

export default function WaterSlideRentalsAzaleaPark() {
  return (
    <CityServicePage
      city="Azalea Park"
      citySlug="azalea-park"
      serviceType="water-slide"
      nearbyAreas={[
        { name: "Eastwood", slug: "eastwood" },
        { name: "Bithlo", slug: "bithlo" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
      ]}
      localContent={{
        intro: "Cool off at your next Azalea Park celebration with a water slide rental from Orlando Inflatables! Our affordable water slides are perfect for summer birthday parties, backyard gatherings, and hot-weather events in the Azalea Park community.",
        about: "Azalea Park's Central Florida location means plenty of hot, sunny days perfect for water slide fun. The community's diverse families love to celebrate outdoors, and a water slide adds the perfect cooling element to any summer party. With affordable housing and family-friendly neighborhoods, Azalea Park is home to many growing families who appreciate quality entertainment at reasonable prices.",
        whyChoose: "Azalea Park families choose our water slides because we offer the best value in East Orlando. Our slides are professionally cleaned, safely maintained, and delivered by a friendly team that treats every customer like family. We offer competitive pricing that makes water slide fun accessible to everyone.",
        events: "Summer parties in Azalea Park are better with a water slide! Whether it's a birthday celebration, family reunion, or neighborhood cookout, our water slides keep guests of all ages cool and entertained. We've served countless Azalea Park families and look forward to serving yours!",
      }}
    />
  );
}
