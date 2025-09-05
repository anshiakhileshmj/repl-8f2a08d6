-- Complete API Management & Relay-API Setup for AML Dashboard
-- This creates all necessary tables and security policies for your API key system
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. API Keys table - Core table for API key management
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    partner_id TEXT NOT NULL UNIQUE,
    key_name TEXT NOT NULL,
    api_key TEXT NOT NULL UNIQUE,
    api_secret TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    rate_limit_per_minute INTEGER DEFAULT 60,
    rate_limit_per_day INTEGER DEFAULT 1000,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- 2. Relay Logs table - Already exists, ensure it has proper structure
CREATE TABLE IF NOT EXISTS public.relay_logs (
    id SERIAL PRIMARY KEY,
    partner_id TEXT NOT NULL,
    chain TEXT,
    from_addr TEXT,
    to_addr TEXT NOT NULL,
    decision TEXT NOT NULL, -- 'allowed' or 'blocked'
    risk_band TEXT,
    risk_score INTEGER DEFAULT 0,
    reasons TEXT[] DEFAULT '{}',
    idempotency_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. API Usage table - Track API endpoint usage
CREATE TABLE IF NOT EXISTS public.api_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES public.api_keys(id) ON DELETE SET NULL,
    partner_id TEXT,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL DEFAULT 'POST',
    status_code INTEGER,
    response_time_ms INTEGER,
    request_size_bytes INTEGER,
    response_size_bytes INTEGER,
    ip_address INET,
    user_agent TEXT,
    error_message TEXT,
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Subscription Usage table - Track monthly usage limits
CREATE TABLE IF NOT EXISTS public.subscription_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    api_calls_used INTEGER DEFAULT 0,
    api_calls_limit INTEGER NOT NULL DEFAULT 1000,
    transactions_processed INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10, 3) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, billing_period_start)
);

-- Create performance indexes
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_partner_id ON public.api_keys(partner_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_key_hash ON public.api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_is_active ON public.api_keys(is_active);

CREATE INDEX IF NOT EXISTS idx_relay_logs_partner_id ON public.relay_logs(partner_id);
CREATE INDEX IF NOT EXISTS idx_relay_logs_created_at ON public.relay_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_relay_logs_decision ON public.relay_logs(decision);
CREATE INDEX IF NOT EXISTS idx_relay_logs_risk_score ON public.relay_logs(risk_score);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_partner_id ON public.api_usage(partner_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON public.api_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_api_usage_endpoint ON public.api_usage(endpoint);

CREATE INDEX IF NOT EXISTS idx_subscription_usage_user_id ON public.subscription_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_usage_period ON public.subscription_usage(billing_period_start, billing_period_end);

-- Enable Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relay_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies

-- API Keys policies
DROP POLICY IF EXISTS "Users can view own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can create own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can update own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Users can delete own API keys" ON public.api_keys;
DROP POLICY IF EXISTS "Service role can access all API keys" ON public.api_keys;

CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own API keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own API keys" ON public.api_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own API keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Allow service role (for relay-api) to read API keys for validation
CREATE POLICY "Service role can read API keys" ON public.api_keys
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Relay Logs policies
DROP POLICY IF EXISTS "Users can view own relay logs" ON public.relay_logs;
DROP POLICY IF EXISTS "API can insert relay logs" ON public.relay_logs;
DROP POLICY IF EXISTS "Service role can manage relay logs" ON public.relay_logs;

CREATE POLICY "Users can view own relay logs" ON public.relay_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.api_keys ak 
            WHERE ak.partner_id = relay_logs.partner_id 
            AND ak.user_id = auth.uid()
        )
    );

-- Allow service role and relay-api to insert logs
CREATE POLICY "API can insert relay logs" ON public.relay_logs
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role' OR
        true  -- Allow insertions from relay-api
    );

CREATE POLICY "Service role can manage relay logs" ON public.relay_logs
    FOR ALL USING (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- API Usage policies
DROP POLICY IF EXISTS "Users can view own API usage" ON public.api_usage;
DROP POLICY IF EXISTS "API can log usage" ON public.api_usage;
DROP POLICY IF EXISTS "Service role can manage usage" ON public.api_usage;

CREATE POLICY "Users can view own API usage" ON public.api_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "API can log usage" ON public.api_usage
    FOR INSERT WITH CHECK (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role' OR
        true  -- Allow insertions from relay-api
    );

CREATE POLICY "Service role can manage usage" ON public.api_usage
    FOR ALL USING (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Subscription Usage policies
DROP POLICY IF EXISTS "Users can view own subscription usage" ON public.subscription_usage;
DROP POLICY IF EXISTS "Users can update own subscription usage" ON public.subscription_usage;
DROP POLICY IF EXISTS "Service role can manage subscription usage" ON public.subscription_usage;

CREATE POLICY "Users can view own subscription usage" ON public.subscription_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription usage" ON public.subscription_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscription usage" ON public.subscription_usage
    FOR ALL USING (
        auth.role() = 'service_role' OR
        auth.jwt() ->> 'role' = 'service_role'
    );

-- Function to create initial subscription usage for new users
CREATE OR REPLACE FUNCTION public.create_initial_subscription_usage()
RETURNS TRIGGER AS $$
DECLARE
    current_period_start DATE;
    current_period_end DATE;
BEGIN
    -- Get current billing period (monthly)
    current_period_start := DATE_TRUNC('month', CURRENT_DATE);
    current_period_end := (current_period_start + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Insert initial subscription usage record
    INSERT INTO public.subscription_usage (
        user_id,
        billing_period_start,
        billing_period_end,
        api_calls_used,
        api_calls_limit
    )
    VALUES (
        NEW.user_id,
        current_period_start,
        current_period_end,
        0,
        1000  -- Default free tier limit
    )
    ON CONFLICT (user_id, billing_period_start) DO NOTHING;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new profiles to initialize subscription usage
DROP TRIGGER IF EXISTS trigger_create_subscription_usage ON public.profiles;
CREATE TRIGGER trigger_create_subscription_usage
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.create_initial_subscription_usage();

-- Function to validate API key authentication for relay-api
CREATE OR REPLACE FUNCTION public.validate_api_key(api_key_input TEXT)
RETURNS TABLE (
    user_id UUID,
    partner_id TEXT,
    rate_limit_per_minute INTEGER,
    rate_limit_per_day INTEGER,
    is_valid BOOLEAN
) AS $$
DECLARE
    key_record RECORD;
    key_hash_input TEXT;
BEGIN
    -- Hash the input API key using SHA-256
    key_hash_input := encode(digest(api_key_input, 'sha256'), 'hex');
    
    -- Find the API key record
    SELECT ak.user_id, ak.partner_id, ak.rate_limit_per_minute, ak.rate_limit_per_day, ak.is_active
    INTO key_record
    FROM public.api_keys ak
    WHERE ak.key_hash = key_hash_input
    AND ak.is_active = true
    AND (ak.expires_at IS NULL OR ak.expires_at > NOW());
    
    IF key_record.user_id IS NOT NULL THEN
        -- Update last_used_at
        UPDATE public.api_keys 
        SET last_used_at = NOW() 
        WHERE key_hash = key_hash_input;
        
        -- Return valid key data
        RETURN QUERY SELECT 
            key_record.user_id,
            key_record.partner_id,
            key_record.rate_limit_per_minute,
            key_record.rate_limit_per_day,
            true AS is_valid;
    ELSE
        -- Invalid key
        RETURN QUERY SELECT 
            NULL::UUID,
            NULL::TEXT,
            0,
            0,
            false AS is_valid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log API usage (called by relay-api)
CREATE OR REPLACE FUNCTION public.log_api_usage(
    p_partner_id TEXT,
    p_endpoint TEXT,
    p_method TEXT DEFAULT 'POST',
    p_status_code INTEGER DEFAULT NULL,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    api_key_record RECORD;
BEGIN
    -- Get user_id and api_key_id from partner_id
    SELECT user_id, id INTO api_key_record
    FROM public.api_keys
    WHERE partner_id = p_partner_id
    AND is_active = true;
    
    -- Insert usage log
    INSERT INTO public.api_usage (
        user_id,
        api_key_id,
        partner_id,
        endpoint,
        method,
        status_code,
        response_time_ms,
        ip_address,
        error_message
    )
    VALUES (
        api_key_record.user_id,
        api_key_record.id,
        p_partner_id,
        p_endpoint,
        p_method,
        p_status_code,
        p_response_time_ms,
        p_ip_address,
        p_error_message
    );
    
    -- Update subscription usage counter
    UPDATE public.subscription_usage
    SET 
        api_calls_used = api_calls_used + 1,
        updated_at = NOW()
    WHERE user_id = api_key_record.user_id
    AND billing_period_start = DATE_TRUNC('month', CURRENT_DATE)
    AND billing_period_end = (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the request
        RAISE WARNING 'Error logging API usage: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon, service_role;
GRANT ALL ON public.api_keys TO authenticated, service_role;
GRANT ALL ON public.relay_logs TO authenticated, service_role;
GRANT ALL ON public.api_usage TO authenticated, service_role;
GRANT ALL ON public.subscription_usage TO authenticated, service_role;

-- Grant execute permissions for functions
GRANT EXECUTE ON FUNCTION public.validate_api_key(TEXT) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.log_api_usage(TEXT, TEXT, TEXT, INTEGER, INTEGER, INET, TEXT) TO authenticated, service_role, anon;
GRANT EXECUTE ON FUNCTION public.create_initial_subscription_usage() TO authenticated, service_role;

-- Insert initial subscription usage for existing users
INSERT INTO public.subscription_usage (
    user_id,
    billing_period_start,
    billing_period_end,
    api_calls_used,
    api_calls_limit
)
SELECT 
    p.user_id,
    DATE_TRUNC('month', CURRENT_DATE),
    (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
    0,
    1000
FROM public.profiles p
WHERE NOT EXISTS (
    SELECT 1 FROM public.subscription_usage su 
    WHERE su.user_id = p.user_id 
    AND su.billing_period_start = DATE_TRUNC('month', CURRENT_DATE)
)
ON CONFLICT (user_id, billing_period_start) DO NOTHING;

-- Create a view for API key management (without exposing sensitive data)
CREATE OR REPLACE VIEW public.api_keys_view AS
SELECT 
    id,
    user_id,
    partner_id,
    key_name,
    LEFT(api_key, 8) || '••••••••••••••••••••••••' || RIGHT(api_key, 4) AS api_key_preview,
    is_active,
    rate_limit_per_minute,
    rate_limit_per_day,
    last_used_at,
    created_at,
    expires_at
FROM public.api_keys;

-- Grant permissions for the view
GRANT SELECT ON public.api_keys_view TO authenticated;

-- Enable RLS on the view
ALTER VIEW public.api_keys_view OWNER TO postgres;

-- Comments for documentation
COMMENT ON TABLE public.api_keys IS 'Stores API keys for accessing relay-api endpoints with rate limiting and security features';
COMMENT ON TABLE public.relay_logs IS 'Logs from relay-api processing transactions and compliance decisions';  
COMMENT ON TABLE public.api_usage IS 'Tracks API endpoint usage for analytics and billing';
COMMENT ON TABLE public.subscription_usage IS 'Monthly usage tracking for subscription billing and limits';
COMMENT ON FUNCTION public.validate_api_key(TEXT) IS 'Validates API key and returns user information for relay-api authentication';
COMMENT ON FUNCTION public.log_api_usage IS 'Logs API usage from relay-api for analytics and billing';