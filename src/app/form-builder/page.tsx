"use client";

import React, { useState, useEffect } from "react";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import FormBuilderArea from "@/components/builder/FormBuilderArea";
import Sidebar from "@/components/builder/Sidebar";
import { FormBuilderElement, FormElementFactory } from "@/components/builder/FormBuilderElement";

import Image from 'next/image'
import { FaEdit, FaEye, FaPlay, FaSave } from "react-icons/fa";

/* TODO 

Builder:
- show all correct property labels for each element type
- and and remove buttons for multiple selection properties
- save json to db
- load json from db
- drag and drop

Viewer:
- gray dotted bg
- white rounded rect for viewer
- parse the json into a Form Matrix
- map the Form Matrix to HTML elements

*/

export default function FormBuilderPage() {

    const [selectedElement, setSelectedElement] = useState<FormBuilderElement | null>(null);
    const [formName, setFormName] = useState<string>("");
    const [formMatrix, setFormMatrix] = useState<FormBuilderElement[][]>([]);

    const [form, setForm] = useState<{ formName: string; formMatrix: FormBuilderElement[][] }>({
        formName: "",
        formMatrix: [],
    });
    useEffect(() => {
        setForm({ formName: formName || "", formMatrix });
    }, [formName, formMatrix]);


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
        setSelectedElement(newElement);
        setFormMatrix(prevMatrix => [...prevMatrix, [newElement]]);
    };

    const addColumn = (rowIndex: number) => {
        setFormMatrix(prevMatrix => {
            const newMatrix = [...prevMatrix];
            const newElement: FormBuilderElement = FormElementFactory.getDefaultProperties("undefined");
            setSelectedElement(newElement);
            newMatrix[rowIndex] = [...newMatrix[rowIndex], newElement];
            return newMatrix;
        });
    };


    return (
        <div className="h-screen flex flex-col flex-1">

            <div className="flex p-4 gap-4 items-center">
                <Image
                    src="/logo.png"
                    alt=""
                    width="75"
                    height="100"
                    quality={100}
                />
                <div className="text-xl font-bold">Insurance Clouds™</div>
            </div>

            {/* Row of Buttons: Edit, JSON .... Preview, Save */}
            <div className="flex items-end bg-gray-200">
                <button
                    onClick={() => {
                        //
                    }
                    }
                    className="flex items-center ml-4 px-8 py-2 rounded-t-xl gap-2 bg-indigo-400 hover:bg-blue-300 text-white text-md  drop-shadow-md"
                >
                    <FaEdit />
                    <div>Edit</div>  
                </button>
                <button
                    onClick={() => {
                        //
                    }
                    }
                    className="mr-auto flex items-center px-8 py-2 rounded-t-xl gap-2 bg-black hover:bg-blue-300 text-green-300 text-md  drop-shadow-md"
                >
                    <FaEye />JSON
                </button>
                <button
                    onClick={() => {
                        //
                    }
                    }
                    className="ml-auto flex items-center gap-2 hover:bg-purple-300 text-white font-bold text-md  drop-shadow-md p-4"
                >
                    <FaPlay />Preview  
                </button>
                <button
                    onClick={() => {
                        //
                    }
                    }
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-300 text-white font-bold text-md  drop-shadow-md p-4"
                >
                    <FaSave />Save
                </button>

            </div>
            <div className="flex flex-1">

                {/* Sidebar (Fixed Width) */}
                <div className="w-[380px] min-w-[380px] bg-white flex flex-col h-full overflow-y-auto">
                    <Sidebar selectedElement={selectedElement} updateElement={updateElement} />
                </div>

                {/* Form Builder Area (Flexible Width - Takes Up Remaining Space) */}
                <div className="flex-grow  h-full overflow-y-auto bg-gray-300 p-8 bg-[url('/builder_bg_tile.jpg')] bg-repeat bg-[length:25px]">
                    <DndProvider backend={HTML5Backend}>
                        <FormBuilderArea
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

                {/* JSON Viewer (Fixed Width) */}
                <div className="w-[400px] bg-black p-8 h-full overflow-y-auto">
                    <pre className="text-green-400 text-xl font-bold">JSON</pre>
                    <pre className="whitespace-pre-wrap text-sm text-green-400">
                        {JSON.stringify(form, null, 2)}
                    </pre>
                </div>
            </div>

        </div>

    );

}
