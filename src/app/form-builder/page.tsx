"use client";

import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
//import FormBuildArea from "@/components/builder/FormBuildArea";
import { FormBuilderElement } from "@/components/builder/types";

import FormBuilderArea from "@/components/builder/FormBuilderArea"; 
import Sidebar from "@/components/builder/Sidebar";
import { v4 as uuidv4 } from "uuid";

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
  };

  const deleteElement = (rowIndex: number, colIndex: number) => {
    setFormMatrix(prevMatrix => {
      const newMatrix =  [...prevMatrix];
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
      const newMatrix =  structuredClone(prevMatrix);
      if (!newMatrix[rowIndex][colIndex]) {
        console.log("bad access");
        return newMatrix;
      }
      if (direction === "left") {
        if (colIndex > 0) {
          console.log("left");
          const tempElement = newMatrix[rowIndex][colIndex-1];
          newMatrix[rowIndex][colIndex-1] = newMatrix[rowIndex][colIndex]
          newMatrix[rowIndex][colIndex] = tempElement;
        }
      }
      if (direction === "right") {
        if (colIndex < newMatrix[rowIndex].length-1) {
          console.log("right");
          const tempElement = newMatrix[rowIndex][colIndex+1];
          newMatrix[rowIndex][colIndex+1] = newMatrix[rowIndex][colIndex]
          newMatrix[rowIndex][colIndex] = tempElement;
        }
      }

      return newMatrix;
    })
  }

  const addRow = () => {
    setFormMatrix(prevMatrix => [...prevMatrix, [{ id: uuidv4(), type:"textbox", label: "Field Title", placeholder: "Placeholder" }]]);
  };

  const addColumn = (rowIndex: number) => {
    setFormMatrix(prevMatrix => {
      const newMatrix = [...prevMatrix];
      const newElement: FormBuilderElement = { id: uuidv4(), type: "textbox", label: "Field Title", placeholder: "Placeholder" }
      newMatrix[rowIndex] = [...newMatrix[rowIndex], newElement];
      setSelectedElement(newElement)
      return newMatrix;
    });
  };


  return (
    <div className="h-screen flex flex-1">
      <DndProvider backend={HTML5Backend}>
      
          
          {/* Sidebar (Fixed Width) */}
          <div className="w-[380px] min-w-[380px] p-8 bg-gray-50 flex flex-col h-full overflow-y-auto">
            <Sidebar selectedElement={selectedElement} updateElement={updateElement} />
          </div>

          {/* Form Builder Area (Flexible Width - Takes Up Remaining Space) */}
          <div className="flex-grow  h-full overflow-y-auto bg-gray-300 p-8 bg-[url('/builder_bg_tile.jpg')] bg-repeat bg-[length:25px]">
            <FormBuilderArea
              setFormName={setFormName}
              formMatrix={formMatrix}
              setSelectedElement={setSelectedElement}
              deleteElement={deleteElement}
              moveElement={moveElement}
              addRow={addRow}
              addColumn={addColumn}
            />
          </div>

          {/* JSON Viewer (Fixed Width) */}
          <div className="w-[400px] bg-black p-8 h-full overflow-y-auto">
            <pre className="text-green-400 text-xl font-bold">JSON</pre>
            <pre className="whitespace-pre-wrap text-sm text-green-400">
              {JSON.stringify(form, null, 2)}
            </pre>
          </div>

      </DndProvider>
    </div>

  );
  
}
