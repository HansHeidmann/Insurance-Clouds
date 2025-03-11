import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { User } from "@/lib/types";



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



// GET
export async function GET(req: NextRequest) {
    const supabase = await createClient();

    const searchParams = req.nextUrl.searchParams;
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

    // Get all forms if a specific ID isn't provided
    const currentUser = await getCurrentUser();
    if (currentUser) {
        const { data, error } = await supabase
            .from("forms")
            .select("*")
            .eq("organization_id", currentUser.organization_id)
            .order('edited_at', {ascending: false})

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Error getting form(s)" }, { status: 500 });
}

// POST
export async function POST() {
    const supabase = await createClient();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "Couldn't retrieve currentUser" }, { status: 400 });
    }

    // Insert form into database
    const { data, error } = await supabase
        .from("forms")
        .insert([{ 
            'organization_id': currentUser.organization_id,
            'author_id': currentUser.id 
        }])
        .select("id")
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
}

// PATCH
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
        .update({})
        .eq("id", formId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Form updated successfully" });
}

// DELETE
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
