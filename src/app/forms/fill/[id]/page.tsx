"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/ui/MainHeader";
import { Form } from "@/lib/types";
import { FormFillerElement } from "@/components/filler/FormFillerElement";
import Image from "next/image";

export default function ViewFormPage() {
    const { id: formId } = useParams();
    const [form, setForm] = useState<Form | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        if (!formId) return;

        const fetchForm = async () => {
            setLoading(true);
            const response = await fetch(`/api/v1/forms/${formId}`);
            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
            } else {
                setForm(data);
            }
            setLoading(false);
        };

        fetchForm(); 
    }, [formId]);
  

    // Ensure form.json exists & maintain row-based structure
    const formRows = Array.isArray(form?.json) ? form.json : [];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            
            <Header />


            {/* Remove below when done */}
            <div className=" absolute h-full overflow-y-auto top-[86px] left-0 w-1/4 p-4 bg-black text-green-300">
                <p>** FOR DEBUG ** (hide this sidebar for prod.)</p>
                <pre className="whitespace-pre-wrap text-sm text-green-400 ">
                    {JSON.stringify(form, null, 2)}
                </pre>
            </div>
            {/* Remove above when done */}




            <div className="flex flex-col m-8 p-8 w-[850px] min-h-[1100px] mx-auto bg-white rounded-2xl shadow-md">
                {loading ? (
                    <Image 
                        className="mx-auto"
                        src="/loading.gif" 
                        alt="loading" 
                        width="100" 
                        height="100" 
                        quality={100}
                    />
                ) : (
                    <>
                        <div className="text-3xl font-bold mb-4">{form?.name}</div>
                        <div className="">
                            {formRows.length > 0 ? (
                                <div className="space-y-2">
                                    {formRows.map((row: FormFillerElement[], rowIndex: number) => (
                                        <div key={rowIndex} className="flex gap-2">
                                            {row.map((element: FormFillerElement) => (
                                                <div 
                                                    style={{ 
                                                        width: `${element.width}%`,
                                                        flex: `0 0 ${element.width}%`
                                                    }}
                                                    key={element.id} 
                                                    className="p-4 bg-white rounded-lg shadow-md"
                                                >
                                                    {/* Label */}
                                                    <label className="block text-gray-700 font-semibold">
                                                        {element.label} {element.required && <span className="text-red-500">*</span>}
                                                    </label>

                                                    {/* Help Text */}
                                                    {element.helpText && <p className="text-sm text-gray-500">{element.helpText}</p>}

                                                    {/* Render Input Field */}
                                                    {renderFormField(element)}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No form data available.</p>
                            )}
                        </div>

                        <button 
                            className="mx-auto mt-8 px-8 py-4 font-bold text-xl bg-blue-500 text-white rounded-lg shadow-lg"
                        >
                            Submit
                        </button>
                    </>
                )}
            
            </div>


        </div>
    );
}

const renderFormField = (element: FormFillerElement) => {
    switch (element.type) {
/*
        export type FormElementType =
    | "undefined"
    | "textbox"
    | "name"
    | "address"
    | "phone"
    | "email"
    | "password"
    | "date"
    | "number"
    | "url"
    | "choices"
    | "options"
    | "checkboxes"
    | "calculation"
    | "signature"
    | "file";
*/
       
        case "undefined":  // this should never happen
            return (
                <input
                    type="text"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder={"Undefined"}
                />
            );

        case "textbox":
            return (
                <input
                    type="text"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder={"Enter text"}
                />
            );
        
        case "name":
            return (
                <div className="flex gap-2 mt-2">
                    {Object.entries(element.properties).map(([key, value], index) =>
                        value === true ? (
                            <div key={index}>
                                {key == "title" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Title"
                                    />
                                }
                                {key == "firstName" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="First"
                                    />
                                }
                                {key == "middleInitial" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-4 px-3 py-2 border rounded-md"
                                        placeholder="I"
                                    />
                                }
                                {key == "middleName" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Middle"
                                    />
                                }
                                {key == "lastName" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Last"
                                    />
                                }
                                {key == "suffix" &&
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Suffix"
                                    />
                                }
                            </div>
                        ) : null
                    )}
                </div>
            );


        case "address":
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {Object.entries(element.properties).map(([key, value], index) =>
                        value === true ? (
                            <div key={index} className="flex flex-col">
                                {/* Address Line 1 */}
                                {key === "addressLine1" && (
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Address Line 1"
                                        maxLength={69}
                                    />
                                )}

                                {/* Address Line 2 */}
                                {key === "addressLine2" && (
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="Address Line 2"
                                        maxLength={69}
                                    />
                                )}

                                {/* City on Its Own Line */}
                                {key === "city" && (
                                    <input
                                        type="text"
                                        className="mt-1 w-full px-3 py-2 border rounded-md"
                                        placeholder="City"
                                        maxLength={69}
                                    />
                                )}

                                {/* State & Zip in the Same Row */}
                                {key === "state" && (
                                    <div className="flex flex-row gap-2 text-gray-400">
                                        {/* State Dropdown */}
                                        <select className="mt-1 w-1/2 px-3 py-2 border rounded-md bg-white">
                                            <option value="">State</option>
                                            {[
                                                "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                                                "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                                                "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                                                "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                                                "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
                                            ].map((state, i) => (
                                                <option key={i} value={state}>{state}</option>
                                            ))}
                                        </select>

                                        {/* Zip Code Input */}
                                        <input
                                            type="text"
                                            className="mt-1 w-1/2 px-3 py-2 border rounded-md"
                                            placeholder="Zip"
                                            maxLength={5}
                                            pattern="\d{5}"
                                            inputMode="numeric"
                                        />
                                    </div>
                                )}
                            </div>
                        ) : null
                    )}
                </div>
            );

            

        case "phone":
            return (
                <input
                    type="tel"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder="Enter phone number"
                />
            );
        
        case "email":
            return (
                <input
                    type="email"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder="me@example.com"
                />
            );

        case "password":
            return (
                <input
                    type="password"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder="••••••••••••"
                />
            );

        case "date":
            return <input type="date" className="mt-2 w-full px-3 py-2 border rounded-md" />;

        case "number":
            return (
                <input
                    type="number"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder="Enter number"
                />
            );
        
        case "url":


            return (
                <input
                    type="url"
                    className="mt-2 w-full px-3 py-2 border rounded-md"
                    placeholder="https://example.com/"
                    pattern="https?://.*" // Ensures HTTP or HTTPS
                    inputMode="url"
                />
            );

        case "choices":
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {(element.properties?.options as string[]).map((option, i) => (
                        <label key={i} className="flex items-center gap-2">
                            <input
                                type="radio"
                                name={`choices-${element.id}`}  // Ensures only one selection per group
                                value={option}
                                className="w-4 h-4"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            );
            
        case "checkboxes":
            return (
                <div className="flex flex-col gap-2 mt-2">
                    {(element.properties?.options as string[])?.map((option, i) => (
                        <label key={i} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4" />
                            {option}
                        </label>
                    ))}
                </div>
            );

        case "options":
            return (
                <select className="mt-2 w-full px-3 py-2 border rounded-md">
                    {(element.properties?.options as string[])?.map((option, i) => (
                        <option key={i}>{option}</option>
                    ))}
                </select>
            );

        case "file":
            return (
                <div className="mt-2 w-full px-3 py-2 border rounded-md flex items-center justify-between">
                    <span className="text-gray-500">No file chosen</span>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        Attach File
                    </button>
                </div>
            );

        case "signature":
            return (
                <div className="mt-2 w-full h-32 border rounded-md flex items-center justify-center text-gray-500">
                    Signature Field
                </div>
            );

        case "calculation":
            return (
                <div className="mt-2 w-full px-3 py-2 border rounded-md bg-gray-200 text-gray-700">
                    {element.properties?.formula || "No formula defined"}
                </div>
            );

        default:
            return <p className="text-gray-500">Unsupported field type</p>;
    }
};
