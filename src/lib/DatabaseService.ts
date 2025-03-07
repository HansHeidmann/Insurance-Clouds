import { Member, Organization, User } from "./types";


export default class DatabaseService {

    // Get Current User
    static async getCurrentUser(): Promise<User | null>  {
        try {
            const response = await fetch("/api/v1/users?self=true", {
                method: "GET"
            });
    
            if (!response.ok) throw new Error("Failed to fetch user");
    
            const data = await response.json();
            console.log("User:", data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Update User Details
    static async updateUser(name: string, email: string) {
       
    }
        
    // Update Avatar
    static async updateUserAvatar(file: File) {
       
    }



    ///////////////
    //
    // Organization
    //

    // Get Organization for currentUser
    static async getCurrentOrganization(): Promise<Organization | null>  {
        const user = await this.getCurrentUser()
        try {
            const response = await fetch(`/api/v1/organization?org_id=${user?.organization_id}}`, {
                method: "GET"
            });
    
            if (!response.ok) throw new Error("Failed to fetch user");
    
            const data = await response.json();
            console.log("User:", data);
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    

    // Fetch Organization Members
    static async getOrganizationMembers(): Promise<Member[]> {

    }

    // Update Organization Details
    static async updateOrganization(newName: string, newAvatarUrl?: string) {
    
    }

}