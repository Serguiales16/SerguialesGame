import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase environment variables. Please check your .env file.'
    );
}

// Using any - types can be generated later with: npx supabase gen types typescript
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
