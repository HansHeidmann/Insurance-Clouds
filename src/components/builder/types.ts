export type FormElementType = "undefined" | "input" | "textarea" | "select" | "radio" | "checkbox";


export interface FormBuilderElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  inputType?: "text" | "email" | "phone";
  options?: string[];
  required?: boolean;
}