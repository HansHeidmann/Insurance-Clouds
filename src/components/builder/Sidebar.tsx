import React, { useState, useEffect } from "react";
import { FormBuilderElement, FormElementType } from "./types";
import Image from "next/image";
import { FaRoute, FaRandom } from "react-icons/fa";


interface SidebarProps {
  selectedElement: FormBuilderElement | null;
  updateElement: (updatedElement: FormBuilderElement) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedElement, updateElement }) => {
  const [editedElement, setEditedElement] = useState<FormBuilderElement | null>(selectedElement);
  const [selectedType, setSelectedType] = useState<FormElementType | null>(selectedElement?.type || null);

  useEffect(() => {
    setEditedElement(selectedElement);
    setSelectedType(selectedElement?.type || null);
  }, [selectedElement]);

  if (!editedElement) {
    return <div className="text-gray-500">Select an element to edit</div>;
  }

  const elementIcons: Record<FormElementType, string> = {
    textbox: "textbox.png",
    name: "name.png",
    address: "address.png",
    phone: "phone.png",
    email: "email.png",
    date: "date.png",
    number: "number.png",
    url: "url.png",
    choices: "choices.png",
    options: "options.png",
    checkboxes: "checkboxes.png",
    calculation: "calculation.png",
    signature: "signature.png",
    file: "file.png",
  };

  return (
    <div>
      {/* Step 1: Show Type Selection First If No Type is Set */}
      {!editedElement.type && (
        <>
          <label className="block pb-2 text-2xl font-medium">Select Field Type</label>
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
                    // Set the type for the new element
                    const updatedElement = { ...editedElement, type: type as FormElementType };
                    setEditedElement(updatedElement);
                    setSelectedType(type as FormElementType);
                    updateElement(updatedElement);
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
        </>
      )}

      {/* Step 2: Show Properties After Type is Selected */}
      {editedElement.type && (
        <>

          {/* DEBUG: Element ID */}
          <label>Element ID</label>
          <div className="flex items-center gap-2 mb-3">
            <input
              className="w-full text-sm p-2 border rounded mb-3"
              type="textbox"
              disabled
              placeholder={editedElement.id}
            />
            
          </div>

          {/* Element Type Dropdown */}
          <label className="block text-md font-medium">Field Type</label>
          <select
            className="w-full p-2 border rounded mb-3"
            value={selectedType ?? ""}
            onChange={(e) => {
              const newType = e.target.value as FormElementType;
              setSelectedType(newType);
              setEditedElement({ ...editedElement, type: newType });
              //updateElement({ ...editedElement, type: newType });
            }}
          >
            <option value="" disabled>Select a field type</option>
            {Object.keys(elementIcons).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          

          {/* Element Required Checkbox */}
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={editedElement.required || false}
              onChange={(e) => setEditedElement({ ...editedElement, required: e.target.checked })}
            />
            <label>*Required</label>
          </div>

          {/* Label Input */}
          <label className="block text-md font-medium">Label</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={editedElement.label ?? ""}
            onChange={(e) => {
              setEditedElement({ ...editedElement, label: e.target.value })
            }}
          />

          {/* Placeholder Input */}
          <label className="block text-md font-medium">Placeholder</label>
          <input
            className="w-full p-2 border rounded mb-3"
            value={editedElement.placeholder ?? ""}
            onChange={(e) => setEditedElement({ ...editedElement, placeholder: e.target.value })}
          />

          {/* Options Input for Choices/Options */}
          {(editedElement.type === "choices" || editedElement.type === "options") && (
            <>
              <label className="block text-md font-medium">Options (comma-separated)</label>
              <input
                className="w-full p-2 border rounded mb-3"
                value={editedElement.options?.join(", ") ?? ""}
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
        </>
      )}
    </div>
  );
};

export default Sidebar;
