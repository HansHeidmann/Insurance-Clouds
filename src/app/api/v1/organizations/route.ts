import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { User } from "@/lib/types";

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



// POST: Create a New Organization
export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const searchParams = req.nextUrl.searchParams;
    const name = searchParams.get("name");
    if (!name) {
        return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (user.organization_id != null) {
        return NextResponse.json({ error: "User is already in an organization" }, { status: 500 });
    }

    // Create organization
    const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert([{ name, admin_id: user.id }])
        .select("id")
        .single();

    if (orgError) {
        return NextResponse.json({ error: "Error creating a new organization" }, { status: 500 });
    }

    // Update currentUser's organization
    const { error: userError } = await supabase
        .from("users")
        .update({ organization_id: orgData.id, role: "admin" }) // Fix: Use an object, not an array
        .eq("id", user.id); // Fix: Use .eq() instead of .where()

    if (userError) {
        return NextResponse.json({ error: "Error updating currentUser's organization" }, { status: 500 });
    }

    return NextResponse.json({ message: "Organization created successfully" });
}



// GET: Fetch an Organization by ID
export async function GET(req: NextRequest) {
    
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("id");
    if (!orgId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Fetch organization details
    const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .single();

    if (error) return NextResponse.json({ error: "Error getting organization data" }, { status: 500 });

    return NextResponse.json(data);
}

// PATCH: Update an Organization
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();
    const { orgId, name, avatar_url } = await req.json();

    if (!orgId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar_url) updateData.avatar_url = avatar_url;

    // Update organization
    const { error } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", orgId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Organization updated successfully" });
}

// DELETE: Delete an Organization
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    const { orgId } = await req.json();

    if (!orgId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Delete organization
    const { error } = await supabase
        .from("organizations")
        .delete()
        .eq("id", orgId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Organization deleted successfully" });
}
