// Note: This is for UI structure only - real data will come from Supabase
export const getMockTransactions = (): any[] => [];
export const getMockAlerts = (): any[] => [];
export const getMockCases = (): any[] => [];
export const getMockApiKeys = (): any[] => [];
export const getMockReports = (): any[] => [];
export const getMockRiskProfiles = (): any[] => [];

// Mock data structures for components that expect specific properties
export const getMockMetrics = (): MetricsData => ({
  highRiskCount: 0,
  activeCases: 0,
  sanctionsMatches: 0,
  apiCalls: 0
});

export const getMockUsage = () => ({
  api: 0,
  storage: 0
});

export const getMockPlan = () => ({
  name: 'Free',
  features: []
});

export const getMockPaymentMethod = () => ({
  type: 'card',
  last4: '0000'
});

export const getMockInvoices = (): any[] => [];

// Analytics data structure
export interface AnalyticsData {
  date: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  total: number;
}

export interface MetricsData {
  highRiskCount: number;
  activeCases: number;
  sanctionsMatches: number;
  apiCalls: number;
}

export interface GeographicRiskData {
  country: string;
  riskScore: number;
  latitude: number;
  longitude: number;
  transactionCount: number;
}
