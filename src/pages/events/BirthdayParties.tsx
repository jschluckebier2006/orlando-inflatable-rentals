import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Cake, 
  Star, 
  Users, 
  Clock, 
  Shield, 
  CheckCircle,
  Phone,
  PartyPopper,
  Heart,
  Sparkles,
  Gift,
  Camera
} from "lucide-react";

const BirthdayParties = () => {
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Birthday Party Inflatable Rentals Orlando",
    "description": "Professional bounce house and inflatable rentals for birthday parties in Orlando and East Orange County. Safe, clean, and fun entertainment for kids of all ages.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Orlando Inflatables",
      "telephone": "(407) 374-3062",
      "areaServed": "Orlando, FL"
    },
    "serviceType": "Birthday Party Entertainment",
    "areaServed": {
      "@type": "State",
      "name": "Florida"
    }
  };

  const features = [
    {
      icon: Cake,
      title: "Age-Appropriate Options",
      description: "We have inflatables perfect for toddlers, young children, tweens, and teens to ensure safe fun for every age group."
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "All equipment is commercially rated, properly inspected, and thoroughly sanitized before each rental."
    },
    {
      icon: Clock,
      title: "Flexible Rental Periods",
      description: "Choose from 4-hour, 6-hour, or full-day rentals to match your party schedule perfectly."
    },
    {
      icon: Users,
      title: "Capacity for All Party Sizes",
      description: "From intimate gatherings to large celebrations, we have inflatables that can accommodate any guest count."
    },
    {
      icon: PartyPopper,
      title: "Theme Matching",
      description: "Many of our inflatables feature popular themes and colors to complement your party decorations."
    },
    {
      icon: Star,
      title: "Professional Setup",
      description: "Our trained team handles all delivery, setup, and pickup so you can focus on the celebration."
    }
  ];

  const partyIdeas = [
    {
      title: "Backyard Birthday Bash",
      description: "Transform your backyard into the ultimate party zone with a bounce house combo that includes slides and obstacles.",
      recommended: ["Bounce House Combos", "Water Slides (summer)", "Concession Machines"]
    },
    {
      title: "Princess Palace Party",
      description: "Create a magical kingdom with our princess-themed bounce houses perfect for royal celebrations.",
      recommended: ["Princess Bounce Houses", "Tables & Chairs", "Cotton Candy Machine"]
    },
    {
      title: "Sports Spectacular",
      description: "Score big with interactive sports games and obstacle courses for active kids who love competition.",
      recommended: ["Interactive Games", "Obstacle Courses", "Popcorn Machine"]
    },
    {
      title: "Summer Splash Celebration",
      description: "Beat the Florida heat with exciting water slides and splash zones that kids absolutely love.",
      recommended: ["Water Slides", "Slip-N-Slides", "Snow Cone Machine"]
    }
  ];

  const ageGroups = [
    {
      age: "Toddlers (1-3)",
      recommendations: "Smaller bounce houses with low walls and soft, enclosed designs for safe bouncing.",
      popular: "Toddler Bounce Houses"
    },
    {
      age: "Young Kids (4-7)",
      recommendations: "Standard bounce houses, small combos with slides, and age-appropriate interactive games.",
      popular: "Bounce House Combos"
    },
    {
      age: "Tweens (8-12)",
      recommendations: "Obstacle courses, larger water slides, and competitive interactive games.",
      popular: "Obstacle Courses"
    },
    {
      age: "Teens (13+)",
      recommendations: "Extreme obstacle courses, large water slides, and challenging interactive games.",
      popular: "Interactive Games"
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Birthday Party Inflatable Rentals Orlando | Bounce Houses for Kids Parties"
        description="Make your child's birthday unforgettable with bounce house rentals in Orlando. Professional delivery, setup & pickup. Safe, clean inflatables for all ages. Book today!"
        canonical="/events/birthday-parties"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(eventSchema)}
        </script>
      </Helmet>
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Birthday Parties", href: "/events/birthday-parties" }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container-page">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Cake className="h-5 w-5" />
              <span className="font-medium">Birthday Party Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Birthday Party Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Create magical birthday memories with our premium bounce houses, water slides, and party entertainment. 
              Serving Orlando and East Orange County with professional delivery and setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Get a Free Quote
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/rentals">Browse All Rentals</Link>
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
              Make Your Child's Birthday Unforgettable
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              At Orlando Inflatables, we understand that your child's birthday party is one of the most important 
              days of the year. That's why we've dedicated ourselves to providing the highest quality inflatable 
              rentals that transform ordinary backyard parties into extraordinary celebrations that kids will 
              remember for years to come.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're planning a princess-themed party, a superhero adventure, or a summer splash bash, 
              we have the perfect bounce house, water slide, or interactive game to make your vision a reality. 
              Our family-owned business has been serving the Orlando community for years, and we treat every 
              party as if it were our own child's celebration.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              From the moment you contact us for a quote to the time we pick up the equipment after your party, 
              you'll experience the Orlando Inflatables difference – professional service, pristine equipment, 
              and a genuine commitment to making your child's birthday the best one yet.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Parents Choose Us for Birthday Parties</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We go above and beyond to ensure every birthday party is safe, fun, and stress-free for parents.
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
              Birthday Party Ideas
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Need inspiration? Here are some of our most popular birthday party packages that kids absolutely love.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {partyIdeas.map((idea) => (
              <Card key={idea.title} className="overflow-hidden hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
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

      {/* Age Groups */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Inflatables for Every Age Group</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We have age-appropriate options to ensure safe and exciting fun for birthday kids of all ages.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group) => (
              <Card key={group.age} className="text-center">
                <CardContent className="p-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{group.age}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{group.recommendations}</p>
                  <span className="inline-block bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Popular: {group.popular}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What's Included with Every Birthday Party Rental</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Free Delivery & Setup</h3>
                    <p className="text-muted-foreground text-sm">We deliver to your location and handle all setup at no extra charge within our service area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Professional Installation</h3>
                    <p className="text-muted-foreground text-sm">Our trained technicians ensure proper anchoring and safety setup.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Sanitized Equipment</h3>
                    <p className="text-muted-foreground text-sm">Every inflatable is thoroughly cleaned and sanitized before your event.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Safety Instructions</h3>
                    <p className="text-muted-foreground text-sm">We provide clear safety guidelines and rules for supervising adults.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Extension Cords & Blower</h3>
                    <p className="text-muted-foreground text-sm">All necessary equipment is included – just provide access to a standard outlet.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Pickup After Party</h3>
                    <p className="text-muted-foreground text-sm">We return at your scheduled end time to pack up everything.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Camera className="h-8 w-8 text-primary" />
              Birthday Party Planning Tips
            </h2>
            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mt-6 mb-3">Book Early for Weekend Parties</h3>
              <p className="text-muted-foreground">
                Weekend dates, especially Saturday afternoons, fill up quickly during peak birthday season (spring and fall). 
                We recommend booking at least 2-3 weeks in advance to ensure availability of your preferred inflatable.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Consider Your Space</h3>
              <p className="text-muted-foreground">
                Before booking, measure your setup area. Most bounce houses need a flat area at least 15x15 feet, 
                plus overhead clearance. We're happy to help you choose the right size for your space.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Have a Backup Plan for Weather</h3>
              <p className="text-muted-foreground">
                Florida weather can be unpredictable. For outdoor parties, have a rain date in mind. 
                We offer flexible rescheduling for weather-related issues at no additional charge.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Add Concessions for Extra Fun</h3>
              <p className="text-muted-foreground">
                Nothing says "birthday party" like fresh popcorn, cotton candy, or snow cones! 
                Bundle concession rentals with your bounce house for a complete party experience and save with our package deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Rentals */}
      <section className="py-16">
        <div className="container-page">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Birthday Party Rentals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Bounce Houses</h3>
                <p className="text-muted-foreground mb-4">Classic fun for all ages. Multiple sizes and themes available.</p>
                <Button variant="outline" asChild>
                  <Link to="/bounce-house-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Water Slides</h3>
                <p className="text-muted-foreground mb-4">Perfect for summer birthdays. Beat the Florida heat!</p>
                <Button variant="outline" asChild>
                  <Link to="/water-slide-rentals">View Options</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-lg mb-2">Concessions</h3>
                <p className="text-muted-foreground mb-4">Popcorn, cotton candy, and snow cones for the perfect party.</p>
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
          <h2 className="text-3xl font-bold mb-6 text-center">Birthday Party Delivery Areas</h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            We deliver birthday party rentals throughout East Orange County and surrounding communities.
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
            Ready to Plan the Perfect Birthday Party?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Contact us today for a free quote and let's make your child's birthday celebration one they'll never forget!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Get Your Free Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="tel:+14073743062">Call (407) 374-3062</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BirthdayParties;
