import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { JotformModal } from "@/components/JotformModal";
import logo from "@/assets/logo.png";

const rentalCategories = [
  { name: "Bounce Houses", href: "/bounce-house-rentals", description: "Fun bounce houses for all ages" },
  { name: "Bounce & Slide Combos", href: "/bounce-slide-combo-rentals", description: "2-in-1 bounce & slide fun" },
  { name: "Water & Dry Slides", href: "/water-slide-rentals", description: "Beat the heat with water slides" },
  { name: "Obstacle Courses", href: "/obstacle-course-rentals", description: "Challenge your guests" },
  { name: "Interactive Games", href: "/interactive-game-rentals", description: "Engaging games for everyone" },
  { name: "Concessions", href: "/concession-rentals", description: "Popcorn, snow cones & more" },
  { name: "Tables & Chairs", href: "/table-chair-rentals", description: "Seating for your event" },
];

const deliveryAreas = [
  "Alafaya", "Avalon Park", "Azalea Park", "Bithlo", "Christmas",
  "Chuluota", "Eastwood", "Stoneybrook", "Waterford Lakes", "Wedgefield"
];

const eventTypes = [
  { name: "Birthday Parties", href: "/events/birthday-parties" },
  { name: "School Events", href: "/events/school-events" },
  { name: "Church Events", href: "/events/church-events" },
  { name: "Corporate Events", href: "/events/corporate-events" },
  { name: "Graduation Events", href: "/events/graduation-events" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showJotform, setShowJotform] = useState(false);
  const location = useLocation();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        {/* Top bar */}
        <div className="gradient-primary text-primary-foreground py-2">
          <div className="container-page flex items-center justify-between text-sm">
            <a href="tel:4074971840" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Phone className="h-4 w-4" />
              <span className="font-medium">(407) 497-1840</span>
            </a>
            <span className="hidden sm:block">Serving East Orlando & Orange County</span>
            <a href="mailto:orlandoinflatablesllc@gmail.com" className="hidden md:block hover:opacity-90 transition-opacity">
              orlandoinflatablesllc@gmail.com
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="container-page">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Orlando Inflatables - Bounce House & Water Slide Rentals" 
                className="h-12 md:h-14 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      location.pathname === "/" && "bg-accent"
                    )}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>All Rentals</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {rentalCategories.map((category) => (
                        <li key={category.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={category.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{category.name}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {category.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/rentals"
                            className="block select-none rounded-md bg-primary/10 p-3 text-center font-medium text-primary no-underline outline-none transition-colors hover:bg-primary/20"
                          >
                            View All Rentals →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Delivery Areas</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2">
                      {deliveryAreas.map((area) => (
                        <li key={area}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={`/delivery-area/${area.toLowerCase().replace(/\s+/g, "-")}`}
                              className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              {area}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/delivery-area"
                            className="block select-none rounded-md bg-primary/10 p-2 text-center font-medium text-primary no-underline outline-none transition-colors hover:bg-primary/20"
                          >
                            View All Delivery Areas →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Events</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-2 p-4">
                      {eventTypes.map((event) => (
                        <li key={event.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={event.href}
                              className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                            >
                              {event.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/events"
                            className="block select-none rounded-md bg-primary/10 p-2 text-center font-medium text-primary no-underline outline-none transition-colors hover:bg-primary/20"
                          >
                            View All Event Types →
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      location.pathname.startsWith("/blog") && "bg-accent"
                    )}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Contact</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/contact"
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            Contact Us
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/privacy-policy"
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            Privacy Policy
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* CTA Button */}
            <Button 
              onClick={() => setShowJotform(true)}
              className="hidden md:flex btn-bounce"
              size="lg"
            >
              Get a Free Quote
            </Button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-foreground hover:bg-accent"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="container-page py-4 space-y-4">
              <Link 
                to="/" 
                className="block py-2 text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <Link 
                  to="/rentals" 
                  className="block py-2 font-medium text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Rentals
                </Link>
                <div className="pl-4 space-y-1">
                  {rentalCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="block py-1 text-sm text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/delivery-area" 
                className="block py-2 font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Delivery Areas
              </Link>

              <Link 
                to="/events" 
                className="block py-2 font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>

              <Link 
                to="/blog" 
                className="block py-2 font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <Link 
                to="/contact" 
                className="block py-2 font-medium text-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>

              <Link 
                to="/privacy-policy" 
                className="block py-2 pl-4 text-sm text-muted-foreground hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy Policy
              </Link>

              <Button 
                onClick={() => {
                  setShowJotform(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full btn-bounce"
                size="lg"
              >
                Get a Free Quote
              </Button>
            </div>
          </div>
        )}
      </header>

      <JotformModal open={showJotform} onOpenChange={setShowJotform} />
    </>
  );
}
