import { CityDeliveryPage } from "@/components/templates/CityDeliveryPage";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";

const nearbyAreas = [
  { name: "Bithlo", slug: "bithlo" },
  { name: "Chuluota", slug: "chuluota" },
  { name: "Wedgefield", slug: "wedgefield" },
  { name: "Alafaya", slug: "alafaya" },
];

const faqs = [
  {
    question: "Do you deliver party rentals to Christmas, Florida year-round?",
    answer: "Yes! While our town has a festive name, we deliver bounce houses and water slides to Christmas all year long. Summer birthday parties are just as popular as holiday gatherings in Florida's most uniquely named community!",
  },
  {
    question: "How much does a bounce house rental cost in Christmas, FL?",
    answer: "Bounce house rentals in Christmas start at $199 for a full-day rental. All prices include free delivery to Christmas—no extra mileage charges. Larger water slides and combo units are also available at competitive rates.",
  },
  {
    question: "Can you set up near Fort Christmas Historical Park?",
    answer: "We can deliver to private events near the park area. For events within Fort Christmas Historical Park itself, coordinate with Orange County Parks for permits. We're happy to work with any venue requirements they may have.",
  },
  {
    question: "What size water slides are popular for Christmas properties?",
    answer: "Christmas properties often have generous space, making our larger 18-22 foot water slides popular choices. These bigger slides provide maximum thrills and take full advantage of your available yard space.",
  },
  {
    question: "Do you have holiday-themed inflatables for Christmas, FL parties?",
    answer: "We carry various themed inflatables throughout the year, including festive options during the holiday season. Contact us to see what themed units are currently available—Christmas deserves the perfect party theme!",
  },
  {
    question: "Is there an extra delivery charge to Christmas?",
    answer: "No! Delivery to Christmas is included free with your rental. We serve all of East Orange County without additional delivery fees, including the Christmas and surrounding rural areas.",
  },
  {
    question: "How far in advance should I book for a Christmas, FL party?",
    answer: "We recommend booking 1-2 weeks ahead, especially for weekends and holidays. The actual Christmas holiday season books up quickly in our festively-named town, so plan ahead for December events!",
  },
  {
    question: "What events do you serve in the Christmas area?",
    answer: "We serve all types of Christmas celebrations—birthday parties, family reunions, church gatherings, community events, graduation parties, and yes, actual Christmas holiday parties! Whatever you're celebrating, we bring the fun.",
  },
];

// Custom sections for Christmas FL SEO optimization
function LocalDeliverySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Serving Christmas, FL with Reliable Party Rentals
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables proudly delivers bounce house and water slide rentals throughout Christmas, Florida. Our team regularly serves this close-knit community and understands the layout of residential properties, open land spaces, and local event venues common in the area.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-6">
        We frequently deliver party rental equipment near popular Christmas locations such as Fort Christmas Historical Park, local churches, and residential properties throughout the surrounding rural neighborhoods.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Because We Actively Serve Christmas Year-Round, We Understand:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>Larger yard and property layouts</strong></li>
        <li>• <strong>Outdoor power and setup considerations</strong></li>
        <li>• <strong>Flexible placement for grass and open land areas</strong></li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        This local knowledge allows us to provide smooth delivery, proper setup, and stress-free events for Christmas families.
      </p>
    </>
  );
}

function BirthdayPartySection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Birthday Party Bounce House Rentals in Christmas, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Birthday parties are one of the most popular reasons families in Christmas rent bounce houses. Orlando Inflatables offers a wide selection of classic bounce houses, themed inflatables, and combo units that work perfectly for backyard and property-style celebrations.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Families in Christmas Choose Us Because:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Inflatables are cleaned and sanitized before every rental</li>
        <li>• Units work well for both small yards and large open spaces</li>
        <li>• We help match inflatables to guest count and age range</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Many families pair{" "}
        <Link to="/bounce-house-rentals" className="text-primary hover:underline font-semibold">
          bounce house rentals
        </Link>{" "}
        with water slides to keep kids entertained longer during warm Florida weather.
      </p>
    </>
  );
}

function WaterSlideSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Water Slide Rentals for Christmas, FL Summer Parties
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        <Link to="/water-slide-rentals" className="text-primary hover:underline font-semibold">
          Water slide rentals
        </Link>{" "}
        are extremely popular in Christmas during spring and summer months. With larger properties and open outdoor space, families love adding big water slides to birthday parties, family reunions, and community gatherings.
      </p>
      <h3 className="font-display text-xl font-semibold text-foreground mb-4">
        Our Water Slide Rentals in Christmas Are Perfect For:
      </h3>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• Summer birthday parties</li>
        <li>• Holiday weekend celebrations</li>
        <li>• Family reunions and cookouts</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        Each water slide includes professional setup and safety guidance, making it easy to enjoy hours of fun without the hassle.
      </p>
    </>
  );
}

function CommunityEventsSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        School, Church & Community Event Rentals in Christmas
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Schools, churches, and community groups in Christmas often rely on inflatables for festivals, fundraisers, and family-friendly events. Orlando Inflatables provides dependable, commercial-grade equipment that works well for both small gatherings and larger{" "}
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
        What to Expect When Renting in Christmas, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        When you rent from Orlando Inflatables in Christmas, you can expect a simple, well-organized process:
      </p>
      <ul className="space-y-2 mb-6 text-muted-foreground">
        <li>• <strong>On-time delivery</strong> within your scheduled window</li>
        <li>• <strong>Professional setup</strong> and secure anchoring</li>
        <li>• <strong>Clear safety instructions</strong> before use</li>
        <li>• <strong>Hassle-free pickup</strong> after your event</li>
      </ul>
      <p className="text-muted-foreground leading-relaxed">
        We help confirm space requirements, power access, and placement ahead of time so everything runs smoothly on event day.
      </p>
    </>
  );
}

function ExploreMoreSection() {
  return (
    <>
      <h2 className="font-display text-3xl font-bold text-foreground mb-6">
        Explore More Party Rental Options Near Christmas, FL
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Looking for the perfect rental for your Christmas event? Explore our full selection of party rentals and find exactly what you need for your celebration.
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
        <Link to="/water-slide-and-bounce-house-rental-bithlo" className="text-primary hover:underline">party rentals to Bithlo</Link>,{" "}
        <Link to="/water-slide-and-bounce-house-rental-chuluota" className="text-primary hover:underline">Chuluota</Link>,{" "}
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
        Book Party Rentals in Christmas, FL Today
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Orlando Inflatables is proud to serve families and organizations throughout Christmas, Florida with clean, reliable party rental equipment. Whether you're planning a birthday party, church gathering, or community event, our team is ready to help.
      </p>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Check availability online and reserve your date today to secure the best bounce house and water slide rentals in Christmas, FL.
      </p>
      <div className="bg-primary/10 rounded-lg p-6 text-center">
        <p className="text-lg font-semibold text-foreground mb-4">
          Ready to Make Your Christmas, FL Event Unforgettable?
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

export default function ChristmasDelivery() {
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
        cityName="Christmas"
        citySlug="christmas"
        metaTitle="Bounce House & Water Slide Rentals Christmas FL"
        metaDescription="Bounce house & water slide rentals in Christmas FL. Party inflatables for Florida's most festive town! Free delivery year-round. Call (407) 497-1840."
        nearbyAreas={nearbyAreas}
        cityWikipediaUrl="https://en.wikipedia.org/wiki/Christmas,_Florida"
        cityDescription="Welcome to Christmas, Florida—one of the most uniquely named communities in the United States! Located in eastern Orange County along State Road 50, Christmas offers a rural Florida lifestyle with a special festive spirit that lasts all year long. Whether it's July or December, Orlando Inflatables delivers the excitement and fun to make your Christmas celebration unforgettable."
        additionalCityInfo="Christmas is a small, unincorporated community famous for its year-round holiday theme and the beloved Christmas Post Office, which attracts visitors from around the world seeking that special postmark. The town gets its name from Fort Christmas, established on Christmas Day in 1837 during the Second Seminole War. Today, Fort Christmas Historical Park preserves this history with nature trails and a pioneer village. The community's residents enjoy rural Florida living with spacious properties and a tight-knit neighborhood feel."
        localLandmarks="Popular party locations in Christmas include the area near Fort Christmas Historical Park, spacious residential properties along State Road 50 and surrounding roads, church grounds for community gatherings, and the many private acreages perfect for large celebrations. Christmas's rural character means bigger yards and more room for our largest inflatables—take advantage of the space and throw an epic outdoor party!"
        faqs={faqs}
        customSections={customSections}
      />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
