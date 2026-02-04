import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Christmas", slug: "christmas" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver to Chuluota even though it's near Seminole County?",
    answer: "Yes! Chuluota sits right on the Orange/Seminole County border and is absolutely within our service area. We provide the same free delivery and professional setup to Chuluota as all our other communities.",
  },
  {
    question: "How much do bounce house rentals cost in Chuluota?",
    answer: "Chuluota bounce house rentals start at $199 for a full-day rental. With Chuluota's larger properties, many families opt for our bigger combo units and obstacle courses. All prices include free delivery and setup.",
  },
  {
    question: "What inflatables are popular on Chuluota's larger properties?",
    answer: "Chuluota customers love our large obstacle courses, dual-lane racing water slides, and mega combo units. The spacious lots in Chuluota are perfect for our biggest and most exciting inflatables—go big!",
  },
  {
    question: "Can you set up on a horse property in Chuluota?",
    answer: "Absolutely! We're experienced with rural and equestrian property setups. We just need a flat grassy area positioned away from where horses are present. Our team will find the perfect spot on your property.",
  },
  {
    question: "Do you serve Chuluota schools and churches?",
    answer: "Yes! We work with Seminole County schools in the Chuluota area for field days, carnivals, and PTA events. We also serve local churches for community gatherings. Full insurance and certificates available upon request.",
  },
  {
    question: "What's the rental period for Chuluota deliveries?",
    answer: "Our standard rental is up to 8 hours—plenty of time for most parties. Need your inflatable longer? Ask about our extended rental options when booking. We're flexible to accommodate your celebration.",
  },
  {
    question: "How early should Chuluota residents book?",
    answer: "We recommend booking 1-2 weeks ahead for weekends. Chuluota's popularity and larger properties mean our big inflatables are in high demand. For specific themed units or peak season dates, book 3-4 weeks out.",
  },
  {
    question: "What makes Chuluota great for inflatable parties?",
    answer: "Chuluota's rural character means bigger lots, more privacy, and room for multiple inflatables. Many families rent several units for large gatherings. The peaceful atmosphere is perfect for memorable outdoor celebrations.",
  },
];

// Custom sections for Chuluota FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Chuluota, FL with Reliable Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly delivers bounce house and water slide rentals throughout Chuluota, Florida. Our team regularly serves this rural Seminole County community and understands larger properties, open land setups, and outdoor focused events common in the area.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Chuluota Community Park, Chuluota Elementary School, and residential properties throughout Chuluota and nearby rural neighborhoods.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Chuluota Year-Round, We Understand:
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
        Birthday Party Bounce House Rentals in Chuluota
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common reasons families in Chuluota rent bounce houses. With spacious yards and outdoor-friendly properties, many customers choose larger inflatables or combo units that give kids room to play.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Chuluota Families Choose Orlando Inflatables Because:
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
        Water Slide Rentals for Chuluota Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Chuluota during spring and summer. Larger properties make it easy to add big water slides to birthday parties, family reunions, and weekend gatherings.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular Uses for Chuluota Water Slide Rentals Include:
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
        School, Church & Community Event Rentals in Chuluota
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools, churches, and community groups in Chuluota often rely on inflatables for festivals, fundraisers, and family events. Orlando Inflatables provides dependable, commercial-grade equipment that works well for both small gatherings and larger{" "}
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
        What to Expect When Renting in Chuluota, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you rent from Orlando Inflatables in Chuluota, you can expect a simple and organized rental process:
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
        Explore More Party Rental Options Near Chuluota, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Chuluota event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-wedgefield" className="text-primary hover:underline">Wedgefield</Link>,{" "}
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
        Book Party Rentals in Chuluota, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families and organizations throughout Chuluota, Florida with clean, reliable party rental equipment. Whether you are planning a backyard birthday party, church event, or community celebration, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Chuluota, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Chuluota Event Unforgettable?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onOpenForm}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground btn-bounce"
          >
            Check Availability
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

export default function ChuluotaDelivery() {
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
        cityName="Chuluota"
        citySlug="chuluota"
        metaTitle="Bounce House & Water Slide Rentals Chuluota FL"
        metaDescription="Bounce house & water slide rentals in Chuluota FL. Large inflatables for horse properties & spacious lots. Free delivery! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        ogImage="/og-images/og-chuluota.jpg"
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Chuluota,_Florida"
        cityDescription="Welcome to Chuluota, a charming rural community on the border of Seminole and Orange Counties! Known for its peaceful atmosphere, historic character, and thriving equestrian community, Chuluota is a wonderful place to raise a family and celebrate life's special moments. With larger lots and a country feel, Chuluota properties are perfect for our biggest and most exciting inflatables."
        additionalCityInfo="Chuluota's name comes from the Seminole word meaning 'pine island,' reflecting the area's natural beauty and Native American heritage. The community maintains a distinctly rural character with larger lots, horse properties, and a strong equestrian presence while providing convenient access to Orlando and surrounding areas. The historic downtown area adds charm, and residents enjoy a close-knit community feel that's increasingly rare in Central Florida. Chuluota offers the best of both worlds—country living with city convenience."
        localLandmarks="Chuluota offers wonderful venues for party rentals, from spacious residential backyards to multi-acre horse properties with room to spare. Popular locations include the historic downtown area for community events, church grounds for gatherings of all sizes, school facilities for Seminole County events, and private properties throughout Chuluota's beautiful neighborhoods. Our team is familiar with the area's rural roads and delivers with care."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
