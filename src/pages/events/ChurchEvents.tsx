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
  Church, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle,
  Phone,
  Calendar,
  Heart,
  Sun,
  Sparkles,
  HandHeart,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Leaf
} from "lucide-react";
import toddlerBounce from "@/assets/toddler-bounce-1.jpg";
import kidsGroupBounce from "@/assets/kids-group-bounce-1.jpg";

const ChurchEvents = () => {
  const [showChurchFAQ, setShowChurchFAQ] = useState(false);
  const [showMoreLinks, setShowMoreLinks] = useState(false);

  const features = [
    {
      icon: Heart,
      title: "Family-Friendly Equipment",
      description: "All our inflatables are appropriate for church settings and family-oriented events."
    },
    {
      icon: Shield,
      title: "Safe & Insured",
      description: "Fully insured with certificates available. We prioritize safety for your congregation's children."
    },
    {
      icon: Users,
      title: "Community Event Experience",
      description: "Years of experience serving church events of all sizes, from small groups to large festivals."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Saturday and Sunday availability, plus multi-day rentals for VBS week."
    },
    {
      icon: HandHeart,
      title: "Ministry Pricing",
      description: "Special rates for churches and faith-based organizations to support your ministry budget."
    },
    {
      icon: Sun,
      title: "Outdoor & Indoor Options",
      description: "Weather-appropriate options including units suitable for fellowship halls."
    }
  ];

  const eventTypes = [
    {
      title: "Vacation Bible School (VBS)",
      description: "Make VBS week unforgettable with themed bounce houses and daily activities that get kids excited to attend. Multi-day rental discounts available.",
      recommended: ["Themed Bounce Houses", "Obstacle Courses", "Snow Cone Machines"]
    },
    {
      title: "Fall Festivals & Trunk or Treat",
      description: "Draw families from your community with exciting inflatables that make your fall festival the event of the season.",
      recommended: ["Bounce Houses", "Interactive Games", "Concession Machines"]
    },
    {
      title: "Summer Programs",
      description: "Keep kids cool and engaged during summer programming with water slides and splash activities.",
      recommended: ["Water Slides", "Slip-N-Slides", "Bounce House Combos"]
    },
    {
      title: "Community Outreach Events",
      description: "Attract families to your outreach events and community open houses with fun for all ages.",
      recommended: ["Large Bounce Houses", "Interactive Games", "Popcorn Machines"]
    }
  ];

  const testimonialQuotes = [
    {
      quote: "Orlando Inflatables made our VBS week absolutely incredible. The kids couldn't stop talking about it!",
      church: "Community Church Member"
    },
    {
      quote: "Their fall festival package helped us double our community attendance this year.",
      church: "Local Church Coordinator"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Church Event Inflatable Rentals Orlando | VBS & Fall Festivals"
        description="Professional inflatable rentals for church events in Orlando. VBS, fall festivals, community outreach & more. Safe, family-friendly entertainment. Get a free quote!"
        canonical="/events/church-event-inflatable-rentals-in-orlando"
      />
      <ServiceSchema
        serviceName="Church Event Inflatable Rentals Orlando"
        description="Professional inflatable rentals for church events, VBS, fall festivals, and community outreach in Orlando and East Orange County. Safe, family-friendly entertainment."
        url="/events/church-event-inflatable-rentals-in-orlando"
      />
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Church Events", href: "/events/church-event-inflatable-rentals-in-orlando" }
        ]}
      />
      <FAQPageSchema
        faqs={[
          { question: "Do you offer ministry pricing for church events?", answer: "Yes. We offer special ministry pricing because we believe in supporting the important work churches do in our community. Contact us for church event discounts." },
          { question: "What inflatables work best for Vacation Bible School?", answer: "Bounce house combos and obstacle courses are popular for VBS because they accommodate multiple age groups and provide hours of entertainment throughout the week." },
          { question: "Can you provide equipment for fall festivals?", answer: "Absolutely. We specialize in church fall festivals with multiple inflatables, concession machines, and games that create a carnival atmosphere for your community." },
          { question: "Are your inflatables appropriate for church settings?", answer: "Yes. All our inflatables are family-friendly and appropriate for church settings. We have a variety of themes suitable for faith-based events." },
          { question: "Do you provide insurance for church events?", answer: "Yes. We carry comprehensive liability insurance and can provide certificates naming your church as an additional insured for your event." }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteImages.kidsGroupBounce1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <Church className="h-5 w-5" />
              <span className="font-medium">Church Event Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Church Event Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Family-friendly inflatable rentals for VBS, fall festivals, summer programs, and community outreach events. 
              Trusted by churches throughout East Orange County.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Request Church Quote
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
              Supporting Your Ministry with Fun & Fellowship
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Orlando Inflatables, we understand that church events are about more than just entertainment – 
              they're about building community, reaching families, and creating lasting memories within your 
              congregation and beyond. That's why we're honored to partner with churches throughout Orlando 
              and East Orange County to provide safe, family-friendly inflatable entertainment.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're planning a week-long Vacation Bible School adventure, a fall festival to welcome 
              your community, or a summer splash day for your youth group, we have the experience and equipment 
              to make your event a success. Our team has served dozens of churches in the area and understands 
              the unique needs of faith-based organizations.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              We offer special ministry pricing because we believe in supporting the important work churches 
              do in our community. From small fellowship events to large outreach festivals, we're here to 
              help you create an atmosphere of joy and connection.
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
            <h2 className="text-3xl font-bold mb-4">Why Churches Choose Orlando Inflatables</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We specialize in church events and understand what makes them successful.
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
              Church Events We Serve
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From weekly programs to annual celebrations, we have the right equipment for your ministry.
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
      <EventCrossLinks currentEvent="church" />

      {/* Related Blog Posts */}
      <RelatedBlogPosts eventType="church" />

      {/* VBS Special Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              VBS Week Special Packages
            </h2>
            <div className="bg-background rounded-xl p-8 shadow-lg">
              <p className="text-lg text-muted-foreground mb-6">
                Vacation Bible School is one of the most important weeks of the year for children's ministry. 
                We offer special multi-day packages designed specifically for VBS programs:
              </p>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">VBS Week Package Includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Monday-Friday rental period
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Daily safety checks available
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Theme-matching options
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Significant multi-day discount
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Popular VBS Additions:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Snow cone machine for daily treats
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Water day activities (Friday splash)
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Obstacle course for relay games
                    </li>
                    <li className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      Popcorn for family night
                    </li>
                  </ul>
                </div>
              </div>
              <p className="text-center">
                <Button asChild>
                  <Link to="/contact">Request VBS Package Quote</Link>
                </Button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">What Churches Say About Us</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialQuotes.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                  <p className="font-medium">– {testimonial.church}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Tips */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Church Event Planning Tips</h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mt-6 mb-3">Coordinate with Your Facilities Team</h3>
              <p className="text-muted-foreground">
                Let us know about any setup requirements or restrictions at your property. We're experienced 
                in working with church campuses and can accommodate various setups.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Plan for Volunteers</h3>
              <p className="text-muted-foreground">
                Each inflatable needs dedicated adult supervision. We recommend recruiting volunteers 
                specifically for bounce house monitoring and establishing clear safety rules.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Consider Your Audience</h3>
              <p className="text-muted-foreground">
                Think about the age range of children attending. We can help you select age-appropriate 
                inflatables and may recommend multiple units for different age groups.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Book Early for Peak Seasons</h3>
              <p className="text-muted-foreground">
                VBS season (June-July) and fall festival weekends (October) book quickly. 
                Contact us early to secure your preferred equipment and dates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Church Event Rentals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Bounce Houses</h3>
                <p className="text-muted-foreground mb-4">Perfect for VBS and children's ministry events.</p>
                <Button variant="outline" asChild>
                  <Link to="/bounce-house-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Water Slides</h3>
                <p className="text-muted-foreground mb-4">Great for summer programs and VBS water days.</p>
                <Button variant="outline" asChild>
                  <Link to="/water-slide-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Concessions</h3>
                <p className="text-muted-foreground mb-4">Add festive treats to your community events.</p>
                <Button variant="outline" asChild>
                  <Link to="/concession-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-6 text-center">Churches We Serve</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We deliver to churches throughout East Orange County and surrounding communities.
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

      {/* SECTION 1: East Orlando Church Authority Block */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">East Orlando Churches</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Church Event Rentals Across East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Orlando Inflatables proudly provides church event rentals throughout East Orlando, serving churches of all sizes for family nights, festivals, outreach events, and seasonal celebrations. Our team understands the importance of safety, professionalism, and clear communication when working with church leadership and volunteers.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  We regularly support church events such as:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Vacation Bible School activities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Fall festivals and trunk-or-treat events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Church family fun days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Community outreach events</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Because we serve East Orlando churches year-round, we understand setup needs for church campuses, parking lots, grassy areas, and fellowship spaces.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={toddlerBounce} 
                  alt="Kids enjoying bounce house at East Orlando church event" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <p className="font-bold">Serving Churches</p>
                  <p className="text-sm opacity-90">Throughout East Orlando</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: VBS & Youth Event Rentals */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={kidsGroupBounce} 
                  alt="Children enjoying VBS inflatable activities at East Orlando church" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-medium">VBS & Youth Events</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Vacation Bible School & Youth Event Rentals</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Vacation Bible School events and youth gatherings are some of the most popular times for churches to rent inflatables. Orlando Inflatables provides age-appropriate, commercial-grade equipment that keeps kids engaged while supporting a safe event environment.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Popular VBS and youth event rentals include:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Bounce houses and combo units</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Obstacle courses for group rotations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Interactive inflatable games</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We help churches plan spacing, age group separation, and event flow to ensure a smooth experience for volunteers and families.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Church Festivals Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Leaf className="h-5 w-5" />
                <span className="font-medium">Festivals & Outreach</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Church Festivals, Fall Events & Outreach Activities</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Church festivals and outreach events require reliable equipment and organized setup. Orlando Inflatables offers inflatables that work well on grass, pavement, and parking lot surfaces.
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
                  <h3 className="font-semibold mb-2">Combos & Obstacle Courses</h3>
                  <p className="text-muted-foreground text-sm">Great for older kids</p>
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
              Our team works closely with church staff to ensure proper placement, power access, and safe operation.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: East Orlando Church Event FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">East Orlando Church Event Rental FAQs</h2>
              <p className="text-muted-foreground text-lg">
                Get answers to common questions about church event rentals in East Orlando.
              </p>
            </div>
            
            <Collapsible open={showChurchFAQ} onOpenChange={setShowChurchFAQ}>
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Do you provide inflatable rentals for churches in East Orlando?</h4>
                    <p className="text-muted-foreground">
                      Yes. Orlando Inflatables provides church event rentals throughout East Orlando for churches of all sizes.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Are your inflatables safe for church and youth events?</h4>
                    <p className="text-muted-foreground">
                      Yes. All inflatables are commercial-grade, regularly inspected, and cleaned before each event. We also provide clear safety guidelines for volunteers and staff.
                    </p>
                  </CardContent>
                </Card>
                
                <CollapsibleContent className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can inflatables be set up in church parking lots?</h4>
                      <p className="text-muted-foreground">
                        Yes. Many East Orlando churches use parking lots or paved areas for events. We help plan safe placement and anchoring.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Do you offer rentals for Vacation Bible School events?</h4>
                      <p className="text-muted-foreground">
                        Absolutely. VBS events are one of the most common church rentals we provide, and we help match inflatables to age groups and schedules.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can churches combine inflatables with concessions?</h4>
                      <p className="text-muted-foreground">
                        Yes. Many churches add concessions to create a full festival-style experience for families and guests.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showChurchFAQ ? (
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
                Looking for more ways to make your East Orlando church event unforgettable? Explore our full range of rentals, from <Link to="/bounce-house-rentals" className="text-primary hover:underline font-medium">church bounce house rentals in East Orlando</Link> to <Link to="/obstacle-course-rentals" className="text-primary hover:underline font-medium">obstacle courses for youth events</Link>.
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
                      We also provide rentals for <Link to="/events/birthday-parties" className="text-primary hover:underline font-medium">birthday parties</Link>, <Link to="/events/school-events" className="text-primary hover:underline font-medium">school events</Link>, and <Link to="/events/graduation-events" className="text-primary hover:underline font-medium">graduation parties</Link> throughout East Orlando.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Popular Church Event Rentals:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                      <Link to="/bounce-house-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Bounce Houses
                      </Link>
                      <Link to="/water-slide-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Water Slides
                      </Link>
                      <Link to="/obstacle-course-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Obstacle Courses
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

      {/* SECTION 5: East Orlando Church CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-page text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">East Orlando Churches</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book Church Event Rentals in East Orlando
          </h2>
          <p className="text-xl mb-4 opacity-90 max-w-3xl mx-auto">
            Orlando Inflatables is honored to support churches throughout East Orlando with clean, reliable, and professionally managed event rentals. Whether you're planning a Vacation Bible School event, fall festival, or community outreach, our team is ready to help.
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Contact us today to check availability and reserve church event rentals for your East Orlando event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Request Church Quote
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

export default ChurchEvents;
