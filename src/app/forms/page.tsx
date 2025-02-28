"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlusCircle, FaBuilding, FaEdit, FaEye } from "react-icons/fa";

type FormRow = {
    id: string;
    author: string;
    name: string;
    created_at: string;
    edited_at: string;
    total_entries: number;
    creator_name: string;
};

export default function FormsPage() {
    const router = useRouter();
    const [forms, setForms] = useState<FormRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [organizationId, setOrganizationId] = useState<string | null>(null);

    // Fetch current user's organization_id
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("/api/users/current");
                if (!response.ok) {
                    router.push("/authenticate");
                    return;
                }

                const userData = await response.json();
                setOrganizationId(userData.organization_id);

                // Fetch forms for the user's organization
                if (userData.organization_id) {
                    const formResponse = await fetch(`/api/forms?organization_id=${userData.organization_id}`);
                    const formData = await formResponse.json();
                    
                    if (formResponse.ok) {
                        setForms(formData);
                    } else {
                        setError("Failed to load forms.");
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

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
            <div className="flex items-center bg-white border-b p-4">
                <button
                    className="mr-auto flex items-center gap-4 hover:bg-gray-200 p-2 rounded-lg"
                    onClick={() => router.push("/")}
                >
                    <Image src="/logo.png" alt="Logo" width={75} height={75} quality={100} />
                    <div className="text-xl font-bold text-gray-700">Insurance Clouds™</div>
                </button>

                <div className="flex pr-4">
                    <button
                        className="p-1 rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}
                    >
                        <Image src="/default-profile-picture.jpg" alt="Profile" width={50} height={50} className="rounded-full object-cover" />
                    </button>
                </div>
            </div>

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
                    ) : error ? (
                        <p className="text-red-500 text-center">{error}</p>
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
                                                Last Edited: {new Date(form.edited_at).toLocaleString()} | Created by: {form.creator_name}
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
