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
            <div key={element.id || `${rowIndex}-${colIndex}`} className="bg-gray-200 p-1 drop-shadow-md rounded-lg">
              <label>{element.label}</label>
              {element.type === "input" && (
                <input
                  type={element.inputType}
                  placeholder={element.placeholder}
                  required={element.required}
                />
              )}
              {element.type === "select" && (
                <select required={element.required}>
                  {element.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              {element.type === "checkbox" && <input type="checkbox" required={element.required} />}
              <button 
                onClick={() => setSelectedElement(element)} 
                className="bg-blue-500 hover:bg-blue-300 text-white text-sm  drop-shadow-md rounded-lg p-2 m-2"
              >
                  <FaEdit />
              </button>
              <button
                className="bg-red-500 hover:bg-red-300 text-white text-sm drop-shadow-md rounded-lg p-2 m-2"
                onClick={() => deleteElement(rowIndex, colIndex)}
              >
                <FaTrash />
              </button>
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
    </div>
  );
};

export default FormBuilderArea;
