"use client";


import React, { useState, useEffect, useRef } from "react";


import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import FormBuilderArea from "@/components/builder/FormBuilderArea";
import Sidebar from "@/components/builder/Sidebar";
import { FormBuilderElement, FormElementFactory } from "@/components/builder/FormBuilderElement";

import { FaEdit, FaEye, FaPlay, FaSave } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/MainHeader";
import FloatingToolbar from "@/components/builder/FloatingToolbar";



export default function FormBuilderPage() {

    const router = useRouter();
    const { id: formId } = useParams();

    const [activeTab, setActiveTab] = useState<string>("edit");
    const [selectedElement, setSelectedElement] = useState<FormBuilderElement | null>(null);
    const [formName, setFormName] = useState<string>("");
    const [formMatrix, setFormMatrix] = useState<FormBuilderElement[][]>([]);
    const [formLoaded, setFormLoaded] = useState(false);

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
                setFormLoaded(true);
            } else {
                console.error("Error loading form:", data.error);    
            }
        };

        fetchForm();
    }, [formId, router]);

    useEffect(() => {
        if (formLoaded && formMatrix.length === 0) {
            const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
            setFormMatrix(prevMatrix => {
                const newMatrix = [...prevMatrix];
                // Insert new row at the specified index
                newMatrix.splice(0, 0, [newElement]);
                selectElement(newElement);
                return newMatrix;
            });
        }
    }, [formLoaded, formMatrix.length]);

    // FloatingToolbar
    const selectedElementRef = useRef<HTMLDivElement | null>(null);
    const [toolbarPos, setToolbarPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        if (selectedElementRef.current) {
            const rect = selectedElementRef.current.getBoundingClientRect();
            setToolbarPos({
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY - 0, // 10px above the element
            });
        }
    }, [selectedElement]);

  
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
    

    const selectElement = (element: FormBuilderElement | null) => {
        setSelectedElement(element);
    }

    const updateElement = (updatedElement: FormBuilderElement) => {

        setFormMatrix(prevMatrix => {
            return prevMatrix.map(row =>
                row.map(element => (element.id === updatedElement.id ? updatedElement : element))
            );
        });
        // Ensure the sidebar also updates with the latest data
        selectElement(updatedElement);
    };

    const deleteElement = () => {
        let rowIndex = -1
        let colIndex = -1;
        for (let r = 0; r < formMatrix.length; r++) {
            for (let c = 0; c < formMatrix[r].length; c++) {
                if (formMatrix[r][c].id === selectedElement?.id) {
                    rowIndex = r;
                    colIndex = c;
                    console.log(selectedElement);
                    break; 
                  }
            }
        }
        if (rowIndex==null || colIndex==null) {
            return;
        }
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

    const moveElement = (direction: string) => {
        let rowIndex = -1
        let colIndex = -1;
        for (let r = 0; r < formMatrix.length; r++) {
            for (let c = 0; c < formMatrix[r].length; c++) {
                if (formMatrix[r][c].id === selectedElement?.id) {
                    rowIndex = r;
                    colIndex = c;
                    console.log(selectedElement);
                    break; 
                  }
            }
        }
        if (rowIndex==null || colIndex==null) {
            return;
        }
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

    const addRow = (rowIndex: number) => {
        const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
        
        setFormMatrix(prevMatrix => {
            const newMatrix = [...prevMatrix];
            // Insert new row at the specified index
            newMatrix.splice(rowIndex, 0, [newElement]);
            selectElement(newElement);
            return newMatrix;
        });
    };

    const addColumn = (rowIndex: number, colIndex: number) => {

        const rowPercentWidthFull = formMatrix[rowIndex].reduce((acc, element) => acc + element.width, 0);
        const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
        newElement.width = (100 - rowPercentWidthFull) / 2;
        
        setFormMatrix(prevMatrix => {
            const newMatrix = [...prevMatrix];
            // Insert new element at the specified column index in the specified row
            newMatrix[rowIndex] = [
                ...newMatrix[rowIndex].slice(0, colIndex),
                newElement,
                ...newMatrix[rowIndex].slice(colIndex)
            ];
            selectElement(newElement);
            return newMatrix;
        });
    };

    const swapElements = (sourceRow: number, sourceCol: number, targetRow: number, targetCol: number) => {
        setFormMatrix(prevMatrix => {
            // Validate indices
            if (sourceRow < 0 || sourceRow >= prevMatrix.length ||
                targetRow < 0 || targetRow >= prevMatrix.length ||
                sourceCol < 0 || sourceCol >= prevMatrix[sourceRow].length ||
                targetCol < 0 || targetCol >= prevMatrix[targetRow].length) {
                console.error('Invalid indices:', { sourceRow, sourceCol, targetRow, targetCol });
                return prevMatrix;
            }

            // Create a new matrix with a deep clone
            const newMatrix = structuredClone(prevMatrix);
            
            // Get the elements to swap
            const sourceElement = newMatrix[sourceRow][sourceCol];
            const targetElement = newMatrix[targetRow][targetCol];

            // Perform the swap
            newMatrix[sourceRow][sourceCol] = targetElement;
            newMatrix[targetRow][targetCol] = sourceElement;

            // Update the selected element reference if it was one of the swapped elements
            if (selectedElement?.id === sourceElement.id) {
                selectElement(newMatrix[targetRow][targetCol]);
            } else if (selectedElement?.id === targetElement.id) {
                selectElement(newMatrix[sourceRow][sourceCol]);
            }

            return newMatrix;
        });
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
                        ${activeTab == "edit" ? "bg-white" : "bg-[#a259b1]"} 
                        ${activeTab == "edit" ? "text-[#a259b1]" : "text-white"} 
                        mr-0.5 flex items-center px-6 py-2 rounded-t-xl gap-2 
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
                        ${activeTab == "data" ? "bg-white" : "bg-[#68b159]"} 
                        ${activeTab == "data" ? "text-[#68b159]" : "text-white"} 
                        mr-0.5 flex items-center px-6 py-2 rounded-t-xl gap-2 
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
                        ${activeTab == "settings" ? "bg-white" : "bg-[#5978b1]"} 
                        ${activeTab == "settings" ? "text-[#5978b1]" : "text-white"} 
                        mr-0.5 flex items-center px-6 py-2 rounded-t-xl gap-2 
                    `}
                >
                    <FaGear />
                    <div>Settings</div>  
                </button>
                <button
                    onClick={() => {
                        //
                    }}
                    className="ml-auto flex items-center py-3 px-6 gap-2 bg-gray-200 text-gray-500 hover:bg-gray-300 hover:text-black transition duration-200 "
                >
                    <FaPlay />Preview  
                </button>
                <button
                    onClick={() => {
                        saveForm();
                    }}
                    className="flex items-center py-3 px-6 gap-2 bg-black text-white  hover:bg-black hover:text-yellow-300 transition duration-200 "
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
                <div 
                    className="flex-grow  h-full overflow-y-auto bg-gray-500 p-8 bg-[url('/builder_bg_tile.png')] bg-repeat bg-[length:25px]"
                    onClick={()=>selectElement(null)}
                >
                    <DndProvider backend={HTML5Backend}>
                        <FormBuilderArea
                            formName={formName}
                            setFormName={setFormName}
                            formMatrix={formMatrix}
                            selectedElement={selectedElement}
                            selectElement={selectElement}
                            deleteElement={deleteElement}
                            addRow={addRow}
                            addColumn={addColumn}
                            swapElements={swapElements}
                            selectedElementRef={selectedElementRef}
                        />
                    </DndProvider>
                </div>
                
                {selectedElement && (
                    <FloatingToolbar
                        x={toolbarPos.x}
                        y={toolbarPos.y}
                        selectElement={selectElement}
                        selectedElement={selectedElement}
                        deleteElement={deleteElement}
                        moveElement={moveElement}
                        updateElement={updateElement}
                    />
                )}


            </div>

        </div>

    );

}
