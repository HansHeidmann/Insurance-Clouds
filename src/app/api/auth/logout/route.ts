import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
