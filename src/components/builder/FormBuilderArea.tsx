import React from "react";
import { FaEdit, FaPlusCircle, FaTrash, FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { FormBuilderElement } from "./FormBuilderElement";

interface FormBuilderProps {
    setFormName: (element: string) => void;
    formMatrix: FormBuilderElement[][];
    selectedElement: FormBuilderElement | null;
    setSelectedElement: (element: FormBuilderElement) => void;
    deleteElement: (rowIndex: number, colIndex: number) => void;
    moveElement: (rowIndex: number, colIndex: number, direction: string) => void
    addRow: () => void;
    addColumn: (rowIndex: number) => void;
}

const FormBuilderArea: React.FC<FormBuilderProps> = ({ setFormName, formMatrix, selectedElement, setSelectedElement, deleteElement, moveElement, addRow, addColumn }) => {
    return (
        <div className="p-8 bg-white rounded-2xl shadow-md">
            
            <input
                className="text-3xl w-full mb-8 py-0 border-gray-200 border-4 border-l-0 border-t-0 border-r-0 focus:outline-none focus:ring-0 cursor-text"
                placeholder="Form Name"
                onChange={(e) => setFormName(e.target.value)}
            />
            
            {formMatrix.map((row, rowIndex) => (
                
                <div key={rowIndex} className="flex gap-4 mb-4">
                {row.map((element, colIndex) => (

                    <div
                        key={element.id || `${rowIndex}-${colIndex}`}
                        className={`flex bg-white p-2 drop-shadow-lg rounded-lg box-border border-2 border-dashed ${
                        element === selectedElement ? "border-indigo-400" : "border-white"
                        }`}
                        onClick={() => setSelectedElement(element)}
                    >

                    {/* Left Column - Button */}
                    <div className="content-center">
                        <button
                        className="h-10 px-0.5 mr-2 bg-white hover:bg-cyan-100 text-black text-sm drop-shadow-md rounded-sm"
                        onClick={() => {

                                moveElement(rowIndex, colIndex, "left")  
                            }
                        }
                        >
                        <FaCaretLeft />
                        </button>
                    </div>

                    {/* Center Column - MAIN */}
                    <div>
                        
                        {/* Label and Buttons */}
                        <div className="flex justify-between ">
                            <div className="flex items-end ">
                                <label className="text-lg font-semibold -mb-1.5">{element.label}</label>
                                {/* 
                                <label className="text-xl -mb-1.5 text-red-500">*</label>
                                */}
                            </div>
                            <div className="pl-4 space-x-2">
                                <button 
                                onClick={() => setSelectedElement(element)} 
                                className="bg-indigo-500 hover:bg-blue-300 text-white text-sm  drop-shadow-md rounded-lg p-2"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-300 text-white text-sm drop-shadow-md rounded-lg p-2"
                                    onClick={() => deleteElement(rowIndex, colIndex)}
                                    >
                                    <FaTrash />
                                </button>
                            </div>  
                        </div>

                        {/* Help Text (optional) */}
                        { element.helpText ?
                            <div className="text-sm pt-1">{element.helpText}</div>
                            :
                            <div className="text-sm pt-1">{"Help Text (optional)"}</div>
                        } 
                        <hr></hr>

                        {/* 
                        //
                        // Builder Preview of Inputs  
                        // 
                        */}
                        <div className="flex flex-col pt-1 space-y-0.5">
                            
                            
                            
                            {(element.type === "textbox") && (
                                <input className="rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="Enter text"></input>
                            )}

                            {(element.type === "name") && (
                                <div className="flex w-min gap-1">
                                    {element.properties.title
                                        && <input className="rounded-md w-6 placeholder-opacity-90 pl-1 border" disabled placeholder="T."></input>
                                    }
                                    {element.properties.firstName
                                        && <input className="rounded-md w-11 placeholder-opacity-90 pl-1 border" disabled placeholder="First"></input>
                                    }
                                    {element.properties.middleInitial
                                        && <input className="rounded-md w-7 placeholder-opacity-90 pl-1 border" disabled placeholder="M."></input>
                                    }
                                    {element.properties.middleName
                                        && <input className="rounded-md w-14 placeholder-opacity-90 pl-1 border" disabled placeholder="Middle"></input>
                                    }
                                    {element.properties.lastName
                                        && <input className="rounded-md w-11 placeholder-opacity-90 pl-1 border" disabled placeholder="Last"></input>
                                    }
                                    {element.properties.suffix
                                        && <input className="rounded-md w-6 placeholder-opacity-90 pl-1 border" disabled placeholder="S."></input>
                                    }
                                </div>
                            )}

                            {(element.type === "address") && (
                                <div className="flex flex-col w-full gap-1">
                                    <div className="flex flex-col gap-1">
                                        {element.properties.addressLine1
                                            && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="Address Line 1"></input>
                                        }
                                        {element.properties.addressLine1
                                            && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="Address Line 2"></input>
                                        }
                                        {element.properties.city
                                            && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="City"></input>
                                        }
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        {element.properties.state
                                            && <input className="w-14 rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="State"></input>
                                        }
                                        {element.properties.zip
                                            && <input className="w-16 rounded-md placeholder-opacity-90 pl-1 border" disabled placeholder="Zip"></input>
                                        }
                                    </div>
                                </div>
                            )}

                        
                        
                        </div>

                    </div>
                    
                    {/* Right Column - Button */}
                    <div className="content-center">
                        <button
                        className="h-10 px-0.5 ml-2 bg-white hover:bg-cyan-100 text-black text-sm drop-shadow-md rounded-sm"
                        onClick={() => {
                                moveElement(rowIndex, colIndex, "right");
                                setSelectedElement(element);
                            }
                        }
                        >
                        <FaCaretRight />
                        </button>
                    </div>

                    </div>
                ))}

                <div className="content-center">
                    <button 
                    onClick={() => addColumn(rowIndex)} 
                    className="bg-green-400 hover:bg-green-200 h-min p-4 text-white text-sm drop-shadow-md rounded-lg"
                    >
                    <FaPlusCircle />
                    </button>
                </div>
                </div>
            ))}
                
            <button
                onClick={addRow}
                className="bg-green-400 hover:bg-green-200 w-min p-4 text-white text-sm drop-shadow-md rounded-lg"
            >
                <FaPlusCircle />
            </button>
                
                
            {/* Big Buttons */}
            <div className="flex justify-center space-x-4 mt-16">
                <button className="bg-orange-500 hover:bg-orange-300 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
                View
                </button>
                <button className="bg-blue-500  hover:bg-blue-300 rounded-md py-5 px-9 shadow-lg font-sans text-md font-semibold text-white">
                Save
                </button>
            </div>  



        </div>


    );
};

export default FormBuilderArea;
