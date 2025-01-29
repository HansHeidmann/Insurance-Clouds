"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "@/components/builder/Sidebar";
import FormArea from "@/components/builder/FormArea";

// Define the base form element type inside the component
type FormElementType = "input" | "textarea" | "select" | "radio";

interface FormElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  inputType?: "text" | "email" | "phone"; // Only applies to input fields
  options?: string[]; // Only applies to select and radio fields
  required?: boolean;
}

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <Sidebar />
        <FormArea formElements={formElements} setFormElements={setFormElements} />
      </div>
    </DndProvider>
  );
}
