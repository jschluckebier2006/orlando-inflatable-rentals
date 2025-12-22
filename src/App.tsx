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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
