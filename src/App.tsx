import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import WhatsAppButton from "./components/WhatsAppButton";
import { CONTACT_WHATSAPP_NUMBER } from "./lib/contact";
import Landing from "./pages/Landing";
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Admin = lazy(() => import("./pages/Admin"));
const About = lazy(() => import("./pages/About"));
const PropertySubmit = lazy(() => import("./pages/PropertySubmit"));
const PropertyDetail = lazy(() => import("./pages/PropertyDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Launches = lazy(() => import("./pages/Launches"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const RouteAwareWhatsApp = () => {
  const location = useLocation();
  const hide = /^\/(admin|auth)(\/|$)/.test(location.pathname);
  if (hide) return null;
  return <WhatsAppButton phone={CONTACT_WHATSAPP_NUMBER} message="Olá! Gostaria de saber mais sobre a Imobiflow." />;
};

const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#15263d_0%,#1c3250_34%,#223d5f_68%,#162b46_100%)] text-white">
    <div className="rounded-2xl border border-white/10 bg-slate-900/40 px-5 py-3 text-sm text-white/85 backdrop-blur">
      Carregando...
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/imobiliaria" element={<Index />} />
            <Route path="/lancamentos" element={<Launches />} />
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
        </Suspense>
        <RouteAwareWhatsApp />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
