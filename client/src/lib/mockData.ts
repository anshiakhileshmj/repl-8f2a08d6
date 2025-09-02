import { Transaction, Alert, Case, ApiKey, ComplianceReport, RiskProfile } from "@shared/schema";

// Note: This is for UI structure only - real data will come from API
export const getMockTransactions = (): Partial<Transaction>[] => [];
export const getMockAlerts = (): Partial<Alert>[] => [];
export const getMockCases = (): Partial<Case>[] => [];
export const getMockApiKeys = (): Partial<ApiKey>[] => [];
export const getMockReports = (): Partial<ComplianceReport>[] => [];
export const getMockRiskProfiles = (): Partial<RiskProfile>[] => [];

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
