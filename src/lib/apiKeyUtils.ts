import { supabase } from "@/integrations/supabase/client";

// Generate a new API key with format wm_ + 32 random hex characters
export function generateApiKey(): string {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const hexString = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `wm_${hexString}`;
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

// Get user profile with partner_id
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  return profile;
}

// Create new API key
export async function createApiKey(name: string, environment: string = 'production') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getUserProfile();
  const apiKey = generateApiKey();
  const keyHash = await hashApiKey(apiKey);
  const keyPreview = createApiKeyPreview(apiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      partner_id: profile.partner_id,
      name,
      key_hash: keyHash,
      key_preview: keyPreview,
      environment,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...data,
    key: apiKey, // Return the actual key only once
  };
}

// Rotate API key (generate new key for existing record)
export async function rotateApiKey(keyId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const newApiKey = generateApiKey();
  const newKeyHash = await hashApiKey(newApiKey);
  const newKeyPreview = createApiKeyPreview(newApiKey);

  const { data, error } = await supabase
    .from('api_keys')
    .update({
      key_hash: newKeyHash,
      key_preview: newKeyPreview,
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

  // Get total calls this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data: usageLogs, error: usageError } = await supabase
    .from('api_usage_logs')
    .select('*, api_keys!inner(user_id)')
    .eq('api_keys.user_id', user.id)
    .gte('created_at', startOfMonth.toISOString());

  if (usageError) throw usageError;

  const callsThisMonth = usageLogs?.length || 0;
  const successfulCalls = usageLogs?.filter(log => log.status_code >= 200 && log.status_code < 300).length || 0;
  const avgResponseTime = usageLogs?.reduce((sum, log) => sum + (log.response_time_ms || 0), 0) / (usageLogs?.length || 1) || 0;

  return {
    callsThisMonth,
    limit: 1670000, // Default limit
    avgResponseTime: Math.round(avgResponseTime),
    successRate: callsThisMonth > 0 ? ((successfulCalls / callsThisMonth) * 100) : 100,
  };
}