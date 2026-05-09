import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import Index from "./pages/Index"; // Eager — homepage is the most common entry; avoid extra round-trip
import { ScrollToTop } from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import { CartProvider } from "./contexts/CartContext";
import { CartDrawer } from "./components/cart/CartDrawer";
import { CheckoutModal } from "./components/booking/CheckoutModal";

// Lazy-load every other route so each page only ships its own JS
const Rentals = lazy(() => import("./pages/Rentals"));
const DeliveryArea = lazy(() => import("./pages/DeliveryArea"));
const Events = lazy(() => import("./pages/Events"));
const Contact = lazy(() => import("./pages/Contact"));
const BounceHouseRentals = lazy(() => import("./pages/BounceHouseRentals"));
const BounceSlideComboRentals = lazy(() => import("./pages/BounceSlideComboRentals"));
const WaterSlideRentals = lazy(() => import("./pages/WaterSlideRentals"));
const ObstacleCourseRentals = lazy(() => import("./pages/ObstacleCourseRentals"));
const InteractiveGameRentals = lazy(() => import("./pages/InteractiveGameRentals"));
const ConcessionRentals = lazy(() => import("./pages/ConcessionRentals"));
const TableChairRentals = lazy(() => import("./pages/TableChairRentals"));
const AlafayaDelivery = lazy(() => import("./pages/delivery/Alafaya"));
const AvalonParkDelivery = lazy(() => import("./pages/delivery/AvalonPark"));
const AzaleaParkDelivery = lazy(() => import("./pages/delivery/AzaleaPark"));
const BithloDelivery = lazy(() => import("./pages/delivery/Bithlo"));
const ChristmasDelivery = lazy(() => import("./pages/delivery/Christmas"));
const ChuluotaDelivery = lazy(() => import("./pages/delivery/Chuluota"));
const EastwoodDelivery = lazy(() => import("./pages/delivery/Eastwood"));
const StoneybrookDelivery = lazy(() => import("./pages/delivery/Stoneybrook"));
const WaterfordLakesDelivery = lazy(() => import("./pages/delivery/WaterfordLakes"));
const WedgefieldDelivery = lazy(() => import("./pages/delivery/Wedgefield"));
const BounceHouseAlafaya = lazy(() => import("./pages/city-service/BounceHouseAlafaya"));
const WaterSlideAlafaya = lazy(() => import("./pages/city-service/WaterSlideAlafaya"));
const BounceHouseAvalonPark = lazy(() => import("./pages/city-service/BounceHouseAvalonPark"));
const WaterSlideAvalonPark = lazy(() => import("./pages/city-service/WaterSlideAvalonPark"));
const BounceHouseAzaleaPark = lazy(() => import("./pages/city-service/BounceHouseAzaleaPark"));
const WaterSlideAzaleaPark = lazy(() => import("./pages/city-service/WaterSlideAzaleaPark"));
const BounceHouseBithlo = lazy(() => import("./pages/city-service/BounceHouseBithlo"));
const WaterSlideBithlo = lazy(() => import("./pages/city-service/WaterSlideBithlo"));
const BounceHouseChristmas = lazy(() => import("./pages/city-service/BounceHouseChristmas"));
const WaterSlideChristmas = lazy(() => import("./pages/city-service/WaterSlideChristmas"));
const BounceHouseChuluota = lazy(() => import("./pages/city-service/BounceHouseChuluota"));
const WaterSlideChuluota = lazy(() => import("./pages/city-service/WaterSlideChuluota"));
const BounceHouseEastwood = lazy(() => import("./pages/city-service/BounceHouseEastwood"));
const WaterSlideEastwood = lazy(() => import("./pages/city-service/WaterSlideEastwood"));
const BounceHouseStoneybrook = lazy(() => import("./pages/city-service/BounceHouseStoneybrook"));
const WaterSlideStoneybrook = lazy(() => import("./pages/city-service/WaterSlideStoneybrook"));
const BounceHouseWaterfordLakes = lazy(() => import("./pages/city-service/BounceHouseWaterfordLakes"));
const WaterSlideWaterfordLakes = lazy(() => import("./pages/city-service/WaterSlideWaterfordLakes"));
const BounceHouseWedgefield = lazy(() => import("./pages/city-service/BounceHouseWedgefield"));
const WaterSlideWedgefield = lazy(() => import("./pages/city-service/WaterSlideWedgefield"));
const BirthdayParties = lazy(() => import("./pages/events/BirthdayParties"));
const SchoolEvents = lazy(() => import("./pages/events/SchoolEvents"));
const ChurchEvents = lazy(() => import("./pages/events/ChurchEvents"));
const CorporateEvents = lazy(() => import("./pages/events/CorporateEvents"));
const GraduationEvents = lazy(() => import("./pages/events/GraduationEvents"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Blog = lazy(() => import("./pages/Blog"));
const BounceHousePricing2025 = lazy(() => import("./pages/blog/BounceHousePricing2025"));
const CorporateTeamBuilding = lazy(() => import("./pages/blog/CorporateTeamBuilding"));
const ToddlerPartySafety = lazy(() => import("./pages/blog/ToddlerPartySafety"));
const Top3BounceHouseThemes = lazy(() => import("./pages/blog/Top3BounceHouseThemes"));
const ElevateCelebration = lazy(() => import("./pages/blog/ElevateCelebration"));
const BounceHouseRentalsNearMe = lazy(() => import("./pages/blog/BounceHouseRentalsNearMe"));
const FoundingOfChristmasFlorida = lazy(() => import("./pages/blog/FoundingOfChristmasFlorida"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const WebVitals = lazy(() => import("./pages/WebVitals"));
const CheckoutReturn = lazy(() => import("./pages/CheckoutReturn"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminBookings = lazy(() => import("./pages/admin/Bookings"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminCalendar = lazy(() => import("./pages/admin/Calendar"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/CustomerDetail"));
const AdminNewReservation = lazy(() => import("./pages/admin/NewReservation"));
const AdminActivity = lazy(() => import("./pages/admin/Activity"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminNotifications = lazy(() => import("./pages/admin/Notifications"));

const queryClient = new QueryClient();

// Minimal fallback — height matches typical hero so layout stays stable
const RouteFallback = () => <div className="min-h-screen" aria-hidden="true" />;

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
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
              <Route path="/events/birthday-party-inflatable-rentals-in-orlando" element={<BirthdayParties />} />
              <Route path="/events/school-event-inflatable-rentals-in-orlando" element={<SchoolEvents />} />
              <Route path="/events/church-event-inflatable-rentals-in-orlando" element={<ChurchEvents />} />
              <Route path="/events/corporate-event-inflatable-rentals-in-orlando" element={<CorporateEvents />} />
              <Route path="/events/graduation-party-water-slide-rentals-in-orlando" element={<GraduationEvents />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/bounce-house-rental-pricing-orlando-2025" element={<BounceHousePricing2025 />} />
              <Route path="/blog/corporate-team-building-with-inflatables" element={<CorporateTeamBuilding />} />
              <Route path="/blog/toddler-party-safety-bounce-house-rules" element={<ToddlerPartySafety />} />
              <Route path="/blog/top-3-bounce-house-themes-orlando" element={<Top3BounceHouseThemes />} />
              <Route path="/blog/elevate-celebration-bounce-house-rental" element={<ElevateCelebration />} />
              <Route path="/blog/bounce-house-rentals-near-me" element={<BounceHouseRentalsNearMe />} />
              <Route path="/blog/founding-of-christmas-florida" element={<FoundingOfChristmasFlorida />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/web-vitals" element={<WebVitals />} />
              <Route path="/checkout/return" element={<CheckoutReturn />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminCalendar />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="customers/:id" element={<AdminCustomerDetail />} />
                <Route path="new" element={<AdminNewReservation />} />
                <Route path="activity" element={<AdminActivity />} />
                <Route path="notifications" element={<AdminNotifications />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <CartDrawer />
          <CheckoutModal />
          </CartProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
