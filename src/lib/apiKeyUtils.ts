import { supabase } from "@/integrations/supabase/client";

// Generate a new API key with format sk_live_ + 64 random hex characters (matches relay-API format)
export function generateApiKey(): string {
  const randomBytes = new Uint8Array(32); // 32 bytes = 64 hex chars
  crypto.getRandomValues(randomBytes);
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `sk_live_${hexString}`;
}

// Generate a secure API secret
export function generateApiSecret(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `sk_secret_${hexString}`;
}

// Hash API key using SHA-256
export async function hashApiKey(apiKey: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(apiKey);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = new Uint8Array(hashBuffer);
  return Array.from(hashArray)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Create API key preview (first 8 chars + ... + last 4 chars)
export function createApiKeyPreview(apiKey: string): string {
  if (apiKey.length < 12) return apiKey;
  return `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;
}

// Get user profile
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return profile;
}

// Check subscription limits
export async function checkSubscriptionLimits(userId: string) {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('subscription_plan')
    .eq('id', userId)
    .single();

  const { data: currentUsage } = await supabase
    .from('subscription_usage')
    .select('api_calls_used, api_calls_limit')
    .eq('user_id', userId)
    .gte('billing_period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
    .lte('billing_period_end', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])
    .single();

  // Get plan limits
  const planLimits = {
    free: { apiKeys: 1, apiCalls: 100 },
    starter: { apiKeys: 3, apiCalls: 10000 },
    pro: { apiKeys: 10, apiCalls: 50000 },
    growth: { apiKeys: -1, apiCalls: -1 } // unlimited
  };

  const limits = planLimits[profile?.subscription_plan || 'free'];
  
  return {
    plan: profile?.subscription_plan || 'free',
    limits,
    currentUsage: currentUsage || { api_calls_used: 0, api_calls_limit: limits.apiCalls }
  };
}

// Create new API key
export async function createApiKey(name: string, environment: string = 'production') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Check subscription limits
  const { limits, currentUsage } = await checkSubscriptionLimits(user.id);
  
  // Check if user can create more API keys
  const { data: existingKeys } = await supabase
    .from('api_keys')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (limits.apiKeys !== -1 && (existingKeys?.length || 0) >= limits.apiKeys) {
    throw new Error(`API key limit reached. Your plan allows ${limits.apiKeys} active API keys.`);
  }

  const apiKey = generateApiKey();
  const apiSecret = generateApiSecret();
  const keyHash = await hashApiKey(apiKey);
  const keyPreview = createApiKeyPreview(apiKey);
  
  // Generate partner_id (UUID format)
  const partnerId = crypto.randomUUID();

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      partner_id: partnerId,
      key_name: name,
      api_key: apiKey,
      api_secret: apiSecret,
      key_hash: keyHash,
      is_active: true,
      rate_limit_per_minute: 60,
      rate_limit_per_day: limits.apiCalls === -1 ? 999999 : Math.min(limits.apiCalls / 30, 10000), // Daily limit based on plan
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    key: apiKey, // Return the actual key only once
    secret: apiSecret,
    preview: keyPreview
  };
}

// Rotate API key (generate new key for existing record)
export async function rotateApiKey(keyId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const newApiKey = generateApiKey();
  const newApiSecret = generateApiSecret();
  const newKeyHash = await hashApiKey(newApiKey);
  const newKeyPreview = createApiKeyPreview(newApiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .update({
      api_key: newApiKey,
      api_secret: newApiSecret,
      key_hash: newKeyHash,
      last_used_at: null, // Reset last used timestamp
    })
    .eq('id', keyId)
    .eq('user_id', user.id) // Ensure user owns the key
    .select()
    .single();

  if (error) throw error;

  return {
    ...data,
    key: newApiKey, // Return the new key only once
    secret: newApiSecret,
    preview: newKeyPreview
  };
}

// Delete API key
export async function deleteApiKey(keyId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('api_keys')
    .delete()
    .eq('id', keyId)
    .eq('user_id', user.id); // Ensure user owns the key

  if (error) throw error;
}

// Get all user's API keys
export async function getUserApiKeys() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Get API usage statistics
export async function getApiUsageStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get subscription usage for current month
  const { data: subscriptionUsage } = await supabase
    .from('subscription_usage')
    .select('*')
    .eq('user_id', user.id)
    .gte('billing_period_start', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0])
    .lte('billing_period_end', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0])
    .single();

  // Get total calls this month from api_usage table
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageLogs, error: usageError } = await supabase
    .from('api_usage')
    .select('*, api_keys!inner(user_id)')
    .eq('api_keys.user_id', user.id)
    .gte('created_at', startOfMonth.toISOString());

  if (usageError) throw usageError;

  const callsThisMonth = usageLogs?.length || 0;
  const successfulCalls = usageLogs?.filter(log => log.status_code >= 200 && log.status_code < 300).length || 0;
  const avgResponseTime = usageLogs?.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / (usageLogs?.length || 1) || 0;

  return {
    callsThisMonth: subscriptionUsage?.api_calls_used || callsThisMonth,
    limit: subscriptionUsage?.api_calls_limit || 100,
    avgResponseTime: Math.round(avgResponseTime),
    successRate: callsThisMonth > 0 ? ((successfulCalls / callsThisMonth) * 100) : 100,
  };
}