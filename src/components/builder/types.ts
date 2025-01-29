export type FormElementType = "input" | "textarea" | "select" | "radio";

export interface FormElement {
  id?: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  inputType?: "text" | "email" | "phone";
  options?: string[];
  required?: boolean;
}
