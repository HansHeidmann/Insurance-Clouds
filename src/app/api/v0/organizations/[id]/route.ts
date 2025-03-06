import { NextResponse } from "next/server";
import { supabase } from "@/lib/SupabaseServer";

// GET → Fetch organization details & members
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    // Fetch organization info
    const { data: org, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", id)
        .single();

    if (orgError) {
        return NextResponse.json({ error: orgError.message }, { status: 404 });
    }

    // Fetch members of the organization
    const { data: members, error: membersError } = await supabase
        .from("users")
        .select("*")
        .eq("organization_id", id);

    if (membersError) {
        return NextResponse.json({ error: membersError.message }, { status: 500 });
    }

    return NextResponse.json({ organization: org, members }, { status: 200 });
}
