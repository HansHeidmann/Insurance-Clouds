import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { User } from "@/lib/types";


// Helper function
async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient();
    const { data: { user }, error: error } = await supabase.auth.getUser();
    if (!user || error) return null;
    const { data: userData, error: userError } = await supabase
        .from("users").select("*").eq("id", user.id).single();
    if (userError) return null
    return userData;
}


// GET - all members (type = User) in the same Organization as currentUser
export async function GET() {
    const supabase = await createClient();
    
    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Please log in and try again" }, { status: 500 });

    // Fetch user details from DB
    const { data: members, error: membersError } = await supabase
        .from("users")
        .select("*")
        .eq("organization_id", currentUser?.organization_id)
    if (membersError) return NextResponse.json({ error: "Error getting members" }, { status: 500 });

    return NextResponse.json(members);
}