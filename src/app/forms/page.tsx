"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlusCircle, FaBuilding, FaEdit, FaEye } from "react-icons/fa";
import { Form, Organization, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";
import DatabaseService from "@/lib/DatabaseService";


export default function FormsPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<User[] | null>(null);
    const [forms, setForms] = useState<Form[] | null>(null);
    const [loading, setLoading] = useState(true);


    // Fetch List of Forms for Organization
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const org = await DatabaseService.getCurrentOrganization();
                setOrganization(org);

                const members = await DatabaseService.getOrganizationMembers();
                setMembers(members);
                
                const forms = await DatabaseService.getFormsForOrganization();
                setForms(forms);

            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);


    // Handle creating a new form
    const createForm = async () => {
        const newForm = await DatabaseService.createForm();
        if (newForm) {
            router.push(`/forms/build/${newForm.id}`);
        } 
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <Header currentUser={currentUser} organization={organization} />

            {/* Main Content */}
            <div className="p-8 max-w-5xl mx-auto">
               
                {/* Forms List */}
                <div className="bg-white p-6 rounded-lg shadow-lg">

                    {loading ? (
                        <p className="text-gray-500 text-center">Loading forms...</p>
                    ) : forms?.length === 0 ? (
                        <p className="text-gray-500 text-center">No forms found for this organization.</p>
                    ) : (

                        <div className="space-y-4">

                            <div className="flex flex-col">
                                <h1 className="text-3xl font-bold text-gray-700 mb-6">{organization?.name}&apos;s Forms</h1>
                                <button
                                    className="mx-auto flex h-min w-min whitespace-nowrap bg-blue-500 text-white text-sm font-bold rounded-lg py-2 px-4 items-center gap-2"
                                    onClick={()=>{createForm()}}
                                >
                                    <FaPlusCircle />
                                    New Form
                                </button>
                            </div>

                            {forms?.map((form) => (
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
                                                className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                            >
                                                <FaEdit /> Edit
                                            </button>
                                            <button
                                                onClick={() => router.push(`/forms/view/${form.id}`)}
                                                className="px-4 py-2 text-sm bg-pink-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
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
