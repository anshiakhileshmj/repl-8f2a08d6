import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb, bigint, bigserial, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// API Endpoints Table - Stores API documentation
export const apiEndpoints = pgTable("api_endpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  method: text("method").notNull(),
  path: text("path").notNull(),
  description: text("description").notNull(),
  parameters: jsonb("parameters").default(sql`'{}'::jsonb`),
  responseSchema: jsonb("response_schema").default(sql`'{}'::jsonb`),
  rateLimit: integer("rate_limit").default(60),
  category: text("category").notNull(),
  exampleRequest: text("example_request"),
  exampleResponse: text("example_response"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// API Keys Table - Core API management
export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  key: text("key"),
  keyHash: text("key_hash").notNull(),
  partnerId: text("partner_id"),
  userId: varchar("user_id"),
  isActive: boolean("is_active").notNull().default(true),
  active: boolean("active").default(true),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  rateLimitPerMinute: integer("rate_limit_per_minute").notNull().default(60),
});

// API Usage Table - Tracking and analytics
export const apiUsage = pgTable("api_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  apiKeyId: varchar("api_key_id").notNull(),
  endpoint: text("endpoint").notNull(),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  responseTimeMs: integer("response_time_ms"),
  statusCode: integer("status_code"),
});

// Developer Profiles Table - User management
export const developerProfiles = pgTable("developer_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  companyName: text("company_name"),
  website: text("website"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  apiUsagePlan: text("api_usage_plan").default("free"),
  monthlyRequestLimit: integer("monthly_request_limit").default(1000),
});

// Real-time Transfers Table
export const realTimeTransfers = pgTable("real_time_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hash: text("hash").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  amount: decimal("amount").notNull(),
  currency: text("currency").notNull().default("ETH"),
  network: text("network").notNull().default("ethereum"),
  blockNumber: integer("block_number").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  usdValue: decimal("usd_value").notNull().default("0"),
  isWhale: boolean("is_whale").notNull().default(false),
  gasPrice: decimal("gas_price"),
  gasUsed: decimal("gas_used"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Relay Logs Table - Transaction logging
export const relayLogs = pgTable("relay_logs", {
  id: serial("id").primaryKey(),
  partnerId: text("partner_id"),
  chain: text("chain").notNull(),
  fromAddr: text("from_addr"),
  toAddr: text("to_addr").notNull(),
  riskScore: integer("risk_score").notNull().default(0),
  riskBand: text("risk_band").notNull(),
  decision: text("decision").notNull(),
  reasons: text("reasons").array().default(sql`'{}'::text[]`),
  txHash: text("tx_hash"),
  idempotencyKey: text("idempotency_key"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Risk Events Table
export const riskEvents = pgTable("risk_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wallet: text("wallet").notNull(),
  feature: text("feature").notNull(),
  category: varchar("category").default("BEHAVIORAL"),
  details: jsonb("details").default(sql`'{}'::jsonb`),
  weightApplied: integer("weight_applied").notNull().default(0),
  confidence: decimal("confidence").default("1.0"),
  metadata: jsonb("metadata"),
  occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Risk Scores Table
export const riskScores = pgTable("risk_scores", {
  id: bigint("id", { mode: "number" }).primaryKey().default(sql`nextval()`),
  wallet: text("wallet").notNull(),
  score: integer("score").notNull().default(0),
  band: text("band").notNull().default("LOW"),
  confidence: decimal("confidence").default("1.0"),
  metadata: jsonb("metadata"),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  riskFactors: jsonb("risk_factors").default(sql`'[]'::jsonb`),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Sanctioned Wallets Table - AML compliance
export const sanctionedWallets = pgTable("sanctioned_wallets", {
  address: text("address").primaryKey(),
  source: text("source").notNull().default("OFAC"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Stablecoin Transfers Table
export const stablecoinTransfers = pgTable("stablecoin_transfers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderAddress: text("sender_address").notNull(),
  receiverAddress: text("receiver_address").notNull(),
  tokenSymbol: text("token_symbol").notNull(),
  tokenName: text("token_name").notNull(),
  amount: decimal("amount").notNull(),
  network: text("network").notNull().default("ethereum"),
  blockTime: timestamp("block_time", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Tracked Wallets Table
export const trackedWallets = pgTable("tracked_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull(),
  name: text("name"),
  network: text("network").notNull().default("eth"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Wallet Risk Ratings Table
export const walletRiskRatings = pgTable("wallet_risk_ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  riskScore: integer("risk_score"),
  riskLevel: text("risk_level"),
  totalTransactions: integer("total_transactions").notNull().default(0),
  failedTransactions: integer("failed_transactions").notNull().default(0),
  failedTxRatio: decimal("failed_tx_ratio"),
  walletAgeDays: integer("wallet_age_days"),
  firstTxDate: timestamp("first_tx_date", { withTimezone: true }),
  network: text("network").default("ethereum"),
  lastUpdated: timestamp("last_updated", { withTimezone: true }).notNull().defaultNow(),
});

// Wallet Transactions Table
export const walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  txHash: text("tx_hash").notNull(),
  fromAddress: text("from_address").notNull(),
  toAddress: text("to_address").notNull(),
  valueEth: decimal("value_eth").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  isError: boolean("is_error").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Transaction Patterns Table
export const transactionPatterns = pgTable("transaction_patterns", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  wallet: text("wallet").notNull(),
  patternType: text("pattern_type").notNull(),
  patternData: jsonb("pattern_data").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.80"),
  detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Network Associations Table
export const networkAssociations = pgTable("network_associations", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  wallet: text("wallet").notNull(),
  associatedWallet: text("associated_wallet").notNull(),
  associationType: text("association_type").notNull(),
  strength: decimal("strength", { precision: 3, scale: 2 }).default("1.00"),
  firstSeen: timestamp("first_seen", { withTimezone: true }).defaultNow(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).defaultNow(),
});

// Risk Indicators Table
export const riskIndicators = pgTable("risk_indicators", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  indicatorKey: text("indicator_key").notNull().unique(),
  category: text("category").notNull(),
  baseWeight: decimal("base_weight", { precision: 5, scale: 2 }).notNull(),
  halfLifeDays: integer("half_life_days").notNull().default(30),
  isCritical: boolean("is_critical").default(false),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Insert schemas
export const insertApiEndpointSchema = createInsertSchema(apiEndpoints).omit({
  id: true,
  createdAt: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  key: true,
  keyHash: true,
  lastUsedAt: true,
  createdAt: true,
});

export const insertApiUsageSchema = createInsertSchema(apiUsage).omit({
  id: true,
  timestamp: true,
});

export const insertDeveloperProfileSchema = createInsertSchema(developerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRealTimeTransferSchema = createInsertSchema(realTimeTransfers).omit({
  id: true,
  createdAt: true,
});

export const insertRelayLogSchema = createInsertSchema(relayLogs).omit({
  id: true,
  createdAt: true,
});

export const insertRiskEventSchema = createInsertSchema(riskEvents).omit({
  id: true,
  occurredAt: true,
  timestamp: true,
  createdAt: true,
});

export const insertRiskScoreSchema = createInsertSchema(riskScores).omit({
  id: true,
  lastUpdated: true,
  updatedAt: true,
  createdAt: true,
});

export const insertSanctionedWalletSchema = createInsertSchema(sanctionedWallets).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertStablecoinTransferSchema = createInsertSchema(stablecoinTransfers).omit({
  id: true,
  createdAt: true,
});

export const insertTrackedWalletSchema = createInsertSchema(trackedWallets).omit({
  id: true,
  createdAt: true,
});

export const insertWalletRiskRatingSchema = createInsertSchema(walletRiskRatings).omit({
  id: true,
  lastUpdated: true,
});

export const insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionPatternSchema = createInsertSchema(transactionPatterns).omit({
  id: true,
  detectedAt: true,
});

export const insertNetworkAssociationSchema = createInsertSchema(networkAssociations).omit({
  id: true,
  firstSeen: true,
  lastSeen: true,
});

export const insertRiskIndicatorSchema = createInsertSchema(riskIndicators).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type InsertApiEndpoint = z.infer<typeof insertApiEndpointSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type ApiUsage = typeof apiUsage.$inferSelect;
export type InsertApiUsage = z.infer<typeof insertApiUsageSchema>;

export type DeveloperProfile = typeof developerProfiles.$inferSelect;
export type InsertDeveloperProfile = z.infer<typeof insertDeveloperProfileSchema>;

export type RealTimeTransfer = typeof realTimeTransfers.$inferSelect;
export type InsertRealTimeTransfer = z.infer<typeof insertRealTimeTransferSchema>;

export type RelayLog = typeof relayLogs.$inferSelect;
export type InsertRelayLog = z.infer<typeof insertRelayLogSchema>;

export type RiskEvent = typeof riskEvents.$inferSelect;
export type InsertRiskEvent = z.infer<typeof insertRiskEventSchema>;

export type RiskScore = typeof riskScores.$inferSelect;
export type InsertRiskScore = z.infer<typeof insertRiskScoreSchema>;

export type SanctionedWallet = typeof sanctionedWallets.$inferSelect;
export type InsertSanctionedWallet = z.infer<typeof insertSanctionedWalletSchema>;

export type StablecoinTransfer = typeof stablecoinTransfers.$inferSelect;
export type InsertStablecoinTransfer = z.infer<typeof insertStablecoinTransferSchema>;

export type TrackedWallet = typeof trackedWallets.$inferSelect;
export type InsertTrackedWallet = z.infer<typeof insertTrackedWalletSchema>;

export type WalletRiskRating = typeof walletRiskRatings.$inferSelect;
export type InsertWalletRiskRating = z.infer<typeof insertWalletRiskRatingSchema>;

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type InsertWalletTransaction = z.infer<typeof insertWalletTransactionSchema>;

export type TransactionPattern = typeof transactionPatterns.$inferSelect;
export type InsertTransactionPattern = z.infer<typeof insertTransactionPatternSchema>;

export type NetworkAssociation = typeof networkAssociations.$inferSelect;
export type InsertNetworkAssociation = z.infer<typeof insertNetworkAssociationSchema>;

export type RiskIndicator = typeof riskIndicators.$inferSelect;
export type InsertRiskIndicator = z.infer<typeof insertRiskIndicatorSchema>;

// Legacy types for compatibility with existing AML dashboard components
export type Transaction = {
  id: string;
  customerId: string;
  customerName: string;
  amount: string;
  currency: string;
  riskScore: number;
  status: string;
  transactionType: string;
  sourceCountry?: string;
  destinationCountry?: string;
  description?: string;
  flaggedReasons?: any[];
  createdAt?: Date;
};

export type Alert = {
  id: string;
  transactionId?: string;
  severity: string;
  title: string;
  description: string;
  alertType: string;
  isResolved: boolean;
  assignedTo?: string;
  createdAt?: Date;
};

export type Case = {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  transactionIds?: string[];
  notes?: any[];
  createdAt?: Date;
  updatedAt?: Date;
};

// User authentication schemas
export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  company: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  country: z.string().min(1, "Country is required"),
  businessType: z.string().min(1, "Business type is required"),
  password: z.string().min(6, "Password must be at least 6 characters").max(15, "Password must be no more than 15 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const updateProfileSchema = z.object({
  companyName: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;