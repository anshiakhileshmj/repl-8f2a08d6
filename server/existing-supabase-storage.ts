import { db } from './db';
import { eq, desc, and, like, gte, lte } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import type { 
  IStorage, MetricsData, AnalyticsData, GeographicRiskData, 
  ApiUsageData, BillingData, DeveloperProfile, TransactionFilters 
} from './storage';
import type { 
  User, InsertUser, Transaction, InsertTransaction, 
  Alert, InsertAlert, Case, InsertCase, 
  ApiKey, InsertApiKey, ComplianceReport, InsertComplianceReport,
  SanctionedWallet, InsertSanctionedWallet
} from '@shared/schema';

// Import your existing Supabase tables
import { 
  trackedWallets, walletRiskRatings, stablecoinTransfers, 
  walletTransactions, apiKeys as existingApiKeys, apiUsage, 
  developerProfiles
} from '../migrations/schema';

export class ExistingSupabaseStorage implements IStorage {
  // User management - mock implementation for demo
  async getUser(id: string): Promise<User | undefined> {
    // Return mock user for demo
    return {
      id: id,
      username: 'developer',
      password: '',
      fullName: 'AML Developer',
      email: 'developer@aml-dashboard.com',
      phone: '+1-555-0123',
      company: 'FinTech Solutions',
      jobTitle: 'Senior Developer',
      createdAt: new Date()
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // Return mock user for demo
    return {
      id: randomUUID(),
      username: username,
      password: '',
      fullName: 'AML Developer',
      email: username.includes('@') ? username : `${username}@aml-dashboard.com`,
      phone: '+1-555-0123',
      company: 'FinTech Solutions',
      jobTitle: 'Senior Developer',
      createdAt: new Date()
    };
  }

  async createUser(user: InsertUser): Promise<User> {
    // For demo purposes, return a mock user since auth.users is managed by Supabase Auth
    return {
      id: randomUUID(),
      username: user.username,
      password: '',
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || null,
      company: user.company || null,
      jobTitle: user.jobTitle || null,
      createdAt: new Date()
    };
  }

  // Metrics - using existing data
  async getMetrics(): Promise<MetricsData> {
    const [walletCount] = await db.select().from(trackedWallets);
    const [riskCount] = await db.select().from(walletRiskRatings).where(eq(walletRiskRatings.riskLevel, 'HIGH'));
    const [txCount] = await db.select().from(walletTransactions);
    const [transferCount] = await db.select().from(stablecoinTransfers);

    return {
      highRiskCount: Array.isArray(riskCount) ? riskCount.length : 0,
      activeCases: Array.isArray(walletCount) ? walletCount.length : 0,
      sanctionsMatches: 5, // Mock data
      apiCalls: Array.isArray(txCount) ? txCount.length : 0,
    };
  }

  // Transactions - map wallet transactions to our transaction format
  async getRecentTransactions(): Promise<Transaction[]> {
    const results = await db.select().from(walletTransactions).orderBy(desc(walletTransactions.timestamp)).limit(10);
    
    return results.map(tx => ({
      id: tx.id,
      customerId: tx.walletAddress,
      customerName: `Wallet ${tx.walletAddress.slice(0, 8)}...`,
      amount: parseFloat(tx.valueEth.toString()),
      currency: 'ETH',
      riskScore: Math.floor(Math.random() * 100), // Mock risk score
      status: tx.isError ? 'flagged' : 'approved',
      transactionType: 'crypto_transfer',
      sourceCountry: 'Unknown',
      destinationCountry: 'Unknown',
      description: `Transfer from ${tx.fromAddress.slice(0, 8)}... to ${tx.toAddress.slice(0, 8)}...`,
      flaggedReasons: tx.isError ? ['failed_transaction'] : null,
      createdAt: new Date(tx.timestamp)
    }));
  }

  async getFilteredTransactions(filters: TransactionFilters): Promise<Transaction[]> {
    let query = db.select().from(walletTransactions);
    
    // Apply basic filtering
    if (filters.country || filters.riskLevel) {
      // For demo, return recent transactions
      query = query.orderBy(desc(walletTransactions.timestamp)).limit(50);
    }
    
    const results = await query;
    return results.map(tx => ({
      id: tx.id,
      customerId: tx.walletAddress,
      customerName: `Wallet ${tx.walletAddress.slice(0, 8)}...`,
      amount: parseFloat(tx.valueEth.toString()),
      currency: 'ETH',
      riskScore: Math.floor(Math.random() * 100),
      status: tx.isError ? 'flagged' : 'approved',
      transactionType: 'crypto_transfer',
      sourceCountry: 'Unknown',
      destinationCountry: 'Unknown',
      description: `Transfer from ${tx.fromAddress.slice(0, 8)}... to ${tx.toAddress.slice(0, 8)}...`,
      flaggedReasons: tx.isError ? ['failed_transaction'] : null,
      createdAt: new Date(tx.timestamp)
    }));
  }

  async getTransactions(params: { page: number; pageSize: number; [key: string]: any }): Promise<Transaction[]> {
    const offset = (params.page - 1) * params.pageSize;
    const results = await db.select().from(walletTransactions)
      .orderBy(desc(walletTransactions.timestamp))
      .limit(params.pageSize)
      .offset(offset);
    
    return results.map(tx => ({
      id: tx.id,
      customerId: tx.walletAddress,
      customerName: `Wallet ${tx.walletAddress.slice(0, 8)}...`,
      amount: parseFloat(tx.valueEth.toString()),
      currency: 'ETH',
      riskScore: Math.floor(Math.random() * 100),
      status: tx.isError ? 'flagged' : 'approved',
      transactionType: 'crypto_transfer',
      sourceCountry: 'Unknown',
      destinationCountry: 'Unknown',
      description: `Transfer from ${tx.fromAddress.slice(0, 8)}... to ${tx.toAddress.slice(0, 8)}...`,
      flaggedReasons: tx.isError ? ['failed_transaction'] : null,
      createdAt: new Date(tx.timestamp)
    }));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    // For demo, return the transaction with an ID
    return {
      id: randomUUID(),
      ...transaction,
      createdAt: new Date()
    };
  }

  // Alerts - map high-risk wallets to alerts
  async getCriticalAlerts(): Promise<Alert[]> {
    const highRiskWallets = await db.select().from(walletRiskRatings)
      .where(eq(walletRiskRatings.riskLevel, 'HIGH'))
      .limit(5);

    return highRiskWallets.map(wallet => ({
      id: wallet.id,
      transactionId: null,
      severity: 'critical' as const,
      title: `High Risk Wallet Detected`,
      description: `Wallet ${wallet.walletAddress} has been flagged as high risk with score ${wallet.riskScore}`,
      alertType: 'unusual_pattern',
      isResolved: false,
      assignedTo: null,
      createdAt: new Date(wallet.lastUpdated)
    }));
  }

  async getAlerts(filters: { status?: string; severity?: string; dateRange?: string }): Promise<Alert[]> {
    const riskWallets = await db.select().from(walletRiskRatings).limit(20);
    
    return riskWallets.map(wallet => ({
      id: wallet.id,
      transactionId: null,
      severity: wallet.riskLevel === 'HIGH' ? 'high' as const : 'medium' as const,
      title: `${wallet.riskLevel} Risk Wallet`,
      description: `Wallet ${wallet.walletAddress} risk score: ${wallet.riskScore}`,
      alertType: 'threshold',
      isResolved: false,
      assignedTo: null,
      createdAt: new Date(wallet.lastUpdated)
    }));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    return {
      id: randomUUID(),
      ...alert,
      createdAt: new Date()
    };
  }

  async updateAlert(id: string, updates: { isResolved?: boolean; assignedTo?: string }): Promise<void> {
    // Mock implementation
  }

  // Cases - mock implementation
  async getCases(): Promise<Case[]> {
    return [];
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    return {
      id: randomUUID(),
      ...caseData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async updateCase(id: string, updates: any): Promise<void> {
    // Mock implementation
  }

  // API Keys - use existing api_keys table
  async getApiKeys(): Promise<ApiKey[]> {
    const results = await db.select().from(existingApiKeys).orderBy(desc(existingApiKeys.createdAt));
    
    return results.map(key => ({
      id: key.id,
      userId: key.userId,
      name: key.name || 'API Key',
      keyHash: key.key || 'aml_' + randomUUID().replace(/-/g, ''),
      keyPreview: `${key.key?.slice(0, 12)}...****` || 'aml_****',
      environment: 'production',
      isActive: key.isActive ?? true,
      lastUsed: key.lastUsedAt ? new Date(key.lastUsedAt) : null,
      usageCount: 0, // Would need to calculate from api_usage table
      createdAt: new Date(key.createdAt)
    }));
  }

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    const keyHash = `aml_${randomUUID().replace(/-/g, '')}`;
    
    const result = await db.insert(existingApiKeys).values({
      name: apiKey.name,
      keyHash: keyHash,
      key: keyHash,
      isActive: true,
    }).returning();

    return {
      id: result[0].id,
      userId: result[0].userId || 'system-user',
      name: result[0].name || 'API Key',
      keyHash: keyHash,
      keyPreview: `${keyHash.slice(0, 12)}...${keyHash.slice(-4)}`,
      environment: 'production',
      isActive: true,
      lastUsed: null,
      usageCount: 0,
      createdAt: new Date(result[0].createdAt)
    };
  }

  async updateApiKey(id: string, updates: { isActive?: boolean }): Promise<void> {
    await db.update(existingApiKeys).set(updates).where(eq(existingApiKeys.id, id));
  }

  async deleteApiKey(id: string): Promise<void> {
    await db.delete(existingApiKeys).where(eq(existingApiKeys.id, id));
  }

  // Sanctioned Wallets - use tracked_wallets with a flag
  async getSanctionedWallets(filters: { search?: string; source?: string }): Promise<SanctionedWallet[]> {
    let query = db.select().from(trackedWallets);
    
    if (filters.search) {
      query = query.where(like(trackedWallets.address, `%${filters.search}%`));
    }
    
    const results = await query.limit(50);
    
    return results.map(wallet => ({
      id: wallet.id,
      address: wallet.address,
      reason: 'Flagged for monitoring',
      addedBy: null,
      source: 'manual',
      isActive: true,
      createdAt: new Date(wallet.createdAt)
    }));
  }

  async createSanctionedWallet(wallet: InsertSanctionedWallet): Promise<SanctionedWallet> {
    // Add to tracked_wallets table
    const result = await db.insert(trackedWallets).values({
      address: wallet.address,
      name: wallet.reason || 'Sanctioned wallet',
      network: 'eth'
    }).returning();

    return {
      id: result[0].id,
      address: result[0].address,
      reason: wallet.reason || 'Added to sanctions list',
      addedBy: null,
      source: 'manual',
      isActive: true,
      createdAt: new Date(result[0].createdAt)
    };
  }

  async deleteSanctionedWallet(id: string): Promise<void> {
    await db.delete(trackedWallets).where(eq(trackedWallets.id, id));
  }

  // PEP Profiles - mock implementation
  async getPepProfiles(): Promise<any[]> {
    return [
      { id: '1', name: 'High Profile Person', country: 'US', riskLevel: 'High' },
      { id: '2', name: 'Political Figure', country: 'UK', riskLevel: 'Medium' }
    ];
  }

  // Mock implementations for other methods
  async getApiUsage(): Promise<ApiUsageData> {
    return { callsThisMonth: 7543, limit: 10000, avgResponseTime: 245, successRate: 99.2 };
  }

  async getReports(): Promise<ComplianceReport[]> { return []; }
  async createReport(report: InsertComplianceReport): Promise<ComplianceReport> {
    return { id: randomUUID(), ...report, createdAt: new Date() };
  }

  async getRiskTrends(): Promise<AnalyticsData[]> {
    return [
      { date: "Jan 1", highRisk: 12, mediumRisk: 34, lowRisk: 78, total: 124 },
      { date: "Jan 2", highRisk: 15, mediumRisk: 42, lowRisk: 65, total: 122 }
    ];
  }

  async getGeographicRiskData(): Promise<GeographicRiskData[]> {
    return [
      { country: "Russia", riskScore: 95, latitude: 55.7558, longitude: 37.6176, transactionCount: 45 },
      { country: "Iran", riskScore: 90, latitude: 35.6892, longitude: 51.389, transactionCount: 23 }
    ];
  }

  async getBillingHistory(): Promise<any[]> { return []; }
  async getSubscription(): Promise<any> { return null; }
  async getBillingData(): Promise<BillingData> {
    return {
      plan: { name: "Professional", price: 299, features: [] },
      paymentMethod: { type: "Visa", last4: "4242", expiry: "12/26" },
      usage: { apiCalls: 7543, apiLimit: 10000, storage: 2.1, storageLimit: 10 },
      invoices: []
    };
  }

  async getDeveloperProfile(): Promise<DeveloperProfile> {
    return {
      apiLimits: { rateLimit: "1000/hour", monthlyQuota: "10,000", concurrentConnections: "10" },
      activityLog: [],
      accountStatus: { verified: true, status: "Active" }
    };
  }
}