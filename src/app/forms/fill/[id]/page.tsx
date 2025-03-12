"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/ui/MainHeader";
import { Form } from "@/lib/types";


export default function ViewFormPage() {
    //const router = useRouter();
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

            {/* Main Content */}
            <div className="flex flex-col items-center p-8">
                <div className="bg-white w-[850px] min-h-[1100px] p-6 rounded-lg shadow-md">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading form...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : form ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-800">{form.name}</h1>
                            <h2 className="text-2xl font-bold text-gray-800">{form.description}</h2>

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
