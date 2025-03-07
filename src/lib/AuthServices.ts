"use client";

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export class AuthServices {
    // Get Authenticated User (Client-side)
    static async getAuthUser() {
        const { data, error } = await supabase.auth.getUser();
        console.log(data.user);
        if (error || !data?.user) return null;
        return data.user;
    }

    // Sign Up (No DB Insert - Only Supabase Auth)
    static async signUp(firstName: string, lastName: string, email: string, password: string) {
        // Step 1: Create user in Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error || !data?.user) {
            throw new Error(error?.message || "Failed to create user in Supabase Auth.");
        }

        const userId = data.user.id; // Get the newly created user's ID

        // Step 2: Store additional user details in the database via API route
        const response = await fetch("/api/v1/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId, 
                firstName,
                lastName,
                email
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create user in the database.");
        }

        return data;
    }


    // Sign In
    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return data;
    }

    // Sign Out
    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    }
}

