import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropRecommendation from "./pages/CropRecommendation";
import SoilAnalysis from "./pages/SoilAnalysis";
import Weather from "./pages/Weather";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";
import SmartRecommendation from "./pages/SmartRecommendation";
import FertilizerRecommendation from "./pages/FertilizerRecommendation";
import AgriAssistant from "./pages/AgriAssistant";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/recommend" element={<CropRecommendation />} />
            <Route path="/soil" element={<SoilAnalysis />} />
            <Route path="/assistant" element={<AgriAssistant />} />
            <Route path="/smart" element={<SmartRecommendation />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/fertilizer" element={<FertilizerRecommendation />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/market" element={<MarketPrices />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
