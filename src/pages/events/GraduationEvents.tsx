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
  PartyPopper,
  Award,
  Heart,
  Sparkles,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Home,
  Trophy
} from "lucide-react";
import waterSlideBoy from "@/assets/water-slide-boy-1.jpg";
import girlsJumping from "@/assets/girls-jumping-1.jpg";

const GraduationEvents = () => {
  const [showGraduationFAQ, setShowGraduationFAQ] = useState(false);
  const [showMoreLinks, setShowMoreLinks] = useState(false);

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
        title="Graduation Party Water Slide Rentals Orlando | Celebrate Grads"
        description="Celebrate your graduate with water slide and bounce house rentals in Orlando. Pre-K to college graduation parties. Games & concessions. Book your celebration today!"
        canonical="/events/graduation-party-water-slide-rentals-in-orlando"
      />
      <ServiceSchema
        serviceName="Graduation Party Inflatable Rentals Orlando"
        description="Professional inflatable rentals for graduation parties in Orlando and East Orange County. Celebrate graduates with bounce houses, water slides, and party entertainment."
        url="/events/graduation-party-water-slide-rentals-in-orlando"
      />
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Graduation Events", href: "/events/graduation-party-water-slide-rentals-in-orlando" }
        ]}
      />
      <FAQPageSchema
        faqs={[
          { question: "What inflatables are best for graduation parties?", answer: "Water slides are extremely popular for graduation parties in May and June. Bounce houses and interactive games are great for all-ages celebrations with younger siblings and relatives." },
          { question: "Can you accommodate both kids and adults at graduation parties?", answer: "Yes. Our larger water slides and obstacle courses are designed to support adult participants as well as children, perfect for multi-generational celebrations." },
          { question: "How early should I book for a graduation party?", answer: "Graduation season in May and June is very busy. We recommend booking 3-4 weeks in advance to ensure availability for your preferred date." },
          { question: "Do you deliver to backyard graduation parties?", answer: "Absolutely. Most of our graduation party rentals are delivered to residential backyards throughout Orlando and East Orange County." },
          { question: "What concessions are popular for graduation parties?", answer: "Snow cone machines are the most popular for beating the Florida heat, followed by cotton candy and popcorn machines for that festive party atmosphere." }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteImages.waterSlideFun1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">Graduation Party Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Graduation Party Water Slide Rentals in Orlando
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Celebrate your graduate's achievement with memorable party entertainment. From Pre-K to PhD, 
              we make graduation celebrations unforgettable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Get a Free Quote
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
              <Award className="h-8 w-8 text-primary" />
              Celebrate Every Graduation Milestone with a Water Slide Rental
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

      {/* Category Icons */}
      <EventCategoriesGrid />
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
              Graduation Party Ideas - More Fun with Water Slide Rentals
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

      {/* Cross-Links to Other Events */}
      <EventCrossLinks currentEvent="graduation" />

      {/* Related Blog Posts */}
      <RelatedBlogPosts eventType="graduation" />

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

      {/* SECTION 1: East Orlando Graduation Authority Block */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">East Orlando Celebrations</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Graduation Party Rentals Across East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Orlando Inflatables proudly provides graduation party rentals throughout East Orlando, helping families celebrate high school, middle school, and college milestones with fun, stress-free events.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Graduation parties we commonly support include:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">High school graduation celebrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Middle school promotions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">College graduation parties</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">End-of-school-year celebrations</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Because we serve East Orlando year-round, we understand backyard layouts, HOA guidelines, and the timing needs that come with graduation season.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={waterSlideBoy} 
                  alt="Graduation party water slide fun in East Orlando" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <p className="font-bold">Celebrating Graduates</p>
                  <p className="text-sm opacity-90">Throughout East Orlando</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Backyard Graduation Parties */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={girlsJumping} 
                  alt="Teens enjoying backyard graduation party inflatables in East Orlando" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <Home className="h-5 w-5" />
                  <span className="font-medium">Backyard Parties</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Backyard Graduation Party Rentals in East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Backyard graduation parties are extremely popular across East Orlando. Orlando Inflatables offers bounce houses, combo units, and water slides that work well for mixed-age gatherings.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  Popular backyard graduation rentals include:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Bounce house and slide combos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Water slides for warm weather celebrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Interactive inflatables for teens and young adults</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  We help families select inflatables that fit yard size, guest count, and age range.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Graduation Celebrations */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Trophy className="h-5 w-5" />
                <span className="font-medium">Group Celebrations</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">High School & Group Graduation Celebrations</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Graduation celebrations often bring together friends, family, and classmates. Orlando Inflatables provides inflatables designed for larger groups and longer event durations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Obstacle Courses</h3>
                  <p className="text-muted-foreground text-sm">Friendly competition for teens</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg text-center">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Large Inflatables</h3>
                  <p className="text-muted-foreground text-sm">Great for teens and young adults</p>
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
              Our team helps plan placement and flow to keep guests engaged throughout the event.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: East Orlando Graduation FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">East Orlando Graduation Party Rental FAQs</h2>
              <p className="text-muted-foreground text-lg">
                Get answers to common questions about graduation party rentals in East Orlando.
              </p>
            </div>
            
            <Collapsible open={showGraduationFAQ} onOpenChange={setShowGraduationFAQ}>
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Do you provide graduation party rentals throughout East Orlando?</h4>
                    <p className="text-muted-foreground">
                      Yes. Orlando Inflatables provides graduation party rentals across East Orlando for residential homes, HOA communities, and event locations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Are inflatables suitable for teens and older students?</h4>
                    <p className="text-muted-foreground">
                      Yes. We offer inflatables that are popular with teens, including obstacle courses, combo units, and interactive games.
                    </p>
                  </CardContent>
                </Card>
                
                <CollapsibleContent className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can graduation parties include water slides?</h4>
                      <p className="text-muted-foreground">
                        Absolutely. Many East Orlando graduation parties include water slides, especially during spring and early summer.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Are inflatables allowed in HOA communities for graduation parties?</h4>
                      <p className="text-muted-foreground">
                        Many East Orlando HOAs allow inflatables for private events. We help families plan placement and timing to stay within common guidelines.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Do you offer delivery, setup, and pickup for graduation events?</h4>
                      <p className="text-muted-foreground">
                        Yes. Our team handles delivery, professional setup, and takedown so families can focus on celebrating.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showGraduationFAQ ? (
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
                Looking for more ways to make your East Orlando graduation celebration unforgettable? Explore our full range of rentals, from <Link to="/bounce-house-rentals" className="text-primary hover:underline font-medium">graduation bounce house rentals in East Orlando</Link> to <Link to="/water-slide-rentals" className="text-primary hover:underline font-medium">East Orlando graduation water slide rentals</Link>.
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
                      We also provide rentals for <Link to="/events/birthday-parties" className="text-primary hover:underline font-medium">birthday parties</Link>, <Link to="/events/school-events" className="text-primary hover:underline font-medium">school events</Link>, <Link to="/events/church-events" className="text-primary hover:underline font-medium">church events</Link>, and <Link to="/events/corporate-events" className="text-primary hover:underline font-medium">corporate events</Link> throughout East Orlando.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-4 text-center">Popular Graduation Party Rentals:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                      <Link to="/bounce-slide-combo-rentals" className="flex items-center justify-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm">
                        <ArrowRight className="h-4 w-4" />
                        Combo Units
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

      {/* SECTION 5: East Orlando Graduation CTA */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-page text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">East Orlando Celebrations</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book Graduation Party Rentals in East Orlando
          </h2>
          <p className="text-xl mb-4 opacity-90 max-w-3xl mx-auto">
            Orlando Inflatables proudly serves families throughout East Orlando with clean, reliable graduation party rentals. Whether you're planning a backyard celebration or a larger group event, our team is ready to help.
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Check availability online and reserve graduation party rentals for your East Orlando celebration today.
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
