import { UUID } from "crypto";


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
    admin_id: string;
    avatar_url: string;
};

export type Form = {
    id: UUID;
    author_id: string;
    name: string;
    created_at: string;
    edited_at: string;
    total_entries: number;
};

export type Member = {
    id: UUID;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
    role: string | null;
}
