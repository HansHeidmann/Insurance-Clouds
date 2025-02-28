import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET → Fetch organization details & members
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch organization info
    const { data: user, error: userError } = await supabase
        .from("user")
        .select("*")
        .eq("id", id)
        .single();

    if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
}
