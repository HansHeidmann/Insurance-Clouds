import React from "react";

interface FormElementProps {
  element: any;
  index: number;
  setFormElements: React.Dispatch<React.SetStateAction<any[]>>;
}

const FormElementComponent: React.FC<FormElementProps> = ({ element, index, setFormElements }) => {
  const removeElement = () => {
    setFormElements((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-center p-2 border rounded my-2 bg-gray-50">
      <button onClick={removeElement} className="text-red-500 mr-2">X</button>
      {element.type === "input" && (
        <input type={element.inputType} placeholder={element.label} className="p-1 border" />
      )}
      {element.type === "textarea" && <textarea placeholder={element.placeholder} className="p-1 border w-full" />}
      {element.type === "select" && (
        <select className="p-1 border">
          {element.options.map((option: string, idx: number) => (
            <option key={idx}>{option}</option>
          ))}
        </select>
      )}
      {element.type === "radio" && (
        <div>
          {element.options.map((option: string, idx: number) => (
            <label key={idx} className="mr-2">
              <input type="radio" name={`radio-${element.id}`} /> {option}
            </label>
          ))}
        </div>
      )}
      
    </div>
  );
};

export default FormElementComponent;
