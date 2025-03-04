import { UUID } from "crypto";


export type User = {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    organization_id: string | null;
};

export type Organization = {
    id: string;
    name: string;
    admin_id: string;
};

export type Form = {
    id: UUID;
    author: UUID;
    name: string;
    formName: string;
    created_at: string;
};