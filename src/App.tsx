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
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/delivery-area" element={<DeliveryArea />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/bounce-house-rentals" element={<BounceHouseRentals />} />
            <Route path="/water-slide-rentals" element={<WaterSlideRentals />} />
            <Route path="/obstacle-course-rentals" element={<ObstacleCourseRentals />} />
            <Route path="/interactive-game-rentals" element={<InteractiveGameRentals />} />
            <Route path="/concession-rentals" element={<ConcessionRentals />} />
            <Route path="/table-chair-rentals" element={<TableChairRentals />} />
            <Route path="/delivery-area/alafaya" element={<AlafayaDelivery />} />
            <Route path="/delivery-area/avalon-park" element={<AvalonParkDelivery />} />
            <Route path="/delivery-area/azalea-park" element={<AzaleaParkDelivery />} />
            <Route path="/delivery-area/bithlo" element={<BithloDelivery />} />
            <Route path="/delivery-area/christmas" element={<ChristmasDelivery />} />
            <Route path="/delivery-area/chuluota" element={<ChuluotaDelivery />} />
            <Route path="/delivery-area/eastwood" element={<EastwoodDelivery />} />
            <Route path="/delivery-area/stoneybrook" element={<StoneybrookDelivery />} />
            <Route path="/delivery-area/waterford-lakes" element={<WaterfordLakesDelivery />} />
            <Route path="/delivery-area/wedgefield" element={<WedgefieldDelivery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
