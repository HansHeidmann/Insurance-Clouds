import { UUID } from "crypto";

export type FormElementType =
    | "undefined"
    | "textbox"
    | "name"
    | "address"
    | "phone"
    | "email"
    | "password"
    | "date"
    | "number"
    | "url"
    | "choices"
    | "options"
    | "checkboxes"
    | "calculation"
    | "signature"
    | "file";


export interface FormViewerElement {
    id: UUID;
    type: FormElementType;
    label: string;
    helpText?: string;
    required: boolean;
    properties: Record<string, boolean | string | string[]>;
}