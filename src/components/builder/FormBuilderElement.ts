import { v4 as uuidv4 } from "uuid";

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

export interface FormBuilderElement {
    id: string;
    type: FormElementType;
    label: string;
    helpText?: string;
    required: boolean;
    properties: Record<string, boolean | string | string[]>; // ✅ Fixed
}

export class FormElementFactory {
    static getDefaultProperties(type: FormElementType): FormBuilderElement {
        return {
            id: uuidv4(),
            type,
            label: FormElementFactory.getDefaultLabel(type),
            helpText: "",
            required: true,
            properties: FormElementFactory.getDefaultPropertiesForType(type), // ✅ Ensures properties is always present
        };
    }

    static getDefaultPropertiesForType(type: FormElementType): Record<string, boolean | string | string[]> {
        switch (type) {
            case "textbox":
                return { multiline: false };
            case "name":
                return { title: false, firstName: true, middleInitial: false, middleName: false, lastName: true, suffix: false };
            case "address":
                return { addressLine1: true, addressLine2: true, city: true, state: true, zip: true };
            case "phone":
            case "email":
            case "number":
            case "url":
            case "signature":
                return {};
            case "date":
                return { day: true, month: true, year: true };
            case "choices":
            case "options":
            case "checkboxes":
                return { options: ["Choice A", "Choice B", "Choice C"] };
            case "calculation":
                return { formula: "" };
            case "file":
                return { allowedFileTypes: [".txt"] };
            default:
                return {};
        }
    }

    static getDefaultLabel(type: FormElementType): string {
        const labels: Record<FormElementType, string> = {
            undefined: "Untitled",
            textbox: "Untitled",
            name: "Name",
            address: "Address",
            phone: "Phone Number",
            email: "Email Address",
            password: "Password",
            date: "Date",
            number: "Number",
            url: "URL",
            choices: "Choices",
            options: "Options",
            checkboxes: "Checkboxes",
            calculation: "Calculation",
            signature: "Signature",
            file: "File",
        };
        return labels[type] || "Untitled";
    }
}
