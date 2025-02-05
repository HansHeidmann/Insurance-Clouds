export type FormElementType =
  | "textbox"
  | "name"
  | "address"
  | "phone"
  | "email"
  | "date"
  | "number"
  | "url"
  | "choices"
  | "options"
  | "checkboxes"
  | "calculation"
  | "signature"
  | "file"
  ;

export interface FormBuilderElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  inputType?: FormElementType;
  options?: string[];
  required?: boolean;
}
