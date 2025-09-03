import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { TransactionFeed } from "@/components/dashboard/TransactionFeed";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { RiskAnalytics } from "@/components/dashboard/RiskAnalytics";
import { RiskHeatmap } from "@/components/dashboard/RiskHeatmap";
import { CaseManagement } from "@/components/dashboard/CaseManagement";
import { ComplianceReports } from "@/components/dashboard/ComplianceReports";
import { AdvancedFiltering } from "@/components/dashboard/AdvancedFiltering";
import { ApiManagement } from "@/components/dashboard/inline/ApiManagement";
import { Settings } from "@/components/dashboard/inline/Settings";
import { Billing } from "@/components/dashboard/inline/Billing";
import { Profile } from "@/components/dashboard/inline/Profile";
import { useState } from "react";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background dark:bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMobileMenuToggle={handleMobileMenuToggle} />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6" data-testid="dashboard-main">
          {/* Key Metrics Cards */}
          <MetricsCards />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Real-time Transaction Feed */}
            <TransactionFeed />

            {/* Alerts Panel */}
            <AlertsPanel />
          </div>

          {/* Risk Analytics and Heatmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Analytics Chart */}
            <RiskAnalytics />

            {/* Geographic Risk Heatmap */}
            <RiskHeatmap />
          </div>

          {/* Inline Management Sections */}
          <ApiManagement />
          <Settings />
          <Billing />
          <Profile />

          {/* Case Management and Compliance Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Case Management */}
            <CaseManagement />

            {/* Compliance Reports */}
            <ComplianceReports />
          </div>

          {/* Advanced Filtering and Search */}
          <AdvancedFiltering />
        </main>
      </div>
    </div>
  );
}
