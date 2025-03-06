import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Ensures session persists across reloads
        autoRefreshToken: true, // Auto-refresh token when expired
        detectSessionInUrl: true, // Handles OAuth sign-in redirects
    },
});
