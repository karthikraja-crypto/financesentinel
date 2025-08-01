
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { UserProvider } from "./contexts/UserContext";
import { DatasetProvider } from './contexts/DatasetContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Index from "./pages/Index";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Alerts from "./pages/Alerts";
import FlaggedTransactions from "./pages/FlaggedTransactions";
import FlexibleParameters from "./pages/FlexibleParameters";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <UserProvider>
            <CurrencyProvider>
              <DatasetProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/flexible-parameters" element={<FlexibleParameters />} />
                  <Route path="/alerts" element={<Alerts />} />
                  <Route path="/flagged-transactions" element={<FlaggedTransactions />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </DatasetProvider>
            </CurrencyProvider>
          </UserProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
