"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { FaCaretLeft, FaShare } from "react-icons/fa";
import {  FaSheetPlastic } from "react-icons/fa6"
import Header from "@/components/ui/MainHeader";

type Form = {
    id: string;
    name: string;
    json: JSON;
    created_at: string;
    edited_at: string;
};

export default function ViewFormPage() {
    const router = useRouter();
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

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header Section */}
            <Header />

            {/* Back button and share button bar*/}
            <div className="flex items-end bg-gray-200">
                        
                            
                <button
                    onClick={() => {
                        router.push('/forms/all')
                    }
                    }
                    className="mr-auto flex items-center p-4 gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold"
                >
                    <FaCaretLeft />All Forms 
                </button>
                <button
                    onClick={() => {
                        
                    }
                    }
                    className="flex items-center p-4 gap-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold text-md"
                >
                    <FaShare />Share Form
                </button>

            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center p-8">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading form...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : form ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800">{form.name}</h1>
                            <p className="text-sm text-gray-500">Created: {new Date(form.created_at).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">Last Edited: {new Date(form.edited_at).toLocaleString()}</p>

                            {/* Render Form Data (Instead of JSON) */}
                            <div className="mt-6 border-t pt-4">
                                {Array.isArray(form.json) ? (
                                    <div className="space-y-4">
                                        {form.json.map((row: any[], rowIndex: number) => (
                                            <div key={rowIndex} className="flex gap-4">
                                                {row.map((element, colIndex) => (
                                                    <div
                                                        key={`${rowIndex}-${colIndex}`}
                                                        className="p-4 bg-gray-50 rounded-lg shadow"
                                                    >
                                                        <p className="text-sm font-semibold text-gray-700">
                                                            {element.label || "Unnamed Field"}
                                                        </p>
                                                        <input
                                                            className="mt-1 w-full px-3 py-1.5 border rounded-md"
                                                            placeholder={element.placeholder || "Enter data"}
                                                            disabled
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No form data available.</p>
                                )}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">Form not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
