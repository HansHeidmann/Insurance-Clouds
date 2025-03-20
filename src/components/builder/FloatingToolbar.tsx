import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaTrash, FaEdit } from "react-icons/fa";

interface FloatingToolbarProps {
    selectedElementRef: React.RefObject<HTMLDivElement> | null;
    onDelete: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ selectedElementRef, onDelete }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (!selectedElementRef?.current) return;

        // Get the selected element's position
        const rect = selectedElementRef.current.getBoundingClientRect();
        setPosition({
            top: rect.top + window.scrollY - 40, // 10px above + toolbar height
            left: rect.left + window.scrollX + rect.width / 2 - 50, // Centered horizontally
        });

    }, [selectedElementRef]);

    return createPortal(
        <div
            style={{
                position: "absolute",
                top: `${position.top}px`,
                left: `${position.left}px`,
                background: "white",
                padding: "8px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                zIndex: 1000,
            }}
            className="flex gap-2"
        >
            <button className="bg-blue-500 text-white p-2 rounded-md">
                <FaEdit /> Edit
            </button>
            <button onClick={onDelete} className="bg-red-500 text-white p-2 rounded-md">
                <FaTrash /> Delete
            </button>
        </div>,
        document.body // Renders outside of the normal component tree
    );
};

export default FloatingToolbar;
