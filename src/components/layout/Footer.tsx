import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const rentalCategories = [
  { name: "Bounce Houses", href: "/bounce-house-rentals" },
  { name: "Water Slides", href: "/water-slide-rentals" },
  { name: "Obstacle Courses", href: "/obstacle-course-rentals" },
  { name: "Interactive Games", href: "/interactive-game-rentals" },
  { name: "Concessions", href: "/concession-rentals" },
  { name: "Tables & Chairs", href: "/table-chair-rentals" },
];

const deliveryAreas = [
  "Alafaya", "Avalon Park", "Azalea Park", "Bithlo", "Christmas",
  "Chuluota", "Eastwood", "Stoneybrook", "Waterford Lakes", "Wedgefield"
];

const quickLinks = [
  { name: "Contact Us", href: "/contact" },
  { name: "FAQ", href: "/faq" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Cancellation Policy", href: "/cancellation-policy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container-page section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold">Orlando Inflatables</h3>
            <p className="text-background/80 text-sm leading-relaxed">
              Your one-stop shop for bounce house and water slide rentals in East Orlando. 
              Making events memorable since day one!
            </p>
            <div className="space-y-2">
              <a 
                href="tel:4074971840" 
                className="flex items-center gap-2 text-background/90 hover:text-secondary transition-colors"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>(407) 497-1840</span>
              </a>
              <a 
                href="mailto:orlandoinflatablesllc@gmail.com" 
                className="flex items-center gap-2 text-background/90 hover:text-secondary transition-colors"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>orlandoinflatablesllc@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-background/90">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <span>East Orlando, FL</span>
              </div>
            </div>
          </div>

          {/* Rental Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Our Rentals</h4>
            <ul className="space-y-2">
              {rentalCategories.map((category) => (
                <li key={category.name}>
                  <Link 
                    to={category.href}
                    className="text-background/80 hover:text-secondary transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Areas */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Delivery Areas</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {deliveryAreas.map((area) => (
                <li key={area}>
                  <Link 
                    to={`/water-slide-and-bounce-house-rental-${area.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-background/80 hover:text-secondary transition-colors text-sm"
                  >
                    {area}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Map */}
          <div className="space-y-6">
            <div>
              <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-background/80 hover:text-secondary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Google Map Embed */}
            <div className="rounded-lg overflow-hidden">
              <iframe
                title="Orlando Inflatable Rentals LLC"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224262.43870853822!2d-81.42556538153113!3d28.56674155418236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e75dea47c42fdf%3A0xd2badb3440ac0bf9!2sOrlando%20Inflatable%20Rentals%20LLC!5e0!3m2!1sen!2sus!4v1766524561048!5m2!1sen!2sus"
                width="100%"
                height="150"
                style={{ border: 0 }}
                sandbox="allow-scripts allow-same-origin"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/20">
        <div className="container-page py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/70 text-sm text-center md:text-left">
              © {currentYear} Orlando Inflatables LLC. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61563048615864" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-background/70 hover:text-secondary transition-colors"
                aria-label="Visit Orlando Inflatables on Facebook"
              >
                <Facebook className="h-5 w-5" aria-hidden="true" />
              </a>
              <a 
                href="https://www.instagram.com/orlandoinflatablesllc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-background/70 hover:text-secondary transition-colors"
                aria-label="Visit Orlando Inflatables on Instagram"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
