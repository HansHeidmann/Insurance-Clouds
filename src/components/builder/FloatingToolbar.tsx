import React, { useState } from "react";
import {
    FaCaretLeft,
    FaCaretRight,
    FaArrowLeft,
    FaArrowRight,
    FaGripLinesVertical,
    FaEyeSlash,
} from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaXmark } from "react-icons/fa6";

import ActionSheet from "../ui/ActionSheet";
import { FormBuilderElement } from "./FormBuilderElement";



interface FloatingToolbarProps {
    x: number;
    y: number;
    deleteElement: () => void;
    moveElement: (direction: string) => void;
    selectElement: (element: FormBuilderElement | null) => void;
    selectedElement: FormBuilderElement | null;
    updateElement: (updatedElement: FormBuilderElement) => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({x, y, selectElement, selectedElement, deleteElement, moveElement, updateElement}) => {

    const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);
        
    return (
        <div
            style={{
                position: "absolute",
                top: `${y}px`,
                left: `${x}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 100,
            }}
            className="flex items-center bg-white border border-gray-300 rounded-xl shadow-xl px-3 py-2 space-x-2 transition-all"
        >

            {/* Hide Toolbar Button */}
            <button
                    onClick={() => {
                        selectElement(null);
                    }}
                    className="p-2 rounded-md transition-colors hover:bg-gray-600 hover:text-white"
                    title="Hide Toolbar"
            >
                <FaEyeSlash className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Move Left */}
            <button
                    onClick={()=>{moveElement("left")}}
                    className="p-2 rounded-md transition-colors hover:bg-blue-500 hover:text-white"
                    title="Move Left"
            >
                <FaCaretLeft className="w-4 h-4" />
            </button>

            {/* Move Right */}
            <button
                onClick={()=>{moveElement("right")}}
                className="p-2 rounded-md transition-colors hover:bg-blue-500 hover:text-white"
                title="Move Right"
            >
                <FaCaretRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Expand */}
            <button
                onClick={()=>
                    {
                        selectedElement!.widthCSS = "w-increaseBy25Percent"
                        updateElement(selectedElement!)
                    }}
                className="p-2 rounded-md transition-colors hover:bg-indigo-500 hover:text-white"
                title="Expand"
            >
                <FaArrowsLeftRightToLine className="w-4 h-5" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Shrink */}
            <button
                onClick={()=>
                    {
                        selectedElement!.widthCSS = "w-decreaseBy25Percent"
                        updateElement(selectedElement!)
                    }}
                className="p-2 rounded-md flex items-center transition-colors hover:bg-purple-400 hover:text-white"
                title="Shrink"
            >
                <FaArrowRight className="w-2 h-2" />
                <FaGripLinesVertical className="w-2.5 h-2.5 " />
                <FaArrowLeft className="w-2 h-2" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-gray-300 mx-1" />

            {/* Delete */}
            <button
                onClick={()=>setShowDeleteActionSheet(true)}
                className="p-2 rounded-md text-black-600 transition-colors hover:bg-red-500 hover:text-white"
                title="Delete"
            >
                <FaXmark className="w-4 h-4 subpixel-antialiased" />
            </button>

            <ActionSheet
                visible={showDeleteActionSheet}
                title="Delete Field?"
                description="Are you sure you want to remove the selected field?"
                warning = "This action is permanent"

                primaryLabel = "Delete"
                primaryButtonColorCSS = "bg-red-500"
                primaryButtonColorHoverCSS = "hover:bg-red-400"
                primaryAction = {() => {
                    deleteElement();
                    setShowDeleteActionSheet(false);
                }}

                secondaryLabel = "Cancel"
                secondaryButtonColorCSS = "bg-gray-300"
                secondaryButtonColorHoverCSS = "hover:bg-gray-200"
                secondaryAction = {() => {
                    setShowDeleteActionSheet(false);
                }}
            />
          

        </div>
        
    );
};

export default FloatingToolbar;
