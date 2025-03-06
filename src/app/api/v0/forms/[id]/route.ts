import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseServer";

// Fetch a single form by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { data, error } = await supabase.from("forms").select("*").eq("id", id).single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
}

// Update
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const body = await req.json();
    const { name, json } = body;
    const edited_at = new Date().toISOString();

    const { data, error } = await supabase.from("forms").update({ name, json, edited_at }).eq("id", params.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
}

// Delete a form by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    const { error } = await supabase.from("forms").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Form deleted successfully" }, { status: 200 });
}
