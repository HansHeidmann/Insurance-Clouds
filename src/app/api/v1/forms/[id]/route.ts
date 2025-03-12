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

    // Extract 'id' from the dynamic path
    const { pathname } = req.nextUrl;
    // Get the last part of the URL -> [id]
    const formId = pathname.split("/").pop(); 

    // Error if an id wasn't found in the path
    if (!formId) return NextResponse.json({ error: "Form id was not properly provided" }, { status: 400 });

    // Query database for form with that id
    const { data: form, error: formRetrievalError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();
    if (formRetrievalError) {
        return NextResponse.json({ error: formRetrievalError.message }, { status: 500 });
    }
    
    // Respond with Form
    return NextResponse.json(form);
}




// PUT: Replace an existing form when saving
export async function PUT(req: NextRequest) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "Please log in and try again" }, { status: 401 });
    }

    const supabase = await createClient();

    // Extract 'id' from path
    const { pathname } = req.nextUrl;
    const formId = pathname.split("/").pop(); // Get the last part of the URL

    if (!formId) {
        return NextResponse.json({ error: "Form ID was not provided" }, { status: 400 });
    }

    // Fetch the existing form to check ownership
    const { data: originalForm, error: fetchError } = await supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single();

    if (fetchError || !originalForm) {
        return NextResponse.json({ error: "Form not found or access denied" }, { status: 404 });
    }

    // Ensure the current user is in the organization
    if (originalForm.organization_id !== currentUser.organization_id) {
        return NextResponse.json({ error: "Unauthorized: You can not edit this form" }, { status: 403 });
    }

    // Parse request body to get updated form data
    let updatedFormData;
    try {
        updatedFormData = await req.json();
    } catch (error) {
        console.error("Invalid JSON:", error);
        return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    // Ensure valid updates are provided
    if (!updatedFormData || Object.keys(updatedFormData).length === 0) {
        return NextResponse.json({ error: "No form data provided" }, { status: 400 });
    }

    // Preserve original author_id & created_at
    updatedFormData.author_id = originalForm.author_id;
    updatedFormData.created_at = originalForm.created_at;
    updatedFormData.edited_at = new Date().toISOString(); // Updating timestamp

    // Update only specific fields
    const { data: updatedForm, error: updateError } = await supabase
        .from("forms")
        .update({
            id: originalForm.id,
            created_at: originalForm.created_at,
            edited_at: new Date().toISOString(),
            json: updatedFormData.json,
            name: updatedFormData.name,
            author_id: originalForm.author_id,
            organization_id: originalForm.organization_id,
            editor_id: currentUser.id
        })
        .eq("id", formId)
        .select("*")
        .single();

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(updatedForm);
}
