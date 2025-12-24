import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { CTASection } from "@/components/home/CTASection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { MapPin, Phone, ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import { JotformModal } from "@/components/JotformModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import bounceHouseCategoryImg from "@/assets/bounce-house-category.webp";
import bounceSlideComboImg from "@/assets/bounce-slide-combo-category.webp";
import waterSlideCategoryImg from "@/assets/water-slide-category.webp";
import obstacleCourseImg from "@/assets/obstacle-course-category.webp";
import interactiveGamesImg from "@/assets/interactive-games-category.webp";
import concessionsImg from "@/assets/concessions-category.webp";
import tablesChairsImg from "@/assets/tables-chairs-category.webp";
import { ContentImageRow, deliveryPageImages, deliveryPageImages2, getHeroBackground } from "@/components/home/ContentImages";
import { ReviewsSection } from "@/components/home/ReviewsSection";

const services = [
  { name: "Bounce Houses", href: "/bounce-house-rentals", image: bounceHouseCategoryImg },
  { name: "Bounce & Slide Combos", href: "/bounce-slide-combo-rentals", image: bounceSlideComboImg },
  { name: "Water & Dry Slides", href: "/water-slide-rentals", image: waterSlideCategoryImg },
  { name: "Obstacle Courses", href: "/obstacle-course-rentals", image: obstacleCourseImg },
  { name: "Interactive Games", href: "/interactive-game-rentals", image: interactiveGamesImg },
  { name: "Concessions", href: "/concession-rentals", image: concessionsImg },
  { name: "Tables & Chairs", href: "/table-chair-rentals", image: tablesChairsImg },
];

interface NearbyArea {
  name: string;
  slug: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CustomSection {
  id: string;
  content: React.ReactNode;
}

interface CityDeliveryPageProps {
  cityName: string;
  citySlug: string;
  metaTitle: string;
  metaDescription: string;
  nearbyAreas: NearbyArea[];
  cityDescription: string;
  cityWikipediaUrl?: string;
  additionalCityInfo?: string;
  localLandmarks?: string;
  faqs: FAQ[];
  customSections?: CustomSection[];
}

export function CityDeliveryPage({
  cityName,
  citySlug,
  metaTitle,
  metaDescription,
  nearbyAreas,
  cityDescription,
  cityWikipediaUrl,
  additionalCityInfo,
  localLandmarks,
  faqs,
  customSections,
}: CityDeliveryPageProps) {
  const [showJotform, setShowJotform] = useState(false);
  
  // Convert FAQs to schema format
  const faqSchemaItems = faqs.map(faq => ({
    question: faq.question,
    answer: faq.answer
  }));

  return (
    <Layout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonical={`/water-slide-and-bounce-house-rental-${citySlug}`}
      />
      <LocalBusinessSchema cityName={cityName} />
      <FAQPageSchema faqs={faqSchemaItems} />
      <BreadcrumbSchema
        items={[
          { name: "Delivery Areas", href: "/delivery-area" },
          { name: cityName, href: `/water-slide-and-bounce-house-rental-${citySlug}` },
        ]}
      />

      {/* Hero Section with Background Image */}
      <section className="relative text-white py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getHeroBackground(citySlug)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-6 w-6" />
              <span className="text-lg drop-shadow-lg">Now Serving</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 drop-shadow-lg">
              Bounce House & Water Slide Rentals in {cityName}
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-md">
              Your trusted party rental company serving {cityName} and surrounding areas. Free delivery on bounce houses, water slides, obstacle courses, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowJotform(true)}
                size="lg"
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground btn-bounce text-lg px-8"
              >
                Get a Free Quote
              </Button>
              <a href="tel:4074971840">
                <Button
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 btn-bounce text-lg px-8 font-semibold"
                >
                  <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid - Moved to top */}
      <section className="section-padding">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">
              All Party Rental Services in {cityName}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {services.map((service) => (
                <Link key={service.name} to={service.href}>
                  <Card className="h-full card-hover overflow-hidden">
                    {service.image && (
                      <div className="aspect-[16/9] overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.name} 
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-4 flex items-center justify-center">
                      <span className="font-medium text-foreground text-center text-sm">{service.name}</span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            {/* H2: Party Rental Equipment */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Party Rental Equipment Rentals {cityName}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Orlando Inflatables is your premier source for party rental equipment in{" "}
              {cityWikipediaUrl ? (
                <a
                  href={cityWikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {cityName}, Florida <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                `${cityName}, Florida`
              )}
              . {cityDescription}
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Complete Party Rental Inventory for {cityName} Events
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From backyard birthday parties to large community events, we have everything you need to create an unforgettable celebration. Our extensive inventory includes bounce houses in various themes and sizes, thrilling water slides for hot Florida days, challenging obstacle courses, interactive games, concession machines, and tables and chairs for your guests.
            </p>

            {/* H2: Bounce House Rentals */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Bounce House Rentals {cityName} FL
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Our bounce house rentals are the most popular choice for {cityName} birthday parties, school events, and family gatherings. We offer a wide selection of themed bounce houses, combo units with slides, and toddler-friendly options to match any party theme or age group.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Types of Bounce Houses Available in {cityName}
            </h3>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li>• <strong>Standard Bounce Houses:</strong> Classic jumping fun in various sizes and colors</li>
              <li>• <strong>Themed Bounce Houses:</strong> Princess castles, superhero themes, tropical designs, and more</li>
              <li>• <strong>Combo Units:</strong> Bounce houses with attached slides for double the fun</li>
              <li>• <strong>Toddler Inflatables:</strong> Smaller, age-appropriate units for little ones</li>
              <li>• <strong>Large Event Inflatables:</strong> Commercial-grade units for school and church events</li>
            </ul>

            {/* Content Images Row 1 */}
            <ContentImageRow 
              images={deliveryPageImages} 
              alts={[`${cityName} bounce house rental`, `Kids party fun in ${cityName}`, `${cityName} inflatable rentals`]} 
            />

            {/* H2: Water Slide Rentals */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Water Slide Rentals {cityName} Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Beat the Florida heat with our exciting water slide rentals! Perfect for summer parties, pool parties, and any outdoor event in {cityName}. Our water slides range from kid-friendly sizes to massive slides that will thrill guests of all ages.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Water Slide Options for {cityName} Parties
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Choose from single-lane slides, dual-lane racing slides, slip-and-slides, and water slide combos. All our water slides are designed with safety in mind and feature soft landing pools. We provide all the equipment needed – just connect a standard garden hose and you're ready for hours of splashing fun!
            </p>

            {/* H2: About the City */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              About {cityName}, Florida
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {additionalCityInfo || `${cityName} is a wonderful community in the greater Orlando area, known for its family-friendly neighborhoods and active community events. Residents enjoy a suburban lifestyle with easy access to Orlando's attractions, dining, and entertainment options.`}
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Popular Event Venues in {cityName}
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {localLandmarks || `${cityName} offers numerous venues perfect for party rentals, including community parks, HOA clubhouses, schools, churches, and spacious residential backyards. Our delivery team is familiar with the area and can accommodate setups at any location.`}
            </p>

            {/* Content Images Row 2 */}
            <ContentImageRow 
              images={deliveryPageImages2} 
              alts={[`Party celebration in ${cityName}`, `${cityName} water slide fun`, `Birthday party ${cityName}`]} 
            />

            {/* H2: Why Choose Us */}
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              Why Choose Orlando Inflatables in {cityName}?
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              When you book with Orlando Inflatables for your {cityName} event, you're choosing the area's most trusted party rental company. Here's what sets us apart:
            </p>
            <ul className="space-y-2 mb-8 text-muted-foreground">
              <li>• <strong>Free Delivery & Setup:</strong> Complimentary delivery throughout {cityName}</li>
              <li>• <strong>Clean & Sanitized:</strong> Every unit is thoroughly cleaned and inspected before each rental</li>
              <li>• <strong>Licensed & Insured:</strong> Full liability coverage for your peace of mind</li>
              <li>• <strong>On-Time Service:</strong> We arrive when promised and handle all setup</li>
              <li>• <strong>Local Expertise:</strong> We know {cityName} neighborhoods and can recommend the best options for your venue</li>
              <li>• <strong>24/7 Support:</strong> Customer service available throughout your rental period</li>
            </ul>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Our Commitment to {cityName} Families
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We're not just a rental company – we're part of the {cityName} community. Our team takes pride in helping local families create memorable celebrations. From your first phone call to the final pickup, we're dedicated to making your event a success.
            </p>
          </div>
        </div>
      </section>

      {/* Custom Sections */}
      {customSections?.map((section) => (
        <section key={section.id} className="section-padding">
          <div className="container-page">
            <div className="max-w-4xl mx-auto">
              {section.content}
            </div>
          </div>
        </section>
      ))}

      {/* Reviews Section */}
      <ReviewsSection />

      {/* FAQ Section */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h4 className="font-display text-2xl font-bold text-foreground mb-2 text-center">
              Frequently Asked Questions
            </h4>
            <h5 className="text-lg text-muted-foreground mb-8 text-center">
              Common Questions About Party Rentals in {cityName}
            </h5>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card rounded-lg border px-6"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Nearby Areas */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6 text-center">
            We Also Deliver to Nearby Areas
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {nearbyAreas.map((area) => (
              <Link key={area.slug} to={`/water-slide-and-bounce-house-rental-${area.slug}`}>
                <Button variant="outline" className="btn-bounce">
                  <MapPin className="mr-2 h-4 w-4" /> {area.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Rich SEO Interlinking Section */}
      <section className="section-padding section-alt">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6">
              We Are the Best Bounce House Rentals {cityName} Company
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Are you searching for an inflatable "Bounce House Rentals Near Me" in {cityName}, FL area? Well, look no further.{" "}
              <Link to="/" className="text-primary hover:underline font-semibold">
                Orlando Inflatable Rentals LLC
              </Link>{" "}
              offers a wide variety of party inflatable rentals such as bouncy combo slides, inflatable interactive games, water slide rentals, and more! Whether you're hosting a corporate event or your child's birthday party, you'll find exactly what you need to make your event epic! We carry a selection of fun affordable{" "}
              <Link to="/bounce-house-rentals" className="text-primary hover:underline">
                bounce house rentals
              </Link>
              , inexpensive{" "}
              <Link to="/water-slide-rentals" className="text-primary hover:underline">
                water slide rentals
              </Link>
              , Hybrid Water Slides,{" "}
              <Link to="/obstacle-course-rentals" className="text-primary hover:underline">
                Obstacle Course Rentals
              </Link>
              , Bouncer/Slide Combo Rentals,{" "}
              <Link to="/interactive-game-rentals" className="text-primary hover:underline">
                Inflatable Sidewalk Game Rentals
              </Link>
              ,{" "}
              <Link to="/table-chair-rentals" className="text-primary hover:underline">
                Table Rentals, Chair Rentals
              </Link>
              , and{" "}
              <Link to="/concession-rentals" className="text-primary hover:underline">
                Concession Equipment rentals
              </Link>
              . Make your next {cityName} Party a HUGE success with our top party rental equipment rentals – if you need it, we've got it!
            </p>

            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Top Bounce House Rentals {cityName} FL
            </h2>
            <p className="text-muted-foreground mb-4">
              Bounce Houses for rent, Party Rental Equipment Service in {cityName} FL.
            </p>

            <h3 className="font-display text-xl font-semibold text-foreground mb-4">
              Hey {cityName} Residents! If you don't want to miss out on these awesome inflatable rentals, get in touch ASAP!
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              At{" "}
              <Link to="/" className="text-primary hover:underline font-semibold">
                Orlando Inflatable Rentals
              </Link>
              , our fun inflatables can suit any occasion. We have rentals perfect for your child's{" "}
              <Link to="/events/birthday-parties" className="text-primary hover:underline">
                birthday party
              </Link>{" "}
              or just for some family time in Spring, Summer, and Fall. We offer a ton of different units including a{" "}
              <Link to="/bounce-house-rentals" className="text-primary hover:underline">
                bouncy castle
              </Link>{" "}
              and{" "}
              <Link to="/water-slide-rentals" className="text-primary hover:underline">
                water slides with two lanes
              </Link>
              , ensuring that no one ever has to spend time waiting in line again. Get together with your friends and family and enjoy the {cityName}, FL outdoors. We have a range of inflatable bouncers perfect for parties, as well as giant water slides where you can splash around all day.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              When you rent from{" "}
              <a
                href="https://g.page/r/CfkLrEA027rSEAE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-semibold inline-flex items-center gap-1"
              >
                Orlando Inflatable Rentals <ExternalLink className="h-3 w-3" />
              </a>
              , not only can you be sure of getting competitive prices on popular inflatables, but also excellent customer service. {cityName} area residents, support your local {cityName} bounce house rentals vendor and call{" "}
              <a href="tel:4074971840" className="text-primary hover:underline font-semibold">
                407-497-1840
              </a>{" "}
              now to reserve your inflatable rentals. It's time to have some family fun!
            </p>

            <div className="bg-primary/10 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-foreground mb-4">
                Ready to Book Your {cityName} Party Rentals?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowJotform(true)}
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
                    <Phone className="mr-2 h-5 w-5" /> (407) 497-1840
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </Layout>
  );
}
