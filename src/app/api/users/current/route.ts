import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET api/users/current
export async function GET() {  
    try {
        // Get the authenticated user and session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        const userId = sessionData.session.user.id; 

        // Fetch user details from the database
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (userError) {
            return NextResponse.json({ error: userError.message }, { status: 500 });
        }

        return NextResponse.json({ user, session: sessionData.session }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong." + error  }, { status: 500 });
    }
}
