"use client";


import React, { useState, useEffect } from "react";


import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import FormBuilderArea from "@/components/builder/FormBuilderArea";
import Sidebar from "@/components/builder/Sidebar";
import { FormBuilderElement, FormElementFactory } from "@/components/builder/FormBuilderElement";

import { FaEdit, FaEye, FaPlay, FaSave } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/MainHeader";





export default function FormBuilderPage() {

    const router = useRouter();
    const { id: formId } = useParams();

    const [activeTab, setActiveTab] = useState<string>("edit");
    const [selectedElement, setSelectedElement] = useState<FormBuilderElement | null>(null);
    const [formName, setFormName] = useState<string>("");
    const [formMatrix, setFormMatrix] = useState<FormBuilderElement[][]>([]);


    // Load Form (when page has finished loading)
    useEffect(() => {
        const fetchForm = async () => {
            if (!formId) {
                router.push("/forms")
            };

            const res = await fetch(`/api/v1/forms/${formId}`);
            const data = await res.json();

            if (res.ok) {
                setFormName(data.name);
                setFormMatrix(data.json);
            } else {
                console.error("Error loading form:", data.error);    
            }
        };

        fetchForm();
    }, [formId]);

  
    // Save Form (for Save button pressed)
    const saveForm = async () => {
        if (!formName.trim()) {
            alert("Form name is required!");
            return;
        }

        const res = await fetch(`/api/v1/forms/${formId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: formName, json: formMatrix }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Form saved successfully!");
            router.push("/forms");
        } else {
            alert("Error saving form: " + data.error);
        }
    };
    

      

    const updateElement = (updatedElement: FormBuilderElement) => {

        setFormMatrix(prevMatrix => {
            return prevMatrix.map(row =>
                row.map(element => (element.id === updatedElement.id ? updatedElement : element))
            );
        });
        // Ensure the sidebar also updates with the latest data
        setSelectedElement(updatedElement);
    };

    const deleteElement = (rowIndex: number, colIndex: number) => {
        setFormMatrix(prevMatrix => {
            const newMatrix = [...prevMatrix];
            newMatrix[rowIndex] = newMatrix[rowIndex].filter((_, index) => index !== colIndex);
            if (newMatrix[rowIndex].length === 0) {
                newMatrix.splice(rowIndex, 1);
            }
            setSelectedElement(null);
            return newMatrix;
        });
    };

    const moveElement = (rowIndex: number, colIndex: number, direction: string) => {
        setFormMatrix(prevMatrix => {
            const newMatrix = structuredClone(prevMatrix);
            setSelectedElement(newMatrix[rowIndex][colIndex]);
            if (!newMatrix[rowIndex][colIndex]) {
                console.log("bad access");
                return newMatrix;
            }
            if (direction === "left" && colIndex > 0) {
                [newMatrix[rowIndex][colIndex], newMatrix[rowIndex][colIndex - 1]] = [newMatrix[rowIndex][colIndex - 1], newMatrix[rowIndex][colIndex]];
            }
            if (direction === "right" && colIndex < newMatrix[rowIndex].length - 1) {
                [newMatrix[rowIndex][colIndex], newMatrix[rowIndex][colIndex + 1]] = [newMatrix[rowIndex][colIndex + 1], newMatrix[rowIndex][colIndex]];
            }

            return newMatrix;
        })
    }

    const addRow = () => {
        const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
        setFormMatrix(prevMatrix => [...prevMatrix, [newElement]]);
        setSelectedElement(newElement);
    };

    const addColumn = (rowIndex: number) => {
        const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
        setFormMatrix(prevMatrix => {
            const newMatrix = [...prevMatrix];
            newMatrix[rowIndex] = [...newMatrix[rowIndex], newElement];
            return newMatrix;
        });
        setSelectedElement(newElement);
    };


    return (
        <div className="h-screen flex flex-col flex-1">

            {/* Header */}
            <Header />


            {/* Row of Buttons: Edit, JSON .... Preview, Save */}
            <div className="flex items-end bg-gray-200">
                <button
                    onClick={() => {
                        setActiveTab("edit");
                    }
                    }
                    className=
                    {`
                        ${activeTab == "edit" ? "bg-white" : "bg-purple-500"} 
                        ${activeTab == "edit" ? "text-purple-500" : "text-white"} 
                        mr-0.5 font-bold flex items-center px-6 py-2 rounded-t-xl gap-2 
                    `}
                >
                    <FaEdit />
                    <div>Edit</div>  
                </button>
                <button
                    onClick={() => {
                        setActiveTab("data");
                    }
                    }
                    className=
                    {`
                        ${activeTab == "data" ? "bg-white" : "bg-[#22BBEE]"} 
                        ${activeTab == "data" ? "text-[#22BBEE]" : "text-white"} 
                        mr-0.5 font-bold flex items-center px-6 py-2 rounded-t-xl gap-2 
                    `}
                >
                    <FaEye />
                    <div>Data</div>  
                </button>
                <button
                    onClick={() => {
                        setActiveTab("settings");
                    }}
                    className=
                    {`
                        ${activeTab == "settings" ? "bg-white" : "bg-green-500"} 
                        ${activeTab == "settings" ? "text-green-500" : "text-white"} 
                        mr-0.5 font-bold flex items-center px-6 py-2 rounded-t-xl gap-2 
                    `}
                >
                    <FaGear />
                    <div>Settings</div>  
                </button>
                <button
                    onClick={() => {
                        //
                    }
                    }
                    className="ml-auto flex items-center p-4 gap-2 bg-indigo-400 hover:bg-purple-300 shadow text-white font-semibold text-md  drop-shadow-md"
                >
                    <FaPlay />Preview  
                </button>
                <button
                    onClick={() => {
                        saveForm();
                    }
                    }
                    className="flex items-center p-4 gap-2 bg-indigo-600 hover:bg-blue-300 text-white font-bold text-md  drop-shadow-md"
                >
                    <FaSave />Save
                </button>

            </div>

            <div className="flex flex-1 min-h-0">
                {/* Sidebar (Fixed Width) */}
                <div className="w-[380px] min-w-[380px] bg-white flex flex-col overflow-y-auto min-h-0">
                    <Sidebar 
                        activeTab={activeTab}
                        formMatrix={formMatrix}
                        selectedElement={selectedElement}
                        updateElement={updateElement}
                    />
                </div>

                {/* Main Area (Flexible Width - Takes Up Remaining Space) */}
                <div className="flex-grow  h-full overflow-y-auto bg-gray-500 p-8 bg-[url('/builder_bg_tile.png')] bg-repeat bg-[length:25px]">
                    <DndProvider backend={HTML5Backend}>
                        <FormBuilderArea
                            formName={formName}
                            setFormName={setFormName}
                            formMatrix={formMatrix}
                            selectedElement={selectedElement}
                            setSelectedElement={setSelectedElement}
                            deleteElement={deleteElement}
                            moveElement={moveElement}
                            addRow={addRow}
                            addColumn={addColumn}
                        />
                    </DndProvider>
                </div>



            </div>

        </div>

    );

}
