import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('http')) 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Customer = {
  id: string;
  name: string;
  phone: string;
  created_at: string;
};

export type Device = {
  id: string;
  name: string;
  vehicle: string;
  imei: string;
  sim: string;
  sim_expiry: string;
  annual_expiry: string;
  customer_id: string;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string;
  role: 'admin' | 'user';
};
