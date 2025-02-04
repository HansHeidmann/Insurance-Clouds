"use client";

import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
//import FormBuildArea from "@/components/builder/FormBuildArea";
import { FormBuilderElement } from "@/components/builder/types";

import FormBuilderArea from "@/components/builder/FormBuilderArea"; 
import Sidebar from "@/components/builder/Sidebar";

export default function FormBuilderPage() {

  const [selectedElement, setSelectedElement] = useState<FormBuilderElement | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formMatrix, setFormMatrix] = useState<FormBuilderElement[][]>([]);

  const [form, setForm] = useState<{ formName: string; formMatrix: FormBuilderElement[][] }>({
    formName: "",
    formMatrix: [],
  });
  useEffect(() => {
    setForm({ formName: formName || "", formMatrix }); // Default to "" if undefined
  }, [formName, formMatrix]);


  const updateElement = (updatedElement: FormBuilderElement) => {
    setFormMatrix(prevMatrix => {
      return prevMatrix.map(row =>
        row.map(element => (element.id === updatedElement.id ? updatedElement : element))
      );
    });
  };

  const deleteElement = (rowIndex: number, colIndex: number) => {
    setFormMatrix(prevMatrix => {
      const newMatrix =  [...prevMatrix];
      newMatrix[rowIndex] = newMatrix[rowIndex].filter((_, index) => index !== colIndex);
      if (newMatrix[rowIndex].length === 0) {
        newMatrix.splice(rowIndex, 1);
      }
      return newMatrix;
    });
  };

  const addRow = () => {
    setFormMatrix(prevMatrix => [...prevMatrix, [{ id: `${Date.now()}`, type: "undefined", label: "" }]]);
  };

  const addColumn = (rowIndex: number) => {
    setFormMatrix(prevMatrix => {
      const newMatrix = [...prevMatrix];
      newMatrix[rowIndex] = [...newMatrix[rowIndex], { id: `${Date.now()}`, type: "undefined", label: "" }];
      return newMatrix;
    });
  };


  return (
    <div className="h-screen flex flex-col">

      {/* Top Row: Tabs on Left, Buttons on Right */}
      <div className="flex items-center bg-gray-200 px-4 py-3 justify-between">
        
        {/* Buttons on the Right */}
        <div className="flex space-x-4">
          <button className="bg-purple-500 rounded-lg py-3 px-6 shadow font-sans text-lg font-semibold text-white">
            Preview Form
          </button>
          <button className="bg-green-500 rounded-lg py-3 px-6 shadow font-sans text-lg font-semibold text-white">
            Save Form
          </button>
        </div>
      </div>
  
      <DndProvider backend={HTML5Backend}>
        <div className="flex flex-1">
  
          {/* Sidebar */}
          <div className="w-1/4 p-8 min-w-[400px] bg-white flex flex-col h-full overflow-auto">
            <Sidebar
              selectedElement={selectedElement}
              updateElement={updateElement}
            />
            
          </div>
              
          {/* Form Builder Area */}
          <div className="w-1/2 bg-gray-300 p-8 bg-[url('/builder_bg_tile.jpg')] bg-repeat bg-[length:25px]">
 
            <FormBuilderArea
              setFormName={setFormName}
              formMatrix={formMatrix}
              setSelectedElement={setSelectedElement}
              deleteElement={deleteElement}
              addRow={addRow}
              addColumn={addColumn}
            />
          </div>

          {/* JSON Viewer */}
          <div className="w-1/4 bg-black p-8">
            <pre className="text-green-400 text-xl font-bold">JSON</pre>
            <pre className="whitespace-pre-wrap text-sm text-green-400">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>

          
        </div>
      </DndProvider>
    </div>
  );
  
}
