import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Avalon Park", slug: "avalon-park" },
  { name: "Waterford Lakes", slug: "waterford-lakes" },
  { name: "Stoneybrook", slug: "stoneybrook" },
  { name: "Eastwood", slug: "eastwood" },
];

const faqs = [
  {
    question: "How much does it cost to rent a bounce house in Alafaya?",
    answer: "Bounce house rentals in Alafaya start at $199 for a standard 8-hour rental. Prices vary based on size and features. Combo units with slides and themed bounce houses may cost more. All rentals include free delivery, setup, and pickup in Alafaya.",
  },
  {
    question: "Do you deliver bounce houses to UCF area?",
    answer: "Yes! We provide free delivery to all of Alafaya including the UCF campus area, Research Park, and surrounding neighborhoods. We're very familiar with the area and can accommodate setups at residential homes, apartment complexes, and event venues.",
  },
  {
    question: "What size water slide is best for an Alafaya backyard party?",
    answer: "For most Alafaya backyards, we recommend our 15-18 foot water slides. They provide plenty of excitement while fitting in standard-sized yards. We'll help you choose the right size based on your space and the ages of your guests.",
  },
  {
    question: "How far in advance should I book party rentals in Alafaya?",
    answer: "We recommend booking at least 1-2 weeks in advance, especially for weekend events. During peak season (spring and summer), popular items book up quickly. For large events or specific themed inflatables, booking 3-4 weeks ahead is ideal.",
  },
  {
    question: "Do you set up bounce houses at Alafaya community parks?",
    answer: "Yes, we regularly set up at community parks, HOA common areas, and clubhouses throughout Alafaya. You may need a permit from the venue or HOA. We can provide insurance certificates if required for your location.",
  },
  {
    question: "What happens if it rains on my party day in Alafaya?",
    answer: "Florida weather can be unpredictable! If there's rain in the forecast, we'll work with you to reschedule at no additional charge. Light rain is usually fine, but we'll take down equipment during lightning for safety.",
  },
  {
    question: "Can I rent multiple inflatables for a large Alafaya event?",
    answer: "Absolutely! We offer package deals for multiple rentals. Many Alafaya customers combine a bounce house, water slide, and concession machines for complete party packages. Contact us for custom quotes on multi-item rentals.",
  },
  {
    question: "What power source do I need for inflatables in Alafaya?",
    answer: "Each inflatable requires a standard 110V electrical outlet within 100 feet. If you're setting up in a park or area without power, we offer generator rentals. Our team will ensure everything is properly powered during setup.",
  },
];

// Custom sections for Alafaya SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Alafaya with Reliable Party Rental Delivery
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly provides bounce house and water slide rentals throughout Alafaya, Florida. Our team is very familiar with the area, including residential neighborhoods, school campuses, and community venues, allowing us to deliver and set up efficiently for every type of event.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We regularly deliver party rental equipment near well-known Alafaya locations such as University of Central Florida, Timber Creek High School, and surrounding neighborhoods along Alafaya Trail and East Colonial Drive.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Alafaya Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>Yard sizes and neighborhood layouts</strong></li>
        <li>• <strong>School and church setup requirements</strong></li>
        <li>• <strong>Timing considerations for busy weekends</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        This local experience helps ensure smooth delivery, proper setup, and stress-free events.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Alafaya
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most common events we serve in Alafaya, and bounce houses remain the go-to attraction for kids and families. Orlando Inflatables offers a wide variety of themed bounce houses, combo units, and age-appropriate inflatables to match any celebration.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Families in Alafaya Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Equipment is cleaned and sanitized before every rental</li>
        <li>• Options are available for toddlers, kids, and teens</li>
        <li>• We help match inflatables to yard size and guest count</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many customers combine{" "}
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
        Water Slide Rentals for Alafaya Summer Events
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Alafaya during the warmer months. Our water slides are perfect for backyard parties, graduation celebrations, and neighborhood events where kids and teens want something exciting.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Our Alafaya Water Slide Rentals Are Commonly Used For:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Summer birthday parties</li>
        <li>• School break celebrations</li>
        <li>• Family gatherings and cookouts</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Each rental includes professional setup and clear safety guidance so families can enjoy hours of splashing fun.
      </p>
    </>
  );
}

function SchoolEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        School Event & Field Day Rentals in Alafaya
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools and youth organizations in Alafaya trust Orlando Inflatables for dependable, high-capacity inflatables that can handle large groups. Our commercial-grade equipment is ideal for field days, reward events, and{" "}
        <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          school celebrations
        </Link>.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Popular School Event Rentals Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/obstacle-course-rentals" className="text-primary hover:underline">Obstacle courses</Link> for competitive play</li>
        <li>• Large bounce houses for rotating groups</li>
        <li>• <Link to="/interactive-game-rentals" className="text-primary hover:underline">Interactive inflatable games</Link></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Our team coordinates setup details with school staff to ensure safety, proper placement, and efficient scheduling.
      </p>
    </>
  );
}

function ChurchEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Church & Community Event Rentals in Alafaya
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Churches and community organizations in Alafaya frequently rent inflatables for festivals, outreach events, and family nights. Orlando Inflatables provides equipment that works well on grass or pavement and accommodates a wide range of ages.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Common{" "}
        <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-semibold">
          Church Event Rentals
        </Link>{" "}
        Include:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <Link to="/bounce-slide-combo-rentals" className="text-primary hover:underline">Bounce house and slide combos</Link></li>
        <li>• Interactive inflatable games</li>
        <li>• Obstacle courses for youth groups</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We prioritize professionalism, punctuality, and clean equipment for every church or community event.
      </p>
    </>
  );
}

function RentalDayExpectationsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        What to Expect When Renting in Alafaya
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you book Orlando Inflatables in Alafaya, you can expect a simple and organized rental process:
      </p>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>On-time delivery</strong> within your scheduled window</li>
        <li>• <strong>Professional setup</strong> and secure anchoring</li>
        <li>• <strong>Clear safety instructions</strong> before use</li>
        <li>• <strong>Hassle-free pickup</strong> after your event</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We help customers confirm space requirements, power access, and placement ahead of time so there are no surprises on event day.
      </p>
    </>
  );
}

function ExploreMoreSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Explore More Party Rental Options Near Alafaya
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Alafaya event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="text-primary hover:underline">Waterford Lakes</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-azalea-park" className="text-primary hover:underline">Azalea Park</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-eastwood" className="text-primary hover:underline">Eastwood</Link>, and throughout the greater Orlando area. Check out our{" "}
        <Link to="/delivery-area" className="text-primary hover:underline">full delivery area</Link> for more locations.
      </p>
    </>
  );
}

function BookNowSection({ onOpenForm }: { onOpenForm: () => void }) {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Book Alafaya Party Rentals with Orlando Inflatables
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly serves families, schools, and organizations throughout Alafaya with clean, reliable party rental equipment. Whether you're planning a birthday party, school event, or church gathering, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals for your Alafaya event.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Alafaya Event Unforgettable?
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

export default function AlafayaDelivery() {
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
        cityName="Alafaya"
        citySlug="alafaya"
        metaTitle="Bounce House & Water Slide Rentals Alafaya FL | Orlando Inflatables"
        metaDescription="Bounce house & water slide rentals in Alafaya FL. Serving UCF area with party inflatables, obstacle courses & more. Free delivery! Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Alafaya,_Florida"
        cityDescription="Located in Orange County near the University of Central Florida, Alafaya is home to thousands of families, students, and young professionals who know how to celebrate! Whether you're hosting a birthday party, graduation celebration, or community event, we have the perfect inflatable rentals for your occasion."
        additionalCityInfo="Alafaya is a census-designated place (CDP) in Orange County, Florida, situated in the heart of East Orlando. The community has experienced tremendous growth over the past two decades, largely driven by its proximity to the University of Central Florida, one of the largest universities in the nation. The area features excellent schools, family-friendly neighborhoods, and convenient access to major employers in the Research Park corridor."
        localLandmarks="Popular gathering spots in Alafaya include community parks, HOA clubhouses, UCF campus venues, and the many residential neighborhoods with spacious backyards. The community's young, active population makes it one of our most popular delivery areas. We frequently set up at locations near Alafaya Trail, Innovation Way, and the Research Park area."
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
