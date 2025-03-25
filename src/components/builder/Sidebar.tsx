import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FormBuilderElement, FormElementType, FormElementFactory } from "./FormBuilderElement";
import { FaCopy, FaDownload, FaPlusCircle, FaTrash } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface SidebarProps {
    activeTab: string;
    formMatrix: FormBuilderElement[][];
    selectedElement: FormBuilderElement | null;
    updateElement: (updatedElement: FormBuilderElement) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, formMatrix, selectedElement, updateElement }) => {
    const [editedElement, setEditedElement] = useState<FormBuilderElement | null>(selectedElement);
    const [selectedType, setSelectedType] = useState<FormElementType | null>(selectedElement?.type || null);

    useEffect(() => {
        setEditedElement(selectedElement);
        setSelectedType(selectedElement?.type || null);
    }, [selectedElement]);


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

    if (activeTab == "data") {
        return (
            <div className="h-full p-4 bg-white ">
                {/* JSON Viewer (Fixed Width) */}
                <div className=" bg-white rounded-lg h-full overflow-y-auto">
                    <div className="flex gap-2">
                        <button className="mb-2 ml-auto flex w-min items-center gap-2 text-sm rounded-md px-4 py-2 text-white bg-blue-800 hover:bg-yellow-400 active:bg-yellow-500">
                            <FaCopy/>Copy
                        </button>
                        <button className="mb-2 flex w-min items-center gap-2 text-sm rounded-md  px-4 py-2 text-white bg-red-800 hover:bg-red-500 active:bg-red-600">
                            <FaDownload/>Download
                        </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-black">
                        {JSON.stringify(formMatrix, null, 2)}
                    </pre>
                </div>
            </div>
        )
    }

    if (activeTab == "settings") {
        return (
            <div className="h-full p-4 bg-white ">
                {/* JSON Viewer (Fixed Width) */}
                <div className=" bg-white rounded-lg h-full overflow-y-auto">
                    Coming soon...
                </div>
            </div>
        )
    }

    if (!editedElement) {
        return (
            <>
                <div className="p-4 bg-white text-black">Select an element to edit</div>
            </>
        )
    }

    return (
        <div className="p-4 bg-white">
            <div className="bg-white rounded-lg">

                {/* Show ICONS to select Type for new element */}
                {editedElement.type === "undefined" && (
                    <>
                        <div className="flex flex-wrap gap-3">
                            {Object.entries(elementIcons)
                                .filter(([type]) => type !== "undefined")
                                .map(([type, icon]) => {

                                    return (
                                        <div
                                            key={type}
                                            className={`
                                                size-24 mx-auto
                                                bg-white text-black
                                                hover:bg-blue-100 hover:border-blue-100
                                                shadow-md rounded-lg 
                                                flex items-center justify-center flex-col cursor-pointer 
                                                border border-gray-200"
                                                `}
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

                        <div className="mb-4">
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
                                                        className="
                                                        bg-white text-red-500 border-red-500 border
                                                        hover:bg-red-500 hover:text-white 
                                                        text-sm rounded-md p-2 my-0.5
                                                        "
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
                                                        <FaXmark />
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
                                                className="
                                                bg-white text-green-500 border border-green-400
                                                hover:bg-green-400 hover:text-white
                                                w-full p-2  text-sm rounded-lg"
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
                        <div className="flex justify-center mt-4">
                        <button
                            className="
                            flex px-10 py-3
                            bg-black text-white text-lg font-bold shadow-md rounded
                            hover:bg-blue-400 transition
                            "
                            onClick={() => {
                            if (editedElement) {
                                updateElement(editedElement);
                            }
                            }}
                        >
                            Save
                        </button>
                        </div>

                        




                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
