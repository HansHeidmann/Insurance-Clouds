"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SidebarElements from "@/components/builder/SidebarElements";
import SidebarEditor from "@/components/builder/SidebarEditor";
import FormBuildArea from "@/components/builder/FormBuildArea";
import { FormElement } from "@/components/builder/types";

// Extracted Reusable TabButton Component
const TabButton = ({
  label,
  isActive,
  onClick,
  disabled = false,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    className={`flex-1 p-2 border rounded-t-md ${
      isActive ? "bg-white font-bold" : "bg-gray-200"
    }`}
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
);

export default function FormBuilderPage() {
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<FormElement | null>(null);
  const [activeTab, setActiveTab] = useState<"elements" | "editor">("elements");

  const handleSelectElement = (element: FormElement | null) => {
    setSelectedElement(element);
    if (element) setActiveTab("editor");
  };

  return (
    <div className="h-screen flex flex-col">

      {/* Top Row: Tabs on Left, Buttons on Right */}
      <div className="flex items-center bg-blue-100 px-4 py-3 justify-between">
        {/* Tabs on the Left */}
        <div className="flex space-x-2">
          <TabButton label="Elements" isActive={activeTab === "elements"} onClick={() => setActiveTab("elements")} />
          <TabButton
            label="Editor"
            isActive={activeTab === "editor"}
            onClick={() => setActiveTab("editor")}
            disabled={!selectedElement}
          />
        </div>
  
        {/* Buttons on the Right */}
        <div className="flex space-x-4">
          <button className="bg-purple-500 rounded-lg py-3 px-6 shadow font-sans text-lg font-semibold text-white">
            Preview Form
          </button>
          <button className="bg-green-500 rounded-lg py-3 px-6 shadow font-sans text-lg font-semibold text-white">
            Save Form
          </button>
        </div>
      </div>
  
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-1">
  
          {/* Sidebar (Left Side) */}
          <div className="w-1/4 min-w-[400px] bg-gray-100 flex flex-col h-full overflow-auto">
            {/* Sidebar Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "elements" ? (
                <SidebarElements />
              ) : (
                <SidebarEditor selectedElement={selectedElement} setFormElements={setFormElements} />
              )}
            </div>
          </div>
  
          {/* Form Builder Area (Right Side) */}
          <FormBuildArea
            formElements={formElements}
            setFormElements={setFormElements}
            setSelectedElement={handleSelectElement}
            setActiveTab={setActiveTab}
          />
        </div>
      </DndProvider>
    </div>
  );
  
}
