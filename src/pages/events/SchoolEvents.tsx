import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { EventCategoriesGrid } from "@/components/home/EventCategoriesGrid";
import { EventCrossLinks } from "@/components/home/EventCrossLinks";
import { RelatedBlogPosts } from "@/components/home/RelatedBlogPosts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { siteImages } from "@/components/home/ContentImages";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import {
  GraduationCap, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle,
  Phone,
  Calendar,
  FileText,
  Award,
  Building2,
  Heart,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Trophy,
  PartyPopper
} from "lucide-react";
import kidsGroupSlide from "@/assets/kids-group-slide-1.jpg";
import kidsSmilingBounce from "@/assets/kids-smiling-bounce-1.jpg";

const SchoolEvents = () => {
  const [showSchoolFAQ, setShowSchoolFAQ] = useState(false);
  const [showMoreLinks, setShowMoreLinks] = useState(false);

  const features = [
    {
      icon: Shield,
      title: "Fully Insured",
      description: "We carry comprehensive liability insurance and can provide certificates of insurance for your school district."
    },
    {
      icon: FileText,
      title: "School-Approved Equipment",
      description: "All inflatables meet or exceed safety standards required by Orange County schools."
    },
    {
      icon: Users,
      title: "High-Capacity Units",
      description: "Large inflatables designed for high volume to keep lines short and kids engaged."
    },
    {
      icon: Clock,
      title: "Extended Hours Available",
      description: "Multi-day rentals and extended hours for week-long events and festivals."
    },
    {
      icon: Building2,
      title: "Gymnasium Friendly",
      description: "Indoor-appropriate units for gymnasium events when weather doesn't cooperate."
    },
    {
      icon: Award,
      title: "PTO & Fundraiser Pricing",
      description: "Special discounts for PTOs, PTAs, and school fundraising events."
    }
  ];

  const eventTypes = [
    {
      title: "Field Day Events",
      description: "Make field day the most anticipated day of the school year with obstacle courses, bounce houses, and interactive games that get kids moving and having fun.",
      recommended: ["Obstacle Courses", "Interactive Games", "Bounce Houses"]
    },
    {
      title: "School Carnivals & Festivals",
      description: "Create a carnival atmosphere with multiple inflatables, concession machines, and games that keep the whole family entertained for hours.",
      recommended: ["Combo Bounce Houses", "Concession Machines", "Interactive Games"]
    },
    {
      title: "End of Year Celebrations",
      description: "Celebrate academic achievements with a splash! Water slides and bounce houses make the perfect reward for a year of hard work.",
      recommended: ["Water Slides", "Bounce House Combos", "Snow Cone Machines"]
    },
    {
      title: "Fundraiser Events",
      description: "Boost your fundraiser attendance and revenue with exciting inflatables that draw families to your event.",
      recommended: ["Large Bounce Houses", "Obstacle Courses", "Concession Machines"]
    }
  ];

  const packages = [
    {
      name: "Field Day Package",
      items: ["2 Obstacle Courses", "1 Large Bounce House", "2 Interactive Games"],
      ideal: "Up to 300 students"
    },
    {
      name: "Carnival Package",
      items: ["3 Bounce Houses", "1 Water Slide (seasonal)", "Concession Bundle"],
      ideal: "Up to 500 attendees"
    },
    {
      name: "Small School Package",
      items: ["1 Combo Bounce House", "1 Obstacle Course", "1 Interactive Game"],
      ideal: "Up to 150 students"
    },
    {
      name: "Custom Package",
      items: ["Mix and match any units", "Volume discounts", "Multi-day rates"],
      ideal: "Any size event"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="School Event Inflatable Rentals Orlando | Field Days & Carnivals"
        description="Professional inflatable rentals for school events in Orlando. Fully insured, school-approved equipment for field days, carnivals, and fundraisers. Get a free quote today!"
        canonical="/events/school-event-inflatable-rentals-in-orlando"
      />
      <ServiceSchema
        serviceName="School Event Inflatable Rentals Orlando"
        description="Professional inflatable rentals for school events, field days, carnivals, and fundraisers in Orlando and East Orange County. Safe, insured, and school-approved equipment."
        url="/events/school-event-inflatable-rentals-in-orlando"
      />
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "School Events", href: "/events/school-event-inflatable-rentals-in-orlando" }
        ]}
      />
      <FAQPageSchema
        faqs={[
          { question: "Do you provide insurance certificates for Orange County schools?", answer: "Yes. Orlando Inflatables carries comprehensive liability insurance and provides Certificates of Insurance (COI) naming your school or district as an additional insured upon request." },
          { question: "What equipment is best for school field days?", answer: "Obstacle courses and interactive games are popular for field days because they can handle high volume and keep lines moving. We recommend multiple units spread across your space." },
          { question: "Can you set up inflatables in a school gymnasium?", answer: "Yes. We have indoor-appropriate units for gymnasium events when weather doesn't cooperate. These units are designed for indoor use with proper ventilation." },
          { question: "Do you offer discounts for schools and PTOs?", answer: "Yes. We offer special pricing for educational institutions, PTOs, and non-profit fundraising events. Multi-unit and multi-day discounts are also available." },
          { question: "How far in advance should schools book?", answer: "We recommend booking 3-4 weeks ahead for field days and end-of-year celebrations, as these dates tend to be popular across many schools." }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteImages.kidsSmilingBounce1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">School Event Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              School Event Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Fully insured, school-approved inflatable rentals for field days, carnivals, fundraisers, and celebrations. 
              Trusted by schools throughout Orange County.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Request School Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20" asChild>
                <Link to="/rentals">View All Rentals</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Your Partner for Successful School Events
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Orlando Inflatables, we understand the unique requirements that schools have for event rentals. 
              That's why we've built our business around providing safe, insured, and school-approved inflatable 
              entertainment that meets the strict standards of Orange County schools and districts throughout 
              Central Florida.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're planning a field day for 500 students, a carnival fundraiser for the whole community, 
              or an end-of-year celebration to reward your students, we have the experience and equipment to make 
              your event a tremendous success. Our team works directly with PTOs, administrators, and event 
              coordinators to ensure seamless planning and execution.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We know that budget matters for schools, which is why we offer special pricing for educational 
              institutions, PTOs, and non-profit fundraising events. Multi-unit and multi-day discounts help 
              stretch your event budget further while providing maximum entertainment value for students and families.
            </p>
          </div>
        </div>
      </section>

      {/* Category Icons */}
      <EventCategoriesGrid />

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Schools Trust Orlando Inflatables</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We specialize in school events and understand the requirements that make them successful.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              School Events We Serve
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From small classroom celebrations to district-wide events, we have the right equipment for every occasion.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {eventTypes.map((event) => (
              <Card key={event.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Recommended Rentals:</p>
                    <div className="flex flex-wrap gap-2">
                      {event.recommended.map((item) => (
                        <span key={item} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Cross-Links to Other Events */}
      <EventCrossLinks currentEvent="school" />

      {/* Related Blog Posts */}
      <RelatedBlogPosts eventType="school" />

      {/* Packages */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">School Event Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Pre-configured packages designed for schools, or create your own custom combination.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.name} className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-4">{pkg.name}</h3>
                  <ul className="space-y-2 mb-4">
                    {pkg.items.map((item) => (
                      <li key={item} className="text-muted-foreground text-sm flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    {pkg.ideal}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance & Documentation */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Insurance & Documentation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Certificates of Insurance</h3>
                <p className="text-muted-foreground mb-4">
                  We understand that most schools require vendors to provide proof of insurance. We carry 
                  comprehensive general liability insurance and can provide a Certificate of Insurance (COI) 
                  naming your school or district as an additional insured upon request.
                </p>
                <p className="text-muted-foreground">
                  Just let us know your requirements when booking, and we'll have the documentation ready 
                  in time for your event approval process.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Safety Certifications</h3>
                <p className="text-muted-foreground mb-4">
                  All of our inflatable equipment is:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Commercially rated and manufactured
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Regularly inspected for safety
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Cleaned and sanitized before each rental
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Properly anchored by trained staff
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Tips */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">School Event Planning Tips</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mt-6 mb-3">Book Well in Advance</h3>
              <p className="text-muted-foreground">
                Field days and end-of-year celebrations all tend to fall within the same few weeks. 
                Book 3-4 weeks ahead to ensure you get your first choice of equipment and preferred delivery time.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Plan Your Layout</h3>
              <p className="text-muted-foreground">
                Consider traffic flow when placing inflatables. Spread them across your space to prevent 
                crowding and create clear pathways between attractions. We can help with layout suggestions.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Arrange Sufficient Supervision</h3>
              <p className="text-muted-foreground">
                Each inflatable should have dedicated adult supervision. Plan for parent volunteers 
                or staff members at each station to enforce rules and ensure safety.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Consider Power Requirements</h3>
              <p className="text-muted-foreground">
                Each inflatable requires its own 20-amp circuit. We can discuss generator options for 
                outdoor areas without convenient power access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular School Event Rentals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Obstacle Courses</h3>
                <p className="text-muted-foreground mb-4">High-capacity fun that keeps lines moving fast.</p>
                <Button variant="outline" asChild>
                  <Link to="/obstacle-course-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Interactive Games</h3>
                <p className="text-muted-foreground mb-4">Competitive games students love.</p>
                <Button variant="outline" asChild>
                  <Link to="/interactive-game-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Bounce Houses</h3>
                <p className="text-muted-foreground mb-4">Classic fun for elementary students.</p>
                <Button variant="outline" asChild>
                  <Link to="/bounce-house-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-6 text-center">Schools We Serve</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We deliver to schools throughout East Orange County and surrounding areas.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Alafaya", href: "/water-slide-and-bounce-house-rental-alafaya" },
              { name: "Avalon Park", href: "/water-slide-and-bounce-house-rental-avalon-park" },
              { name: "Waterford Lakes", href: "/water-slide-and-bounce-house-rental-waterford-lakes" },
              { name: "Stoneybrook", href: "/water-slide-and-bounce-house-rental-stoneybrook" },
              { name: "Eastwood", href: "/water-slide-and-bounce-house-rental-eastwood" },
              { name: "Azalea Park", href: "/water-slide-and-bounce-house-rental-azalea-park" },
              { name: "Christmas", href: "/water-slide-and-bounce-house-rental-christmas" },
              { name: "Chuluota", href: "/water-slide-and-bounce-house-rental-chuluota" },
              { name: "Bithlo", href: "/water-slide-and-bounce-house-rental-bithlo" },
              { name: "Wedgefield", href: "/water-slide-and-bounce-house-rental-wedgefield" }
            ].map((area) => (
              <Link
                key={area.name}
                to={area.href}
                className="bg-background border rounded-full px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: East Orlando School Authority Block */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">East Orlando Schools</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">School Event Rentals Across East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Orlando Inflatables specializes in providing school event rentals throughout East Orlando, working with elementary schools, middle schools, high schools, PTAs, and school administrators to deliver safe, organized, and engaging events.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  We regularly support school events such as:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Field days and reward days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">End-of-year celebrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">School carnivals and festivals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Fundraisers and PTA events</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Because we serve East Orlando schools year-round, we understand campus layouts, supervision needs, and scheduling requirements that schools expect from a professional rental provider.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={kidsGroupSlide} 
                  alt="Students enjoying inflatable slide at East Orlando school event" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <p className="font-bold">Trusted by Schools</p>
                  <p className="text-sm opacity-90">Throughout East Orlando</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: School Event Types - Field Days */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={kidsSmilingBounce} 
                  alt="Kids enjoying field day inflatables at East Orlando school" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Field Day Specialists</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Inflatables for East Orlando School Field Days</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Field days are one of the most popular school events in East Orlando. Orlando Inflatables provides commercial-grade inflatables designed for continuous use and high participation.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Popular field day rentals include:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Large obstacle courses for rotation groups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Multiple bounce houses to reduce wait times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Interactive inflatable games that encourage teamwork</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our team helps schools plan spacing, flow, and setup so students can rotate safely and efficiently throughout the event.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Carnivals Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <PartyPopper className="h-5 w-5" />
                <span className="font-medium">Carnivals & Festivals</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">School Carnivals, Festivals & PTA Events</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                School carnivals and PTA events require reliable equipment and professional coordination. Orlando Inflatables offers a wide range of inflatables that work well for indoor gyms, outdoor fields, and blacktop areas.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Bounce Houses & Combos</h3>
                  <p className="text-muted-foreground text-sm">Multiple sizes for all age groups</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Games & Obstacle Courses</h3>
                  <p className="text-muted-foreground text-sm">Competitive fun for students</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Concessions</h3>
                  <p className="text-muted-foreground text-sm">Popcorn, cotton candy, snow cones</p>
                </CardContent>
              </Card>
            </div>
            
            <p className="text-muted-foreground text-lg text-center">
              We work closely with school staff to ensure proper placement, power access, and safety compliance.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: East Orlando School Event FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">East Orlando School Event Rental FAQs</h2>
              <p className="text-muted-foreground text-lg">
                Get answers to common questions about school event rentals in East Orlando.
              </p>
            </div>
            
            <Collapsible open={showSchoolFAQ} onOpenChange={setShowSchoolFAQ}>
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Do you provide inflatable rentals for East Orlando schools?</h4>
                    <p className="text-muted-foreground">
                      Yes. Orlando Inflatables provides school event rentals throughout East Orlando, including elementary, middle, and high schools.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Are your inflatables safe for school use?</h4>
                    <p className="text-muted-foreground">
                      Yes. All inflatables are commercial-grade, regularly inspected, and cleaned before each event. We also provide clear safety guidelines for school staff.
                    </p>
                  </CardContent>
                </Card>
                
                <CollapsibleContent className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can you handle large school events with many students?</h4>
                      <p className="text-muted-foreground">
                        Absolutely. We regularly support large field days and school festivals by providing multiple inflatables and helping plan event flow.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Do you provide delivery and setup at schools?</h4>
                      <p className="text-muted-foreground">
                        Yes. Our team handles delivery, professional setup, and takedown at East Orlando school campuses.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can schools combine inflatables with concessions?</h4>
                      <p className="text-muted-foreground">
                        Yes. Many schools pair inflatable rentals with concessions to create a full carnival-style event.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showSchoolFAQ ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        See More FAQs
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* SECTION 4: Internal Linking Reinforcement */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <ArrowRight className="h-5 w-5" />
                <span className="font-medium">Explore More</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Explore More East Orlando Event Rental Options</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Looking for more ways to make your East Orlando school event unforgettable? Explore our full range of rentals, from <Link to="/bounce-house-rentals" className="text-primary hover:underline font-medium">school bounce house rentals in East Orlando</Link> to exciting <Link to="/obstacle-course-rentals" className="text-primary hover:underline font-medium">obstacle courses for field days</Link>.
              </p>
            </div>
            
            <Collapsible open={showMoreLinks} onOpenChange={setShowMoreLinks}>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-center">East Orlando Communities We Serve:</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Link to="/water-slide-and-bounce-house-rental-avalon-park" className="bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                      Avalon Park
                    </Link>
                    <Link to="/water-slide-and-bounce-house-rental-waterford-lakes" className="bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                      Waterford Lakes
                    </Link>
                    <Link to="/water-slide-and-bounce-house-rental-eastwood" className="bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                      Eastwood
                    </Link>
                    <Link to="/water-slide-and-bounce-house-rental-alafaya" className="bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                      Alafaya
                    </Link>
                    <Link to="/water-slide-and-bounce-house-rental-stoneybrook" className="bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium">
                      Stoneybrook
                    </Link>
                  </div>
                </div>
                
                <CollapsibleContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-4">Related Event Types:</h3>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                      We also provide rentals for <Link to="/events/birthday-party-inflatable-rentals-in-orlando" className="text-primary hover:underline font-medium">birthday parties</Link>, <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-medium">church gatherings</Link>, and <Link to="/events/graduation-party-water-slide-rentals-in-orlando" className="text-primary hover:underline font-medium">graduation parties</Link> throughout East Orlando.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Popular School Event Rentals:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                      <Link to="/bounce-house-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Bounce Houses
                      </Link>
                      <Link to="/obstacle-course-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Obstacle Courses
                      </Link>
                      <Link to="/interactive-game-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Interactive Games
                      </Link>
                      <Link to="/concession-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Concessions
                      </Link>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showMoreLinks ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        See More Options
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
              </div>
            </Collapsible>
          </div>
        </div>
      </section>

      {/* SECTION 5: East Orlando School CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-page text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">East Orlando Schools</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book School Event Rentals in East Orlando
          </h2>
          <p className="text-xl mb-4 opacity-90 max-w-3xl mx-auto">
            Orlando Inflatables proudly supports schools throughout East Orlando with clean, dependable, and professionally managed event rentals. Whether you're planning a field day, school carnival, or end-of-year celebration, our team is ready to help.
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Contact us today to check availability and reserve school event rentals for your East Orlando campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Request School Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="tel:+14073743062">
                <Phone className="mr-2 h-5 w-5" />
                Call (407) 374-3062
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SchoolEvents;
