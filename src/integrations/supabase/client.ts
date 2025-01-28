import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gvwedklqzaynxgqiwueh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2d2Vka2xxemF5bnhncWl3dWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5ODUzNjIsImV4cCI6MjA1MzU2MTM2Mn0.XoqycfUIkdjJlw5grWXcux817cFC6oU2PXLkP2k1gG8";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);