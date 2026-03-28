import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicLayout from "./components/layouts/PublicLayout";
import SaaSLayout from "./components/layouts/SaaSLayout";
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
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "879911991392-78jramr0op8lod00a3c3bjg4s079dcnr.apps.googleusercontent.com";

const App = () => (
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Landing Page */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
              </Route>

              {/* Public Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

          {/* SaaS Application Pages */}
              <Route element={<ProtectedRoute />}>
                <Route element={<SaaSLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/disease" element={<DiseaseDetection />} />
            <Route path="/recommend" element={<CropRecommendation />} />
            <Route path="/soil" element={<SoilAnalysis />} />
            <Route path="/assistant" element={<AgriAssistant />} />
                <Route path="/smart" element={<SmartRecommendation />} />
                  <Route path="/fertilizer" element={<FertilizerRecommendation />} />
                  <Route path="/weather" element={<Weather />} />
                  <Route path="/market" element={<MarketPrices />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
