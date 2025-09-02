-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "tracked_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"address" text NOT NULL,
	"name" text,
	"network" text DEFAULT 'eth' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracked_wallets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wallet_risk_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"first_tx_date" timestamp with time zone,
	"total_transactions" integer DEFAULT 0 NOT NULL,
	"failed_transactions" integer DEFAULT 0 NOT NULL,
	"wallet_age_days" integer,
	"failed_tx_ratio" numeric,
	"risk_score" integer,
	"risk_level" text,
	"last_updated" timestamp with time zone DEFAULT now() NOT NULL,
	"network" text DEFAULT 'ethereum',
	CONSTRAINT "wallet_risk_ratings_wallet_address_key" UNIQUE("wallet_address"),
	CONSTRAINT "wallet_risk_ratings_risk_level_check" CHECK (risk_level = ANY (ARRAY['LOW'::text, 'MEDIUM'::text, 'HIGH'::text])),
	CONSTRAINT "wallet_risk_ratings_risk_score_check" CHECK ((risk_score >= 1) AND (risk_score <= 10))
);
--> statement-breakpoint
ALTER TABLE "wallet_risk_ratings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "stablecoin_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"block_time" timestamp with time zone NOT NULL,
	"token_symbol" text NOT NULL,
	"token_name" text NOT NULL,
	"amount" numeric NOT NULL,
	"sender_address" text NOT NULL,
	"receiver_address" text NOT NULL,
	"network" text DEFAULT 'ethereum' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stablecoin_transfers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_address" text NOT NULL,
	"tx_hash" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"value_eth" numeric NOT NULL,
	"from_address" text NOT NULL,
	"to_address" text NOT NULL,
	"is_error" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "wallet_transactions_tx_hash_key" UNIQUE("tx_hash")
);
--> statement-breakpoint
ALTER TABLE "wallet_transactions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "real_time_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" text NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"block_number" integer NOT NULL,
	"from_address" text NOT NULL,
	"to_address" text NOT NULL,
	"amount" numeric NOT NULL,
	"currency" text DEFAULT 'ETH' NOT NULL,
	"usd_value" numeric DEFAULT '0' NOT NULL,
	"is_whale" boolean DEFAULT false NOT NULL,
	"network" text DEFAULT 'ethereum' NOT NULL,
	"gas_price" numeric,
	"gas_used" numeric,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "real_time_transfers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_endpoints" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"method" text NOT NULL,
	"path" text NOT NULL,
	"description" text NOT NULL,
	"category" text NOT NULL,
	"parameters" jsonb DEFAULT '{}'::jsonb,
	"response_schema" jsonb DEFAULT '{}'::jsonb,
	"example_request" text,
	"example_response" text,
	"rate_limit" integer DEFAULT 60,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "api_endpoints" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key_hash" text NOT NULL,
	"name" text NOT NULL,
	"user_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	"rate_limit_per_minute" integer DEFAULT 60 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"partner_id" text,
	"key" text,
	"active" boolean DEFAULT true,
	CONSTRAINT "api_keys_key_hash_key" UNIQUE("key_hash")
);
--> statement-breakpoint
ALTER TABLE "api_keys" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "api_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_key_id" uuid NOT NULL,
	"endpoint" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"response_time_ms" integer,
	"status_code" integer,
	"ip_address" text
);
--> statement-breakpoint
ALTER TABLE "api_usage" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "sanctioned_wallets" (
	"address" text PRIMARY KEY NOT NULL,
	"source" text DEFAULT 'OFAC' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sanctioned_wallets" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "risk_scores" (
	"wallet" text PRIMARY KEY NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"band" text DEFAULT 'LOW' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confidence" numeric(5, 2) DEFAULT '1.0',
	"metadata" jsonb,
	"last_updated" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "risk_scores" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "risk_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet" text NOT NULL,
	"feature" text NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb,
	"weight_applied" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"category" varchar(50),
	"confidence" numeric(5, 2) DEFAULT '1.0',
	"metadata" jsonb,
	"occurred_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "risk_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "relay_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"partner_id" text,
	"chain" text NOT NULL,
	"from_addr" text,
	"to_addr" text NOT NULL,
	"decision" text NOT NULL,
	"risk_band" text NOT NULL,
	"risk_score" integer DEFAULT 0 NOT NULL,
	"reasons" text[] DEFAULT '{""}',
	"tx_hash" text,
	"idempotency_key" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "relay_logs_decision_check" CHECK (decision = ANY (ARRAY['allowed'::text, 'blocked'::text]))
);
--> statement-breakpoint
ALTER TABLE "relay_logs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "developer_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"company_name" text,
	"website" text,
	"api_usage_plan" text DEFAULT 'free',
	"monthly_request_limit" integer DEFAULT 1000,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"partner_id" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"job_title" text,
	"phone" text,
	"country" text,
	"business_type" text,
	CONSTRAINT "developer_profiles_user_id_key" UNIQUE("user_id"),
	CONSTRAINT "developer_profiles_partner_id_key" UNIQUE("partner_id")
);
--> statement-breakpoint
ALTER TABLE "developer_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_usage" ADD CONSTRAINT "api_usage_api_key_id_fkey" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "developer_profiles" ADD CONSTRAINT "developer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_wallet_network" ON "tracked_wallets" USING btree ("address" text_ops,"network" text_ops);--> statement-breakpoint
CREATE INDEX "idx_wallet_risk_ratings_wallet_address" ON "wallet_risk_ratings" USING btree ("wallet_address" text_ops);--> statement-breakpoint
CREATE INDEX "idx_stablecoin_transfers_block_time" ON "stablecoin_transfers" USING btree ("block_time" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_stablecoin_transfers_token_symbol" ON "stablecoin_transfers" USING btree ("token_symbol" text_ops);--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_timestamp" ON "wallet_transactions" USING btree ("timestamp" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_wallet_transactions_wallet_address" ON "wallet_transactions" USING btree ("wallet_address" text_ops);--> statement-breakpoint
CREATE INDEX "idx_real_time_transfers_amount" ON "real_time_transfers" USING btree ("amount" numeric_ops);--> statement-breakpoint
CREATE INDEX "idx_real_time_transfers_timestamp" ON "real_time_transfers" USING btree ("timestamp" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_real_time_transfers_whale" ON "real_time_transfers" USING btree ("is_whale" bool_ops) WHERE (is_whale = true);--> statement-breakpoint
CREATE INDEX "idx_api_keys_active" ON "api_keys" USING btree ("active" bool_ops);--> statement-breakpoint
CREATE INDEX "idx_api_keys_hash" ON "api_keys" USING btree ("key_hash" text_ops);--> statement-breakpoint
CREATE INDEX "idx_api_keys_key" ON "api_keys" USING btree ("key" text_ops);--> statement-breakpoint
CREATE INDEX "idx_api_usage_api_key_id" ON "api_usage" USING btree ("api_key_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "idx_api_usage_timestamp" ON "api_usage" USING btree ("timestamp" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_sanctioned_wallets_address" ON "sanctioned_wallets" USING btree ("address" text_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_scores_confidence" ON "risk_scores" USING btree ("confidence" numeric_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_scores_last_updated" ON "risk_scores" USING btree ("last_updated" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_scores_wallet" ON "risk_scores" USING btree ("wallet" text_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_events_category" ON "risk_events" USING btree ("category" text_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_events_created_at" ON "risk_events" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_events_occurred_at" ON "risk_events" USING btree ("occurred_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_risk_events_wallet" ON "risk_events" USING btree ("wallet" text_ops);--> statement-breakpoint
CREATE INDEX "idx_relay_logs_created_at" ON "relay_logs" USING btree ("created_at" timestamptz_ops);--> statement-breakpoint
CREATE INDEX "idx_relay_logs_partner_id" ON "relay_logs" USING btree ("partner_id" text_ops);--> statement-breakpoint
CREATE INDEX "idx_relay_logs_to_addr" ON "relay_logs" USING btree ("to_addr" text_ops);--> statement-breakpoint
CREATE POLICY "Allow public read access to tracked wallets" ON "tracked_wallets" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow public insert access to tracked wallets" ON "tracked_wallets" AS PERMISSIVE FOR INSERT TO public;--> statement-breakpoint
CREATE POLICY "Allow public update access to tracked wallets" ON "tracked_wallets" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "Allow public delete access to tracked wallets" ON "tracked_wallets" AS PERMISSIVE FOR DELETE TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to wallet risk ratings" ON "wallet_risk_ratings" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to wallet risk ratings" ON "wallet_risk_ratings" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to stablecoin transfers" ON "stablecoin_transfers" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to stablecoin transfers" ON "stablecoin_transfers" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to wallet transactions" ON "wallet_transactions" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to wallet transactions" ON "wallet_transactions" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to real_time_transfers" ON "real_time_transfers" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to real_time_transfers" ON "real_time_transfers" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to api endpoints" ON "api_endpoints" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to api endpoints" ON "api_endpoints" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Users can manage their own API keys" ON "api_keys" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id));--> statement-breakpoint
CREATE POLICY "Users can view their own API usage" ON "api_usage" AS PERMISSIVE FOR SELECT TO public USING ((EXISTS ( SELECT 1
   FROM api_keys
  WHERE ((api_keys.id = api_usage.api_key_id) AND (api_keys.user_id = auth.uid())))));--> statement-breakpoint
CREATE POLICY "Allow public read access to sanctioned wallets" ON "sanctioned_wallets" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to sanctioned wallets" ON "sanctioned_wallets" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow public read access to risk scores" ON "risk_scores" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Allow service role full access to risk scores" ON "risk_scores" AS PERMISSIVE FOR ALL TO public;--> statement-breakpoint
CREATE POLICY "Allow service role full access to risk events" ON "risk_events" AS PERMISSIVE FOR ALL TO public USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text));--> statement-breakpoint
CREATE POLICY "Allow service role full access to relay logs" ON "relay_logs" AS PERMISSIVE FOR ALL TO public USING (((auth.jwt() ->> 'role'::text) = 'service_role'::text));--> statement-breakpoint
CREATE POLICY "Users can view their own relay logs" ON "relay_logs" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "Users can manage their own developer profile" ON "developer_profiles" AS PERMISSIVE FOR ALL TO public USING ((auth.uid() = user_id));
*/