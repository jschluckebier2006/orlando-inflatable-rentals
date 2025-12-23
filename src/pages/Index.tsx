import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/seo/SEOHead";
import { LocalBusinessSchema } from "@/components/seo/LocalBusinessSchema";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { SEOContentSection } from "@/components/home/SEOContentSection";
import { PopularRentalsSection } from "@/components/home/PopularRentalsSection";
import { DeliveryAreasSection } from "@/components/home/DeliveryAreasSection";
import { EventTypesSection } from "@/components/home/EventTypesSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { CTASection } from "@/components/home/CTASection";
import { ContentImageRow, homePageImages } from "@/components/home/ContentImages";

const Index = () => {
  return (
    <Layout>
      <SEOHead
        title="Bounce House & Water Slide Rentals in Orlando FL"
        description="Orlando Inflatables is your one-stop shop for bounce house, water slide, obstacle course, and party rental equipment in East Orlando, Orange County. Book your rental today! (407) 497-1840"
        canonical="/"
      />
      <LocalBusinessSchema />
      
      <HeroSection />
      <CategoriesSection />
      <SEOContentSection />
      <div className="container-page">
        <ContentImageRow 
          images={homePageImages} 
          alts={["Kids enjoying bounce house fun", "Children on water slide", "Group playing in bounce house"]} 
        />
      </div>
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
