import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET
export async function GET() {
    const { data, error } = await supabase.from('forms').select('*').order( 'created_at', {ascending: false} );

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 })
}

// POST
export async function POST() {
    const { data, error } = await supabase
        .from('forms')
        .insert([{}])
        .select('id')

    if (error) {
        return NextResponse.json({ error: error.message}, { status: 500});
    }
    if (!data || data.length === 0) { 
        return NextResponse.json({ error: "No form created" }, { status: 500 });
    }
    
    return NextResponse.json(data[0], { status: 201 })
}