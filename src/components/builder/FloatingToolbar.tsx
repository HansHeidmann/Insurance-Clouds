import React, { useState } from "react";
import {
    FaCaretLeft,
    FaCaretRight,
    FaEyeSlash,
    FaCut,
    FaCopy,
    FaPaste,
    FaRegCopy,
    FaRegHandScissors,
} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong, FaArrowsLeftRightToLine, FaRegPaste, FaScissors, FaXmark } from "react-icons/fa6";

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
    justifyRowElements: () => void;
    cutElement: () => void;
    copyElement: () => void;
    pasteElement: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    x, y, selectElement, selectedElement, deleteElement, moveElement, updateElement, justifyRowElements,
    cutElement, copyElement, pasteElement
}) => {

    const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);

    const buttonBaseStyle = "p-2 flex flex-col items-center rounded-md transition-colors text-xs";
    const iconSize = "w-4 h-4 mb-1";

    return (
        <div
            style={{
                position: "absolute",
                top: `${y}px`,
                left: `${x}px`,
                transform: "translate(-50%, -100%)",
                zIndex: 100,
            }}
            className="flex items-center bg-white border border-gray-300 rounded-xl shadow-xl transition-all p-1"
        >

            {/* Hide Toolbar Button */}
            <button
                    onClick={() => {
                        selectElement(null);
                    }}
                    className={`${buttonBaseStyle} hover:bg-gray-600 hover:text-white`}
                    title="Hide Toolbar"
            >
                <FaEyeSlash className={iconSize} />
                <span>Hide</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Move Left */}
            <button
                    onClick={()=>{moveElement("left")}}
                    className={`${buttonBaseStyle} hover:bg-blue-500 hover:text-white`}
                    title="Move Left"
            >
                <FaCaretLeft className={iconSize} />
                <span>Left</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />
            {/* Move Right */}
            <button
                onClick={()=>{moveElement("right")}}
                className={`${buttonBaseStyle} hover:bg-blue-500 hover:text-white`}
                title="Move Right"
            >
                <FaCaretRight className={iconSize} />
                <span>Right</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Cut */}
            <button
                onClick={cutElement}
                className={`${buttonBaseStyle} hover:bg-orange-500 hover:text-white`}
                title="Cut"
            >
                <FaCut className={iconSize} />
                <span>Cut</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />
            {/* Copy */}
            <button
                onClick={copyElement}
                className={`${buttonBaseStyle} hover:bg-cyan-500 hover:text-white`}
                title="Copy"
            >
                <FaRegCopy className={iconSize} />
                <span>Copy</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />
            {/* Paste */}
            <button
                onClick={pasteElement}
                className={`${buttonBaseStyle} hover:bg-green-500 hover:text-white`}
                title="Paste"
            >
                <FaRegPaste className={iconSize} />
                <span>Paste</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Expand */}
            <button
                onClick={()=>
                    {
                        if (!selectedElement) return;
                        const currentWidth = selectedElement.width ?? 100;
                        updateElement({...selectedElement, width: Math.round(currentWidth * 1.1)});
                    }}
                className={`${buttonBaseStyle} hover:bg-indigo-500 hover:text-white`}
                title="Expand"
            >
                <FaArrowRightLong className={iconSize} />
                <span>Expand</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Shrink */}
            <button
                onClick={()=>
                    {
                        if (!selectedElement) return;
                        const currentWidth = selectedElement.width ?? 100;
                        updateElement({...selectedElement, width: Math.max(10, Math.round(currentWidth / 1.1))});
                    }}
                className={`${buttonBaseStyle} hover:bg-purple-400 hover:text-white`}
                title="Shrink"
            >
                <FaArrowLeftLong className={iconSize} />
                <span>Shrink</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Justify */}
            <button
                onClick={()=> {
                        justifyRowElements()
                    }}
                className={`${buttonBaseStyle} hover:bg-teal-500 hover:text-white`}
                title="Justify Row"
            >
                <FaArrowsLeftRightToLine className={iconSize} />
                <span>Justify</span>
            </button>
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Delete */}
            <button
                onClick={()=>setShowDeleteActionSheet(true)}
                className={`${buttonBaseStyle} hover:bg-red-500 hover:text-white`}
                title="Delete"
            >
                <FaXmark className={`${iconSize} subpixel-antialiased`} />
                <span>Delete</span>
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
