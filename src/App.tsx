
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import Index from "./pages/Index";
import Preferences from "./pages/Preferences";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance with retry configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed queries twice
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    },
  },
});

/**
 * Main application component that sets up routing and context providers
 * - Uses basename for production deployment to adsb.cc/tracker
 * - Configures QueryClient for API requests
 * - Provides user preferences context
 */
const App = () => {
  // Determine if we're in production and need the basename
  const isProd = import.meta.env.PROD;
  const basename = isProd ? '/tracker' : '/';

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserPreferencesProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserPreferencesProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
