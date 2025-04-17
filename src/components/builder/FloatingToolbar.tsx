import React, { useState } from "react";
import {
    FaCaretLeft,
    FaCaretRight,
    FaEyeSlash,
    FaCut,
    FaRegCopy,
} from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong, FaArrowsLeftRightToLine, FaRegPaste, FaXmark } from "react-icons/fa6";

import ActionSheet from "../ui/ActionSheet";
import { FormBuilderElement } from "./FormBuilderElement";

// Properties for the FloatingToolbar component
interface FloatingToolbarProps {
    x: number;  // X position of the toolbar on screen
    y: number;  // Y position of the toolbar on screen
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

// FloatingToolbar component definition
const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
    x, y, selectElement, selectedElement, deleteElement, moveElement, updateElement, justifyRowElements,
    cutElement, copyElement, pasteElement
}) => {

    // State to manage the visibility of the delete confirmation action sheet
    const [showDeleteActionSheet, setShowDeleteActionSheet] = useState(false);

    // Styles (Tailwind CSS) for the toolbar buttons and icons
    const buttonBaseStyle = "p-2 flex flex-col items-center rounded-md transition-colors text-xs";
    const iconSize = "w-4 h-4 mb-1";



    //
    // FloatingToolbar
    //
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
                    // Handle click event for the hide button
                    onClick={() => {
                        selectElement(null);
                    }}
                    className={`${buttonBaseStyle} hover:bg-gray-600 hover:text-white`}
                    title="Hide Toolbar"
            >
                {/* Icon and Label */}
                <FaEyeSlash className={iconSize} />
                <span>Hide</span>
            </button>


            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            
            {/* 
     
            <button
                    onClick={()=>{moveElement("left")}}
                    className={`${buttonBaseStyle} hover:bg-blue-500 hover:text-white`}
                    title="Move Left"
            >
                <FaCaretLeft className={iconSize} />
                <span>Left</span>
            </button>
 
            <div className="w-px h-10 bg-gray-300 mx-1" />

            <button
                onClick={()=>{moveElement("right")}}
                className={`${buttonBaseStyle} hover:bg-blue-500 hover:text-white`}
                title="Move Right"
            >
                <FaCaretRight className={iconSize} />
                <span>Right</span>
            </button>
   
            <div className="w-px h-10 bg-gray-300 mx-1" /> 

            */}


            {/* Cut */}
            <button
                // Handle click event for the cut button
                onClick={cutElement}
                className={`${buttonBaseStyle} hover:bg-orange-500 hover:text-white`}
                title="Cut"
            >
                {/* Icon and Label */}
                <FaCut className={iconSize} />
                <span>Cut</span>
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Copy Button */}
            <button
                // Handle click event for the copy button
                onClick={copyElement}
                className={`${buttonBaseStyle} hover:bg-cyan-500 hover:text-white`}
                title="Copy"
            >
                {/* Icon and Label */}
                <FaRegCopy className={iconSize} />
                <span>Copy</span>
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Paste Button*/}
            <button
                // Handle click event for the paste button
                onClick={pasteElement}
                className={`${buttonBaseStyle} hover:bg-green-500 hover:text-white`}
                title="Paste"
            >
                {/* Icon and Label */}
                <FaRegPaste className={iconSize} />
                <span>Paste</span>
            </button>
           
           {/* Divider */}
           <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Shrink Button */}
            <button
                // Handle click event for the shrink button                
                onClick={()=>
                    {
                        if (!selectedElement) return;
                        const currentWidth = selectedElement.width ?? 100;
                        updateElement({...selectedElement, width: Math.max(10, Math.round(currentWidth / 1.1))});
                    }}
                className={`${buttonBaseStyle} hover:bg-purple-400 hover:text-white`}
                title="Shrink"
            >
                {/* Icon and Label */}
                <FaArrowLeftLong className={iconSize} />
                <span>Shrink</span>
            </button>
           
            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Expand Button */}
            <button
                // Handle click event for the expand button
                onClick={()=>
                    {
                        if (!selectedElement) return;
                        const currentWidth = selectedElement.width ?? 100;
                        updateElement({...selectedElement, width: Math.round(currentWidth * 1.1)});
                    }}
                className={`${buttonBaseStyle} hover:bg-indigo-500 hover:text-white`}
                title="Expand"
            >
                {/* Icon and Label */}
                <FaArrowRightLong className={iconSize} />
                <span>Expand</span>
            </button>
            
            

            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />


            {/* Justify Button */}
            <button
                // Handle click event for the justify button
                onClick={()=> {
                        justifyRowElements()
                    }}
                className={`${buttonBaseStyle} hover:bg-teal-500 hover:text-white`}
                title="Justify Row"
            >
                {/* Icon and Label */}
                <FaArrowsLeftRightToLine className={iconSize} />
                <span>Justify</span>
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-gray-300 mx-1" />

            {/* Delete Button */}
            <button
                // Handle click event for the delete button
                onClick={ ()=> {
                    if (!selectedElement) return;
                    // If the selected element is "Untitled", delete it immediately
                    if (selectedElement.label === "Untitled") {
                        deleteElement();
                        selectElement(null);
                    }
                    else {
                        // If the selected element has a label, show the delete confirmation action sheet
                        setShowDeleteActionSheet(true);
                    }
                  
                }}
                className={`${buttonBaseStyle} hover:bg-red-500 hover:text-white`} // styling
                title="Delete" // hover text
            >
                {/* Icon and Label */}
                <FaXmark className={`${iconSize} subpixel-antialiased`} />
                <span>Delete</span>
            </button>




            {/* Fullscreen Pop-up Action Sheet for Delete Confirmation */}
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
