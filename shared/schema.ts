import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("USD"),
  riskScore: integer("risk_score").notNull(),
  status: varchar("status").notNull(), // pending, flagged, approved, rejected
  transactionType: text("transaction_type").notNull(),
  sourceCountry: text("source_country"),
  destinationCountry: text("destination_country"),
  description: text("description"),
  flaggedReasons: jsonb("flagged_reasons"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alerts = pgTable("alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionId: varchar("transaction_id").references(() => transactions.id),
  severity: varchar("severity").notNull(), // critical, high, medium, low
  title: text("title").notNull(),
  description: text("description").notNull(),
  alertType: varchar("alert_type").notNull(), // sanctions, pep, unusual_pattern, threshold
  isResolved: boolean("is_resolved").default(false),
  assignedTo: varchar("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  caseNumber: text("case_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: varchar("status").notNull(), // open, in_progress, resolved, closed
  priority: varchar("priority").notNull(), // low, medium, high, urgent
  assignedTo: text("assigned_to"),
  transactionIds: jsonb("transaction_ids"),
  notes: jsonb("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  keyPreview: text("key_preview").notNull(),
  environment: varchar("environment").notNull(), // production, development
  isActive: boolean("is_active").default(true),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceReports = pgTable("compliance_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  reportType: varchar("report_type").notNull(), // sar, ctr, monthly, quarterly
  description: text("description"),
  fileUrl: text("file_url"),
  generatedBy: varchar("generated_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const riskProfiles = pgTable("risk_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  overallRiskScore: integer("overall_risk_score").notNull(),
  riskFactors: jsonb("risk_factors"),
  pepStatus: boolean("pep_status").default(false),
  sanctionsMatch: boolean("sanctions_match").default(false),
  lastAssessment: timestamp("last_assessment").defaultNow(),
});

export const sanctionedWallets = pgTable("sanctioned_wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  address: text("address").notNull().unique(),
  reason: text("reason"),
  addedBy: varchar("added_by").references(() => users.id),
  source: varchar("source").default("manual"), // manual, ofac, un, eu
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletRiskScores = pgTable("wallet_risk_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wallet: text("wallet").notNull().unique(),
  score: integer("score").notNull(),
  band: varchar("band").notNull(), // LOW, MEDIUM, HIGH, CRITICAL, PROHIBITED
  riskFactors: jsonb("risk_factors"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.80"),
  dataSourced: jsonb("data_sources"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const relayLogs = pgTable("relay_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull(),
  chain: varchar("chain").notNull(),
  fromAddr: text("from_addr"),
  toAddr: text("to_addr").notNull(),
  decision: varchar("decision").notNull(), // allowed, blocked
  riskBand: varchar("risk_band").notNull(),
  riskScore: integer("risk_score").notNull(),
  reasons: jsonb("reasons"),
  idempotencyKey: text("idempotency_key"),
  txHash: text("tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const billingHistory = pgTable("billing_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  invoiceNumber: text("invoice_number").notNull(),
  status: varchar("status").notNull(), // paid, pending, failed
  billingDate: timestamp("billing_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  paidDate: timestamp("paid_date"),
  downloadUrl: text("download_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  plan: varchar("plan").notNull(), // starter, professional, enterprise
  status: varchar("status").notNull(), // active, cancelled, expired
  currentPeriodStart: timestamp("current_period_start").notNull(),
  currentPeriodEnd: timestamp("current_period_end").notNull(),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  createdAt: true,
});

export const insertCaseSchema = createInsertSchema(cases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiKeySchema = createInsertSchema(apiKeys).omit({
  id: true,
  createdAt: true,
  keyHash: true,
  keyPreview: true,
  lastUsed: true,
  usageCount: true,
});

export const insertComplianceReportSchema = createInsertSchema(complianceReports).omit({
  id: true,
  createdAt: true,
});

export const insertRiskProfileSchema = createInsertSchema(riskProfiles).omit({
  id: true,
  lastAssessment: true,
});

export const insertSanctionedWalletSchema = createInsertSchema(sanctionedWallets).omit({
  id: true,
  createdAt: true,
});

export const insertWalletRiskScoreSchema = createInsertSchema(walletRiskScores).omit({
  id: true,
  lastUpdated: true,
});

export const insertRelayLogSchema = createInsertSchema(relayLogs).omit({
  id: true,
  createdAt: true,
});

export const insertBillingHistorySchema = createInsertSchema(billingHistory).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Case = typeof cases.$inferSelect;
export type InsertCase = z.infer<typeof insertCaseSchema>;

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = z.infer<typeof insertApiKeySchema>;

export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;

export type RiskProfile = typeof riskProfiles.$inferSelect;
export type InsertRiskProfile = z.infer<typeof insertRiskProfileSchema>;

export type SanctionedWallet = typeof sanctionedWallets.$inferSelect;
export type InsertSanctionedWallet = z.infer<typeof insertSanctionedWalletSchema>;

export type WalletRiskScore = typeof walletRiskScores.$inferSelect;
export type InsertWalletRiskScore = z.infer<typeof insertWalletRiskScoreSchema>;

export type RelayLog = typeof relayLogs.$inferSelect;
export type InsertRelayLog = z.infer<typeof insertRelayLogSchema>;

export type BillingHistory = typeof billingHistory.$inferSelect;
export type InsertBillingHistory = z.infer<typeof insertBillingHistorySchema>;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
