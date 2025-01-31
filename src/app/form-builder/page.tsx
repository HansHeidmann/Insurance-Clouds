"use client";

import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SidebarElements from "@/components/builder/SidebarElements";
import SidebarEditor from "@/components/builder/SidebarEditor";
import FormBuildArea from "@/components/builder/FormBuildArea";
import { FormElement } from "@/components/builder/types";

// 🆕 Extracted Reusable TabButton Component
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
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex">
        {/* Sidebar Container */}
        <div className="w-1/4 min-w-[400px] bg-gray-100 p-4">
          <div className="flex mb-2">
            <TabButton label="Elements" isActive={activeTab === "elements"} onClick={() => setActiveTab("elements")} />
            <TabButton
              label="Editor"
              isActive={activeTab === "editor"}
              onClick={() => setActiveTab("editor")}
              disabled={!selectedElement}
            />
          </div>

          {activeTab === "elements" ? (
            <SidebarElements />
          ) : (
            <SidebarEditor selectedElement={selectedElement} setFormElements={setFormElements} />
          )}
        </div>

        {/* FormBuildArea Container */}
        <FormBuildArea
          formElements={formElements}
          setFormElements={setFormElements}
          setSelectedElement={handleSelectElement}
          setActiveTab={setActiveTab}
        />
      </div>
    </DndProvider>
  );
}
