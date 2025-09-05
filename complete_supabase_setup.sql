-- Additional SQL queries to complete the Supabase setup
-- Run these after your existing 2 queries

-- Add missing columns to API keys table to match relay-api expectations
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS partner_id TEXT;
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS key_hash TEXT;

-- Update API keys to use partner_id (this links with relay-api)
UPDATE public.api_keys SET partner_id = id::TEXT WHERE partner_id IS NULL;

-- Create unique index on partner_id and key_hash
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_keys_partner_id ON public.api_keys(partner_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_keys_hash ON public.api_keys(key_hash);

-- Add subscription usage policies  
CREATE POLICY "Users can update own subscription usage" ON public.subscription_usage
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage subscription usage" ON public.subscription_usage
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update subscription usage" ON public.subscription_usage
    FOR UPDATE WITH CHECK (true);

-- Add invoices policies
CREATE POLICY "Users can update own invoices" ON public.invoices
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage invoices" ON public.invoices
    FOR INSERT WITH CHECK (true);

-- Add analytics policies  
CREATE POLICY "System can manage analytics" ON public.analytics_data
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update analytics" ON public.analytics_data  
    FOR UPDATE WITH CHECK (true);

-- Function to generate secure API keys
CREATE OR REPLACE FUNCTION generate_api_key()
RETURNS TEXT AS $$
DECLARE
    api_key TEXT;
BEGIN
    -- Generate a secure random API key (32 bytes = 64 hex chars)
    api_key := 'sk_live_' || encode(gen_random_bytes(32), 'hex');
    RETURN api_key;
END;
$$ LANGUAGE plpgsql;

-- Function to sync relay logs with transactions table
CREATE OR REPLACE FUNCTION sync_relay_log_to_transaction()
RETURNS TRIGGER AS $$
DECLARE
    user_uuid UUID;
    api_key_uuid UUID;
BEGIN
    -- Get user_id from api_keys table using partner_id
    SELECT ak.user_id, ak.id INTO user_uuid, api_key_uuid
    FROM public.api_keys ak 
    WHERE ak.partner_id = NEW.partner_id
    LIMIT 1;
    
    IF user_uuid IS NOT NULL THEN
        -- Insert into transactions table
        INSERT INTO public.transactions (
            user_id,
            api_key_id,
            from_address,
            to_address,
            blockchain,
            status,
            risk_score,
            risk_level,
            is_sanctioned,
            sanctions_match_reason,
            metadata,
            processed_at,
            created_at
        ) VALUES (
            user_uuid,
            api_key_uuid,
            COALESCE(NEW.from_addr, 'unknown'),
            NEW.to_addr,
            COALESCE(NEW.chain, 'ethereum'),
            CASE NEW.decision 
                WHEN 'allowed' THEN 'completed'::transaction_status
                WHEN 'blocked' THEN 'flagged'::transaction_status
                ELSE 'pending'::transaction_status
            END,
            NEW.risk_score,
            CASE 
                WHEN NEW.risk_score >= 80 THEN 'critical'::risk_level
                WHEN NEW.risk_score >= 60 THEN 'high'::risk_level  
                WHEN NEW.risk_score >= 30 THEN 'medium'::risk_level
                ELSE 'low'::risk_level
            END,
            NEW.decision = 'blocked',
            CASE 
                WHEN NEW.decision = 'blocked' AND array_length(NEW.reasons, 1) > 0 
                THEN array_to_string(NEW.reasons, ', ')
                ELSE NULL
            END,
            jsonb_build_object(
                'risk_band', NEW.risk_band,
                'reasons', NEW.reasons,
                'idempotency_key', NEW.idempotency_key
            ),
            NEW.created_at,
            NEW.created_at
        );
        
        -- Update subscription usage
        PERFORM update_subscription_usage(user_uuid, 1);
        
        -- Create alert if high risk or sanctioned
        IF NEW.risk_score >= 70 OR NEW.decision = 'blocked' THEN
            INSERT INTO public.alerts (
                user_id,
                alert_type,
                severity,
                title,
                description,
                metadata,
                created_at
            ) VALUES (
                user_uuid,
                CASE WHEN NEW.decision = 'blocked' THEN 'sanctions_hit' ELSE 'high_risk_transaction' END,
                CASE 
                    WHEN NEW.risk_score >= 90 THEN 'critical'::alert_severity
                    WHEN NEW.risk_score >= 70 THEN 'high'::alert_severity
                    ELSE 'medium'::alert_severity
                END,
                CASE WHEN NEW.decision = 'blocked' 
                     THEN 'Sanctioned Wallet Detected' 
                     ELSE 'High Risk Transaction Alert' 
                END,
                CASE WHEN NEW.decision = 'blocked'
                     THEN 'Transaction blocked due to sanctions screening: ' || NEW.to_addr
                     ELSE 'High risk transaction detected with score: ' || NEW.risk_score
                END,
                jsonb_build_object(
                    'to_address', NEW.to_addr,
                    'risk_score', NEW.risk_score,
                    'risk_band', NEW.risk_band,
                    'reasons', NEW.reasons
                ),
                NEW.created_at
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to sync relay logs to transactions
CREATE OR REPLACE TRIGGER trigger_sync_relay_log
    AFTER INSERT ON public.relay_logs
    FOR EACH ROW
    EXECUTE FUNCTION sync_relay_log_to_transaction();

-- Function to log API usage 
CREATE OR REPLACE FUNCTION log_api_usage(
    p_user_id UUID,
    p_api_key_id UUID,
    p_endpoint TEXT,
    p_method TEXT,
    p_status_code INTEGER,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_error_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.api_usage (
        user_id,
        api_key_id,
        endpoint,
        method,
        status_code,
        response_time_ms,
        ip_address,
        error_message,
        created_at
    ) VALUES (
        p_user_id,
        p_api_key_id,
        p_endpoint,
        p_method,
        p_status_code,
        p_response_time_ms,
        p_ip_address,
        p_error_message,
        timezone('utc'::text, now())
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update analytics data
CREATE OR REPLACE FUNCTION update_analytics_data(
    p_user_id UUID,
    p_metric_type TEXT,
    p_data JSONB
)
RETURNS VOID AS $$
DECLARE
    current_date DATE;
BEGIN
    current_date := CURRENT_DATE;
    
    INSERT INTO public.analytics_data (
        user_id,
        metric_type,
        date_bucket,
        data,
        created_at
    ) VALUES (
        p_user_id,
        p_metric_type,
        current_date,
        p_data,
        timezone('utc'::text, now())
    )
    ON CONFLICT (user_id, metric_type, date_bucket)
    DO UPDATE SET
        data = p_data,
        created_at = timezone('utc'::text, now());
END;
$$ LANGUAGE plpgsql;

-- Create view for dashboard metrics
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
    up.id as user_id,
    up.subscription_plan,
    COUNT(DISTINCT t.id) as total_transactions,
    COUNT(DISTINCT CASE WHEN t.status = 'flagged' THEN t.id END) as flagged_transactions,
    COUNT(DISTINCT CASE WHEN t.is_sanctioned = true THEN t.id END) as sanctioned_hits,
    AVG(t.risk_score) as avg_risk_score,
    COUNT(DISTINCT a.id) as total_alerts,
    COUNT(DISTINCT CASE WHEN a.severity = 'critical' THEN a.id END) as critical_alerts,
    su.api_calls_used,
    su.api_calls_limit,
    COUNT(DISTINCT ak.id) as total_api_keys
FROM public.user_profiles up
LEFT JOIN public.transactions t ON up.id = t.user_id AND t.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN public.alerts a ON up.id = a.user_id AND a.created_at >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN public.subscription_usage su ON up.id = su.user_id 
    AND su.billing_period_start <= CURRENT_DATE 
    AND su.billing_period_end >= CURRENT_DATE
LEFT JOIN public.api_keys ak ON up.id = ak.user_id AND ak.is_active = true
GROUP BY up.id, up.subscription_plan, su.api_calls_used, su.api_calls_limit;

-- Grant necessary permissions for dashboard view
GRANT SELECT ON dashboard_metrics TO authenticated;

-- RLS policy for dashboard metrics view
CREATE POLICY "Users can view own dashboard metrics" ON dashboard_metrics
    FOR SELECT USING (auth.uid() = user_id);

-- Function to get subscription limits
CREATE OR REPLACE FUNCTION get_subscription_limits(plan_name subscription_plan)
RETURNS TABLE(api_calls_limit INTEGER, features JSONB) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE plan_name
            WHEN 'free' THEN 100
            WHEN 'starter' THEN 10000
            WHEN 'pro' THEN 50000
            WHEN 'growth' THEN 2147483647
            ELSE 100
        END as api_calls_limit,
        CASE plan_name
            WHEN 'free' THEN jsonb_build_object(
                'analytics', false,
                'alerts', true,
                'api_keys', 1,
                'sanctions_management', false
            )
            WHEN 'starter' THEN jsonb_build_object(
                'analytics', true,
                'alerts', true,
                'api_keys', 3,
                'sanctions_management', false
            )
            WHEN 'pro' THEN jsonb_build_object(
                'analytics', true,
                'alerts', true,
                'api_keys', 10,
                'sanctions_management', true
            )
            WHEN 'growth' THEN jsonb_build_object(
                'analytics', true,
                'alerts', true,
                'api_keys', -1,
                'sanctions_management', true
            )
            ELSE jsonb_build_object(
                'analytics', false,
                'alerts', true,
                'api_keys', 1,
                'sanctions_management', false
            )
        END as features;
END;
$$ LANGUAGE plpgsql;