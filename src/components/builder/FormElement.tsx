import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FormElement } from "./types";
import { FaTrash, FaGripVertical } from "react-icons/fa";

interface FormElementProps {
  element: FormElement;
  index: number;
  setFormElements: React.Dispatch<React.SetStateAction<FormElement[]>>;
}

const FormElementComponent: React.FC<FormElementProps> = ({ element, index, setFormElements }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Drag logic (Only Draggable from the Move Icon)
  const [{ isDragging }, drag] = useDrag({
    type: "FORM_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop logic (Handles Reordering)
  const [{ isOver }, drop] = useDrop({
    accept: "FORM_ITEM",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        setFormElements((prevElements) => {
          const updatedElements = [...prevElements];
          const [movedItem] = updatedElements.splice(draggedItem.index, 1);
          updatedElements.splice(index, 0, movedItem);
          return updatedElements;
        });

        draggedItem.index = index;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  drop(ref);
  const dragRef = useRef<HTMLButtonElement>(null);
  drag(dragRef); // Make only the move button draggable

  return (
    <div>
      <div
        ref={ref}
        className={`flex items-center justify-between p-2 border rounded my-2 bg-gray-50 transition ${
          isDragging ? "opacity-0" : isOver ? "bg-gray-300" : "bg-gray-50"
        }`}
        style={{ display: isDragging ? "none" : "flex" }} // Hide while dragging
      >
        {/* Move/Drag Icon (Draggable) */}
        <button
          ref={dragRef}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded cursor-grab"
          aria-label="Move element"
        >
          <FaGripVertical className=" text-gray-600" />
        </button>
        

        <div className="flex flex-col w-full px-2">
          {/* Bold Label */}
          <label className="font-bold mb-1">{element.label}</label>

          {element.type === "input" && (
            <input type={element.inputType} placeholder={element.label} className="p-1 border w-full" />
          )}
          {element.type === "textarea" && <textarea placeholder={element.placeholder} className="p-1 border w-full" />}
          {element.type === "select" && (
            <select className="p-1 border w-full">
              {element.options?.map((option, idx) => (
                <option key={idx}>{option}</option>
              ))}
            </select>
          )}
          {element.type === "radio" && (
            <div className="w-full">
              {element.options?.map((option, idx) => (
                <label key={idx} className="mr-2">
                  <input type="radio" name={`radio-${element.id}`} className="mr-1" /> {option}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Trash Bin Icon (Delete) */}
        <button
          onClick={() => setFormElements((prev) => prev.filter((_, i) => i !== index))}
          className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-red-500 hover:text-red-700 transition"
          aria-label="Remove element"
        >
          <FaTrash className="" />
        </button>
      </div>
    </div>
  );
};

export default FormElementComponent;
