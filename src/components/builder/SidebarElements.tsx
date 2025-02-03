import React from "react";
import { useDrag } from "react-dnd";
import { FormElement } from "./types";
import { useRef } from "react";
import { FaGripVertical } from "react-icons/fa";

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
      <h2 className="text-lg font-bold my-3">Add Field</h2>
      <div className="flex flex-wrap gap-2">
        {elements.map((el, index) => (
          <DraggableElement key={index} element={el} />
        ))}
      </div>
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
      className={`p-3 min-w-[180px] border rounded-3xl bg-white cursor-grab flex items-center gap-x-2 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <FaGripVertical className="text-gray-700 ml-1.5" />
      <span className="font-semibold pt-0.5">{element.label}</span>
    </div>
    
  );
};

export default SidebarElements;
