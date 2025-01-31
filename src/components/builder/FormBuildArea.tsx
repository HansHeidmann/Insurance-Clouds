import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import FormElementComponent from "./FormElement";
import { FormElement } from "./types";

interface FormBuildAreaProps {
  formElements: FormElement[];
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
  setSelectedElement: (element: FormElement | null) => void;
  setActiveTab: (tab: "elements" | "editor") => void; // Ensure this prop is passed
}

const FormBuildArea: React.FC<FormBuildAreaProps> = ({
  formElements,
  setFormElements,
  setSelectedElement,
  setActiveTab,
}) => {
  

  // Accept new elements from Sidebar and add them to the form
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_ELEMENT",
    drop: (item: Omit<FormElement, "id">) => {
      const newElement: FormElement = { ...item, id: uuidv4() };
      setFormElements((prevElements) => [...prevElements, newElement]);
      setSelectedElement(item)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const dropRef = useRef<HTMLDivElement>(null);
  drop(dropRef);

  return (
    <div ref={dropRef} className={`w-3/4 p-4 border min-h-screen ${isOver ? "bg-green-100" : "bg-white"}`}>
      <h2 className="text-lg font-bold">Form Builder</h2>
      {formElements.length === 0 && <p className="text-gray-400">Drag elements here</p>}
      {formElements.map((element, index) => (
        <FormElementComponent
          key={element.id}
          element={element}
          index={index}
          setFormElements={setFormElements}
          setSelectedElement={setSelectedElement} // Pass selection function
          setActiveTab={setActiveTab} // Pass tab switch function
        />
      ))}
    </div>
  );
};

export default FormBuildArea;
