"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { FaPlusCircle, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FaCaretDown, FaCaretUp, FaSheetPlastic } from "react-icons/fa6";

type Form = {
    id: string;
    author: string;
    name: string;
    created_at: string;
    edited_at: string;
    total_entries: number | null;
};

type Response = {
    id: string;
    form_id: string;
    submitted_at: string;
    json: string;
};

export default function FormsPage() {
    const router = useRouter();
    const [forms, setForms] = useState<Form[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedForm, setExpandedForm] = useState<string | null>(null);
    const [responses, setResponses] = useState<{ [key: string]: Response[] }>({});

    // GET all forms
    useEffect(() => {
        const fetchForms = async () => {
            setLoading(true);
            const response = await fetch("/api/forms");
            const data = await response.json();
    
            if (!response.ok) {
                console.error("Error fetching forms:", data.error);
                setError(data.error);
            } else {
                setForms(data || []);
            }
            setLoading(false);
        };
    
        fetchForms();
    }, []);
    
    // CREATE a new form
    const createForm = async () => {
        try {
            const response = await fetch("/api/forms", { method: "POST" });
    
            if (!response.ok) {
                throw new Error("Failed to create form");
            }
    
            const data = await response.json(); // Safely parse response
    
            if (data?.id) {
                router.push(`/forms/build/${data.id}`);
            } else {
                console.error("Error creating a new form", data);
                alert("Error creating form. Please try again.");
            }
        } catch (error) {
            console.error("Error creating form:", error);
            alert("Error creating form. Please check the console.");
        }
    };

    // DELETE a form
    const deleteForm = async (formId: string) => {
        const response = await fetch(`/api/forms/${formId}`, { method: "DELETE" });
        const data = await response.json();
    
        if (!response.ok) {
            alert("Error deleting form: " + data.error);
        } else {
            setForms(forms.filter((form) => form.id !== formId));
        }
    };

    // GET list of entries for a form
    const fetchResponses = async (formId: string) => {
        if (responses[formId]) {
            setExpandedForm(expandedForm === formId ? null : formId);
            return;
        }
        const { data, error } = await supabase
            .from("entries")
            .select("id, form_id, submitted_at, json")
            .eq("form_id", formId)
            .order("submitted_at", { ascending: false });

        if (error) {
            console.error("Error fetching responses:", error.message);
        } else {
            setResponses((prev) => ({ ...prev, [formId]: data || [] }));
            setExpandedForm(formId);
        }
    };
    

    return (
        <>

            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button
                    className="mr-auto p-4 flex items-center gap-4  hover:bg-gray-200"
                >
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="mr-auto text-xl font-bold text-gray-700">Insurance Clouds™</div>
                </button>

                <div className="flex pr-4">
                    <button
                        className="ml-auto p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}
                    >
                        <Image
                            src="/default-profile-picture.jpg"
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                        />
                    </button>
                    
                </div>
            </div>

            {/* Forms Section */}
            <div className="bg-gray-100 p-8 min-h-screen">
                <div className="p-10 w-[850px] min-h-[700px] mx-auto bg-white rounded-2xl shadow-md">
                    <h1 className="text-3xl font-bold mb-6 text-gray-700">My Forms</h1>

                    {/* Create New Form Button */}
                    <button
                        onClick={() => createForm()}
                        className="flex items-center gap-2 mb-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                    >
                        <FaPlusCircle />
                        New Form
                    </button>

                    {/* Forms List */}
                    <div className="space-y-4">
                        {loading ? (
                            <p className="text-gray-500 text-center">Loading...</p>
                        ) : forms.length === 0 ? (
                            <p className="text-gray-500 text-center">You have not created any forms.</p>
                        ) : (
                            forms.map((form) => (
                                <div key={form.id} className="bg-gray-50 shadow-md rounded-lg">
                                    {/* Form Info */}
                                    <div className="flex justify-between items-center p-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-black">{form.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                Created: {new Date(form.created_at).toLocaleString()} | Last Edited:{" "}
                                                {new Date(form.edited_at).toLocaleString()}
                                            </p>
                                        </div>

                                        {/* Buttons Moved to Right */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => router.push(`/forms/build/${form.id}`)}
                                                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => router.push(`/forms/preview/${form.id}`)}
                                                className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                                            >
                                                Preview
                                            </button>
                                            <button
                                                onClick={() => deleteForm(form.id)}
                                                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                    {/* Responses Button (Expanded or Collapsed) */}
                                    <button
                                        onClick={() => fetchResponses(form.id)}
                                        className={`flex items-center  px-4 py-1 text-sm font-semibold text-gray-600  bg-gray-200 hover:bg-gray-200 rounded-bl-lg rounded-tr-lg ${
                                            expandedForm === form.id ? "rounded-bl-none" : "rounded-bl-lg"
                                        }`}
                                    >
                                        {expandedForm === form.id ? <FaCaretUp className="mr-2" /> : <FaCaretDown className="mr-2" />}
                                        {expandedForm === form.id ? `Hide Recent` : `Show Recent`}
                                    </button>

                                    {/* Responses (Collapsible) */}
                                    {expandedForm === form.id && (
                                        <div className="p-4 bg-gray-200 rounded-b-lg">
                                            <div className="p-2 bg-white  rounded-lg shadow-sm">
                                                {responses[form.id]?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {responses[form.id].map((response) => (
                                                            <div
                                                                key={response.id}
                                                                className="flex justify-between bg-gray-50 p-2 rounded shadow-sm"
                                                            >
                                                                <div className="text-gray-700">Responder ID here</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {new Date(response.submitted_at).toLocaleString()}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No responses yet.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
