import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FormElement } from "./types";
import { FaTrash, FaGripVertical, FaEdit } from "react-icons/fa";

interface FormElementProps {
  element: FormElement;
  index: number;
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
  setSelectedElement: (element: FormElement | null) => void;
  setActiveTab: (tab: "elements" | "editor") => void;
}

const FormElementComponent: React.FC<FormElementProps> = ({
  element,
  index,
  setFormElements,
  setSelectedElement,
  setActiveTab,
}) => {
  

  // Drag Logic
  const [{ isDragging }, drag] = useDrag({
    type: "FORM_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);

  // Drop Logic (Handles Reordering)
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_ITEM",
    hover: (draggedItem: { index: number }) => {
      if (!ref.current || draggedItem.index === index) return;

      setFormElements((prevElements) => {
        const updatedElements = [...prevElements];
        const [movedItem] = updatedElements.splice(draggedItem.index, 1);
        updatedElements.splice(index, 0, movedItem);

        draggedItem.index = index;
        return updatedElements;
      });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);
  drag(ref); // Whole element is draggable

  return (
    <div ref={ref} className="cursor-grab">
      <div
        className={`flex items-center justify-between p-2 border rounded my-2 bg-gray-50 ${
          isOver ? "bg-gray-300" : "bg-gray-50"
        }`}
        style={{
          opacity: isDragging ? 0.5 : 1, // Smooth dragging effect
          transition: "none", // No floating animation
        }}
      >
        {/* Move Icon */}
        <button className="mx-1 p-2 bg-purple-200 hover:bg-gray-300 rounded cursor-grab">
          <FaGripVertical className="text-gray-600" />
        </button>

        {/* Edit Button */}
        <button
          className="mx-1 p-2 bg-blue-200 hover:bg-blue-300 rounded"
          onClick={() => {
            setSelectedElement(element);
            setActiveTab("editor");
          }}
        >
          <FaEdit className="text-blue-600" />
        </button>

        <div className="flex flex-col w-full px-2">
          {/* Bold Label */}
          <label className="font-bold mb-1">{element.label}</label>

          {/* Correctly Render Form Fields */}
          {element.type === "input" && (
            <input type={element.inputType} placeholder={element.label} className="p-1 border w-full rounded" />
          )}

          {element.type === "textarea" && (
            <textarea placeholder={element.placeholder} className="p-1 border w-full rounded" />
          )}

          {element.type === "select" && (
            <select className="p-1 border w-full rounded">
              {element.options?.map((option, idx) => (
                <option key={idx}>{option}</option>
              ))}
            </select>
          )}

          {element.type === "radio" && (
            <div className="w-full">
              {element.options?.map((option, idx) => (
                <label key={idx} className="mr-2 flex items-center">
                  <input type="radio" name={`radio-${element.id}`} className="mr-1" /> {option}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Trash Bin Icon (Delete) */}
        <button
          onClick={() => setFormElements((prev) => prev.filter((_, i) => i !== index))}
          className="mx-1 p-2 bg-red-200 hover:bg-gray-300 rounded text-red-500 hover:text-red-700 transition"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default FormElementComponent;
