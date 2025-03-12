import { UUID } from "crypto";

//
// Database Types
//

export type User = {
    id: UUID;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    organization_id: string | null;
};

export type Organization = {
    id: UUID;
    name: string;
    admin_id: UUID;
    avatar_url: string;
};

export type Form = {
    id: UUID;
    author_id: UUID; // Initial creator of this Form
    editor_id: UUID; // Most recent User to edit this Form
    organization_id: UUID
    name: string;
    description: string;
    json: JSON;
    created_at: string;
    edited_at: string;
    total_entries: number;
};

export type Member = {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    role: string;
}
