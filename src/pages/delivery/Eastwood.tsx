import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Azalea Park", slug: "azalea-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Eastwood?",
    answer: "Bounce house rentals in Eastwood start at $199 for a full-day rental. We offer budget-friendly options for every family, plus combo units and water slides at various price points. All rentals include free delivery and setup.",
  },
  {
    question: "Is Eastwood within your delivery area?",
    answer: "Absolutely! Eastwood is one of our core East Orlando service areas. We provide free delivery, professional setup, and pickup to all Eastwood neighborhoods. You're right in the heart of our territory!",
  },
  {
    question: "What are your most popular rentals for Eastwood birthday parties?",
    answer: "Combo bounce houses with slides are the top choice for Eastwood birthdays! They offer multiple activities in one unit—bouncing plus sliding—perfect for entertaining kids of different ages at your party.",
  },
  {
    question: "Do you have budget-friendly options for Eastwood families?",
    answer: "Yes! We believe every family deserves great party entertainment. Our standard bounce houses offer excellent value, and we provide package deals when you combine multiple items. Quality fun doesn't have to break the bank.",
  },
  {
    question: "Can you set up in smaller Eastwood backyards?",
    answer: "Many Eastwood homes have varied yard sizes. We offer compact bounce houses designed for smaller spaces that still deliver big fun. Share your yard dimensions and we'll recommend the perfect fit.",
  },
  {
    question: "What time do you deliver to Eastwood?",
    answer: "We schedule deliveries based on your event time, typically arriving 1-2 hours before your party starts. You can request specific delivery windows when booking, and we'll accommodate your schedule.",
  },
  {
    question: "Do you offer same-day rentals to Eastwood?",
    answer: "Same-day rentals may be available depending on our schedule. Call us to check availability! For guaranteed selection, we recommend booking at least a few days ahead.",
  },
  {
    question: "What areas near Eastwood do you also serve?",
    answer: "We serve all surrounding communities including Azalea Park, Waterford Lakes, Avalon Park, and beyond. If you're planning a party anywhere in East Orlando, we've got you covered with free delivery.",
  },
];

// Custom sections for Eastwood FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Eastwood, FL with Trusted Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly provides bounce house and water slide rentals throughout Eastwood, Florida. Our team regularly delivers to this well-established, family-friendly community and understands neighborhood layouts, HOA considerations, and event setup requirements.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near well-known Eastwood locations such as Eastwood Elementary School, Sun Blaze Elementary School, and throughout residential neighborhoods surrounding Eastwood Golf Club.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Eastwood Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>HOA-friendly setup practices</strong></li>
        <li>• <strong>Backyard space planning for residential homes</strong></li>
        <li>• <strong>Power access and safe placement guidelines</strong></li>
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
        Birthday Party Bounce House Rentals in Eastwood
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common events we serve in Eastwood, and bounce houses are always a hit. Orlando Inflatables offers classic bounce houses, themed inflatables, and combo units that fit perfectly in residential backyards.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Eastwood Families Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match the inflatable to yard size and guest count</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many families combine{" "}
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
        Water Slide Rentals for Eastwood Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Eastwood during spring and summer. Our water slides are perfect for backyard birthday parties, end-of-school celebrations, and neighborhood get-togethers.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Common Uses for Eastwood Water Slide Rentals Include:
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
        School Event & Field Day Rentals in Eastwood
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations in the Eastwood area rely on Orlando Inflatables for dependable event rentals. Our commercial-grade inflatables are ideal for field days, reward events, and{" "}
        <Link to="/events/school-events" className="text-primary hover:underline font-semibold">
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
        Church & Community Event Rentals in Eastwood
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community groups in Eastwood often use inflatables for festivals, family nights, and outreach events. Orlando Inflatables provides clean, professional equipment suitable for a wide range of ages.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular{" "}
        <Link to="/events/church-events" className="text-primary hover:underline font-semibold">
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
        What to Expect When Renting in Eastwood, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Eastwood, you can expect a smooth and organized rental experience:
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
        Explore More Party Rental Options Near Eastwood
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Eastwood event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-azalea-park" className="text-primary hover:underline">party rentals to Azalea Park</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-avalon-park" className="text-primary hover:underline">Avalon Park</Link>,{" "}
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
        Book Party Rentals in Eastwood, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families, schools, and community organizations throughout Eastwood with clean, reliable party rental equipment. Whether you're planning a backyard birthday party or a large community event, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Eastwood, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Eastwood Event Unforgettable?
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

export default function EastwoodDelivery() {
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
        cityName="Eastwood"
        citySlug="eastwood"
        metaTitle="Bounce House & Water Slide Rentals Eastwood FL | Orlando Inflatables"
        metaDescription="Affordable bounce house & water slide rentals in Eastwood FL. Budget-friendly party inflatables with free delivery. Call (407) 497-1840 for quotes!"
        nearbyAreas={nearbyAreas}
        cityDescription="Welcome to Eastwood, an established East Orlando neighborhood offering families a convenient, affordable location in the heart of it all! With easy access to major roads and employment centers, Eastwood residents enjoy the best of Orlando living. Orlando Inflatables is proud to serve this community with quality party rentals at prices that work for every budget."
        additionalCityInfo="Eastwood is a neighborhood in East Orlando, Orange County, Florida, known for its established residential character and convenient location. The area developed primarily in the latter half of the 20th century and offers a diverse mix of single-family homes. Residents appreciate Eastwood's proximity to East Colonial Drive and the 408 expressway, providing easy access to downtown Orlando, the airport, and attractions. It's a practical, family-friendly neighborhood where celebrations happen every weekend."
        localLandmarks="We deliver throughout Eastwood's established streets and residential areas. Popular party venues include private backyards of various sizes, community gathering spaces, local parks and recreational facilities, school grounds for special events, and church properties for celebrations. Our team knows the Eastwood area well and ensures prompt, professional delivery to your doorstep."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
