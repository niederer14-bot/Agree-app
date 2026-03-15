import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

let singleton: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!singleton) {
    singleton = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    });
  }
  return singleton;
}

export function getSupabaseConfigSummary() {
  return {
    url: env.supabaseUrl,
    anonKeyPresent: Boolean(env.supabaseAnonKey && !env.supabaseAnonKey.includes('YOUR_')),
    liveBackend: env.useLiveBackend
  };
}
