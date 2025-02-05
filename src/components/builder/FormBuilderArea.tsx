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

            <div key={element.id || `${rowIndex}-${colIndex}`} className="bg-white p-4 drop-shadow-lg rounded-lg space-y-2 border-blue-300 border-2">
             
              {/* Label and Buttons */}
              <div className="flex justify-between bg-blue-200">
                <div className="flex items-end bg-yellow-200">
                  <label className="text-md -mb-1.5">{element.label}</label>
                  <label className="text-xl -mb-1.5 text-red-500">*</label>
                </div>
                <div className="pl-4 space-x-2">
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
              </div>

              {/* Inputs Preview */}
              <div>
                <input className="rounded-md text-lg" disabled placeholder={element.placeholder}></input>
              </div>
              
            </div>
          ))}
          <button 
            onClick={() => addColumn(rowIndex)} 
            className="bg-green-400 hover:bg-green-200 h-min p-4 text-white text-sm drop-shadow-md rounded-lg"
          >
            <FaPlusCircle />
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="bg-green-400 hover:bg-green-200 w-min p-4 text-white text-sm drop-shadow-md rounded-lg"
      >
        <FaPlusCircle />
      </button>
        
        
      {/* Big Buttons */}
      <div className="flex justify-center space-x-4 mt-16">
        <button className="bg-orange-500 hover:bg-orange-300 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
          View
        </button>
        <button className="bg-blue-500  hover:bg-blue-300 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
          Save
        </button>
      </div>



    </div>


  );
};

export default FormBuilderArea;
