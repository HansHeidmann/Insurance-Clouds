import React from "react";
import { FaEdit, FaPlusCircle, FaTrash, FaCaretLeft, FaCaretRight, FaGripVertical } from "react-icons/fa";
import { FormBuilderElement } from "./FormBuilderElement";


interface FormBuilderProps {
    formName: string;
    setFormName: (element: string) => void;
    formMatrix: FormBuilderElement[][];
    selectedElement: FormBuilderElement | null;
    selectElement: (element: FormBuilderElement | null) => void;
    deleteElement: (rowIndex: number, colIndex: number) => void;
    moveElement: (rowIndex: number, colIndex: number, direction: string) => void
    addRow: () => void;
    addColumn: (rowIndex: number) => void;

    selectedElementRef: React.RefObject<HTMLDivElement | null>; // for FloatingToolbar
}

const FormBuilderArea: React.FC<FormBuilderProps> = ({ formName, setFormName, formMatrix, selectedElement, selectElement, deleteElement, moveElement, addRow, addColumn, selectedElementRef }) => {
    return (
        <div
            onClick={() => { selectElement(null); }}
            className="p-16 w-[850px] min-h-[1100px] mx-auto bg-white rounded-2xl shadow-md
            hover:cursor-pointer
            "
        >

            <input
                className="text-3xl w-full mb-8 py-0 border-gray-200 border-4 border-l-0 border-t-0 border-r-0 focus:outline-none focus:ring-0 cursor-text"
                placeholder="Form Name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
            />

            {formMatrix.map((row, rowIndex) => (

                <div key={rowIndex} className="flex gap-4 mb-4">
                    {row.map((element, colIndex) => (
                        <div
                            ref={element === selectedElement ? selectedElementRef : null}
                            key={element.id || `${rowIndex}-${colIndex}`}
                            className={`
                                flex box-border rounded-lg drop-shadow-md border-2
                                transition-colors duration-200
                                ${element === selectedElement ? "border-blue-400 border-2" : "border-transparent"}
                                hover:cursor-move
                              `}
                            onClick={(event) => {
                                selectElement(element)
                                event.stopPropagation();
                            }}
                        >
                            {/* Drag & Drop Grip */}
                            <div className=" hidden  items-center mr-2">
                                <button
                                    className="cursor-move h-10 px-0.5 bg-white text-gray-500 drop-shadow-md rounded-sm"
                                    onClick={(e) => {
                                        selectElement(element)
                                        e.stopPropagation();
                                        moveElement(rowIndex, colIndex, "left")
                                    }
                                    }
                                >
                                    <FaGripVertical/>
                                </button>

                            </div>

                            {/* Center Column - MAIN */}
                            <div className="bg-white p-4 rounded-md hover:bg-blue-100">
                            
                                <div className="absolute inset-0 hover:cursor-move rounded-md z-10" />

                                {/* Label and Buttons */}
                                <div className="flex justify-between ">
                                    <div className="flex items-end ">
                                        <label className="text-md font-semibold -mb-1.5">{element.label}</label>
                                        { element.required &&
                                            <label className="text-xl -mb-1.5 text-red-500">*</label>
                                            }
                                    </div>
                                    <div className="pl-4 space-x-1">
                                        
                                        <button
                                            onClick={(event) => {
                                                selectElement(element)
                                                event.stopPropagation();
                                            }
                                            }
                                            className="hidden bg-indigo-500 hover:bg-blue-300 text-white text-xs  drop-shadow-md rounded-lg p-1.5"
                                        >
                                            <FaEdit />
                                        </button>
                                        
                                    </div>
                                </div>

                                {/* Help Text (optional) */}
                                {element.helpText ?
                                    <>
                                        <div className="text-sm pt-1">{element.helpText}</div>
                                        <hr className="border-gray-200"></hr>
                                    </>
                                    :
                                    <>
                                        <div className="text-sm pt-1"></div>
                                        <hr className="border-gray-200"></hr>
                                    </>
                                }
                                

                                {/* // Builder Preview of Inputs */}
                                <div className="flex flex-col pt-1 space-y-0.5">

                                    {(element.type === "textbox") && (
                                        <div>
                                            {element.properties.multiline == true ? (
                                                <textarea
                                                    className="rounded-md placeholder-opacity-90 pl-1 border w-56 h-24 resize-none"
                                                    placeholder="Enter text"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="rounded-md placeholder-opacity-90 pl-1 border w-full"
                                                    placeholder="Enter text"
                                                />
                                            )}
                                        </div>
                                    )}

                                    {(element.type === "name") && (
                                        <div className="flex w-min gap-1">
                                            {element.properties.title
                                                && <input disabled className="rounded-md w-6 placeholder-opacity-90 pl-1 border" placeholder="T"></input>
                                            }
                                            {element.properties.firstName
                                                && <input disabled className="rounded-md w-11 placeholder-opacity-90 pl-1 border" placeholder="First"></input>
                                            }
                                            {element.properties.middleInitial
                                                && <input disabled className="rounded-md w-7 placeholder-opacity-90 pl-1 border" placeholder="M"></input>
                                            }
                                            {element.properties.middleName
                                                && <input disabled className="rounded-md w-14 placeholder-opacity-90 pl-1 border" placeholder="Middle"></input>
                                            }
                                            {element.properties.lastName
                                                && <input disabled className="rounded-md w-11 placeholder-opacity-90 pl-1 border" placeholder="Last"></input>
                                            }
                                            {element.properties.suffix
                                                && <input disabled className="rounded-md w-6 placeholder-opacity-90 pl-1 border" placeholder="S"></input>
                                            }
                                        </div>
                                    )}

                                    {(element.type === "address") && (
                                        <div className="flex flex-col w-full gap-1">
                                            <div className="flex flex-col gap-1">
                                                {element.properties.addressLine1
                                                    && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" placeholder="Address Line 1"></input>
                                                }
                                                {element.properties.addressLine1
                                                    && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" placeholder="Address Line 2"></input>
                                                }
                                                {element.properties.city
                                                    && <input className="w-40 rounded-md placeholder-opacity-90 pl-1 border" placeholder="City"></input>
                                                }
                                            </div>
                                            <div className="flex flex-row gap-1">
                                                {element.properties.state
                                                    && <input className="w-14 rounded-md placeholder-opacity-90 pl-1 border" placeholder="State"></input>
                                                }
                                                {element.properties.zip
                                                    && <input className="w-16 rounded-md placeholder-opacity-90 pl-1 border" placeholder="Zip"></input>
                                                }
                                            </div>
                                        </div>
                                    )}

                                    {(element.type === "phone") && (
                                        <input className="rounded-md placeholder-opacity-90 pl-1 border" placeholder="(123)-456-7890"></input>
                                    )}

                                    {(element.type === "email") && (
                                        <input className="rounded-md placeholder-opacity-90 pl-1 border" placeholder="person@example.com"></input>
                                    )}

                                    {(element.type === "password") && (
                                        <input className="rounded-md placeholder-opacity-90 pl-1 border" placeholder="●●●●●●●●"></input>
                                    )}

                                    {(element.type === "date") && (
                                        <input type="date" className="rounded-md placeholder-opacity-90 pl-1 border"></input>
                                    )}

                                    {(element.type === "number") && (
                                        <input type="number" className="rounded-md placeholder-opacity-90 pl-1 border" placeholder="123"></input>
                                    )}

                                    {(element.type === "url") && (
                                        <input type="url" className="rounded-md placeholder-opacity-90 pl-1 border" placeholder="https://example.com"></input>
                                    )}

                                    {element.type === "choices" && (
                                        <select className="border rounded-md p-2">
                                            {(element.properties.options as string[]).map((option: string, index: number) => (
                                                <option key={index} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {element.type === "options" && (
                                        <div className="flex flex-col gap-2">
                                            {(element.properties.options as string[])?.map((option: string, index: number) => (
                                                <label key={index} className="flex items-center gap-2">
                                                    <input type="radio" name={`option-${element.id}`} value={option} className="cursor-pointer" />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {element.type === "checkboxes" && (
                                        <div className="flex flex-col gap-2">
                                            {(element.properties.options as string[])?.map((option: string, index: number) => (
                                                <label key={index} className="flex items-center gap-2">
                                                    <input type="checkbox" name={`option-${element.id}`} value={option} className="cursor-pointer" />
                                                    {option}
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                </div>

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



        </div>


    );
};

export default FormBuilderArea;
