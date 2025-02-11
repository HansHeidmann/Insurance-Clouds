export type FormElementType =
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
  | "file"
  ;

export interface FormBuilderElement {
  id: string;
  type?: FormElementType;
  label: string;
  placeholder?: string;
  inputType?: FormElementType;
  options?: string[];
  required?: boolean;
}

/*

How I need to update the Properties for Each Form Element

"textbox":
  label: String = "Untitled" (default)
  text: String = null (default)
  multiline: Bool = false (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"name":
  label: String = "Name" (default)
  firstName: String = null (default)
  lastName: String = null (default)
  title: String = null (default) 
  middleInitial: String = null (default)
  middleName: String = null (default)
  suffix: String = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"address":
  label: String = "Address" (default)
  addressLine1: String = null (default)
  addressLine2: String = null (default)
  city: String = null (default)
  state: String = null (default)
  zip: String = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"phone":
  label: String = "Phone" (default)
  number: Number = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"email":
  label: String = "Email" (default)
  emailAddress: String = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"date":
  label: String = "Date" (default)
  day: Number = null (default)
  month: Number = null (default)
  year: Number = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"number":
  label: String = "Number" (default)
  value: Number = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"url":
  label: String = "URL" (default)
  url: String = null (default)
  placeholder: String = null (default)
  helpText: String = null (default)
  required: Bool = true (default)

"choices"(dropdown):
  label: String = "Choices" (default)
  choices: String[] = "Choice A" (default selected), "Choice B", "Choice C" 
  helpText: String = null (default)
  required: Bool = true (default)

"options"(radio buttons):
  label: String = "Options" (default)
  options: String[] = "Option A" (default selected), "Option B", "Option C" 
  helpText: String = null (default)
  required: Bool = true (default)

"checkboxes"(multiple selection allowed):
  label: String = "Checkboxes" (default)
  options: String[] = "Selection A" (default selected), "Selection B", "Selection C" 
  helpText: String = null (default)
  required: Bool = true (default)

"calculation"
  label: String = "Calculation" (default)
  helpText: String = null (default)
  required: Bool = true (default)

"signature"
  label: String = "Signature" (default)
  signature: Image = null (default)
  required: Bool = true (default)

"file"
  label: String = "Signature" (default)
  file: File = null (default)
  required: Bool = true (default)

*/
