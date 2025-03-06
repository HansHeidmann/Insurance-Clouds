import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Create a server-side Supabase client
export const supabaseServer = () => createServerComponentClient({ cookies });
