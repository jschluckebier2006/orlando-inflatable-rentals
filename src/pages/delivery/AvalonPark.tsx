import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Avalon Park?",
    answer: "Bounce house rentals in Avalon Park start at $199 for an 8-hour rental. Pricing depends on the size and style—combo units with slides and themed inflatables may cost more. All rentals include free delivery, setup, and pickup throughout Avalon Park.",
  },
  {
    question: "Do you deliver to all Avalon Park villages and neighborhoods?",
    answer: "Yes! We deliver to every village within Avalon Park including East Park, West Park, and all surrounding neighborhoods. Our team knows the community well and provides on-time delivery to your exact location.",
  },
  {
    question: "Can I rent a water slide for my Avalon Park pool party?",
    answer: "Absolutely! Water slides are perfect for Avalon Park summer parties. We set them up on the grass near your pool area for hours of refreshing fun. Our 15-18 foot slides are ideal for most Avalon Park backyards.",
  },
  {
    question: "How far in advance should I book party rentals in Avalon Park?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends. Avalon Park is one of our busiest service areas, and popular inflatables book quickly. For major holidays or themed units, 3-4 weeks notice is ideal.",
  },
  {
    question: "Do you set up at Avalon Park Town Center events?",
    answer: "Yes, we serve events at Downtown Avalon Park and Town Center venues. You may need venue approval for commercial locations. For private backyard parties, simply book directly with us and we handle everything.",
  },
  {
    question: "What happens if it rains on my Avalon Park party day?",
    answer: "Florida weather is unpredictable! If rain threatens your event, we'll work with you to reschedule at no extra charge. Light showers are usually fine, but we'll take down equipment during lightning for everyone's safety.",
  },
  {
    question: "Can I rent tables, chairs, and concessions with my Avalon Park bounce house?",
    answer: "Yes! We offer complete party packages including tables, chairs, cotton candy machines, snow cone makers, and popcorn poppers. Bundle items together for special package pricing on your Avalon Park celebration.",
  },
  {
    question: "What safety measures do you take for Avalon Park rentals?",
    answer: "Every inflatable is commercially rated, regularly inspected, and cleaned with hospital-grade disinfectants. We're fully licensed and insured. Our team provides proper anchoring and complete safety instructions at every delivery.",
  },
];

// Custom sections for Avalon Park FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Avalon Park with Trusted Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly provides bounce house and water slide rentals throughout Avalon Park, Florida. Our team regularly serves this master-planned community and understands neighborhood layouts, HOA guidelines, and event setup requirements common throughout Avalon Park.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Avalon Elementary School, community areas throughout Avalon Park Orlando, and nearby school and church venues in East Orlando.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Avalon Park Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>HOA-friendly setup practices</strong></li>
        <li>• <strong>Backyard and green space planning</strong></li>
        <li>• <strong>Power access and safe placement near homes and community areas</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        This local experience allows us to provide smooth delivery, efficient setup, and stress-free events for Avalon Park families.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Avalon Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common events we serve in Avalon Park, and bounce houses are always a favorite. Orlando Inflatables offers classic bounce houses, themed inflatables, and combo units that fit well in residential backyards and community green spaces.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Avalon Park Families Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match the inflatable to yard size and guest count</li>
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
        Water Slide Rentals for Avalon Park Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Avalon Park during spring and summer. Our water slides are perfect for backyard birthday parties, end-of-school celebrations, and neighborhood get-togethers.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Common Uses for Avalon Park Water Slide Rentals Include:
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
        School Event & Field Day Rentals in Avalon Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations in and around Avalon Park rely on Orlando Inflatables for dependable event rentals. Our commercial-grade inflatables are ideal for field days, reward events, and{" "}
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
        Church & Community Event Rentals in Avalon Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community groups in Avalon Park often rent inflatables for festivals, family nights, and outreach events. Orlando Inflatables provides clean, professional equipment suitable for a wide range of ages.
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
        What to Expect When Renting in Avalon Park, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Avalon Park, you can expect a smooth and organized rental experience:
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
        Explore More Party Rental Options Near Avalon Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Avalon Park event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="text-primary hover:underline">party rentals to Waterford Lakes</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-alafaya" className="text-primary hover:underline">Alafaya</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-eastwood" className="text-primary hover:underline">Eastwood</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-stoneybrook" className="text-primary hover:underline">Stoneybrook</Link>, and throughout the greater Orlando area. Check out our{" "}
        <Link to="/delivery-area" className="text-primary hover:underline">full delivery area</Link> for more locations.
      </p>
    </>
  );
}

function BookNowSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Book Party Rentals in Avalon Park, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families, schools, and community organizations throughout Avalon Park with clean, reliable party rental equipment. Whether you're planning a backyard birthday party or a large community event, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Avalon Park, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Avalon Park Event Unforgettable?
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

export default function AvalonParkDelivery() {
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
        cityName="Avalon Park"
        citySlug="avalon-park"
        metaTitle="Bounce House & Water Slide Rentals Avalon Park FL"
        metaDescription="Bounce house & water slide rentals in Avalon Park FL. Serving Downtown Avalon Park & all villages with party inflatables. Free delivery! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Avalon_Park,_Florida"
        cityDescription="Welcome to Avalon Park, one of East Orlando's most beloved master-planned communities! Known for its charming New Urbanism design, tree-lined boulevards, and vibrant Downtown center, Avalon Park is home to thousands of families who know how to celebrate in style. Whether you're hosting a birthday party, graduation celebration, or community gathering, Orlando Inflatables delivers the excitement."
        additionalCityInfo="Avalon Park was developed with New Urbanism principles that emphasize walkability, community gathering spaces, and traditional neighborhood design. The community features a charming downtown area with shops, restaurants, and event venues. Multiple villages make up this thriving community, including East Park, West Park, and surrounding neighborhoods. Avalon Park's family-oriented culture, excellent schools, and active HOAs create the perfect environment for memorable celebrations."
        localLandmarks="We regularly deliver to parties throughout Avalon Park's beautiful neighborhoods. Popular venues include Downtown Avalon Park near the Town Center shops and restaurants, community clubhouses and HOA facilities, Avalon Park area schools for field days and carnivals, neighborhood parks and common areas, and the many spacious backyards throughout all Avalon Park villages. Our team is familiar with every corner of this wonderful community."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
