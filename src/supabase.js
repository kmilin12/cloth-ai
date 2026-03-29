import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create dummy client if variables are missing to prevent total app crash
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
  console.error("Missing Supabase environment variables! Please check your Vercel Dashboard Settings.");
}

export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
