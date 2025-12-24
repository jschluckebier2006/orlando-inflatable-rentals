import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Eastwood", slug: "eastwood" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Alafaya", slug: "alafaya" },
  { name: "Avalon Park", slug: "avalon-park" },
];

const faqs = [
  {
    question: "How much do bounce house rentals cost in Azalea Park?",
    answer: "Our Azalea Park bounce house rentals start at $199 for a full-day rental. We offer various sizes and styles to fit every budget. All prices include free delivery, professional setup, and pickup—no hidden fees or surprises.",
  },
  {
    question: "Is delivery really free to Azalea Park?",
    answer: "Yes! We provide complimentary delivery, setup, and pickup for all rentals in Azalea Park. Whether you're near Semoran Boulevard or East Colonial Drive, delivery is included at no extra cost.",
  },
  {
    question: "Do you offer Spanish-speaking customer service?",
    answer: "¡Sí! We have Spanish-speaking team members available to assist you with your rental needs. Call us and we'll be happy to help you plan your party in Spanish or English.",
  },
  {
    question: "Can I rent inflatables for a quinceañera in Azalea Park?",
    answer: "Absolutely! Our inflatables are perfect for quinceañeras, sweet 16 parties, and milestone celebrations. We have elegant combo units and fun options that complement any party theme beautifully.",
  },
  {
    question: "What size bounce house fits in an Azalea Park yard?",
    answer: "Most Azalea Park yards can accommodate our standard 15x15 bounce houses. We also have compact options for smaller spaces. Tell us your yard dimensions and we'll recommend the perfect fit for your celebration.",
  },
  {
    question: "How early should I book for an Azalea Park party?",
    answer: "We recommend booking 1-2 weeks ahead for the best selection. Weekend dates and summer months fill up quickly. For last-minute needs, call us—we often have same-week availability.",
  },
  {
    question: "Do you serve Azalea Park schools and churches?",
    answer: "Yes! We regularly provide inflatables for Azalea Park elementary schools, local churches, and community organizations. We carry full insurance and can provide certificates upon request for your venue.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and cash. A deposit secures your booking, with the remaining balance due on delivery day. Payment is easy and flexible for Azalea Park families.",
  },
];

// Custom sections for Azalea Park SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Local Azalea Park Delivery & Event Experience
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables doesn't just advertise Azalea Park, we actively deliver and set up events throughout the area every week. Our team is familiar with local neighborhoods, traffic patterns, and venue requirements, which allows us to provide smooth, on-time service for every event.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We regularly provide bounce house and water slide rentals near well-known Azalea Park locations including Azalea Park Elementary School, Engelwood Neighborhood Center, and surrounding residential neighborhoods along Semoran Boulevard and East Colonial Drive.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Our Delivery Team is Experienced With:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>Residential backyard parties</strong></li>
        <li>• <strong>School campuses and field days</strong></li>
        <li>• <strong>Church parking lots and fellowship events</strong></li>
        <li>• <strong>Community centers and neighborhood gatherings</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Because we already operate throughout Azalea Park, setup is efficient, spacing recommendations are accurate, and there are no surprises on event day.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Azalea Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are the most common events we serve in Azalea Park, and bounce houses remain the top choice for kids of all ages. Our inventory includes classic bounce houses, themed inflatables, and combo units that pair jumping areas with slides.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Parents in Azalea Park Choose Orlando Inflatables Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Units are cleaned and sanitized before every delivery</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match the inflatable to yard size and age group</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        For larger celebrations, many families combine{" "}
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
        Water Slide Rentals for Azalea Park Summer Parties
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Florida heat calls for water slides, and Azalea Park families love them. Our{" "}
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          water slide rentals
        </Link>{" "}
        are ideal for backyard parties, block parties, and outdoor celebrations during spring and summer months.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Water Slide Rentals Are Popular For:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Summer birthday parties</li>
        <li>• End-of-school celebrations</li>
        <li>• Family reunions</li>
        <li>• Neighborhood cookouts</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Each water slide includes clear setup instructions, safe landing areas, and fast-flow designs that keep lines moving and kids smiling.
      </p>
    </>
  );
}

function SchoolEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        School Event & Field Day Rentals in Azalea Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations throughout the Azalea Park area rely on Orlando Inflatables for dependable event rentals. Our commercial-grade inflatables are designed for high-traffic use and are ideal for field days, reward days, and seasonal{" "}
        <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          school celebrations
        </Link>.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        We Commonly Provide:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle courses</Link> for competitive play</li>
        <li>• Large bounce houses for group rotations</li>
        <li>• <Link to="/interactive-game-rentals" className="text-primary hover:underline">Interactive games</Link> that encourage teamwork</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Our team coordinates directly with school staff to ensure proper placement, power access, and smooth setup.
      </p>
    </>
  );
}

function ChurchEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Church & Community Event Rentals in Azalea Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community organizations in Azalea Park frequently use inflatables for fellowship events, festivals, and outreach activities. We help churches select inflatables that work well on grass or pavement and can accommodate wide age ranges.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular{" "}
        <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          Church Event Rentals
        </Link>{" "}
        Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/bounce-slide-combo-rentals" className="text-primary hover:underline">Combo bounce houses</Link></li>
        <li>• Interactive inflatable games</li>
        <li>• Obstacle courses for youth groups</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Our team understands the importance of professionalism, punctuality, and safety for church events.
      </p>
    </>
  );
}

function RentalDayExpectationsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        What Azalea Park Families Can Expect on Rental Day
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Azalea Park, here's exactly how the process works:
      </p>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>On-time delivery</strong> within your scheduled window</li>
        <li>• <strong>Professional setup</strong> and secure anchoring</li>
        <li>• <strong>Clear safety instructions</strong> before use</li>
        <li>• <strong>Hassle-free pickup</strong> after your event</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We help customers confirm space requirements, power access, and placement before delivery so everything runs smoothly from start to finish.
      </p>
    </>
  );
}

function ExploreMoreSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Explore More Party Rental Options Near Azalea Park
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Azalea Park event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-eastwood" className="text-primary hover:underline">party rentals to Eastwood</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="text-primary hover:underline">Waterford Lakes</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-alafaya" className="text-primary hover:underline">Alafaya</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-avalon-park" className="text-primary hover:underline">Avalon Park</Link>, and throughout the greater Orlando area. Check out our{" "}
        <Link to="/delivery-area" className="text-primary hover:underline">full delivery area</Link> for more locations.
      </p>
    </>
  );
}

function BookNowSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Book Your Azalea Park Party Rentals Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables is proud to serve Azalea Park with clean, reliable, and fun party rental equipment. Whether you're planning a backyard birthday party, school event, or community celebration, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online or reserve your date today to secure the best inflatables for your Azalea Park event.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Azalea Park Event Unforgettable?
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

export default function AzaleaParkDelivery() {
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
        cityName="Azalea Park"
        citySlug="azalea-park"
        metaTitle="Bounce House & Water Slide Rentals Azalea Park FL | Orlando Inflatables"
        metaDescription="Affordable bounce house & water slide rentals in Azalea Park FL. Bilingual service, free delivery. Perfect for birthdays & quinceañeras! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Azalea_Park,_Florida"
        cityDescription="Welcome to Azalea Park, a welcoming and diverse East Orlando community with deep roots and strong neighborhood spirit! Located conveniently near major corridors, Azalea Park offers families an affordable place to live with easy access to everything Orlando has to offer. Orlando Inflatables is proud to serve this vibrant community with top-quality party rentals at prices that work for every family."
        additionalCityInfo="Azalea Park is a census-designated place in Orange County, Florida, established primarily in the mid-20th century. The neighborhood has maintained its character as a welcoming place for families of all backgrounds. Known for its diverse, close-knit community, Azalea Park residents take pride in their neighborhood. The area's convenient location near Semoran Boulevard and East Colonial Drive provides easy access to shopping, dining, and entertainment while maintaining a residential, family-friendly atmosphere."
        localLandmarks="We deliver throughout all of Azalea Park, from the established neighborhoods near Semoran Boulevard to the quiet residential streets off East Colonial Drive. Popular party locations include private backyards of all sizes, community centers and gathering spaces, local churches for celebrations, school facilities for events, and neighborhood parks. Our team navigates Azalea Park's streets with ease to ensure on-time delivery for your special occasion."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
