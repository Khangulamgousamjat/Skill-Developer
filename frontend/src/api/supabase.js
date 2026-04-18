import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE');

if (!isConfigured) {
  console.warn("⚠️ Supabase credentials missing or set to placeholder. Database features will be disabled.");
}

// Fallback to a dummy client that won't crash the app
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { 
      from: () => ({ 
        select: () => ({ order: () => ({ limit: () => ({ eq: () => ({ single: () => ({ data: null, error: 'Database not configured' }) }) }) }) }),
        insert: () => ({ select: () => ({ single: () => ({ data: null, error: 'Database not configured' }) }) }),
        update: () => ({ eq: () => ({ data: null, error: 'Database not configured' }) }),
        delete: () => ({ eq: () => ({ data: null, error: 'Database not configured' }) }),
      }),
      auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
      isConfigured: false
    };

// Add explicit flag for components to check
supabase.isConfigured = isConfigured;
