import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you really deliver bounce houses all the way to Bithlo?",
    answer: "Absolutely! Bithlo is part of our core East Orange County service area. We provide free delivery, setup, and pickup to all Bithlo properties. Our team is experienced with rural routes and country roads.",
  },
  {
    question: "What large inflatables work best on Bithlo's bigger properties?",
    answer: "Bithlo's spacious lots are perfect for our largest equipment! We recommend mega obstacle courses, 22-foot water slides, and large combo units that are often too big for suburban yards. Take advantage of your space and go big!",
  },
  {
    question: "How much does it cost to rent a bounce house in Bithlo?",
    answer: "Bounce house rentals in Bithlo start at $199 for a full-day rental. Larger units and water slides may cost more. All prices include free delivery to Bithlo—no extra mileage fees for our rural customers.",
  },
  {
    question: "Can you set up on uneven or sloped terrain in Bithlo?",
    answer: "Our team is experienced with rural property setups. While we need relatively flat ground for safe operation, we can work with minor terrain variations. We'll assess your property on arrival and find the ideal spot.",
  },
  {
    question: "What if I live on a dirt road in Bithlo?",
    answer: "No problem at all! Our delivery trucks can handle dirt roads, gravel driveways, and rural access routes. Just let us know when booking so we can plan accordingly and ensure on-time arrival.",
  },
  {
    question: "What power source do I need for inflatables in Bithlo?",
    answer: "Each inflatable requires a standard 110V outlet within 100 feet. If you're setting up far from your home or don't have nearby power, we offer generator rentals to keep everything running perfectly.",
  },
  {
    question: "Do you serve Bithlo church and community events?",
    answer: "Yes! We love serving Bithlo's churches, community groups, and family gatherings. We've set up at church picnics, community fundraisers, and large family reunions throughout the Bithlo area.",
  },
  {
    question: "How far in advance should Bithlo residents book?",
    answer: "We recommend booking 1-2 weeks ahead for weekends. Bithlo's larger properties are great for our biggest inflatables, which are popular and book quickly during peak season. Call early for the best selection!",
  },
];

// Custom sections for Bithlo FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Bithlo, FL with Reliable Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly delivers bounce house and water slide rentals throughout Bithlo, Florida. Our team regularly serves this rural East Orange County community and understands larger properties, open land setups, and flexible event layouts common in the area.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Bithlo Community Park, Corner Lake Middle School, and residential properties throughout the Bithlo and surrounding East Orange County area.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Bithlo Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>Larger yards and open property layouts</strong></li>
        <li>• <strong>Grass and dirt surface setup considerations</strong></li>
        <li>• <strong>Power access planning for rural locations</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        This local experience allows us to provide smooth delivery, proper setup, and stress-free events.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Bithlo
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common reasons families in Bithlo rent bounce houses. With larger yards and open spaces, many customers choose bigger inflatables or combo units that give kids more room to play.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Bithlo Families Choose Orlando Inflatables Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Units work well for large properties and outdoor setups</li>
        <li>• We help match inflatables to guest count and age range</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many customers pair{" "}
        <Link to="/bounce-house-rentals" className="text-primary hover:underline font-semibold">
          bounce house rentals
        </Link>{" "}
        with water slide rentals for all-day entertainment during warm Florida weather.
      </p>
    </>
  );
}

function WaterSlideSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Water Slide Rentals for Bithlo Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Bithlo during spring and summer months. Larger properties make it easy to add big water slides to birthday parties, family reunions, and weekend gatherings.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular Uses for Bithlo Water Slide Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Summer birthday parties</li>
        <li>• Holiday weekend celebrations</li>
        <li>• Family reunions and outdoor cookouts</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Each rental includes professional setup and safety guidance so families can enjoy worry-free fun.
      </p>
    </>
  );
}

function CommunityEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        School, Church & Community Event Rentals in Bithlo
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools, churches, and community groups in Bithlo often rely on inflatables for festivals, fundraisers, and family events. Orlando Inflatables provides dependable, commercial-grade equipment that works well for both small gatherings and larger{" "}
        <Link to="/events/church-events" className="text-primary hover:underline font-semibold">
          community celebrations
        </Link>.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular Event Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle courses</Link> for friendly competition</li>
        <li>• <Link to="/bounce-slide-combo-rentals" className="text-primary hover:underline">Bounce house and slide combos</Link></li>
        <li>• <Link to="/interactive-game-rentals" className="text-primary hover:underline">Interactive inflatable games</Link> for all ages</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Our team helps organizers plan layout, spacing, and timing so events run smoothly from setup to pickup.
      </p>
    </>
  );
}

function RentalDayExpectationsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        What to Expect When Renting in Bithlo, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you rent from Orlando Inflatables in Bithlo, you can expect a straightforward, organized rental process:
      </p>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>On-time delivery</strong> within your scheduled window</li>
        <li>• <strong>Professional setup</strong> and secure anchoring</li>
        <li>• <strong>Clear safety instructions</strong> before use</li>
        <li>• <strong>Hassle-free pickup</strong> after your event</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We help confirm space requirements, surface type, and power access ahead of time so everything runs smoothly on event day.
      </p>
    </>
  );
}

function ExploreMoreSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Explore More Party Rental Options Near Bithlo, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Bithlo event? Explore our full selection of party rentals and find exactly what you need for your celebration.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Rental Categories:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <Link to="/bounce-house-rentals" className="text-primary hover:underline">Affordable Bounce House Rentals</Link></li>
            <li>• <Link to="/water-slide-rentals" className="text-primary hover:underline">Water Slide Rentals Near Orlando</Link></li>
            <li>• <Link to="/bounce-slide-combo-rentals" className="text-primary hover:underline">Bounce & Slide Combo Rentals</Link></li>
            <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle Course Rentals</Link></li>
            <li>• <Link to="/interactive-game-rentals" className="text-primary hover:underline">Interactive Game Rentals</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground mb-3">Event Types:</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <Link to="/events/birthday-parties" className="text-primary hover:underline">Birthday Party Rentals</Link></li>
            <li>• <Link to="/events/school-events" className="text-primary hover:underline">School Event Rentals</Link></li>
            <li>• <Link to="/events/church-events" className="text-primary hover:underline">Church Event Rentals</Link></li>
            <li>• <Link to="/events/corporate-events" className="text-primary hover:underline">Corporate Event Rentals</Link></li>
          </ul>
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-3">Nearby Areas We Serve:</h3>
      <p className="text-muted-foreground leading-relaxed">
        We also deliver{" "}
        <Link to="/water-slide-and-bounce-house-rental-christmas" className="text-primary hover:underline">party rentals to Christmas</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-wedgefield" className="text-primary hover:underline">Wedgefield</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-chuluota" className="text-primary hover:underline">Chuluota</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-alafaya" className="text-primary hover:underline">Alafaya</Link>, and throughout the greater Orlando area. Check out our{" "}
        <Link to="/delivery-area" className="text-primary hover:underline">full delivery area</Link> for more locations.
      </p>
    </>
  );
}

function BookNowSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Book Party Rentals in Bithlo, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families and organizations throughout Bithlo, Florida with clean, reliable party rental equipment. Whether you're planning a backyard birthday party, church event, or community celebration, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Bithlo, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Bithlo Event Unforgettable?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onOpenForm}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground btn-bounce"
          >
            Get a Free Quote Today
          </Button>
          <a href="tel:4074971840">
            <Button
              variant="outline"
              size="lg"
              className="btn-bounce w-full"
            >
              Call (407) 497-1840
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}

export default function BithloDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  const customSections = [
    { id: "local-delivery", content: <LocalDeliverySection /> },
    { id: "birthday-party", content: <BirthdayPartySection /> },
    { id: "water-slide", content: <WaterSlideSection /> },
    { id: "community-events", content: <CommunityEventsSection /> },
    { id: "rental-day", content: <RentalDayExpectationsSection /> },
    { id: "explore-more", content: <ExploreMoreSection /> },
    { id: "book-now", content: <BookNowSection onOpenForm={() => setShowJotform(true)} /> },
  ];

  return (
    <>
      <CityDeliveryPage
        cityName="Bithlo"
        citySlug="bithlo"
        metaTitle="Bounce House & Water Slide Rentals Bithlo FL | Orlando Inflatables"
        metaDescription="Bounce house & water slide rentals in Bithlo FL. Large inflatables for spacious country properties. Free delivery on rural routes! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Bithlo,_Florida"
        cityDescription="Welcome to Bithlo, where country living meets Florida sunshine! This unincorporated community in eastern Orange County offers the space and freedom that make outdoor celebrations truly special. Bithlo's larger properties are ideal for our biggest bounce houses, tallest water slides, and most exciting obstacle courses. If you've got the space, we've got the inflatables to fill it with fun!"
        additionalCityInfo="Bithlo is an unincorporated community located along State Road 50 between Orlando and Christmas. The area has a rich history dating back to the early 20th century and maintains its rural, country character that distinguishes it from more developed areas of Orange County. Residents enjoy larger lots, agricultural properties, and a peaceful lifestyle while remaining within reach of Orlando's amenities. The community's outdoor-oriented culture makes it perfect for big celebrations under the Florida sky."
        localLandmarks="Bithlo's spacious properties and outdoor lifestyle make it ideal for large inflatables that need room to shine. We regularly set up at private acreages with plenty of yard space, church picnic grounds for community gatherings, family properties hosting reunions and celebrations, community event spaces, and residential lots along Bithlo's country roads. Whether you're on a multi-acre spread or a generous residential lot, we'll bring the party to you."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
