import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { siteImages } from "@/components/home/ContentImages";
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
  HandHeart
} from "lucide-react";

const ChurchEvents = () => {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Church Event Inflatable Rentals Orlando",
    "description": "Professional inflatable rentals for church events, VBS, fall festivals, and community outreach in Orlando and East Orange County. Safe, family-friendly entertainment.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "(407) 374-3062",
      "areaServed": "Orlando, FL"
    },
    "serviceType": "Church Event Entertainment",
    "areaServed": {
      "@type": "State",
      "name": "Florida"
    }
  };

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
        title="Church Event Inflatable Rentals Orlando | VBS, Fall Festivals & Outreach"
        description="Professional inflatable rentals for church events in Orlando. VBS, fall festivals, community outreach & more. Safe, family-friendly entertainment. Get a free quote!"
        canonical="/events/church-events"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(eventSchema)}
        </script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Church Events", href: "/events/church-events" }
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

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-page text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Plan Your Church Event?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact us today for a free quote and special ministry pricing!
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
