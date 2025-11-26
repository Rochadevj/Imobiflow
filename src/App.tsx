import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import About from "./pages/About";
import PropertySubmit from "./pages/PropertySubmit";
import PropertyDetail from "./pages/PropertyDetail";
import Favorites from "./pages/Favorites";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RouteAwareWhatsApp = () => {
  const location = useLocation();
  const hide = /^\/(admin|auth)(\/|$)/.test(location.pathname);
  if (hide) return null;
  return <WhatsAppButton phone="51 991288418" message="Olá! Gostaria de alguma informação?" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/sobre" element={<About />} />
          <Route path="/anunciar" element={<PropertySubmit />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/politica-privacidade" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <RouteAwareWhatsApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
