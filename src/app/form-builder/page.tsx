"use client";

import { supabase } from "@/lib/supabaseClient"; 

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from 'next/image'

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import FormBuilderArea from "@/components/builder/FormBuilderArea";
import Sidebar from "@/components/builder/Sidebar";
import { FormBuilderElement, FormElementFactory } from "@/components/builder/FormBuilderElement";

import { FaEdit, FaEye, FaPlay, FaSave, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FaGear, FaSheetPlastic } from "react-icons/fa6";

import { useRouter } from "next/navigation";
import { UUID } from "crypto";


type Form = {
    id: UUID;
    author: UUID;
    name: string;
    formName: string;
    created_at: string;
};

export default function FormBuilderPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const formId = searchParams.get("id"); // Get form ID from URL

    const [activeTab, setActiveTab] = useState<string>("edit");
    const [selectedElement, setSelectedElement] = useState<FormBuilderElement | null>(null);
    const [formName, setFormName] = useState<string>("");
    const [formMatrix, setFormMatrix] = useState<FormBuilderElement[][]>([]);


    // Redirect based on whether user is logged in
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (!session) {
                router.push("/");
            }
        });
        return () => {
            authListener.subscription.unsubscribe(); // Cleanup listener
        };
    }, [router]);

    // Load Form (when page has finished loading)
    useEffect(() => {
        const loadForm = async () => {
            if (!formId) return; // If no ID, it's a new form

            const { data, error } = await supabase
                .from("forms")
                .select("*")
                .eq("id", formId)
                .single();

            if (error) {
                console.error("Error loading form:", error.message);
                return;
            }

            if (data) {
                setFormName(data.name);
                setFormMatrix(data.json);
            }
        };

        loadForm();
    }, [formId]); // Run effect when `formId` changes

  
    // Save Form (for Save button pressed)
    const saveForm = async () => {
        if (!formName) {
            alert("Form name is required!");
            return;
        }

        let response;
        if (formId) {
            // Update Existing Form
            response = await supabase.from("forms").update({
                'name': formName,
                'json': formMatrix,
                'edited_at': new Date().toISOString()
            }).eq("id", formId);
        } else {
            // Insert New Form
            response = await supabase.from("forms").insert([{
                'name': formName,
                'json': formMatrix,
            }]);
        }

        if (response.error) {
            alert("Error saving form: " + response.error.message);
        } else {
            alert("Form saved successfully!");
            router.push("/forms"); // Redirect after saving
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

            <div className="flex p-4 gap-4 items-center">
                <Image
                    src="/logo.png"
                    alt=""
                    width="75"
                    height="100"
                    quality={100}
                />
                <div className="mr-auto text-xl font-bold">Insurance Clouds™</div>
                {/*<Image
                    src="/account.png"
                    alt=""
                    width="50"
                    height="50"
                    quality={100}
                />*/}
                <div className="flex flex-row gap-2">
                    <button 
                        className="flex bg-green-500 text-white font-bold text-sm rounded-lg py-2 px-4 items-center gap-2"
                        onClick={()=> {router.push("/forms");}}    
                    >
                        <FaSheetPlastic />
                        Forms
                    </button>
                    <button className="flex bg-blue-500 text-white text-sm font-bold  rounded-lg py-2 px-4 items-center gap-2">
                        <FaUserCircle />
                        Account
                    </button>
                    <button 
                        className="flex bg-red-500 text-white text-sm font-bold  rounded-lg py-2 px-4 items-center gap-2"
                        onClick={()=>{supabase.auth.signOut()}}
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                </div>
                
            </div>

            {/* Row of Buttons: Edit, JSON .... Preview, Save */}
            <div className="flex items-end bg-gray-300">
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
