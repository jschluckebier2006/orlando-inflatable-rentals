import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Waterford Lakes?",
    answer: "Bounce house rentals in Waterford Lakes start at $199 for an 8-hour rental. Pricing varies by size and features—combo units and water slides may cost more. All rentals include free delivery, setup, and pickup.",
  },
  {
    question: "How quickly can you deliver to Waterford Lakes?",
    answer: "Waterford Lakes is one of our closest and busiest service areas! We can often accommodate short-notice requests, though booking 1-2 weeks ahead guarantees the best selection of inflatables.",
  },
  {
    question: "What's most popular for Waterford Lakes summer parties?",
    answer: "Water slides are in huge demand during Waterford Lakes summers! Our dual-lane racing slides and tall water slides are favorites. Book early for summer dates—these fill up fast in the Florida heat!",
  },
  {
    question: "Do you deliver to The Villages at Waterford Lakes?",
    answer: "Yes! We serve all Waterford Lakes communities including The Villages, established Waterford Lakes neighborhoods, and newer developments. Wherever you are in Waterford Lakes, delivery is free.",
  },
  {
    question: "Can you set up at Waterford Lakes parks?",
    answer: "We can set up at local parks if you've obtained necessary permits from Orange County. Many Waterford Lakes residents prefer backyard parties—simpler, more private, and just as fun!",
  },
  {
    question: "What's included with Waterford Lakes rentals?",
    answer: "Every rental includes free delivery, professional setup, safety instructions, all necessary equipment (stakes or sandbags), and pickup after your event. Just provide a power outlet and we handle everything else!",
  },
  {
    question: "Do you offer package deals for Waterford Lakes parties?",
    answer: "Absolutely! Combine a bounce house with tables, chairs, and concession machines for special package pricing. Ask about our party packages when requesting a quote—save money and simplify planning!",
  },
  {
    question: "How far in advance should Waterford Lakes residents book?",
    answer: "We recommend 1-2 weeks for weekends, 2-3 weeks for summer dates and holidays. Waterford Lakes is one of our most popular areas, so early booking ensures you get your first-choice inflatable.",
  },
];

// Custom sections for Waterford Lakes FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Waterford Lakes with Reliable Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly delivers bounce house and water slide rentals throughout Waterford Lakes, Florida. Our team regularly serves this busy East Orlando community and understands neighborhood layouts, HOA considerations, and event setup logistics common to the area.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near Waterford Lakes Town Center, Lawton Chiles Elementary School, and surrounding residential neighborhoods along Alafaya Trail and Lake Underhill Road.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Waterford Lakes Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>HOA-friendly setup requirements</strong></li>
        <li>• <strong>Space planning for residential backyards</strong></li>
        <li>• <strong>Power access and safe placement near homes</strong></li>
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
        Birthday Party Bounce House Rentals in Waterford Lakes
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most popular events in Waterford Lakes, and bounce houses remain the top attraction for kids and families. Orlando Inflatables offers a wide selection of classic bounce houses, themed inflatables, and combo units that work perfectly for residential celebrations.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Waterford Lakes Families Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match inflatables to yard size and guest count</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many customers pair{" "}
        <Link to="/bounce-house-rentals" className="text-primary hover:underline font-semibold">
          bounce house rentals
        </Link>{" "}
        with water slide rentals to keep guests entertained longer.
      </p>
    </>
  );
}

function WaterSlideSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Water Slide Rentals for Waterford Lakes Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Waterford Lakes during spring and summer months. Our water slides are ideal for backyard parties, end-of-school celebrations, and neighborhood get-togethers.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Common Uses for Waterford Lakes Water Slide Rentals Include:
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
        School Event & Field Day Rentals in Waterford Lakes
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations in the Waterford Lakes area rely on Orlando Inflatables for dependable event rentals. Our commercial-grade inflatables are ideal for field days, reward events, and{" "}
        <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          school celebrations
        </Link>.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular School Event Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle courses</Link> for friendly competition</li>
        <li>• Large bounce houses for rotating groups</li>
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
        Church & Community Event Rentals in Waterford Lakes
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community organizations in Waterford Lakes often rent inflatables for festivals, family nights, and outreach events. Orlando Inflatables provides clean, professional equipment suitable for a wide range of ages.
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
        What to Expect When Renting in Waterford Lakes, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Waterford Lakes, you can expect a smooth and organized rental experience:
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
        Explore More Party Rental Options Near Waterford Lakes
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Waterford Lakes event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        Book Party Rentals in Waterford Lakes, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families, schools, and organizations throughout Waterford Lakes with clean, reliable party rental equipment. Whether you're planning a backyard birthday party or a large community event, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Waterford Lakes, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Waterford Lakes Event Unforgettable?
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

export default function WaterfordLakesDelivery() {
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
        cityName="Waterford Lakes"
        citySlug="waterford-lakes"
        metaTitle="Bounce House & Water Slide Rentals Waterford Lakes FL"
        metaDescription="Premium bounce house & water slide rentals in Waterford Lakes FL. Near Town Center with free delivery! Call (407) 497-1840 for your party quote."
        nearbyAreas={nearbyAreas}
        ogImage="/og-images/og-waterford-lakes.jpg"
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Waterford_Lakes,_Florida"
        cityDescription="Welcome to Waterford Lakes, one of East Orlando's most popular and vibrant communities! Anchored by the bustling Waterford Lakes Town Center, this thriving area is home to thousands of families who appreciate quality, convenience, and community. Whether you're celebrating near the shops or in your beautiful backyard, Orlando Inflatables delivers the party excitement Waterford Lakes families love."
        additionalCityInfo="Waterford Lakes is a census-designated place in Orange County, Florida, centered around the Waterford Lakes Town Center—one of the largest open-air shopping centers in the Orlando area. The community has experienced tremendous growth since the 1990s and now hosts a diverse, dynamic population of families and young professionals. Multiple neighborhoods make up the greater Waterford Lakes area, including The Villages at Waterford Lakes and surrounding developments. Excellent schools, abundant shopping, and easy access to major roads make Waterford Lakes one of East Orlando's most desirable places to live and celebrate."
        localLandmarks="Popular event locations throughout Waterford Lakes include spacious backyards in established neighborhoods, The Villages at Waterford Lakes community areas, neighborhood parks and common spaces, HOA clubhouses for larger gatherings, and convenient locations near the Town Center for easy guest access. Whether your party is intimate or large-scale, Waterford Lakes has the perfect setting and we'll deliver the perfect inflatable."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
