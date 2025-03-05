"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlusCircle, FaBuilding, FaEdit, FaEye } from "react-icons/fa";
import { FormRow, Organization, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";


export default function FormsPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [forms, setForms] = useState<FormRow[]>([]);
    const [loading, setLoading] = useState(true);


    // Handle creating a new form
    const createForm = async () => {
        try {
            const response = await fetch("/api/forms", { method: "POST" });

            if (!response.ok) {
                throw new Error("Failed to create form.");
            }

            const data = await response.json();
            router.push(`/forms/build/${data.id}`);
        } catch (error) {
            console.error("Error creating form:", error);
            alert("Error creating form. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header currentUser={currentUser} organization={organization} />

            {/* Main Content */}
            <div className="p-8 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-700">Organization Forms</h1>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push("/organization")}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
                        >
                            <FaBuilding /> Organization
                        </button>
                        <button
                            onClick={createForm}
                            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                        >
                            <FaPlusCircle /> New Form
                        </button>
                    </div>
                </div>

                {/* Forms List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {loading ? (
                        <p className="text-gray-500 text-center">Loading forms...</p>
                    ) : forms.length === 0 ? (
                        <p className="text-gray-500 text-center">No forms found for this organization.</p>
                    ) : (
                        <div className="space-y-4">
                            {forms.map((form) => (
                                <div key={form.id} className="bg-gray-50 p-4 rounded-lg shadow-sm hover:bg-gray-100 transition">
                                    <div className="flex justify-between items-center">
                                        {/* Form Info */}
                                        <div>
                                            <h3 className="text-lg font-semibold">{form.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Last Edited: {new Date(form.edited_at).toLocaleString()} | Created by: {form.author_id}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => router.push(`/forms/build/${form.id}`)}
                                                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => router.push(`/forms/view/${form.id}`)}
                                                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                                            >
                                                <FaEye /> View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
