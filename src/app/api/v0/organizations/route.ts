import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseServer";

// POST → Create new organization
export async function POST(req: Request) {
    try {
        const { name } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Organization name is required." }, { status: 400 });
        }

        // Get the authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
            return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
        }

        const adminId = authData.user.id; // Get the logged-in user's ID

        // Insert into organizations table with admin_id
        const { data, error } = await supabase
            .from("organizations")
            .insert([{ name, admin_id: adminId }])
            .select("id")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Update the user's organization_id in the users table
        const { error: userError } = await supabase
            .from("users")
            .update({ organization_id: data.id })
            .eq("id", adminId);

        if (userError) {
            return NextResponse.json({ error: "Organization created, but failed to update user data." }, { status: 500 });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
    }
}
