import { User } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";


// Helper function
async function getCurrentUser(): Promise<User | null> {
    const supabase = await createClient();
    const { data: { user }, error: error } = await supabase.auth.getUser();
    if (!user || error) {
        return null;
    }

    // Fetch user details from DB
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    if (userError) {
        return null
    }

    return userData;
}


// GET - Fetch users
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    
    // Check if getting the logged-in user
    const self = req.nextUrl.searchParams.get("self");

    if (self) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Fetch user details from DB
        const { data, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

        if (userError) {
            return NextResponse.json({ error: userError.message }, { status: 500 });
        }

        return NextResponse.json(data);
    }

    // Fetch all users (or filter by organization)
    const organizationId = req.nextUrl.searchParams.get("organization_id");
    let query = supabase.from("users").select("*");

    if (organizationId) query = query.eq("organization_id", organizationId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// POST - Create new user
export async function POST(req: NextRequest) {
    const supabase = await createClient();
    const body = await req.json();
    console.log(body);
    

    const { data, error } = await supabase
        .from("users")
        .insert([{ id: body.userId, first_name: body.firstName, last_name: body.lastName, email: body.email, }]);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 201 });
}



// PATCH: Update Logged-in User
export async function PATCH(req: NextRequest) {

    const supabase = await createClient();
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Possible req.body and params
    const { body } = await req.json();
    const accessCode = req.nextUrl.searchParams.get("access_code");
    //const newRole = req.nextUrl.searchParams.get("role");

    if (accessCode) {
        // update currentUser's organization_id
        const { error } = await supabase
            .from("users")
            .update( {'organization_id': accessCode, 'role': "member"})
            .eq("id", currentUser.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        
    }

    if (body) {}

   
    
}

// DELETE: Delete Logged-in User
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { self } = await req.json();

    if (self) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Step 1: Delete from `users` table
        const { error: dbError } = await supabase
            .from("users")
            .delete()
            .eq("id", user.id);

        if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

        // Step 2: Remove user from Supabase Auth
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

        if (authError) return NextResponse.json({ error: authError.message }, { status: 500 });

        // Step 3; Return success
        return NextResponse.json({ message: "User deleted successfully" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
