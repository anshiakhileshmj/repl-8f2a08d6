import { db } from './db';
import { 
  users, transactions, alerts, cases, apiKeys, complianceReports, 
  sanctionedWallets, riskProfiles, walletRiskScores, relayLogs, 
  billingHistory, subscriptions,
  type User, type InsertUser, type Transaction, type InsertTransaction, 
  type Alert, type InsertAlert, type Case, type InsertCase, 
  type ApiKey, type InsertApiKey, type ComplianceReport, type InsertComplianceReport,
  type SanctionedWallet, type InsertSanctionedWallet,
  type BillingHistory, type Subscription
} from '@shared/schema';
import { eq, desc, and, like, gte, lte } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { 
  IStorage, MetricsData, AnalyticsData, GeographicRiskData, 
  ApiUsageData, BillingData, DeveloperProfile, TransactionFilters 
} from './storage';

export class SupabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Metrics
  async getMetrics(): Promise<MetricsData> {
    const [transactionCount] = await db.select({ count: transactions.id }).from(transactions);
    const [alertCount] = await db.select({ count: alerts.id }).from(alerts);
    const [caseCount] = await db.select({ count: cases.id }).from(cases);
    const [sanctionCount] = await db.select({ count: sanctionedWallets.id }).from(sanctionedWallets);

    return {
      highRiskCount: transactionCount?.count || 0,
      activeCases: caseCount?.count || 0,
      sanctionsMatches: sanctionCount?.count || 0,
      apiCalls: 25430, // Mock data for now
    };
  }

  // Transactions
  async getRecentTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(10);
  }

  async getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let query = db.select().from(transactions);
    
    const conditions = [];
    if (filters.riskLevel) {
      if (filters.riskLevel === 'high') conditions.push(gte(transactions.riskScore, 70));
      if (filters.riskLevel === 'medium') conditions.push(and(gte(transactions.riskScore, 40), lte(transactions.riskScore, 69)));
      if (filters.riskLevel === 'low') conditions.push(lte(transactions.riskScore, 39));
    }
    if (filters.country) {
      conditions.push(eq(transactions.sourceCountry, filters.country));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(transactions.createdAt)).limit(50);
  }

  async getTransactions(params: { page: number; pageSize: number; [key: string]: any }): Promise<Transaction[]> {
    const offset = (params.page - 1) * params.pageSize;
    return await db.select().from(transactions)
      .orderBy(desc(transactions.createdAt))
      .limit(params.pageSize)
      .offset(offset);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  // Alerts
  async getCriticalAlerts(): Promise<Alert[]> {
    return await db.select().from(alerts)
      .where(eq(alerts.severity, 'critical'))
      .orderBy(desc(alerts.createdAt))
      .limit(5);
  }

  async getAlerts(filters: { status?: string; severity?: string; dateRange?: string }): Promise<Alert[]> {
    let query = db.select().from(alerts);
    
    const conditions = [];
    if (filters.status) conditions.push(eq(alerts.isResolved, filters.status === 'resolved'));
    if (filters.severity) conditions.push(eq(alerts.severity, filters.severity));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(alerts.createdAt)).limit(50);
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await db.insert(alerts).values(alert).returning();
    return result[0];
  }

  async updateAlert(id: string, updates: { isResolved?: boolean; assignedTo?: string }): Promise<void> {
    await db.update(alerts).set(updates).where(eq(alerts.id, id));
  }

  // Cases
  async getCases(): Promise<Case[]> {
    return await db.select().from(cases).orderBy(desc(cases.createdAt));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const result = await db.insert(cases).values(caseData).returning();
    return result[0];
  }

  async updateCase(id: string, updates: any): Promise<void> {
    await db.update(cases).set(updates).where(eq(cases.id, id));
  }

  // API Keys
  async getApiKeys(): Promise<ApiKey[]> {
    return await db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const keyHash = `aml_${randomUUID().replace(/-/g, '')}`;
    const keyPreview = `${keyHash.slice(0, 12)}...${keyHash.slice(-4)}`;
    
    const result = await db.insert(apiKeys).values({
      ...apiKey,
      keyHash,
      keyPreview,
    }).returning();
    return result[0];
  }

  async updateApiKey(id: string, updates: { isActive?: boolean }): Promise<void> {
    await db.update(apiKeys).set(updates).where(eq(apiKeys.id, id));
  }

  async deleteApiKey(id: string): Promise<void> {
    await db.delete(apiKeys).where(eq(apiKeys.id, id));
  }

  // Sanctioned Wallets
  async getSanctionedWallets(filters: { search?: string; source?: string }): Promise<SanctionedWallet[]> {
    let query = db.select().from(sanctionedWallets);
    
    const conditions = [];
    if (filters.search) {
      conditions.push(like(sanctionedWallets.address, `%${filters.search}%`));
    }
    if (filters.source && filters.source !== 'all') {
      conditions.push(eq(sanctionedWallets.source, filters.source));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(sanctionedWallets.createdAt));
  }

  async createSanctionedWallet(wallet: InsertSanctionedWallet): Promise<SanctionedWallet> {
    const result = await db.insert(sanctionedWallets).values(wallet).returning();
    return result[0];
  }

  async deleteSanctionedWallet(id: string): Promise<void> {
    await db.delete(sanctionedWallets).where(eq(sanctionedWallets.id, id));
  }

  // PEP Profiles
  async getPepProfiles(): Promise<any[]> {
    // Return mock data for now - you can implement actual PEP table later
    return [
      { id: '1', name: 'John Political', country: 'US', riskLevel: 'High' },
      { id: '2', name: 'Jane Minister', country: 'UK', riskLevel: 'Medium' }
    ];
  }

  // Billing
  async getBillingHistory(): Promise<BillingHistory[]> {
    return await db.select().from(billingHistory).orderBy(desc(billingHistory.billingDate));
  }

  async getSubscription(): Promise<Subscription | undefined> {
    const result = await db.select().from(subscriptions).limit(1);
    return result[0];
  }

  // API Usage
  async getApiUsage(): Promise<ApiUsageData> {
    return {
      callsThisMonth: 7543,
      limit: 10000,
      avgResponseTime: 245,
      successRate: 99.2,
    };
  }

  // Reports
  async getReports(): Promise<ComplianceReport[]> {
    return await db.select().from(complianceReports).orderBy(desc(complianceReports.createdAt));
  }

  async createReport(report: InsertComplianceReport): Promise<ComplianceReport> {
    const result = await db.insert(complianceReports).values(report).returning();
    return result[0];
  }

  // Analytics
  async getRiskTrends(): Promise<AnalyticsData[]> {
    // Mock data - you can implement actual analytics later
    return [
      { date: "Jan 1", highRisk: 12, mediumRisk: 34, lowRisk: 78, total: 124 },
      { date: "Jan 2", highRisk: 15, mediumRisk: 42, lowRisk: 65, total: 122 },
      { date: "Jan 3", highRisk: 8, mediumRisk: 38, lowRisk: 89, total: 135 }
    ];
  }

  async getGeographicRiskData(): Promise<GeographicRiskData[]> {
    // Mock data - you can implement actual geo analytics later
    return [
      { country: "Russia", riskScore: 95, latitude: 55.7558, longitude: 37.6176, transactionCount: 45 },
      { country: "Iran", riskScore: 90, latitude: 35.6892, longitude: 51.389, transactionCount: 23 },
      { country: "North Korea", riskScore: 98, latitude: 39.0392, longitude: 125.7625, transactionCount: 12 }
    ];
  }

  // Billing
  async getBillingData(): Promise<BillingData> {
    return {
      plan: {
        name: "Professional",
        price: 299,
        features: ["Advanced risk scoring", "Priority support", "Webhook integrations"]
      },
      paymentMethod: {
        type: "Visa",
        last4: "4242",
        expiry: "12/26"
      },
      usage: {
        apiCalls: 7543,
        apiLimit: 10000,
        storage: 2.1,
        storageLimit: 10
      },
      invoices: []
    };
  }

  // Profile
  async getDeveloperProfile(): Promise<DeveloperProfile> {
    return {
      apiLimits: {
        rateLimit: "1000 requests/hour",
        monthlyQuota: "10,000 calls",
        concurrentConnections: "10"
      },
      activityLog: [
        { id: "1", action: "API Key Created", description: "Created new production API key", timestamp: "2024-01-15T10:30:00Z" },
        { id: "2", action: "Transaction Processed", description: "High-risk transaction flagged", timestamp: "2024-01-15T09:45:00Z" }
      ],
      accountStatus: {
        verified: true,
        status: "Active"
      }
    };
  }
}