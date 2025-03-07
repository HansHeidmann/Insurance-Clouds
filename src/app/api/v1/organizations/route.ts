import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/SupabaseServer";

// POST: Create a New Organization
export async function POST(req: NextRequest) {
    const supabase = supabaseServer();
    const { name, adminId } = await req.json();

    if (!name || !adminId) {
        return NextResponse.json({ error: "Organization name and admin ID are required" }, { status: 400 });
    }

    // Create organization
    const { data, error } = await supabase
        .from("organizations")
        .insert([{ name, admin_id: adminId }])
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Organization created successfully", organizationId: data.id });
}

// GET: Fetch an Organization by ID
export async function GET(req: NextRequest) {
    const supabase = supabaseServer();
    const searchParams = req.nextUrl.searchParams;
    const orgId = searchParams.get("orgId");

    if (!orgId) {
        return NextResponse.json({ error: "Organization ID is required" }, { status: 400 });
    }

    // Fetch organization details
    const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// PATCH: Update an Organization
export async function PATCH(req: NextRequest) {
    const supabase = supabaseServer();
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
    const supabase = supabaseServer();
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
