"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Sidebar from "@/components/builder/Sidebar";
import FormArea from "@/components/builder/FormArea";
import { FormElement } from "@/components/builder/types";

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="bg-gray-200 h-screen flex justify-center items-center">
        {/* Centered Inner Div */}
        <div className="flex w-[80%] max-w-screen-lg bg-white">
          <Sidebar />
          <FormArea formElements={formElements} setFormElements={setFormElements} />
        </div>
      </div>
    </DndProvider>
  );
}
