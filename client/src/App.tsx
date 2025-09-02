import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import TransactionsPage from "@/pages/transactions";
import AlertsPage from "@/pages/alerts";
import CasesPage from "@/pages/cases";
import SanctionsPage from "@/pages/sanctions";
import ReportsPage from "@/pages/reports";
import ApiManagementPage from "@/pages/api-management";
import SettingsPage from "@/pages/settings";
import BillingPage from "@/pages/billing";
import ProfilePage from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/alerts" component={AlertsPage} />
      <Route path="/cases" component={CasesPage} />
      <Route path="/sanctions" component={SanctionsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/api-management" component={ApiManagementPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/billing" component={BillingPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
