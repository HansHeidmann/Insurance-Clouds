import { Form, Organization, User } from "./types";


export default class DatabaseService {

    ///////////////
    //
    // User
    //

    // Get Current User
    static async getCurrentUser(): Promise<User | null>  {
        try {
            
            const response = await fetch("/api/v1/users?self=true", {
                method: "GET"
            });
    
            if (!response.ok) throw new Error("Failed to fetch user");
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }



    ///////////////
    //
    // Organization
    //

    // Get Organization for currentUser
    static async getCurrentOrganization(): Promise<Organization | null>  {
        const user = await this.getCurrentUser()
        if (user == null) return null;
        if (user.organization_id == null) return null;
    
        const response = await fetch(`/api/v1/organizations?id=${user.organization_id}`, {
            method: "GET"
        });

        if (!response.ok) {
            console.warn("Couldn't get Organization Data");
            return null;
        }

        const data = await response.json();
        return data;
    }
    

    // Fetch Organization Members
    static async getOrganizationMembers(): Promise<User[] | null> {
    
        const response = await fetch(`/api/v1/organizations/members`, {
            method: "GET"
        });

        if (!response.ok) {
            console.warn("Couldn't get Organization Members");
            return null;
        }

        const members = await response.json();
        return members;
    }


    // Get Organization for currentUser
    static async createOrganization(organizationName: string)  {
        if (!organizationName) return
        await fetch(`/api/v1/organizations?name=${organizationName}`, {
            method: "POST"
        });
    }

    // Get Organization for currentUser
    static async joinOrganization(accessCode: string)  {
        if (!accessCode) return
        await fetch(`/api/v1/organizations/join?access_code=${accessCode}`, {
            method: "PATCH"
        });
        
    }



    ///////////////
    //
    // Forms
    //

    static async createForm(): Promise<Form | null> {

        const response = await fetch("/api/v1/forms", { method: "POST" });

        if (!response.ok) {
            console.warn("Failed to create form.");
        }

        const formData = await response.json();
        const form: Form = formData.data;
       
        return form;
    
    }

   

    // Fetch Organization Members
    static async getFormsForOrganization(): Promise<Form[] | null> {
    
        const response = await fetch(`/api/v1/forms`, {
            method: "GET"
        });

        if (!response.ok) {
            console.warn("Couldn't get Forms for Organization");
            return null;
        }

        const members = await response.json();
        return members;
    }


   

}