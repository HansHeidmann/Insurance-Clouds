import React from "react";
import { useDrag } from "react-dnd";
import { FormElement } from "./types";
import { useRef } from "react";

const elements: Omit<FormElement, "id">[] = [
  { type: "input", label: "Name", inputType: "text" },
  { type: "input", label: "Email", inputType: "email" },
  { type: "input", label: "Phone", inputType: "phone" },
  { type: "textarea", label: "Text Field", placeholder: "Enter text here..." },
  { type: "select", label: "Dropdown", options: ["Option 1", "Option 2"] },
  { type: "radio", label: "Radio Buttons", options: ["Yes", "No"] },
];

const SidebarElements: React.FC = () => {
  return (
    <div>
      <h2 className="text-lg font-bold">Form Elements</h2>
      {elements.map((el, index) => (
        <DraggableElement key={index} element={el} />
      ))}
    </div>
  );
};

interface DraggableElementProps {
  element: Omit<FormElement, "id">;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: element,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <div
      ref={dragRef} 
      className={`p-2 m-2 border rounded bg-white cursor-pointer ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {element.label}
    </div>
  );
};

export default SidebarElements;
