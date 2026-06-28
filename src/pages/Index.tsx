import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { useLocation } from "react-router-dom";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { FAQPageSchema } from "@/components/seo/FAQPageSchema";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { TrustBadgesRow } from "@/components/home/TrustBadgesRow";
import { SEOContentSection } from "@/components/home/SEOContentSection";
import { PopularRentalsSection } from "@/components/home/PopularRentalsSection";
import { AllCategoryCarousels } from "@/components/home/AllCategoryCarousels";
import { DeliveryAreasSection } from "@/components/home/DeliveryAreasSection";
import { EventTypesSection } from "@/components/home/EventTypesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";

// Homepage FAQs for schema
const homepageFaqs = [
  {
    question: "What areas do you deliver to?",
    answer: "We proudly serve East Orlando, Orange County, and Central Florida including Alafaya, Avalon Park, Azalea Park, Bithlo, Christmas, Chuluota, Eastwood, Stoneybrook, Waterford Lakes, and Wedgefield. Contact us to confirm delivery to your specific location!"
  },
  {
    question: "How far in advance should I book?",
    answer: "We recommend booking at least 1-2 weeks in advance to ensure availability, especially during peak season (spring and summer). However, we do accommodate last-minute bookings when possible - just give us a call!"
  },
  {
    question: "Is setup and delivery included?",
    answer: "Yes! We offer free delivery, professional setup, and pickup within our service area. Our trained staff will ensure everything is safely installed and ready for your guests."
  },
  {
    question: "Are your inflatables safe and clean?",
    answer: "Absolutely! Safety is our top priority. All equipment is thoroughly cleaned and sanitized after each use. We are fully licensed and insured, and our inflatables meet all safety standards."
  },
  {
    question: "What happens if it rains on my event day?",
    answer: "We understand Florida weather! If rain prevents safe use of the equipment, we'll work with you to reschedule. Please see our cancellation policy for full details."
  }
];

const Index = () => {
  const { pathname } = useLocation();
  const isKeywordRoute = pathname === "/water-slide-and-bounce-house-rentals-orlando";

  const seo = isKeywordRoute
    ? {
        title: "Water Slide & Bounce House Rentals in Orlando, FL",
        description:
          "Orlando water slide & bounce house rentals with free delivery, setup & pickup in East Orlando and Orange County. (407) 497-1840.",
        canonical: "/water-slide-and-bounce-house-rentals-orlando",
      }
    : {
        title: "Bounce House & Water Slide Rentals - Orlando, FL",
        description:
          "Orlando's local bounce house & water slide rentals. Free delivery, setup & pickup across East Orlando. Book online or call (407) 497-1840.",
        canonical: "/",
      };

  return (
    <Layout>
      <SEOHead
        title={seo.title}
        description={seo.description}
        canonical={seo.canonical}
      />
      <LocalBusinessSchema />
      <OrganizationSchema />
      <FAQPageSchema faqs={homepageFaqs} />
      
      <HeroSection />
      <TrustBadgesRow />
      <AllCategoryCarousels />
      <CategoriesSection />
      <SEOContentSection />
      <PopularRentalsSection />
      <DeliveryAreasSection />
      <EventTypesSection />
      <ReviewsSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
