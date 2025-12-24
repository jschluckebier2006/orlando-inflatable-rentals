import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Stoneybrook?",
    answer: "Bounce house rentals in Stoneybrook start at $199 for a full-day rental. Premium combo units and water slides are also available. All rentals include free delivery, professional setup, and pickup throughout Stoneybrook.",
  },
  {
    question: "Are inflatables allowed by Stoneybrook HOA rules?",
    answer: "Most Stoneybrook HOAs permit temporary inflatable rentals for private parties. We recommend confirming with your specific HOA, but we've successfully served countless Stoneybrook residents without issues.",
  },
  {
    question: "What's popular for Stoneybrook summer pool parties?",
    answer: "Water slides are extremely popular for Stoneybrook summers! Set up on the grass near your pool area, they provide hours of refreshing fun that complements your pool. Perfect for beating the Florida heat!",
  },
  {
    question: "Do you serve Stoneybrook community events and HOA gatherings?",
    answer: "Yes! We work with Stoneybrook HOAs and community groups for neighborhood events, holiday celebrations, and block parties. Contact us for special pricing on larger community gatherings.",
  },
  {
    question: "What size combo units fit well in Stoneybrook backyards?",
    answer: "Our medium combo units (around 20x15 feet) are ideal for most Stoneybrook backyards. These offer bouncing plus a slide in one compact unit—maximizing fun while fitting your space perfectly.",
  },
  {
    question: "How do I book a bounce house for a Stoneybrook birthday party?",
    answer: "Booking is easy! Call us at (407) 497-1840 or submit an online quote request. We'll confirm availability, discuss your needs, help you choose the perfect inflatable, and schedule your delivery time.",
  },
  {
    question: "What safety measures do you take for Stoneybrook rentals?",
    answer: "Safety is our priority! All inflatables are commercially rated, regularly inspected, and cleaned with hospital-grade disinfectants. We provide proper anchoring, complete safety guidelines, and are fully licensed and insured.",
  },
  {
    question: "How early should Stoneybrook residents book?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends. Stoneybrook is a popular area and our best inflatables book quickly. For summer dates and holidays, 3 weeks ahead is even better!",
  },
];

// Custom sections for Stoneybrook FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Stoneybrook, FL with Trusted Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly provides bounce house and water slide rentals throughout Stoneybrook, Florida. Our team regularly delivers to this well-established East Orlando community and understands neighborhood layouts, HOA guidelines, and event setup expectations.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Stoneybrook East Golf Club, Stoneybrook Elementary School, and surrounding residential neighborhoods near Avalon Park and Alafaya.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Stoneybrook Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>HOA-friendly setup and cleanup practices</strong></li>
        <li>• <strong>Backyard space planning for residential homes</strong></li>
        <li>• <strong>Power access and safe inflatable placement</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        This local experience allows us to provide smooth delivery, efficient setup, and stress-free events.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Stoneybrook
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common events we serve in Stoneybrook, and bounce houses are always a favorite. Orlando Inflatables offers classic bounce houses, themed inflatables, and combo units that fit perfectly in residential backyards.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Stoneybrook Families Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match inflatables to yard size and guest count</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many families pair{" "}
        <Link to="/bounce-house-rentals" className="text-primary hover:underline font-semibold">
          bounce house rentals
        </Link>{" "}
        with water slide rentals to extend the fun and keep guests entertained longer.
      </p>
    </>
  );
}

function WaterSlideSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Water Slide Rentals for Stoneybrook Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Stoneybrook during spring and summer. Our water slides are ideal for backyard birthday parties, end-of-school celebrations, and neighborhood get-togethers.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Common Uses for Stoneybrook Water Slide Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Summer birthday parties</li>
        <li>• Family gatherings</li>
        <li>• Community celebrations</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Each rental includes professional setup and clear safety instructions so families can enjoy worry-free fun.
      </p>
    </>
  );
}

function SchoolEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        School Event & Field Day Rentals in Stoneybrook
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations in and around Stoneybrook rely on Orlando Inflatables for dependable event rentals. Our commercial-grade inflatables are ideal for field days, reward events, and{" "}
        <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          school celebrations
        </Link>.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular School Event Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle courses</Link> for friendly competition</li>
        <li>• Large bounce houses for group rotations</li>
        <li>• <Link to="/interactive-game-rentals" className="text-primary hover:underline">Interactive inflatable games</Link></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Our team coordinates setup details with school staff to ensure safe placement and smooth event flow.
      </p>
    </>
  );
}

function ChurchEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Church & Community Event Rentals in Stoneybrook
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community groups in Stoneybrook often rent inflatables for festivals, family nights, and outreach events. Orlando Inflatables provides clean, professional equipment suitable for a wide range of ages.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular{" "}
        <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          Church and Community Rentals
        </Link>{" "}
        Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/bounce-slide-combo-rentals" className="text-primary hover:underline">Bounce house and slide combos</Link></li>
        <li>• Interactive inflatable games</li>
        <li>• Obstacle courses for youth events</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We prioritize professionalism, punctuality, and clear communication for every church or community rental.
      </p>
    </>
  );
}

function RentalDayExpectationsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        What to Expect When Renting in Stoneybrook, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Stoneybrook, you can expect a smooth and organized rental experience:
      </p>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>On-time delivery</strong> within your scheduled window</li>
        <li>• <strong>Professional setup</strong> and secure anchoring</li>
        <li>• <strong>Clear safety instructions</strong> before use</li>
        <li>• <strong>Hassle-free pickup</strong> after your event</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We help customers confirm space requirements, HOA considerations, and power access ahead of time so everything runs smoothly on event day.
      </p>
    </>
  );
}

function ExploreMoreSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Explore More Party Rental Options Near Stoneybrook
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Stoneybrook event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-avalon-park" className="text-primary hover:underline">party rentals to Avalon Park</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-eastwood" className="text-primary hover:underline">Eastwood</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-alafaya" className="text-primary hover:underline">Alafaya</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="text-primary hover:underline">Waterford Lakes</Link>, and throughout the greater Orlando area. Check out our{" "}
        <Link to="/delivery-area" className="text-primary hover:underline">full delivery area</Link> for more locations.
      </p>
    </>
  );
}

function BookNowSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Book Party Rentals in Stoneybrook, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families, schools, and community organizations throughout Stoneybrook with clean, reliable party rental equipment. Whether you're planning a backyard birthday party or a larger neighborhood event, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Stoneybrook, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Stoneybrook Event Unforgettable?
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

export default function StoneybrookDelivery() {
  const [showJotform, setShowJotform] = useState(false);

  const customSections = [
    { id: "local-delivery", content: <LocalDeliverySection /> },
    { id: "birthday-party", content: <BirthdayPartySection /> },
    { id: "water-slide", content: <WaterSlideSection /> },
    { id: "school-events", content: <SchoolEventsSection /> },
    { id: "church-events", content: <ChurchEventsSection /> },
    { id: "rental-day", content: <RentalDayExpectationsSection /> },
    { id: "explore-more", content: <ExploreMoreSection /> },
    { id: "book-now", content: <BookNowSection onOpenForm={() => setShowJotform(true)} /> },
  ];

  return (
    <>
      <CityDeliveryPage
        cityName="Stoneybrook"
        citySlug="stoneybrook"
        metaTitle="Bounce House & Water Slide Rentals Stoneybrook FL | Orlando Inflatables"
        metaDescription="Premium bounce house & water slide rentals in Stoneybrook FL. HOA-friendly party inflatables with free delivery. Call (407) 497-1840 today!"
        nearbyAreas={nearbyAreas}
        cityDescription="Welcome to Stoneybrook, one of East Orlando's most desirable master-planned communities! Known for beautiful homes, well-maintained common areas, and an active community life, Stoneybrook families know how to celebrate in style. Orlando Inflatables delivers premium party rentals that match the quality and care Stoneybrook residents expect."
        additionalCityInfo="Stoneybrook is a master-planned community in East Orlando renowned for its family-friendly atmosphere, excellent amenities, and convenient location. The neighborhood features thoughtfully designed homes, tree-lined streets, and community spaces that foster connection among residents. Active HOAs maintain the community's beautiful appearance, and neighbors often gather for block parties, holiday events, and celebrations. Stoneybrook's culture of community and quality living makes it a perfect place to throw memorable parties."
        localLandmarks="Stoneybrook offers excellent venues for party rentals throughout the community. Popular locations include spacious backyards in established Stoneybrook neighborhoods, community clubhouses and HOA facilities for larger gatherings, neighborhood common areas and parks, nearby schools for carnivals and field days, and church properties for celebrations. Our team is familiar with Stoneybrook and delivers with professionalism."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
