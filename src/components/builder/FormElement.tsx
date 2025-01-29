import React from "react";
import { FormElement } from "./types";  // ✅ Import FormElement type

interface FormElementProps {
  element: FormElement;
  index: number;
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
}

const FormElementComponent: React.FC<FormElementProps> = ({ element, index, setFormElements }) => {
  const removeElement = () => {
    setFormElements((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center p-2 border rounded my-2 bg-gray-50">
      {element.type === "input" && (
        <input type={element.inputType} placeholder={element.label} className="p-1 border" />
      )}
      {element.type === "textarea" && <textarea placeholder={element.placeholder} className="p-1 border w-full" />}
      {element.type === "select" && (
        <select className="p-1 border">
          {element.options?.map((option, idx) => (
            <option key={idx}>{option}</option>
          ))}
        </select>
      )}
      {element.type === "radio" && (
        <div>
          {element.options?.map((option, idx) => (
            <label key={idx} className="mr-2">
              <input type="radio" name={`radio-${element.id}`} /> {option}
            </label>
          ))}
        </div>
      )}
      <button onClick={removeElement} className="ml-4 text-red-500">X</button>
    </div>
  );
};

export default FormElementComponent;
