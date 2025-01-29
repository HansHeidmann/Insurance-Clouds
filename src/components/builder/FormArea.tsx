import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import FormElementComponent from "./FormElement";
import { FormElement } from "./types";

interface FormAreaProps {
  formElements: FormElement[];
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
}

const FormArea: React.FC<FormAreaProps> = ({ formElements, setFormElements }) => {
  const dropRef = useRef<HTMLDivElement>(null);

  // Accept new elements from Sidebar and add them to the form
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_ELEMENT",
    drop: (item: Omit<FormElement, "id">) => {
      const newElement: FormElement = { ...item, id: uuidv4() };
      setFormElements((prevElements) => [...prevElements, newElement]);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`w-3/4 p-4 border min-h-screen ${isOver ? "bg-green-100" : "bg-white"}`}
    >
      <h2 className="text-lg font-bold">Form Workspace</h2>
      {formElements.length === 0 && <p className="text-gray-400">Drag elements here</p>}
      {formElements.map((element, index) => (
        <FormElementComponent
          key={element.id}
          element={element}
          index={index}
          setFormElements={setFormElements}
        />
      ))}
    </div>
  );
};

export default FormArea;
