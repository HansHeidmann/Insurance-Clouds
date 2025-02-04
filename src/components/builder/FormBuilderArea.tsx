import React from "react";
import { FormBuilderElement } from "./types";
import { FaEdit, FaPlusCircle, FaTrash } from "react-icons/fa";

interface FormBuilderProps {
  setFormName: (element: string) => void;
  formMatrix: FormBuilderElement[][];
  setSelectedElement: (element: FormBuilderElement) => void;
  deleteElement: (rowIndex: number, colIndex: number) => void;
  addRow: () => void;
  addColumn: (rowIndex: number) => void;
}

const FormBuilderArea: React.FC<FormBuilderProps> = ({ setFormName, formMatrix, setSelectedElement, deleteElement, addRow, addColumn }) => {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-md">
      <div>
        <input 
          className="text-2xl mb-8 pl-3 py-2 border-gray-200 border-2 rounded-lg"
          placeholder="Form Name"
          onChange={(e)=> setFormName(e.target.value)}
        >
        </input>
      </div>
      
      {formMatrix.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-4">
          {row.map((element, colIndex) => (
            <div key={element.id || `${rowIndex}-${colIndex}`} className="bg-white p-4 drop-shadow-md rounded-lg">
              <div className="space-x-2">
                <label className="font-medium text-lg ">{element.label}</label>
                
                <button 
                  onClick={() => setSelectedElement(element)} 
                  className="bg-indigo-500 hover:bg-blue-300 text-white text-sm  drop-shadow-md rounded-lg p-2"
                >
                    <FaEdit />
                </button>
                <button
                  className="bg-red-500 hover:bg-red-300 text-white text-sm drop-shadow-md rounded-lg p-2"
                  onClick={() => deleteElement(rowIndex, colIndex)}
                >
                  <FaTrash />
                </button>
              </div>
              <div>
                <input className="rounded-md" disabled placeholder={element.placeholder}></input>
              </div>
              
            </div>
          ))}
          <button 
            onClick={() => addColumn(rowIndex)} 
            className="bg-green-400 p-4 text-white text-sm drop-shadow-md rounded-lg"
          >
            <FaPlusCircle />
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="bg-green-400 p-4 text-white text-sm drop-shadow-md rounded-lg"
      >
        <FaPlusCircle />
      </button>
        
        
      {/* Big Buttons */}
      <div className="flex justify-center space-x-4 mt-16">
        <button className="bg-yellow-500 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
          View
        </button>
        <button className="bg-blue-500 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
          Save
        </button>
      </div>



    </div>


  );
};

export default FormBuilderArea;
