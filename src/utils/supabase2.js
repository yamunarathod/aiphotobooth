import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL2;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY2;

export const supabase2 = createClient(supabaseUrl, supabaseAnonKey);

export default supabase2;