import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// GET: Fetch All Entries (Optional Form Filter)
export async function GET(req: NextRequest) {
    const supabase = await createClient();

    const searchParams = req.nextUrl.searchParams;
    const formId = searchParams.get("form_id");
    const entryId = searchParams.get("entryId");

    // Fetch specific entry if entryId is provided
    if (entryId) {
        const { data, error } = await supabase
            .from("entries")
            .select("*")
            .eq("id", entryId)
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    // Fetch all entries or filter by form_id
    let query = supabase.from("entries").select("*");
    if (formId) query = query.eq("form_id", formId);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
}

// POST: Create a New Entry
export async function POST(req: NextRequest) {
    const supabase = await createClient();

    const { formId, data } = await req.json();

    if (!formId || !data) {
        return NextResponse.json({ error: "Form ID and data are required" }, { status: 400 });
    }

    // Insert entry into database
    const { data: entryData, error } = await supabase
        .from("entries")
        .insert([{ form_id: formId, data }])
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Entry created successfully", entryId: entryData.id });
}

// PATCH: Update an Existing Entry
export async function PATCH(req: NextRequest) {
    const supabase = await createClient();

    const { entryId, data } = await req.json();

    if (!entryId || !data) {
        return NextResponse.json({ error: "Entry ID and new data are required" }, { status: 400 });
    }

    // Update entry
    const { error } = await supabase
        .from("entries")
        .update({ data })
        .eq("id", entryId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Entry updated successfully" });
}

// DELETE: Delete an Entry
export async function DELETE(req: NextRequest) {
    const supabase = await createClient();
    
    const { entryId } = await req.json();

    if (!entryId) {
        return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    // Delete entry
    const { error } = await supabase
        .from("entries")
        .delete()
        .eq("id", entryId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Entry deleted successfully" });
}
