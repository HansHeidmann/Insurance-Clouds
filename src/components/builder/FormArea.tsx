import React from "react";
import { useDrop } from "react-dnd";
import FormElementComponent from "./FormElement";
import { v4 as uuidv4 } from "uuid";

interface FormAreaProps {
  formElements: any[];
  setFormElements: React.Dispatch<React.SetStateAction<any[]>>;
}

const FormArea: React.FC<FormAreaProps> = ({ formElements, setFormElements }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_ELEMENT",
    drop: (item: any) => {
      // Assign a unique ID to each new dropped element
      const newElement = { ...item, id: uuidv4() };
      setFormElements((prevElements) => [...prevElements, newElement]); // 🔥 FIX: Add to existing state
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`w-3/4 p-4 border min-h-screen ${
        isOver ? "bg-green-100" : "bg-white"
      }`}
    >
      <h2 className="text-lg font-bold">Form Workspace</h2>
      {formElements.length === 0 && <p className="text-gray-400">Drag elements here</p>}
      {formElements.map((element, index) => (
        <FormElementComponent key={element.id} element={element} index={index} setFormElements={setFormElements} />
      ))}
    </div>
  );
};

export default FormArea;
