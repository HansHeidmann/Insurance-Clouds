import { supabaseClient } from "@/lib/SupabaseClient"; // Uses Server Components API
import { Member, Organization, User } from "./types";

const supabase = supabaseClient;

export class DatabaseService {

    // Get Current User
    static async getCurrentUser(): Promise<User | null>  {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) return null;

        // Fetch full user details from DB
        const { data, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", user.id)
            .single();

        return userError ? null : data;
    }

    // Update User Details
    static async updateUser(name: string, email: string) {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) throw new Error("Unauthorized");

        const { error } = await supabase
            .from("users")
            .update({ name, email })
            .eq("id", currentUser.id);

        if (error) throw new Error("Failed to update user.");
    }
        
    // Update Avatar
    static async updateUserAvatar(file: File) {
        const currentUser = await this.getCurrentUser();
        if (!currentUser) throw new Error("Unauthorized");

        // Define storage path (inside "user_avatars" bucket)
        const filePath = `${currentUser.id}/${file.name}`;

        // Upload image to storage bucket
        const { error } = await supabase.storage
            .from("user_avatars")
            .upload(filePath, file, { upsert: true });

        if (error) {
            console.error("Storage Upload Error:", error);
            throw new Error("Failed to upload image.");
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
            .from("user_avatars")
            .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) throw new Error("Failed to get image URL.");

        const avatarUrl = publicUrlData.publicUrl;

        // Update user record with new avatar URL
        const { error: updateError } = await supabase
            .from("users")
            .update({ avatar_url: avatarUrl })
            .eq("id", currentUser.id);

        if (updateError) throw new Error("Failed to update avatar.");

        return avatarUrl;
    }



    ///////////////
    //
    // Organization
    //

    // Get Organization for currentUser
    static async getCurrentOrganization(): Promise<Organization | null>  {
        const currentUser = await this.getCurrentUser();
        if (!currentUser || !currentUser.organization_id) return null; 
    
        const { data, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", currentUser.organization_id)
            .single();
    
        if (error) return null;
        return data;
    }
    

    // Fetch Organization Members
    static async getOrganizationMembers(): Promise<Member[]> {
        const org = await this.getCurrentOrganization(); // Use await
        if (!org) throw new Error("No organization found.");

        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("organization_id", org.id);

        if (error) throw new Error("Failed to fetch organization members.");
        return data;
    }

    // Update Organization Details
    static async updateOrganization(newName: string, newAvatarUrl?: string) {
        const org = await this.getCurrentOrganization(); 
        if (!org) throw new Error("No organization found.");

        const updateData: Partial<Organization> = { name: newName };
        if (newAvatarUrl) updateData.avatar_url = newAvatarUrl;

        const { error } = await supabase
            .from("organizations")
            .update(updateData)
            .eq("id", org.id);

        if (error) throw new Error("Failed to update organization.");
    }




    /////////////////////////
    //
    //      AUTH
    //


    // Sign Up
    static async signUp(email: string, password: string, firstName: string, lastName: string) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw new Error(error.message);

        // If user successfully created, insert into 'users' table
        const user = data.user;

        if (user) {
            const { error: userError } = await supabase.from("users").insert([
                {
                    id: user.id,
                    email: user.email,
                    firstName,
                    lastName,
                    role: "member",
                    organization_id: null,
                },
            ]);

            if (userError) throw new Error("Failed to create user profile.");
        }

        return data;
    }

    // Sign In (Login Existing User)
    static async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        return data;
    }

    // Sign Out (Logout)
    static async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    }
}
