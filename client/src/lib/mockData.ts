// Note: This is for UI structure only - real data will come from Supabase
export const getMockTransactions = (): any[] => [];
export const getMockAlerts = (): any[] => [];
export const getMockCases = (): any[] => [];
export const getMockApiKeys = (): any[] => [];
export const getMockReports = (): any[] => [];
export const getMockRiskProfiles = (): any[] => [];

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
