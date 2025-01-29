import React, { useRef } from "react";
import { useDrag } from "react-dnd";

const elements = [
  { type: "input", label: "Name", inputType: "text" },
  { type: "input", label: "Email", inputType: "email" },
  { type: "input", label: "Phone", inputType: "phone" },
  { type: "textarea", label: "Text Field", placeholder: "Enter text here..." },
  { type: "select", label: "Dropdown", options: ["Option 1", "Option 2"] },
  { type: "radio", label: "Radio Buttons", options: ["Yes", "No"] },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      <h2 className="text-lg font-bold">Form Elements</h2>
      {elements.map((el, index) => (
        <DraggableElement key={index} element={el} />
      ))}
    </div>
  );
};

interface DraggableElementProps {
  element: any;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ element }) => {

  const dragRef = useRef<HTMLDivElement>(null);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FORM_ELEMENT",
    item: element, // Just pass the element, id will be assigned in FormArea.tsx
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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

export default Sidebar;
