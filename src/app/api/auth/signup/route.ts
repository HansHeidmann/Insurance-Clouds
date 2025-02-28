import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }

        // Attempt to sign up the user
        const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

        if (authError || !authData?.user) {
            return NextResponse.json({ error: authError?.message || "Signup failed." }, { status: 401 });
        }

        const userId = authData.user.id; // Get the new user's ID

        // Insert user into 'users' table
        const { error: userError } = await supabase
            .from("users")
            .insert([{ id: userId, email }]);

        if (userError) {
            // If adding to users table fails, delete the user from auth
            await supabase.auth.admin.deleteUser(userId);
            return NextResponse.json({ error: "Signup failed. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ user: authData.user, session: authData.session }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
