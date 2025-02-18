import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormBuilderElement, FormElementType, FormElementFactory } from "./FormBuilderElement";
import { FaPlusCircle, FaTrash } from "react-icons/fa";

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
    undefined: "error.png",
    textbox: "textbox.png",
    name: "name.png",
    address: "address.png",
    phone: "phone.png",
    email: "email.png",
    password: "password.png",
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
    {/* 
    //
    // Show ICONS to select Type for new element
    // 
    */}
    {editedElement.type === "undefined" && (
        <>
            <label className="block pb-2 text-2xl font-medium">Select Field Type</label>
            <div className="flex flex-wrap gap-3">
                {Object.entries(elementIcons) 
                    .filter(([type]) => type !== "undefined") 
                    .map(([type, icon]) => {
                        const isSelected = type === selectedType;

                        return (
                            <div
                                key={type}
                                className={`size-24 bg-white shadow-lg rounded-lg flex items-center justify-center flex-col cursor-pointer border-2 transition ${
                                    isSelected ? "border-blue-300" : "border-transparent"
                                }`}
                                onClick={() => {
                                    if (!editedElement) return;
                                
                                    const updatedElement = {
                                        ...editedElement, // Preserve ID and any other existing properties
                                        type: type as FormElementType,
                                        label: FormElementFactory.getDefaultLabel(type as FormElementType),
                                        properties: FormElementFactory.getDefaultPropertiesForType(type as FormElementType), 
                                    };
                                
                                    setSelectedType(type as FormElementType);
                                    setEditedElement(updatedElement);
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
    {editedElement.type !== "undefined" && (
    <>
        {/* Element ID (Debugging) */}
        <label className="block text-md font-semibold">ID [debug]</label>
        <div className="flex items-center gap-2 mb-4">
            <input
            className="w-full text-sm p-2 border rounded bg-white"
            type="text"
            disabled
            value={editedElement.id}
            />
        </div>

        {/* Element Type Dropdown */}
        <label className="block text-md font-semibold">Field Type</label>
        <select
            className="w-full p-2 border rounded mb-4"
            value={selectedType ?? ""}
            onChange={(e) => {
                const newType = e.target.value as FormElementType;

                // Get default properties but keep the same ID
                const updatedElement = {
                    ...FormElementFactory.getDefaultProperties(newType),
                    id: editedElement.id, // Keep the same ID
                };

                setSelectedType(newType);
                setEditedElement(updatedElement);
                updateElement(updatedElement); // Save the updated element in FormMatrix
            }}
        >
            <option value="" disabled>Select a field type</option>
            {Object.keys(elementIcons).filter((type) => type !== "undefined").map((type) => (
                <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
            ))}
        </select>


        {/* Element Required (Yes/No) */}
        <label className="block text-md font-semibold">Required Field</label>
        <div className="flex flex-col items-start mb-4">
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="required"
                    value="true"
                    checked={editedElement.required === true}
                    onChange={() => setEditedElement({ ...editedElement, required: true })}
                />
                Yes
            </label>
            <label className="flex items-center gap-2">
                <input
                    type="radio"
                    name="required"
                    value="false"
                    checked={editedElement.required === false}
                    onChange={() => setEditedElement({ ...editedElement, required: false })}
                />
                No
            </label>
        </div>


        {/* Label Input */}
        <label className="block text-md font-semibold">Field Label</label>
        <input
            className="w-full p-2 border rounded mb-4"
            value={editedElement.label ?? ""}
            onChange={(e) => setEditedElement({ ...editedElement, label: e.target.value })}
        />

        {/* Help Text Input */}
        <label className="block text-md font-semibold">Help Text</label>
        <input
            className="w-full p-2 border rounded mb-4"
            value={editedElement.helpText ?? ""}
            placeholder="Enter some helpful information (optional)"
            onChange={(e) => setEditedElement({ ...editedElement, helpText: e.target.value })}
        />

        
        

        {/* Display Properties Header Only If Needed */}
        {editedElement.properties && Object.keys(editedElement.properties).length > 0 && (
            <label className="block text-md font-semibold mt-2">Properties</label>
        )}

        <div  className="mb-4">
        {Object.entries(FormElementFactory.getDefaultPropertiesForType(editedElement.type)).map(([property, value]) => (
            <div key={property}>
                {/* If the property is an array (like "options"), show individual checkboxes */}
                {Array.isArray(value) ? (
                    <>
                        {/* Ensure property is an array before mapping */}
                        {(editedElement.properties[property] as string[] || []).map((option, index) => (
                            <div key={index} className="flex gap-3 mb-1">
                                {/* Text Input for Option Name */}
                                <input
                                    className="w-full p-1 border rounded"
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                        // Update the specific option at index
                                        const updatedOptions = [...(editedElement.properties[property] as string[])];
                                        updatedOptions[index] = e.target.value;
                                        setEditedElement({
                                            ...editedElement,
                                            properties: {
                                                ...editedElement.properties,
                                                [property]: updatedOptions,
                                            },
                                        });
                                    }}
                                />
                                {/* Remove Option Button */}
                                <button
                                    className="bg-red-500 hover:bg-red-300 text-white text-sm rounded-lg p-2 my-0.5"
                                    onClick={() => {
                                        // Remove the option at index
                                        const updatedOptions = (editedElement.properties[property] as string[]).filter(
                                            (_, i) => i !== index
                                        );
                                        setEditedElement({
                                            ...editedElement,
                                            properties: {
                                                ...editedElement.properties,
                                                [property]: updatedOptions,
                                            },
                                        });
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}

                        {/* Add New Option Button */}
                        <button
                            onClick={() => {
                                const updatedOptions = [...(editedElement.properties[property] as string[]), "Another Option"];
                                setEditedElement({
                                    ...editedElement,
                                    properties: {
                                        ...editedElement.properties,
                                        [property]: updatedOptions,
                                    },
                                });
                            }}
                            className="bg-green-400 hover:bg-green-200 w-full p-2 text-white text-sm rounded-lg"
                        >
                            <center><FaPlusCircle /></center>
                        </button>
                    </>
                ) : (
                    /* If the property is a boolean (like "multiline"), show a single checkbox */
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={Boolean(editedElement.properties[property])}
                            onChange={(e) => {
                                setEditedElement({
                                    ...editedElement,
                                    properties: {
                                        ...editedElement.properties,
                                        [property]: e.target.checked,
                                    },
                                });
                            }}
                        />
                        <label className="block text-md">
                            {property
                                .replace(/([A-Z0-9])/g, " $1") 
                                .replace(/\b\w/g, (char) => char.toUpperCase())
                            }
                        </label>

                    </div>
                )}
            </div>
        ))}
        </div>

        {/* Save Button */}
        <button
            className="w-full mt-12 bg-blue-500 text-white text-lg font-bold shadow-md py-4 rounded hover:bg-blue-400 transition"
            onClick={() => {
                if (editedElement) {
                    updateElement(editedElement); 
                }
            }}
        >
            Save
        </button>


        

    </>
    )}
    </div>
);
};

export default Sidebar;
