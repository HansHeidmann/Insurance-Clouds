//   Route = api/v1/organizations/join

import { User } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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


// PATCH: Update currentUser's organization_id and reset role to "member"
export async function PATCH(req: NextRequest) {

    // return if no access code provided in request
    const accessCode = req.nextUrl.searchParams.get("access_code");
    if (!accessCode) return NextResponse.json({ error: "No access code provided" }, { status: 406 });
    // 
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const supabase = await createClient();
    const { error } = await supabase
        .from("users")
        .update( {'organization_id': accessCode, 'role': "member"})
        .eq("id", currentUser.id);

    if (error) {
        return NextResponse.json({ error: "Couldn't join organization" }, { status: 501 });
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
    
}