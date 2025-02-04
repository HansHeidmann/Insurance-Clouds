import React, { useState } from "react";
import { FormBuilderElement, FormElementType } from "./types";

interface SidebarProps {
  selectedElement: FormBuilderElement | null;
  updateElement: (updatedElement: FormBuilderElement) => void; // Function to update state in page.tsx
}

const Sidebar: React.FC<SidebarProps> = ({ selectedElement, updateElement }) => {
  // Local state to track edits before saving
  const [editedElement, setEditedElement] = useState<FormBuilderElement | null>(selectedElement);

  // Update local state when new element is selected
  React.useEffect(() => {
    setEditedElement(selectedElement);
  }, [selectedElement]);

  if (!editedElement) {
    return <div className="p-5 text-gray-500">Select an element to edit</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Edit Element</h2>

      {/* Dropdown to change the type */}
      <label className="block text-sm font-medium">Type</label>
      <select
        className="w-full p-2 border rounded mb-3"
        value={editedElement.type}
        onChange={(e) =>
          setEditedElement({ ...editedElement, type: e.target.value as FormElementType })
        }
      >
        <option value="input">Input</option>
        <option value="select">Select</option>
        <option value="checkbox">Checkbox</option>
        <option value="radio">Radio</option>
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
      {editedElement.type === "input" && (
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
