"use client";

import { createClient } from "@supabase/supabase-js";

// Supabase Client (for Client-side Auth only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

export class AuthServices {
    // Get Authenticated User (Client-side)
    static async getAuthUser() {
        const { data, error } = await supabaseClient.auth.getUser();
        if (error || !data?.user) return null;
        return data.user;
    }

    // Sign Up (No DB Insert - Only Supabase Auth)
    static async signUp(firstName: string, lastName: string, email: string, password: string) {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return data;
    }

    // Sign In
    static async signIn(email: string, password: string) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return data;
    }

    // Sign Out
    static async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw new Error(error.message);
    }
}

