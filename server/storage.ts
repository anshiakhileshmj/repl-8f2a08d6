import { type User, type InsertUser, type Transaction, type InsertTransaction, type Alert, type InsertAlert, type Case, type InsertCase, type ApiKey, type InsertApiKey, type ComplianceReport, type InsertComplianceReport } from "@shared/schema";
import { randomUUID } from "crypto";

// Interfaces for additional data structures
export interface MetricsData {
  highRiskCount: number;
  activeCases: number;
  sanctionsMatches: number;
  apiCalls: number;
}

export interface AnalyticsData {
  date: string;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  total: number;
}

export interface GeographicRiskData {
  country: string;
  riskScore: number;
  latitude: number;
  longitude: number;
  transactionCount: number;
}

export interface ApiUsageData {
  callsThisMonth: number;
  limit: number;
  avgResponseTime: number;
  successRate: number;
}

export interface BillingData {
  plan: {
    name: string;
    price: number;
    features: string[];
  };
  paymentMethod: {
    type: string;
    last4: string;
    expiry: string;
  };
  usage: {
    apiCalls: number;
    apiLimit: number;
    storage: number;
    storageLimit: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    period: string;
  }>;
}

export interface DeveloperProfile {
  apiLimits: {
    rateLimit: string;
    monthlyQuota: string;
    concurrentConnections: string;
  };
  activityLog: Array<{
    id: string;
    action: string;
    description: string;
    timestamp: string;
  }>;
  accountStatus: {
    verified: boolean;
    status: string;
  };
}

export interface TransactionFilters {
  dateRange?: string;
  riskLevel?: string;
  country?: string;
  transactionType?: string;
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Metrics
  getMetrics(): Promise<MetricsData>;

  // Transactions
  getRecentTransactions(): Promise<Transaction[]>;
  getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Alerts
  getCriticalAlerts(): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;

  // Cases
  getCases(): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;

  // API Keys
  getApiKeys(): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deleteApiKey(id: string): Promise<void>;

  // API Usage
  getApiUsage(): Promise<ApiUsageData>;

  // Reports
  getReports(): Promise<ComplianceReport[]>;
  createReport(report: InsertComplianceReport): Promise<ComplianceReport>;

  // Analytics
  getRiskTrends(): Promise<AnalyticsData[]>;
  getGeographicRiskData(): Promise<GeographicRiskData[]>;

  // Billing
  getBillingData(): Promise<BillingData>;

  // Profile
  getDeveloperProfile(): Promise<DeveloperProfile>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private transactions: Map<string, Transaction>;
  private alerts: Map<string, Alert>;
  private cases: Map<string, Case>;
  private apiKeys: Map<string, ApiKey>;
  private reports: Map<string, ComplianceReport>;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.alerts = new Map();
    this.cases = new Map();
    this.apiKeys = new Map();
    this.reports = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  // Metrics
  async getMetrics(): Promise<MetricsData> {
    const transactions = Array.from(this.transactions.values());
    const cases = Array.from(this.cases.values());
    const alerts = Array.from(this.alerts.values());

    return {
      highRiskCount: transactions.filter(t => t.riskScore >= 80).length,
      activeCases: cases.filter(c => c.status === 'open' || c.status === 'in_progress').length,
      sanctionsMatches: alerts.filter(a => a.alertType === 'sanctions').length,
      apiCalls: 45231, // This would come from API usage tracking
    };
  }

  // Transactions
  async getRecentTransactions(): Promise<Transaction[]> {
    const transactions = Array.from(this.transactions.values());
    return transactions
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 10);
  }

  async getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let transactions = Array.from(this.transactions.values());

    if (filters.riskLevel && filters.riskLevel !== 'all-levels') {
      const riskThresholds = {
        'critical': 90,
        'high': 70,
        'medium': 40,
        'low': 0
      };
      const threshold = riskThresholds[filters.riskLevel as keyof typeof riskThresholds];
      if (threshold !== undefined) {
        transactions = transactions.filter(t => {
          if (filters.riskLevel === 'critical') return t.riskScore >= 90;
          if (filters.riskLevel === 'high') return t.riskScore >= 70 && t.riskScore < 90;
          if (filters.riskLevel === 'medium') return t.riskScore >= 40 && t.riskScore < 70;
          if (filters.riskLevel === 'low') return t.riskScore < 40;
          return true;
        });
      }
    }

    return transactions.slice(0, 50); // Limit results
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date(),
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  // Alerts
  async getCriticalAlerts(): Promise<Alert[]> {
    const alerts = Array.from(this.alerts.values());
    return alerts
      .filter(alert => alert.severity === 'critical' || alert.severity === 'high')
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 10);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const id = randomUUID();
    const newAlert: Alert = {
      ...alert,
      id,
      createdAt: new Date(),
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  // Cases
  async getCases(): Promise<Case[]> {
    const cases = Array.from(this.cases.values());
    return cases
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 20);
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const id = randomUUID();
    const newCase: Case = {
      ...caseData,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.cases.set(id, newCase);
    return newCase;
  }

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    const keys = Array.from(this.apiKeys.values());
    return keys.filter(key => key.isActive);
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const id = randomUUID();
    const keyHash = randomUUID(); // In real implementation, this would be a proper hash
    const keyPreview = `aml_pk_${apiKey.environment}_••••••••••••••••`;
    
    const newApiKey: ApiKey = {
      ...apiKey,
      id,
      keyHash,
      keyPreview,
      createdAt: new Date(),
    };
    this.apiKeys.set(id, newApiKey);
    return newApiKey;
  }

  async deleteApiKey(id: string): Promise<void> {
    const apiKey = this.apiKeys.get(id);
    if (apiKey) {
      apiKey.isActive = false;
      this.apiKeys.set(id, apiKey);
    }
  }

  // API Usage
  async getApiUsage(): Promise<ApiUsageData> {
    return {
      callsThisMonth: 1245678,
      limit: 2000000,
      avgResponseTime: 125,
      successRate: 99.8,
    };
  }

  // Reports
  async getReports(): Promise<ComplianceReport[]> {
    const reports = Array.from(this.reports.values());
    return reports
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
      .slice(0, 10);
  }

  async createReport(report: InsertComplianceReport): Promise<ComplianceReport> {
    const id = randomUUID();
    const newReport: ComplianceReport = {
      ...report,
      id,
      createdAt: new Date(),
    };
    this.reports.set(id, newReport);
    return newReport;
  }

  // Analytics
  async getRiskTrends(): Promise<AnalyticsData[]> {
    return [
      { date: "Jan 1", highRisk: 12, mediumRisk: 45, lowRisk: 123, total: 180 },
      { date: "Jan 8", highRisk: 15, mediumRisk: 52, lowRisk: 134, total: 201 },
      { date: "Jan 15", highRisk: 8, mediumRisk: 38, lowRisk: 145, total: 191 },
      { date: "Jan 22", highRisk: 22, mediumRisk: 67, lowRisk: 156, total: 245 },
      { date: "Jan 29", highRisk: 18, mediumRisk: 48, lowRisk: 167, total: 233 },
    ];
  }

  async getGeographicRiskData(): Promise<GeographicRiskData[]> {
    return [
      { country: "Russia", riskScore: 95, latitude: 55.7558, longitude: 37.6176, transactionCount: 45 },
      { country: "Iran", riskScore: 90, latitude: 35.6892, longitude: 51.3890, transactionCount: 23 },
      { country: "North Korea", riskScore: 98, latitude: 39.0392, longitude: 125.7625, transactionCount: 12 },
      { country: "Venezuela", riskScore: 85, latitude: 10.4806, longitude: -66.9036, transactionCount: 34 },
      { country: "United States", riskScore: 25, latitude: 39.8283, longitude: -98.5795, transactionCount: 1250 },
    ];
  }

  // Billing
  async getBillingData(): Promise<BillingData> {
    return {
      plan: {
        name: "Professional Plan",
        price: 299,
        features: [
          "Up to 2M API calls/month",
          "Real-time transaction monitoring",
          "Advanced risk analytics",
          "24/7 priority support"
        ]
      },
      paymentMethod: {
        type: "Visa",
        last4: "4242",
        expiry: "12/25"
      },
      usage: {
        apiCalls: 1245678,
        apiLimit: 2000000,
        storage: 15.2,
        storageLimit: 100
      },
      invoices: [
        { id: "1", date: "Jan 1, 2024", amount: 299, status: "paid", period: "January 2024" },
        { id: "2", date: "Dec 1, 2023", amount: 299, status: "paid", period: "December 2023" },
        { id: "3", date: "Nov 1, 2023", amount: 99, status: "paid", period: "November 2023" }
      ]
    };
  }

  // Profile
  async getDeveloperProfile(): Promise<DeveloperProfile> {
    return {
      apiLimits: {
        rateLimit: "1000/minute",
        monthlyQuota: "2,000,000 calls",
        concurrentConnections: "50",
      },
      activityLog: [
        {
          id: "1",
          action: "API Key Created",
          description: "Created new production API key",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          action: "Profile Updated",
          description: "Changed notification preferences",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          action: "Login",
          description: "Signed in from new device",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
      accountStatus: {
        verified: true,
        status: "Verified and active",
      },
    };
  }
}

import { ExistingSupabaseStorage } from './existing-supabase-storage';

export const storage = new ExistingSupabaseStorage();
