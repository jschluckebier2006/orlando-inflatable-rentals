import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Rentals from "./pages/Rentals";
import DeliveryArea from "./pages/DeliveryArea";
import Events from "./pages/Events";
import Contact from "./pages/Contact";
import BounceHouseRentals from "./pages/BounceHouseRentals";
import BounceSlideComboRentals from "./pages/BounceSlideComboRentals";
import WaterSlideRentals from "./pages/WaterSlideRentals";
import ObstacleCourseRentals from "./pages/ObstacleCourseRentals";
import InteractiveGameRentals from "./pages/InteractiveGameRentals";
import ConcessionRentals from "./pages/ConcessionRentals";
import TableChairRentals from "./pages/TableChairRentals";
import AlafayaDelivery from "./pages/delivery/Alafaya";
import AvalonParkDelivery from "./pages/delivery/AvalonPark";
import AzaleaParkDelivery from "./pages/delivery/AzaleaPark";
import BithloDelivery from "./pages/delivery/Bithlo";
import ChristmasDelivery from "./pages/delivery/Christmas";
import ChuluotaDelivery from "./pages/delivery/Chuluota";
import EastwoodDelivery from "./pages/delivery/Eastwood";
import StoneybrookDelivery from "./pages/delivery/Stoneybrook";
import WaterfordLakesDelivery from "./pages/delivery/WaterfordLakes";
import WedgefieldDelivery from "./pages/delivery/Wedgefield";
import BounceHouseAlafaya from "./pages/city-service/BounceHouseAlafaya";
import WaterSlideAlafaya from "./pages/city-service/WaterSlideAlafaya";
import BounceHouseAvalonPark from "./pages/city-service/BounceHouseAvalonPark";
import WaterSlideAvalonPark from "./pages/city-service/WaterSlideAvalonPark";
import BounceHouseAzaleaPark from "./pages/city-service/BounceHouseAzaleaPark";
import WaterSlideAzaleaPark from "./pages/city-service/WaterSlideAzaleaPark";
import BounceHouseBithlo from "./pages/city-service/BounceHouseBithlo";
import WaterSlideBithlo from "./pages/city-service/WaterSlideBithlo";
import BounceHouseChristmas from "./pages/city-service/BounceHouseChristmas";
import WaterSlideChristmas from "./pages/city-service/WaterSlideChristmas";
import BounceHouseChuluota from "./pages/city-service/BounceHouseChuluota";
import WaterSlideChuluota from "./pages/city-service/WaterSlideChuluota";
import BounceHouseEastwood from "./pages/city-service/BounceHouseEastwood";
import WaterSlideEastwood from "./pages/city-service/WaterSlideEastwood";
import BounceHouseStoneybrook from "./pages/city-service/BounceHouseStoneybrook";
import WaterSlideStoneybrook from "./pages/city-service/WaterSlideStoneybrook";
import BounceHouseWaterfordLakes from "./pages/city-service/BounceHouseWaterfordLakes";
import WaterSlideWaterfordLakes from "./pages/city-service/WaterSlideWaterfordLakes";
import BounceHouseWedgefield from "./pages/city-service/BounceHouseWedgefield";
import WaterSlideWedgefield from "./pages/city-service/WaterSlideWedgefield";
import BirthdayParties from "./pages/events/BirthdayParties";
import SchoolEvents from "./pages/events/SchoolEvents";
import ChurchEvents from "./pages/events/ChurchEvents";
import CorporateEvents from "./pages/events/CorporateEvents";
import GraduationEvents from "./pages/events/GraduationEvents";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BounceHousePricing2025 from "./pages/blog/BounceHousePricing2025";
import CorporateTeamBuilding from "./pages/blog/CorporateTeamBuilding";
import ToddlerPartySafety from "./pages/blog/ToddlerPartySafety";
import Top3BounceHouseThemes from "./pages/blog/Top3BounceHouseThemes";
import ElevateCelebration from "./pages/blog/ElevateCelebration";
import BounceHouseRentalsNearMe from "./pages/blog/BounceHouseRentalsNearMe";
import FoundingOfChristmasFlorida from "./pages/blog/FoundingOfChristmasFlorida";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/water-slide-and-bounce-house-rentals-orlando" element={<Index />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/delivery-area" element={<DeliveryArea />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bounce-house-rentals" element={<BounceHouseRentals />} />
            <Route path="/bounce-slide-combo-rentals" element={<BounceSlideComboRentals />} />
            <Route path="/water-slide-rentals" element={<WaterSlideRentals />} />
            <Route path="/obstacle-course-rentals" element={<ObstacleCourseRentals />} />
            <Route path="/interactive-game-rentals" element={<InteractiveGameRentals />} />
            <Route path="/concession-rentals" element={<ConcessionRentals />} />
            <Route path="/table-chair-rentals" element={<TableChairRentals />} />
            <Route path="/water-slide-and-bounce-house-rental-alafaya" element={<AlafayaDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-avalon-park" element={<AvalonParkDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-azalea-park" element={<AzaleaParkDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-bithlo" element={<BithloDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-christmas" element={<ChristmasDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-chuluota" element={<ChuluotaDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-eastwood" element={<EastwoodDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-stoneybrook" element={<StoneybrookDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-waterford-lakes" element={<WaterfordLakesDelivery />} />
            <Route path="/water-slide-and-bounce-house-rental-wedgefield" element={<WedgefieldDelivery />} />
            <Route path="/bounce-house-rentals-alafaya" element={<BounceHouseAlafaya />} />
            <Route path="/water-slide-rentals-alafaya" element={<WaterSlideAlafaya />} />
            <Route path="/bounce-house-rentals-avalon-park" element={<BounceHouseAvalonPark />} />
            <Route path="/water-slide-rentals-avalon-park" element={<WaterSlideAvalonPark />} />
            <Route path="/bounce-house-rentals-azalea-park" element={<BounceHouseAzaleaPark />} />
            <Route path="/water-slide-rentals-azalea-park" element={<WaterSlideAzaleaPark />} />
            <Route path="/bounce-house-rentals-bithlo" element={<BounceHouseBithlo />} />
            <Route path="/water-slide-rentals-bithlo" element={<WaterSlideBithlo />} />
            <Route path="/bounce-house-rentals-christmas" element={<BounceHouseChristmas />} />
            <Route path="/water-slide-rentals-christmas" element={<WaterSlideChristmas />} />
            <Route path="/bounce-house-rentals-chuluota" element={<BounceHouseChuluota />} />
            <Route path="/water-slide-rentals-chuluota" element={<WaterSlideChuluota />} />
            <Route path="/bounce-house-rentals-eastwood" element={<BounceHouseEastwood />} />
            <Route path="/water-slide-rentals-eastwood" element={<WaterSlideEastwood />} />
            <Route path="/bounce-house-rentals-stoneybrook" element={<BounceHouseStoneybrook />} />
            <Route path="/water-slide-rentals-stoneybrook" element={<WaterSlideStoneybrook />} />
            <Route path="/bounce-house-rentals-waterford-lakes" element={<BounceHouseWaterfordLakes />} />
            <Route path="/water-slide-rentals-waterford-lakes" element={<WaterSlideWaterfordLakes />} />
            <Route path="/bounce-house-rentals-wedgefield" element={<BounceHouseWedgefield />} />
            <Route path="/water-slide-rentals-wedgefield" element={<WaterSlideWedgefield />} />
            <Route path="/events/birthday-parties" element={<BirthdayParties />} />
            <Route path="/events/school-events" element={<SchoolEvents />} />
            <Route path="/events/church-events" element={<ChurchEvents />} />
            <Route path="/events/corporate-events" element={<CorporateEvents />} />
            <Route path="/events/graduation-events" element={<GraduationEvents />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/bounce-house-rental-pricing-orlando-2025" element={<BounceHousePricing2025 />} />
            <Route path="/blog/corporate-team-building-with-inflatables" element={<CorporateTeamBuilding />} />
            <Route path="/blog/toddler-party-safety-bounce-house-rules" element={<ToddlerPartySafety />} />
            <Route path="/blog/top-3-bounce-house-themes-orlando" element={<Top3BounceHouseThemes />} />
            <Route path="/blog/elevate-celebration-bounce-house-rental" element={<ElevateCelebration />} />
            <Route path="/blog/bounce-house-rentals-near-me" element={<BounceHouseRentalsNearMe />} />
            <Route path="/blog/founding-of-christmas-florida" element={<FoundingOfChristmasFlorida />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
