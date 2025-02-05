import React, { useState, useEffect } from "react";
import { FormBuilderElement, FormElementType } from "./types";
import Image from "next/image";

interface SidebarProps {
  selectedElement: FormBuilderElement | null;
  updateElement: (updatedElement: FormBuilderElement) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedElement, updateElement }) => {
  const [editedElement, setEditedElement] = useState<FormBuilderElement | null>(selectedElement);
  const [selectedType, setSelectedType] = useState<FormElementType | null>(selectedElement?.type || null);

  useEffect(() => {
    setEditedElement(selectedElement);
    setSelectedType(selectedElement?.type || null); // Set default selected type when element is selected
  }, [selectedElement]);

  if (!editedElement) {
    return <div className="text-gray-500">Select an element to edit</div>;
  }

  const elementIcons: Record<FormElementType, string> = {
    textbox: "text.png",
    name: "name.png",
    address: "address.png",
    phone: "phone.png",
    email: "email.png",
    date: "date.png",
    number: "number.png",
    url: "url.png",
    choices: "choice.png",
    options: "option.png",
    checkboxes: "checkbox.png",
    calculation: "undefined.png",
    signature: "signature.png",
    file: "file.png",
    
  };

  return (
    <div>
      {/* ICONS for Element Type */}
      <label className="block pb-2 text-2xl font-medium">Type</label>
      <div className="flex flex-wrap gap-3">
        {Object.entries(elementIcons).map(([type, icon]) => {
          const isSelected = type === selectedType;

          return (
            <div
              key={type}
              className={`size-24 bg-white shadow-lg rounded-lg flex items-center justify-center flex-col cursor-pointer border-2 transition ${
                isSelected ? "border-blue-300" : "border-transparent"
              }`}
              onClick={() => {
                // If clicking a new type, update type
                if (type !== selectedType) {
                  setSelectedType(type as FormElementType);
                  setEditedElement({ ...editedElement, type: type as FormElementType });
                }
              }}
            >
              <div className="py-1 select-none pointer-events-none">
                <Image src={`/element_icons/${icon}`} alt={type} width={35} height={35} />
              </div>
              <div className="text-sm select-none pointer-events-none">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Element Required Checkbox */}
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={editedElement.required || false}
          onChange={(e) => setEditedElement({ ...editedElement, required: e.target.checked })}
        />
        <label>*Required</label>
      </div>

      {/* Input fields for common properties */}
      <label className="block text-sm font-medium">Label</label>
      <input
        className="w-full p-2 border rounded mb-3"
        value={editedElement.label}
        onChange={(e) => setEditedElement({ ...editedElement, label: e.target.value })}
      />

      <label className="block text-sm font-medium">Placeholder</label>
      <input
        className="w-full p-2 border rounded mb-3"
        value={editedElement.placeholder || ""}
        onChange={(e) => setEditedElement({ ...editedElement, placeholder: e.target.value })}
      />

      {/* Additional fields based on type */}
      {editedElement.type === "text" && (
        <>
          <label className="block text-sm font-medium">Input Type</label>
          <select
            className="w-full p-2 border rounded mb-3"
            value={editedElement.inputType || "text"}
            onChange={(e) => setEditedElement({ ...editedElement, inputType: e.target.value as any })}
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </>
      )}

      {editedElement.type === "select" && (
        <>
          <label className="block text-sm font-medium">Options (comma-separated)</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={editedElement.options?.join(", ") || ""}
            onChange={(e) =>
              setEditedElement({ ...editedElement, options: e.target.value.split(", ") })
            }
          />
        </>
      )}

      {/* Save Button */}
      <button
        className="w-full bg-blue-500 text-white shadow-md py-2 rounded hover:bg-blue-400 transition"
        onClick={() => updateElement(editedElement)}
      >
        Save
      </button>
    </div>
  );
};

export default Sidebar;
