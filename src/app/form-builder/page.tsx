"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "@/components/builder/Sidebar";
import FormArea from "@/components/builder/FormArea";
import { FormElement } from "@/components/builder/types";  // ✅ Import from types.ts

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
