import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  GraduationCap, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle,
  Phone,
  Calendar,
  PartyPopper,
  Award,
  Heart,
  Sparkles
} from "lucide-react";

const GraduationEvents = () => {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Graduation Party Inflatable Rentals Orlando",
    "description": "Professional inflatable rentals for graduation parties in Orlando and East Orange County. Celebrate graduates with bounce houses, water slides, and party entertainment.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "(407) 374-3062",
      "areaServed": "Orlando, FL"
    },
    "serviceType": "Graduation Party Entertainment",
    "areaServed": {
      "@type": "State",
      "name": "Florida"
    }
  };

  const features = [
    {
      icon: GraduationCap,
      title: "Celebration Specialists",
      description: "We understand graduation parties are milestone celebrations and bring our best to honor your graduate."
    },
    {
      icon: Users,
      title: "All Ages Welcome",
      description: "Entertainment options for graduates of all ages – from kindergarten to college."
    },
    {
      icon: Shield,
      title: "Safe & Reliable",
      description: "Fully insured, inspected equipment with professional setup for worry-free celebration."
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "Peak graduation season availability with extended hours for celebration into the evening."
    },
    {
      icon: PartyPopper,
      title: "Party Atmosphere",
      description: "Combine inflatables with concession machines for the ultimate graduation party experience."
    },
    {
      icon: Star,
      title: "Premium Service",
      description: "White-glove delivery and setup so you can focus on celebrating your graduate."
    }
  ];

  const partyIdeas = [
    {
      title: "Backyard Grad Bash",
      description: "Transform your backyard into the ultimate graduation celebration with bounce houses, games, and party snacks for all your guests.",
      recommended: ["Bounce House Combos", "Interactive Games", "Concession Bundle"],
      ageGroup: "High School & College"
    },
    {
      title: "Summer Splash Celebration",
      description: "May and June graduations in Florida call for water fun! Cool down with water slides and splash activities.",
      recommended: ["Water Slides", "Slip-N-Slides", "Snow Cone Machine"],
      ageGroup: "All Ages"
    },
    {
      title: "Pre-K & Elementary Celebration",
      description: "Mark this important milestone with age-appropriate bounce houses and fun treats that young graduates love.",
      recommended: ["Small Bounce Houses", "Toddler Units", "Cotton Candy Machine"],
      ageGroup: "Pre-K & Elementary"
    },
    {
      title: "Middle School Send-Off",
      description: "Celebrate moving on to high school with obstacle courses and competitive games for tweens.",
      recommended: ["Obstacle Courses", "Interactive Games", "Popcorn Machine"],
      ageGroup: "Middle School"
    }
  ];

  const graduationTypes = [
    {
      type: "Pre-Kindergarten",
      description: "Celebrate your little one's first big achievement with toddler-friendly bounce houses and age-appropriate fun."
    },
    {
      type: "Elementary School",
      description: "Mark the transition to middle school with exciting bounce houses and games for young achievers."
    },
    {
      type: "Middle School",
      description: "Celebrate moving up with obstacle courses and interactive games that tweens love."
    },
    {
      type: "High School",
      description: "Honor this major milestone with premium inflatables and a party your graduate will never forget."
    },
    {
      type: "College",
      description: "Celebrate years of hard work with an unforgettable party for graduates and their friends."
    },
    {
      type: "Graduate School",
      description: "Advanced degrees deserve advanced celebrations – we'll help make it memorable."
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Graduation Party Inflatable Rentals Orlando | Celebrate Your Graduate"
        description="Celebrate your graduate with bounce house rentals in Orlando. Pre-K to college graduation parties. Water slides, games & concessions. Book your celebration today!"
        canonical="/events/graduation-events"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(eventSchema)}
        </script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Graduation Events", href: "/events/graduation-events" }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">Graduation Party Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Graduation Party Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Celebrate your graduate's achievement with memorable party entertainment. From Pre-K to PhD, 
              we make graduation celebrations unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Get a Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
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
              <Award className="h-8 w-8 text-primary" />
              Celebrate Every Graduation Milestone
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Graduation marks the end of one chapter and the exciting beginning of another. At Orlando Inflatables, 
              we believe every graduation – from preschool to postgraduate – deserves a celebration that matches 
              the significance of the achievement. Our bounce houses, water slides, and party entertainment help 
              you create the perfect atmosphere for honoring your graduate.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              May and June in Florida are prime graduation season, and our outdoor entertainment options are 
              perfect for the warm weather. Water slides help guests beat the heat while bounce houses and 
              interactive games keep the energy high throughout your celebration. Add our concession machines 
              for that authentic party atmosphere.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're hosting an intimate backyard gathering or a large party with extended family and 
              friends, we have packages and individual rentals to fit your needs and budget. Let us help you 
              create a graduation party that your graduate and guests will remember for years to come.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us for Graduation Parties</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We specialize in making milestone celebrations memorable and stress-free.
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

      {/* Party Ideas */}
      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Graduation Party Ideas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find the perfect party setup for your graduate's celebration.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partyIdeas.map((idea) => (
              <Card key={idea.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                      {idea.ageGroup}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{idea.title}</h3>
                  <p className="text-muted-foreground mb-4">{idea.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">Recommended Rentals:</p>
                    <div className="flex flex-wrap gap-2">
                      {idea.recommended.map((item) => (
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

      {/* Graduation Types */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">We Celebrate All Graduates</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every milestone deserves recognition. We have entertainment for graduates of all ages.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {graduationTypes.map((grad) => (
              <Card key={grad.type} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <GraduationCap className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">{grad.type}</h3>
                  <p className="text-muted-foreground text-sm">{grad.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Peak Season Info */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              Graduation Season Tips
            </h2>
            <div className="bg-muted/30 rounded-xl p-8">
              <div className="prose prose-lg max-w-none">
                <h3 className="text-xl font-semibold mb-3">Book Early – It's Peak Season!</h3>
                <p className="text-muted-foreground mb-6">
                  May and June are our busiest months as graduation parties, end-of-school celebrations, 
                  and summer events all converge. To ensure you get your first choice of equipment and 
                  preferred time slot, we strongly recommend booking 3-4 weeks in advance.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">What to Consider:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Guest count and age range
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Available outdoor space
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Access to power outlets
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Water access (for water slides)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Florida Weather Tips:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Water slides are perfect for hot days
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Provide shade for guests
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Have a rain backup plan
                      </li>
                      <li className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Afternoon thunderstorms are common
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What's Included</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Free Delivery & Setup</h3>
                    <p className="text-muted-foreground text-sm">Professional delivery and installation within our service area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Clean & Sanitized Equipment</h3>
                    <p className="text-muted-foreground text-sm">Every unit is thoroughly cleaned before your event.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Safety Instructions</h3>
                    <p className="text-muted-foreground text-sm">Clear guidelines for safe operation during your party.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">All Necessary Equipment</h3>
                    <p className="text-muted-foreground text-sm">Blowers, extension cords, and anchoring included.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Pickup After Event</h3>
                    <p className="text-muted-foreground text-sm">We return at your scheduled time to pack everything up.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Support Available</h3>
                    <p className="text-muted-foreground text-sm">Phone support during your event if needed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Graduation Party Rentals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Water Slides</h3>
                <p className="text-muted-foreground mb-4">Beat the May/June heat with exciting water fun.</p>
                <Button variant="outline" asChild>
                  <Link to="/water-slide-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Bounce Houses</h3>
                <p className="text-muted-foreground mb-4">Classic party entertainment for all ages.</p>
                <Button variant="outline" asChild>
                  <Link to="/bounce-house-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Concessions</h3>
                <p className="text-muted-foreground mb-4">Snow cones, popcorn & cotton candy.</p>
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
          <h2 className="text-3xl font-bold mb-6 text-center">Graduation Party Delivery Areas</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We deliver to graduation parties throughout East Orange County and surrounding communities.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Alafaya", href: "/delivery-area/alafaya" },
              { name: "Avalon Park", href: "/delivery-area/avalon-park" },
              { name: "Waterford Lakes", href: "/delivery-area/waterford-lakes" },
              { name: "Stoneybrook", href: "/delivery-area/stoneybrook" },
              { name: "Eastwood", href: "/delivery-area/eastwood" },
              { name: "Azalea Park", href: "/delivery-area/azalea-park" },
              { name: "Christmas", href: "/delivery-area/christmas" },
              { name: "Chuluota", href: "/delivery-area/chuluota" },
              { name: "Bithlo", href: "/delivery-area/bithlo" },
              { name: "Wedgefield", href: "/delivery-area/wedgefield" }
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
            Ready to Celebrate Your Graduate?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact us today for a free quote and let's make your graduation party unforgettable!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Get Your Free Quote
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

export default GraduationEvents;
