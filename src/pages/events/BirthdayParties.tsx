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
  Camera,
  MapPin,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import kidsGroupBounce from "@/assets/kids-group-bounce-1.jpg";
import waterSlideFun from "@/assets/water-slide-fun-1.jpg";

const BirthdayParties = () => {
  const [showEastOrlandoFAQ, setShowEastOrlandoFAQ] = useState(false);
  const [showMoreLinks, setShowMoreLinks] = useState(false);

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
        title="Birthday Party Bounce House Rentals Orlando | Kids Party Fun"
        description="Make your child's birthday unforgettable with bounce house rentals in Orlando. Professional delivery, setup & pickup. Safe, clean inflatables for all ages. Book today!"
        canonical="/events/birthday-party-inflatable-rentals-in-orlando"
      />
      <ServiceSchema
        serviceName="Birthday Party Inflatable Rentals Orlando"
        description="Professional bounce house and inflatable rentals for birthday parties in Orlando and East Orange County. Safe, clean, and fun entertainment for kids of all ages."
        url="/events/birthday-party-inflatable-rentals-in-orlando"
      />
      <BreadcrumbSchema
        items={[
          { name: "Events", href: "/events" },
          { name: "Birthday Parties", href: "/events/birthday-party-inflatable-rentals-in-orlando" }
        ]}
      />
      <FAQPageSchema
        faqs={[
          { question: "Do you deliver birthday party inflatables throughout East Orlando?", answer: "Yes. Orlando Inflatables provides birthday party rentals across East Orlando, including residential neighborhoods, HOA communities, and nearby event locations." },
          { question: "How much space do I need for a bounce house at my East Orlando home?", answer: "Most East Orlando backyards work well for standard bounce houses and combo units. We help confirm spacing, power access, and placement before delivery to ensure a safe setup." },
          { question: "Are bounce houses allowed in East Orlando HOA communities?", answer: "Many East Orlando HOAs allow inflatables for private events. We help customers plan placement and timing to stay within typical HOA guidelines." },
          { question: "What happens if it rains on my birthday party in East Orlando?", answer: "Light rain usually does not affect inflatable rentals. For severe weather, our team works with customers to reschedule or adjust plans when possible." },
          { question: "Can I rent both a bounce house and water slide for an East Orlando birthday party?", answer: "Yes. Many East Orlando families choose combo packages that include a bounce house and water slide for longer parties and higher guest counts." }
        ]}
      />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${siteImages.girlsJumping1})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/90" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
              <Cake className="h-5 w-5" />
              <span className="font-medium">Birthday Party Specialists</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Birthday Party Inflatable Rentals in Orlando
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              Create magical birthday memories with our premium bounce houses, water slides, and party entertainment. 
              Serving Orlando and East Orange County with professional delivery and setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90" asChild>
                <Link to="/contact">
                  <Phone className="mr-2 h-5 w-5" />
                  Check Availability
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/20" asChild>
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

      {/* Category Icons */}
      <EventCategoriesGrid />

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

      {/* Reviews Section */}
      <ReviewsSection />

      {/* Cross-Links to Other Events */}
      <EventCrossLinks currentEvent="birthday" />

      {/* Related Blog Posts */}
      <RelatedBlogPosts eventType="birthday" />

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

      {/* SECTION 1: East Orlando Authority Block */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">East Orlando Focus</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Birthday Party Rentals Throughout East Orlando</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Orlando Inflatables specializes in birthday party rentals throughout East Orlando, serving families in residential neighborhoods, master planned communities, and surrounding areas. Our team understands the layout, spacing, and setup needs common to East Orlando homes, making it easy to plan stress free birthday celebrations.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  We regularly provide birthday party inflatables for:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Backyard parties in East Orlando neighborhoods</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">HOA communities with setup guidelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">School and church birthday celebrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Community parks and green spaces</span>
                  </li>
                </ul>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Because we serve East Orlando year round, we know how to recommend the right bounce house or water slide based on yard size, guest count, and the age group of the kids attending.
                </p>
              </div>
              <div className="relative">
                <img 
                  src={kidsGroupBounce} 
                  alt="Kids enjoying birthday party bounce house in East Orlando" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg">
                  <p className="font-bold">Serving East Orlando</p>
                  <p className="text-sm opacity-90">Year-round service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: East Orlando Birthday Party FAQs */}
      <section className="py-16 bg-muted/30">
        <div className="container-page">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <HelpCircle className="h-5 w-5" />
                <span className="font-medium">Common Questions</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">East Orlando Birthday Party Rental FAQs</h2>
              <p className="text-muted-foreground text-lg">
                Get answers to the most common questions about birthday party rentals in East Orlando.
              </p>
            </div>
            
            <Collapsible open={showEastOrlandoFAQ} onOpenChange={setShowEastOrlandoFAQ}>
              <div className="space-y-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">Do you deliver birthday party inflatables throughout East Orlando?</h4>
                    <p className="text-muted-foreground">
                      Yes. Orlando Inflatables provides birthday party rentals across East Orlando, including residential neighborhoods, HOA communities, and nearby event locations.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-3">How much space do I need for a bounce house at my East Orlando home?</h4>
                    <p className="text-muted-foreground">
                      Most East Orlando backyards work well for standard bounce houses and combo units. We help confirm spacing, power access, and placement before delivery to ensure a safe setup.
                    </p>
                  </CardContent>
                </Card>
                
                <CollapsibleContent className="space-y-6">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Are bounce houses allowed in East Orlando HOA communities?</h4>
                      <p className="text-muted-foreground">
                        Many East Orlando HOAs allow inflatables for private events. We help customers plan placement and timing to stay within typical HOA guidelines.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">What happens if it rains on my birthday party in East Orlando?</h4>
                      <p className="text-muted-foreground">
                        Light rain usually does not affect inflatable rentals. For severe weather, our team works with customers to reschedule or adjust plans when possible.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <h4 className="font-bold text-lg mb-3">Can I rent both a bounce house and water slide for an East Orlando birthday party?</h4>
                      <p className="text-muted-foreground">
                        Yes. Many East Orlando families choose combo packages that include a bounce house and water slide for longer parties and higher guest counts.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </div>
              
              <div className="text-center mt-8">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {showEastOrlandoFAQ ? (
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

      {/* SECTION 3: Internal Linking Reinforcement */}
      <section className="py-16">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <img 
                  src={waterSlideFun} 
                  alt="Kids enjoying water slide birthday party in East Orlando" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <ArrowRight className="h-5 w-5" />
                  <span className="font-medium">Explore More</span>
                </div>
                <h2 className="text-3xl font-bold mb-6">Explore More East Orlando Party Rental Options</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Looking for more ways to make your East Orlando celebration unforgettable? Explore our full range of party rentals, from <Link to="/bounce-house-rentals" className="text-primary hover:underline font-medium">birthday bounce house rentals in East Orlando</Link> to exciting <Link to="/water-slide-rentals" className="text-primary hover:underline font-medium">East Orlando water slide birthday parties</Link>.
                </p>
                
                <Collapsible open={showMoreLinks} onOpenChange={setShowMoreLinks}>
                  <div className="space-y-4 mb-6">
                    <h3 className="font-semibold text-lg">East Orlando Communities We Serve:</h3>
                    <div className="flex flex-wrap gap-2">
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
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Related Event Types:</h3>
                      <p className="text-muted-foreground">
                        We also provide rentals for <Link to="/events/school-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-medium">school events</Link>, <Link to="/events/church-event-inflatable-rentals-in-orlando" className="text-primary hover:underline font-medium">church gatherings</Link>, and <Link to="/events/graduation-party-water-slide-rentals-in-orlando" className="text-primary hover:underline font-medium">graduation parties</Link> throughout East Orlando.
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Popular Rental Categories:</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Link to="/bounce-slide-combo-rentals" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                          Combo Units
                        </Link>
                        <Link to="/obstacle-course-rentals" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                          Obstacle Courses
                        </Link>
                        <Link to="/interactive-game-rentals" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                          Interactive Games
                        </Link>
                        <Link to="/concession-rentals" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                          <ArrowRight className="h-4 w-4" />
                          Concessions
                        </Link>
                      </div>
                    </div>
                  </CollapsibleContent>
                  
                  <div className="mt-6">
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
          </div>
        </div>
      </section>

      {/* SECTION 4: East Orlando CTA (Localized) */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
        <div className="container-page text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full mb-6">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">East Orlando Service Area</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Book an East Orlando Birthday Party Today
          </h2>
          <p className="text-xl mb-4 opacity-90 max-w-3xl mx-auto">
            Orlando Inflatables proudly serves families throughout East Orlando with clean, reliable birthday party rentals. Whether you're planning a backyard celebration, HOA friendly party, or a larger gathering, our team is ready to help.
          </p>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
            Check availability online and reserve your East Orlando birthday party rentals today to secure the best bounce houses and water slides for your celebration.
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

export default BirthdayParties;
