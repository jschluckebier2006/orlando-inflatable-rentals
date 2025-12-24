import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ServiceSchema } from "@/components/seo/ServiceSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { EventCategoriesGrid } from "@/components/home/EventCategoriesGrid";
import { EventCrossLinks } from "@/components/home/EventCrossLinks";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { siteImages } from "@/components/home/ContentImages";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { 
  Building, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle,
  Phone,
  Calendar,
  Target,
  Award,
  Briefcase,
  TrendingUp,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Heart,
  Megaphone,
  PartyPopper
} from "lucide-react";
import slideTunnel from "@/assets/slide-tunnel-1.jpg";
import kidsGroupSlide from "@/assets/kids-group-slide-1.jpg";

const CorporateEvents = () => {
  const [showCorporateFAQ, setShowCorporateFAQ] = useState(false);
  const [showMoreLinks, setShowMoreLinks] = useState(false);

  const features = [
    {
      icon: Building,
      title: "Professional Service",
      description: "Corporate-level service with timely delivery, professional staff, and seamless execution."
    },
    {
      icon: Shield,
      title: "Fully Insured",
      description: "Comprehensive liability insurance with certificates available for your venue or company."
    },
    {
      icon: Target,
      title: "Team Building Options",
      description: "Interactive games and obstacle courses perfect for building camaraderie and friendly competition."
    },
    {
      icon: Users,
      title: "Scalable Solutions",
      description: "From small department gatherings to company-wide events with hundreds of attendees."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Weekday and weekend availability to accommodate your corporate calendar."
    },
    {
      icon: Award,
      title: "All-Ages Entertainment",
      description: "Options for employees and their families to enjoy together."
    }
  ];

  const eventTypes = [
    {
      title: "Company Picnics",
      description: "Transform your annual company picnic into an unforgettable celebration with bounce houses, games, and concessions for employees and families.",
      recommended: ["Large Bounce Houses", "Obstacle Courses", "Concession Package"]
    },
    {
      title: "Team Building Events",
      description: "Foster teamwork and friendly competition with interactive games and challenges that bring departments together.",
      recommended: ["Interactive Games", "Obstacle Courses", "Giant Games"]
    },
    {
      title: "Employee Appreciation Days",
      description: "Show your team how much you value them with fun activities and entertainment that break the routine.",
      recommended: ["Bounce Houses", "Snow Cone Machines", "Popcorn Machines"]
    },
    {
      title: "Family Fun Days",
      description: "Create a memorable experience for employees and their families with entertainment options for all ages.",
      recommended: ["Combo Bounce Houses", "Water Slides", "Concession Bundle"]
    }
  ];

  const packages = [
    {
      name: "Small Gathering",
      employees: "Up to 50",
      items: ["1 Bounce House or Game", "1 Concession Machine"],
      ideal: "Department events"
    },
    {
      name: "Company Picnic",
      employees: "50-150",
      items: ["2 Inflatables", "1 Obstacle Course", "Concession Bundle"],
      ideal: "Medium companies"
    },
    {
      name: "Large Event",
      employees: "150-300",
      items: ["3-4 Inflatables", "2 Interactive Games", "Full Concession Setup"],
      ideal: "Large gatherings"
    },
    {
      name: "Enterprise",
      employees: "300+",
      items: ["Custom selection", "Multiple zones", "Full event support"],
      ideal: "Major events"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Corporate Event Inflatable Rentals Orlando | Company Picnics"
        description="Professional inflatable rentals for corporate events in Orlando. Company picnics, team building, employee appreciation & more. Fully insured. Get a free quote!"
        canonical="/events/corporate-event-inflatable-rentals-in-orlando"
      />
      <ServiceSchema
        serviceName="Corporate Event Inflatable Rentals Orlando"
        description="Professional inflatable rentals for corporate events, company picnics, team building, and employee appreciation in Orlando and East Orange County."
        url="/events/corporate-event-inflatable-rentals-in-orlando"
      />
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Corporate Events", href: "/events/corporate-event-inflatable-rentals-in-orlando" }
        ]}
      />
      <FAQPageSchema
        faqs={[
          { question: "Do you provide insurance documentation for corporate events?", answer: "Yes. We carry comprehensive liability insurance and provide certificates of insurance for your venue or company upon request." },
          { question: "Can you accommodate large company picnics?", answer: "Absolutely. We have packages designed for events of all sizes, from small team outings to large corporate celebrations with hundreds of employees and families." },
          { question: "What equipment is best for team building events?", answer: "Obstacle courses and interactive games like basketball challenges encourage friendly competition and teamwork. We can recommend the best options for your team size." },
          { question: "Do you offer delivery to corporate venues and parks?", answer: "Yes. We deliver to corporate campuses, public parks, private venues, and HOA clubhouses throughout Orlando and East Orange County." },
          { question: "How far in advance should we book for a corporate event?", answer: "We recommend booking 2-3 weeks in advance for corporate events, especially during peak seasons like spring and fall when outdoor events are popular." }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${siteImages.kidsGroupSlide1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <Building className="h-5 w-5" />
              <span className="font-medium">Corporate Event Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Corporate Event Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Professional entertainment solutions for company picnics, team building events, and employee appreciation days. 
              Fully insured and ready for your corporate calendar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Request Corporate Quote
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
              <TrendingUp className="h-8 w-8 text-primary" />
              Elevate Your Corporate Events
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Orlando Inflatables, we understand that corporate events are investments in your most valuable 
              asset – your people. Whether you're planning the annual company picnic, a team building day, or 
              an employee appreciation event, we provide professional entertainment solutions that create lasting 
              memories and strengthen workplace bonds.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Our experience serving businesses throughout Orlando and East Orange County means we understand 
              the expectations of corporate clients. From timely delivery and professional setup to comprehensive 
              insurance documentation and seamless execution, we handle every detail so you can focus on your team.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We work with companies of all sizes – from local startups hosting their first team event to 
              established corporations planning annual celebrations for hundreds of employees and their families. 
              Our scalable solutions ensure the right fit for your event size and budget.
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
            <h2 className="text-3xl font-bold mb-4">Why Companies Choose Orlando Inflatables</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Professional service that meets corporate expectations and exceeds employee expectations.
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
              Corporate Events We Serve
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From intimate team gatherings to large-scale company celebrations.
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
      <EventCrossLinks currentEvent="corporate" />

      {/* Packages */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Corporate Event Packages</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scalable solutions designed for your company size and event goals.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.name} className="text-center">
                <CardContent className="p-6">
                  <Briefcase className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{pkg.name}</h3>
                  <p className="text-primary font-medium mb-4">{pkg.employees} employees</p>
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

      {/* Team Building Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Team Building with Inflatables
            </h2>
            <div className="bg-muted/30 rounded-xl p-8">
              <p className="text-lg text-muted-foreground mb-6">
                Inflatable games and obstacle courses are perfect for team building because they encourage 
                collaboration, friendly competition, and breaking down workplace hierarchies in a fun environment.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Competition Ideas:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Department vs. department relay races
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Obstacle course time trials
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Interactive game tournaments
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Team challenge courses
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">Benefits:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Breaks down barriers between teams
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Creates shared experiences
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Encourages healthy competition
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Builds lasting memories
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance & Documentation */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Insurance & Documentation</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Certificates of Insurance</h3>
                <p className="text-muted-foreground mb-4">
                  We carry comprehensive general liability insurance and can provide Certificates of Insurance 
                  (COI) naming your company, venue, or event as additional insured.
                </p>
                <p className="text-muted-foreground">
                  Just provide your insurance requirements when booking, and we'll have documentation ready 
                  for your procurement or venue approval process.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">What We Provide:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Certificate of Insurance (COI)
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Additional insured endorsement
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    W-9 for vendor registration
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Detailed invoicing for accounting
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Tips */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Corporate Event Planning Tips</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mt-6 mb-3">Consider Your Venue</h3>
              <p className="text-muted-foreground">
                Whether you're hosting at your office campus, a park, or a rented venue, we can work with 
                various setups. Share your venue details for specific recommendations on equipment that fits.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Plan for All Attendees</h3>
              <p className="text-muted-foreground">
                If families are invited, consider age-appropriate options for children while adults 
                enjoy interactive games and socializing areas.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Weather Contingencies</h3>
              <p className="text-muted-foreground">
                For outdoor corporate events in Florida, have a backup plan. We offer flexible 
                rescheduling for weather issues and can suggest covered venue alternatives.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Timing Considerations</h3>
              <p className="text-muted-foreground">
                We recommend longer rental periods for corporate events to allow for setup before 
                guests arrive and leisurely enjoyment without rushing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Corporate Event Rentals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Obstacle Courses</h3>
                <p className="text-muted-foreground mb-4">Perfect for team competitions and challenges.</p>
                <Button variant="outline" asChild>
                  <Link to="/obstacle-course-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Interactive Games</h3>
                <p className="text-muted-foreground mb-4">Engaging activities for all skill levels.</p>
                <Button variant="outline" asChild>
                  <Link to="/interactive-game-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Concessions</h3>
                <p className="text-muted-foreground mb-4">Popcorn, snow cones, and more for all.</p>
                <Button variant="outline" asChild>
                  <Link to="/concession-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-6 text-center">Corporate Event Delivery Areas</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We deliver to business locations throughout East Orange County and surrounding areas.
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

      {/* SECTION 1: East Orlando Corporate Authority Block */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">East Orlando Businesses</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Corporate Event Rentals Across East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Orlando Inflatables provides corporate event rentals throughout East Orlando, working with businesses, offices, property managers, and event planners to deliver professional, well-organized events.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  We support a wide range of corporate events including:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Employee appreciation days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Company picnics and family days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Team building events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Grand openings and brand activations</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Because we regularly serve East Orlando businesses, we understand venue logistics, scheduling expectations, and the importance of clean, professional presentation for corporate events.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={slideTunnel} 
                  alt="Professional inflatable setup for East Orlando corporate event" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <p className="font-bold">Serving Businesses</p>
                  <p className="text-sm opacity-90">Throughout East Orlando</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Team Building & Employee Engagement */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={kidsGroupSlide} 
                  alt="Team enjoying corporate event inflatables in East Orlando" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Target className="h-5 w-5" />
                  <span className="font-medium">Team Building</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Team Building & Employee Engagement Events</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Inflatables are an effective way to encourage interaction and team engagement at corporate events. Orlando Inflatables offers options that promote friendly competition and group participation.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Popular team building rentals include:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Obstacle courses for timed challenges</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Interactive inflatable games</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Large inflatables for group participation</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Our team helps companies plan layouts that maximize participation while maintaining safety and professionalism.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Picnics Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <PartyPopper className="h-5 w-5" />
                <span className="font-medium">Company Picnics</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Company Picnics & Corporate Family Days</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Company picnics and family-friendly corporate events are popular across East Orlando. Inflatables create a welcoming environment for employees and their families.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Bounce Houses</h3>
                  <p className="text-muted-foreground text-sm">Perfect for younger children</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Combos & Slides</h3>
                  <p className="text-muted-foreground text-sm">Great for mixed age groups</p>
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
              We coordinate setup and timing to ensure events run smoothly without disrupting business operations.
            </p>
          </div>
        </div>
      </section>

      {/* Grand Openings Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Megaphone className="h-5 w-5" />
                <span className="font-medium">Promotional Events</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Grand Openings & Promotional Events</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8">
                Inflatables are also effective for attracting attention at grand openings, promotions, and public-facing corporate events. Orlando Inflatables provides clean, eye-catching rentals that enhance visibility and guest engagement.
              </p>
            </div>
            
            <div className="bg-muted/30 rounded-xl p-8">
              <h3 className="font-semibold text-lg mb-4 text-center">Our team works with businesses to ensure:</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Proper placement for foot traffic</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Safe setup in parking lots or paved areas</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">Professional presentation aligned with brand image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: East Orlando Corporate Event FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">East Orlando Corporate Event Rental FAQs</h2>
              <p className="text-muted-foreground text-lg">
                Get answers to common questions about corporate event rentals in East Orlando.
              </p>
            </div>
            
            <Collapsible open={showCorporateFAQ} onOpenChange={setShowCorporateFAQ}>
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Do you provide inflatable rentals for corporate events in East Orlando?</h4>
                    <p className="text-muted-foreground">
                      Yes. Orlando Inflatables provides corporate event rentals throughout East Orlando for businesses of all sizes.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Are inflatables appropriate for professional corporate events?</h4>
                    <p className="text-muted-foreground">
                      Yes. Many corporate events use inflatables for team building, family days, and employee appreciation events. We help select options that fit your event goals and audience.
                    </p>
                  </CardContent>
                </Card>
                
                <CollapsibleContent className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can inflatables be set up at office parks or commercial properties?</h4>
                      <p className="text-muted-foreground">
                        Yes. We regularly set up inflatables at office parks, commercial properties, and outdoor business locations, coordinating placement and power access.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can corporate events include both inflatables and concessions?</h4>
                      <p className="text-muted-foreground">
                        Yes. Many businesses combine inflatables with concessions to create a full event experience.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Do you provide delivery, setup, and takedown for corporate events?</h4>
                      <p className="text-muted-foreground">
                        Yes. Our team handles professional delivery, setup, and takedown so your staff can focus on hosting the event.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showCorporateFAQ ? (
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
                Looking for more ways to make your East Orlando corporate event unforgettable? Explore our full range of rentals, from <Link to="/bounce-house-rentals" className="text-primary hover:underline font-medium">corporate bounce house rentals in East Orlando</Link> to <Link to="/obstacle-course-rentals" className="text-primary hover:underline font-medium">obstacle courses for team building</Link>.
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
                      We also provide rentals for <Link to="/events/birthday-parties" className="text-primary hover:underline font-medium">birthday parties</Link>, <Link to="/events/school-events" className="text-primary hover:underline font-medium">school events</Link>, and <Link to="/events/church-events" className="text-primary hover:underline font-medium">church events</Link> throughout East Orlando.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Popular Corporate Event Rentals:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                      <Link to="/obstacle-course-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Obstacle Courses
                      </Link>
                      <Link to="/interactive-game-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Interactive Games
                      </Link>
                      <Link to="/bounce-house-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Bounce Houses
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

      {/* SECTION 5: East Orlando Corporate CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-page text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">East Orlando Businesses</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book Corporate Event Rentals in East Orlando
          </h2>
          <p className="text-xl mb-4 opacity-90 max-w-3xl mx-auto">
            Orlando Inflatables proudly supports businesses throughout East Orlando with clean, reliable, and professionally managed corporate event rentals. Whether you're planning a company picnic, team building event, or grand opening, our team is ready to help.
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Contact us today to check availability and reserve corporate event rentals for your East Orlando event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Request Corporate Quote
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

export default CorporateEvents;
