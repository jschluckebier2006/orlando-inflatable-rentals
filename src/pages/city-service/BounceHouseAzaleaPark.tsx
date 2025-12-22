import { CityServicePage } from "@/components/templates/CityServicePage";

export default function BounceHouseRentalsAzaleaPark() {
  return (
    <CityServicePage
      city="Azalea Park"
      citySlug="azalea-park"
      serviceType="bounce-house"
      nearbyAreas={[
        { name: "Eastwood", slug: "eastwood" },
        { name: "Bithlo", slug: "bithlo" },
        { name: "Waterford Lakes", slug: "waterford-lakes" },
      ]}
      localContent={{
        intro: "Orlando Inflatables proudly serves the diverse Azalea Park community with affordable, quality bounce house rentals. Whether you're planning a birthday party, quinceañera, family reunion, or community celebration, our bounce houses bring joy and excitement to Azalea Park events of all sizes.",
        about: "Azalea Park is an established East Orlando community known for its welcoming atmosphere and diverse population. Located just east of downtown Orlando, Azalea Park offers families an affordable place to live with convenient access to employment, shopping, and entertainment. The neighborhood's strong community bonds mean there are always celebrations happening, from birthday parties to cultural festivals.",
        whyChoose: "We believe every family deserves access to quality party entertainment, which is why we offer competitive pricing without compromising on safety or cleanliness. Azalea Park families trust Orlando Inflatables because we provide reliable service, clean equipment, and fair prices that fit their budgets.",
        events: "Azalea Park celebrates life's milestones with enthusiasm! Our bounce houses are popular at birthday parties, graduation celebrations, quinceañeras, and family gatherings throughout the community. We understand the importance of these celebrations and take pride in helping Azalea Park families create lasting memories.",
      }}
    />
  );
}
