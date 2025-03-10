import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET: Fetch All Forms (Optional Organization Filter)
export async function GET(req: NextRequest) {
    const supabase = await createClient();
    
    const searchParams = req.nextUrl.searchParams;
    const organizationId = searchParams.get("organization_id");
    const formId = searchParams.get("formId");

    // Fetch specific form if formId is provided
    if (formId) {
        const { data, error } = await supabase
            .from("forms")
            .select("*")
            .eq("id", formId)
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    // Fetch all forms or filter by organization
    let query = supabase.from("forms").select("*");
    if (organizationId) query = query.eq("organization_id", organizationId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// POST: Create a New Form
export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const { name, organization_id, author_id } = await req.json();

    if (!name || !organization_id || !author_id) {
        return NextResponse.json({ error: "Name, organization ID, and author ID are required" }, { status: 400 });
    }

    // Insert form into database
    const { data, error } = await supabase
        .from("forms")
        .insert([{ name, organization_id, author_id }])
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Form created successfully", formId: data.id });
}

// PATCH: Update an Existing Form
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();

    const { formId, name } = await req.json();

    if (!formId) {
        return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;

    // Update form
    const { error } = await supabase
        .from("forms")
        .update(updateData)
        .eq("id", formId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Form updated successfully" });
}

// DELETE: Delete a Form
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();

    const { formId } = await req.json();

    if (!formId) {
        return NextResponse.json({ error: "Form ID is required" }, { status: 400 });
    }

    // Delete form
    const { error } = await supabase
        .from("forms")
        .delete()
        .eq("id", formId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Form deleted successfully" });
}
