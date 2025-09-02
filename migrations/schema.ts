import { pgTable, uniqueIndex, pgPolicy, uuid, text, timestamp, index, unique, check, integer, numeric, boolean, jsonb, foreignKey, varchar, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const trackedWallets = pgTable("tracked_wallets", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	address: text().notNull(),
	name: text(),
	network: text().default('eth').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("unique_wallet_network").using("btree", table.address.asc().nullsLast().op("text_ops"), table.network.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow public read access to tracked wallets", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow public insert access to tracked wallets", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("Allow public update access to tracked wallets", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("Allow public delete access to tracked wallets", { as: "permissive", for: "delete", to: ["public"] }),
]);

export const walletRiskRatings = pgTable("wallet_risk_ratings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	walletAddress: text("wallet_address").notNull(),
	firstTxDate: timestamp("first_tx_date", { withTimezone: true, mode: 'string' }),
	totalTransactions: integer("total_transactions").default(0).notNull(),
	failedTransactions: integer("failed_transactions").default(0).notNull(),
	walletAgeDays: integer("wallet_age_days"),
	failedTxRatio: numeric("failed_tx_ratio"),
	riskScore: integer("risk_score"),
	riskLevel: text("risk_level"),
	lastUpdated: timestamp("last_updated", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	network: text().default('ethereum'),
}, (table) => [
	index("idx_wallet_risk_ratings_wallet_address").using("btree", table.walletAddress.asc().nullsLast().op("text_ops")),
	unique("wallet_risk_ratings_wallet_address_key").on(table.walletAddress),
	pgPolicy("Allow public read access to wallet risk ratings", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to wallet risk ratings", { as: "permissive", for: "all", to: ["public"] }),
	check("wallet_risk_ratings_risk_level_check", sql`risk_level = ANY (ARRAY['LOW'::text, 'MEDIUM'::text, 'HIGH'::text])`),
	check("wallet_risk_ratings_risk_score_check", sql`(risk_score >= 1) AND (risk_score <= 10)`),
]);

export const stablecoinTransfers = pgTable("stablecoin_transfers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	blockTime: timestamp("block_time", { withTimezone: true, mode: 'string' }).notNull(),
	tokenSymbol: text("token_symbol").notNull(),
	tokenName: text("token_name").notNull(),
	amount: numeric().notNull(),
	senderAddress: text("sender_address").notNull(),
	receiverAddress: text("receiver_address").notNull(),
	network: text().default('ethereum').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_stablecoin_transfers_block_time").using("btree", table.blockTime.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_stablecoin_transfers_token_symbol").using("btree", table.tokenSymbol.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow public read access to stablecoin transfers", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to stablecoin transfers", { as: "permissive", for: "all", to: ["public"] }),
]);

export const walletTransactions = pgTable("wallet_transactions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	walletAddress: text("wallet_address").notNull(),
	txHash: text("tx_hash").notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	valueEth: numeric("value_eth").notNull(),
	fromAddress: text("from_address").notNull(),
	toAddress: text("to_address").notNull(),
	isError: boolean("is_error").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_wallet_transactions_timestamp").using("btree", table.timestamp.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_wallet_transactions_wallet_address").using("btree", table.walletAddress.asc().nullsLast().op("text_ops")),
	unique("wallet_transactions_tx_hash_key").on(table.txHash),
	pgPolicy("Allow public read access to wallet transactions", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to wallet transactions", { as: "permissive", for: "all", to: ["public"] }),
]);

export const realTimeTransfers = pgTable("real_time_transfers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	hash: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).notNull(),
	blockNumber: integer("block_number").notNull(),
	fromAddress: text("from_address").notNull(),
	toAddress: text("to_address").notNull(),
	amount: numeric().notNull(),
	currency: text().default('ETH').notNull(),
	usdValue: numeric("usd_value").default('0').notNull(),
	isWhale: boolean("is_whale").default(false).notNull(),
	network: text().default('ethereum').notNull(),
	gasPrice: numeric("gas_price"),
	gasUsed: numeric("gas_used"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_real_time_transfers_amount").using("btree", table.amount.desc().nullsFirst().op("numeric_ops")),
	index("idx_real_time_transfers_timestamp").using("btree", table.timestamp.desc().nullsFirst().op("timestamptz_ops")),
	index("idx_real_time_transfers_whale").using("btree", table.isWhale.asc().nullsLast().op("bool_ops")).where(sql`(is_whale = true)`),
	pgPolicy("Allow public read access to real_time_transfers", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to real_time_transfers", { as: "permissive", for: "all", to: ["public"] }),
]);

export const apiEndpoints = pgTable("api_endpoints", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	method: text().notNull(),
	path: text().notNull(),
	description: text().notNull(),
	category: text().notNull(),
	parameters: jsonb().default({}),
	responseSchema: jsonb("response_schema").default({}),
	exampleRequest: text("example_request"),
	exampleResponse: text("example_response"),
	rateLimit: integer("rate_limit").default(60),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	pgPolicy("Allow public read access to api endpoints", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to api endpoints", { as: "permissive", for: "all", to: ["public"] }),
]);

export const apiKeys = pgTable("api_keys", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	keyHash: text("key_hash").notNull(),
	name: text().notNull(),
	userId: uuid("user_id"),
	isActive: boolean("is_active").default(true).notNull(),
	rateLimitPerMinute: integer("rate_limit_per_minute").default(60).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: 'string' }),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }),
	partnerId: text("partner_id"),
	key: text(),
	active: boolean().default(true),
}, (table) => [
	index("idx_api_keys_active").using("btree", table.active.asc().nullsLast().op("bool_ops")),
	index("idx_api_keys_hash").using("btree", table.keyHash.asc().nullsLast().op("text_ops")),
	index("idx_api_keys_key").using("btree", table.key.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "api_keys_user_id_fkey"
		}).onDelete("cascade"),
	unique("api_keys_key_hash_key").on(table.keyHash),
	pgPolicy("Users can manage their own API keys", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)` }),
]);

export const apiUsage = pgTable("api_usage", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	apiKeyId: uuid("api_key_id").notNull(),
	endpoint: text().notNull(),
	timestamp: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	responseTimeMs: integer("response_time_ms"),
	statusCode: integer("status_code"),
	ipAddress: text("ip_address"),
}, (table) => [
	index("idx_api_usage_api_key_id").using("btree", table.apiKeyId.asc().nullsLast().op("uuid_ops")),
	index("idx_api_usage_timestamp").using("btree", table.timestamp.asc().nullsLast().op("timestamptz_ops")),
	foreignKey({
			columns: [table.apiKeyId],
			foreignColumns: [apiKeys.id],
			name: "api_usage_api_key_id_fkey"
		}).onDelete("cascade"),
	pgPolicy("Users can view their own API usage", { as: "permissive", for: "select", to: ["public"], using: sql`(EXISTS ( SELECT 1
   FROM api_keys
  WHERE ((api_keys.id = api_usage.api_key_id) AND (api_keys.user_id = auth.uid()))))` }),
]);

export const sanctionedWallets = pgTable("sanctioned_wallets", {
	address: text().primaryKey().notNull(),
	source: text().default('OFAC').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_sanctioned_wallets_address").using("btree", table.address.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow public read access to sanctioned wallets", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to sanctioned wallets", { as: "permissive", for: "all", to: ["public"] }),
]);

export const riskScores = pgTable("risk_scores", {
	wallet: text().primaryKey().notNull(),
	score: integer().default(0).notNull(),
	band: text().default('LOW').notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	confidence: numeric({ precision: 5, scale:  2 }).default('1.0'),
	metadata: jsonb(),
	lastUpdated: timestamp("last_updated", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_risk_scores_confidence").using("btree", table.confidence.asc().nullsLast().op("numeric_ops")),
	index("idx_risk_scores_last_updated").using("btree", table.lastUpdated.asc().nullsLast().op("timestamptz_ops")),
	index("idx_risk_scores_wallet").using("btree", table.wallet.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow public read access to risk scores", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
	pgPolicy("Allow service role full access to risk scores", { as: "permissive", for: "all", to: ["public"] }),
]);

export const riskEvents = pgTable("risk_events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	wallet: text().notNull(),
	feature: text().notNull(),
	details: jsonb().default({}),
	weightApplied: integer("weight_applied").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	category: varchar({ length: 50 }),
	confidence: numeric({ precision: 5, scale:  2 }).default('1.0'),
	metadata: jsonb(),
	occurredAt: timestamp("occurred_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	index("idx_risk_events_category").using("btree", table.category.asc().nullsLast().op("text_ops")),
	index("idx_risk_events_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_risk_events_occurred_at").using("btree", table.occurredAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_risk_events_wallet").using("btree", table.wallet.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow service role full access to risk events", { as: "permissive", for: "all", to: ["public"], using: sql`((auth.jwt() ->> 'role'::text) = 'service_role'::text)` }),
]);

export const relayLogs = pgTable("relay_logs", {
	id: serial().primaryKey().notNull(),
	partnerId: text("partner_id"),
	chain: text().notNull(),
	fromAddr: text("from_addr"),
	toAddr: text("to_addr").notNull(),
	decision: text().notNull(),
	riskBand: text("risk_band").notNull(),
	riskScore: integer("risk_score").default(0).notNull(),
	reasons: text().array().default([""]),
	txHash: text("tx_hash"),
	idempotencyKey: text("idempotency_key"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_relay_logs_created_at").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("idx_relay_logs_partner_id").using("btree", table.partnerId.asc().nullsLast().op("text_ops")),
	index("idx_relay_logs_to_addr").using("btree", table.toAddr.asc().nullsLast().op("text_ops")),
	pgPolicy("Allow service role full access to relay logs", { as: "permissive", for: "all", to: ["public"], using: sql`((auth.jwt() ->> 'role'::text) = 'service_role'::text)` }),
	pgPolicy("Users can view their own relay logs", { as: "permissive", for: "select", to: ["public"] }),
	check("relay_logs_decision_check", sql`decision = ANY (ARRAY['allowed'::text, 'blocked'::text])`),
]);

export const developerProfiles = pgTable("developer_profiles", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	companyName: text("company_name"),
	website: text(),
	apiUsagePlan: text("api_usage_plan").default('free'),
	monthlyRequestLimit: integer("monthly_request_limit").default(1000),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	partnerId: text("partner_id").notNull(),
	firstName: text("first_name"),
	lastName: text("last_name"),
	jobTitle: text("job_title"),
	phone: text(),
	country: text(),
	businessType: text("business_type"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "developer_profiles_user_id_fkey"
		}),
	unique("developer_profiles_user_id_key").on(table.userId),
	unique("developer_profiles_partner_id_key").on(table.partnerId),
	pgPolicy("Users can manage their own developer profile", { as: "permissive", for: "all", to: ["public"], using: sql`(auth.uid() = user_id)` }),
]);
