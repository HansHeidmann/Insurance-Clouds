import React, { useState, useEffect } from "react";
import { FormElement } from "./types";
import { FaTrash } from "react-icons/fa";

interface SidebarEditorProps {
  selectedElement: FormElement | null;
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
}

const SidebarEditor: React.FC<SidebarEditorProps> = ({ selectedElement, setFormElements }) => {
  const [tempLabel, setTempLabel] = useState("");
  const [tempOptions, setTempOptions] = useState<string[]>([]);

  // Sync local state with selected element
  useEffect(() => {
    if (selectedElement) {
      setTempLabel(selectedElement.label);
      setTempOptions(selectedElement.options || []);
    }
  }, [selectedElement]);

  if (!selectedElement) {
    return <div className="text-gray-500">Select an element to edit</div>;
  }

  // Handle saving changes
  const handleSave = () => {
    setFormElements((prevElements) =>
      prevElements.map((el) =>
        el.id === selectedElement.id ? { ...el, label: tempLabel, options: tempOptions } : el
      )
    );
  };

  // Remove option (Prevent removing last one)
  const handleRemoveOption = (index: number) => {
    if (tempOptions.length > 1) {
      setTempOptions(tempOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Edit {selectedElement.label}</h2>

      {/* Label Input */}
      <label className="block text-sm font-semibold">Label</label>
      <input
        type="text"
        className="w-full border p-1 rounded mb-2"
        value={tempLabel}
        onChange={(e) => setTempLabel(e.target.value)}
      />

      {/* Dropdown or Radio Options Editing */}
      {(selectedElement.type === "select" || selectedElement.type === "radio") && (
        <div>
          <label className="block text-sm font-semibold">Options</label>
          {tempOptions.map((opt, i) => (
            <div key={i} className="flex items-center">
              <input
                type="text"
                className="w-full border p-1 rounded my-1"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...tempOptions];
                  newOptions[i] = e.target.value;
                  setTempOptions(newOptions);
                }}
              />
              {/* Trash Button (Only show if more than 1 option) */}
              {tempOptions.length > 1 && (
                <button
                  className="ml-2 p-2 bg-red-200 hover:bg-red-300 rounded text-red-600"
                  onClick={() => handleRemoveOption(i)}
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            className="bg-blue-500 text-white px-2 py-1 mt-2 rounded"
            onClick={() => setTempOptions([...tempOptions, `Option ${tempOptions.length + 1}`])}
          >
            + Add Option
          </button>
        </div>
      )}

      {/* Save Button */}
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4 w-full rounded"
        onClick={handleSave}
      >
        Save Changes
      </button>
    </div>
  );
};

export default SidebarEditor;
