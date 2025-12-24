import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver bounce houses to Wedgefield?",
    answer: "Yes! Wedgefield is within our delivery area and we provide free delivery, setup, and pickup to all Wedgefield residents. Our team is familiar with the golf course community and surrounding areas.",
  },
  {
    question: "How much does it cost to rent a bounce house in Wedgefield?",
    answer: "Bounce house rentals in Wedgefield start at $199 for a full-day rental. With Wedgefield's larger lots, many families opt for our bigger units. All prices include free delivery—no extra fees.",
  },
  {
    question: "What large inflatables work well on Wedgefield properties?",
    answer: "Wedgefield's spacious lots are perfect for our mega obstacle courses, tall water slides, and large combo units. Take advantage of your yard space and go big—these are the inflatables suburban yards can't fit!",
  },
  {
    question: "Can you set up near the golf course?",
    answer: "We can set up in your backyard even if it borders the Wedgefield Golf Course. We position inflatables away from course areas with proper staking. Your golf course view makes a beautiful party backdrop!",
  },
  {
    question: "Do you serve events at Wedgefield Golf & Country Club?",
    answer: "If you're hosting an event at the club, we can coordinate with management for setup requirements. Private residence parties are also very popular in Wedgefield—easy to arrange with more flexibility.",
  },
  {
    question: "What events do you serve in Wedgefield?",
    answer: "We serve all types of Wedgefield celebrations—birthday parties, graduation events, family reunions, holiday gatherings, golf tournament after-parties, and neighborhood block parties. Whatever you're celebrating!",
  },
  {
    question: "How far in advance should Wedgefield residents book?",
    answer: "We recommend 1-2 weeks ahead, especially for weekends. Wedgefield is popular for our larger inflatables, which book quickly during peak party season. Early booking ensures the best selection.",
  },
  {
    question: "What power source do I need for inflatables in Wedgefield?",
    answer: "Each inflatable requires a standard 110V outlet within 100 feet. Wedgefield's larger properties sometimes require longer runs—let us know and we can discuss generator rental options if needed.",
  },
];

// Custom sections for Wedgefield FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Wedgefield, FL with Reliable Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly delivers bounce house and water slide rentals throughout Wedgefield, Florida. Our team regularly serves this spacious East Orange County community and understands large properties, open land setups, and outdoor-friendly events common in the area.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Wedgefield Golf Club, Wedgefield K‑8 School, and residential properties throughout Wedgefield and surrounding rural neighborhoods.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Wedgefield Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>Large yards and open property layouts</strong></li>
        <li>• <strong>Grass and natural surface setup considerations</strong></li>
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
        Birthday Party Bounce House Rentals in Wedgefield
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common reasons families in Wedgefield rent bounce houses. With larger lots and outdoor space, many customers choose bigger inflatables or combo units that give kids room to play.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Wedgefield Families Choose Orlando Inflatables Because:
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
        Water Slide Rentals for Wedgefield Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Wedgefield during spring and summer months. Larger properties make it easy to add big water slides to birthday parties, family reunions, and weekend gatherings.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular Uses for Wedgefield Water Slide Rentals Include:
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
        School, Church & Community Event Rentals in Wedgefield
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools, churches, and community groups in Wedgefield often rely on inflatables for festivals, fundraisers, and family events. Orlando Inflatables provides dependable, commercial-grade equipment that works well for both small gatherings and larger{" "}
        <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
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
        What to Expect When Renting in Wedgefield, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you rent from Orlando Inflatables in Wedgefield, you can expect a simple and organized rental process:
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
        Explore More Party Rental Options Near Wedgefield, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Wedgefield event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
            <li>• <Link to="/events/birthday-party-inflatable-rentals-in-orlando" className="text-primary hover:underline">Birthday Party Rentals</Link></li>
            <li>• <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline">School Event Rentals</Link></li>
            <li>• <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline">Church Event Rentals</Link></li>
            <li>• <Link to="/events/corporate-event-inflatable-rentals-in-orlando" className="text-primary hover:underline">Corporate Event Rentals</Link></li>
          </ul>
        </div>
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground mb-3">Nearby Areas We Serve:</h3>
      <p className="text-muted-foreground leading-relaxed">
        We also deliver{" "}
        <Link to="/water-slide-and-bounce-house-rental-christmas" className="text-primary hover:underline">party rentals to Christmas</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-bithlo" className="text-primary hover:underline">Bithlo</Link>,{" "}
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
        Book Party Rentals in Wedgefield, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families and organizations throughout Wedgefield, Florida with clean, reliable party rental equipment. Whether you're planning a backyard birthday party, church event, or community celebration, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Wedgefield, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Wedgefield Event Unforgettable?
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

export default function WedgefieldDelivery() {
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
        cityName="Wedgefield"
        citySlug="wedgefield"
        metaTitle="Bounce House & Water Slide Rentals Wedgefield FL | Orlando Inflatables"
        metaDescription="Bounce house & water slide rentals in Wedgefield FL. Large inflatables for golf course community properties. Free delivery! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Wedgefield,_Florida"
        cityDescription="Welcome to Wedgefield, a beautiful golf course community in eastern Orange County! Centered around the Wedgefield Golf & Country Club, this peaceful, family-oriented neighborhood offers larger lots, stunning golf course views, and a relaxed Florida lifestyle. Wedgefield's spacious properties are perfect for our biggest inflatables—bring the water park experience right to your backyard!"
        additionalCityInfo="Wedgefield is a census-designated place in Orange County, Florida, developed as a golf course community around the Wedgefield Golf & Country Club. The community maintains its character as a peaceful, family-friendly neighborhood where residents enjoy larger lots, many with beautiful golf course views. Wedgefield offers a perfect blend of recreational amenities and natural Florida beauty. The community's location provides convenient access to Orlando while maintaining a quiet, residential atmosphere ideal for raising families and hosting celebrations."
        localLandmarks="Wedgefield's larger lots and golf course setting provide excellent venues for party rentals. Popular locations include private residences with spacious backyards, homes with scenic golf course views, the Wedgefield Golf & Country Club for coordinated events, neighborhood gathering spaces, and properties throughout the community's tree-lined streets. Whether you're hosting an intimate birthday or a large family reunion, Wedgefield has the space."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
