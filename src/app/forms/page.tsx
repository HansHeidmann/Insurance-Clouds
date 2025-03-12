"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlusCircle, FaEdit, FaEye, FaTrash, FaShareAlt } from "react-icons/fa";
import { Form, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";
import DatabaseService from "@/lib/DatabaseService";


export default function FormsPage() {
    const router = useRouter();
    const [members, setMembers] = useState<User[] | null>(null);
    const [forms, setForms] = useState<Form[] | null>(null);
    const [loading, setLoading] = useState(true);


    // Fetch List of Forms for Organization
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
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
            <Header />

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
                                <h1 className="text-3xl font-bold text-gray-700 mb-4">All Forms</h1>
                                <button
                                    className="mr-auto flex h-min w-min whitespace-nowrap bg-green-500 hover:bg-green-700 text-white text-sm font-bold rounded-lg py-4 px-4 items-center gap-2"
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
                                        <div className="flex flex-col">
                                            <h3 className="text-xl text-blue-500 font-bold">{form.name}</h3>
                                            <hr className="border-gray-300"></hr>
                                            <div>
                                                
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {(() => {
                                                    const date = new Date(form.created_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.author_id);
                                                    return <div>{date} ~ {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</div>;
                                                })()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {(() => {
                                                    const date = new Date(form.edited_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.editor_id);
                                                    return <div>{date} ~ {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</div>;
                                                })()}
                                            </div>
                                           
                                            
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/forms/preview/${form.id}`)}
                                                    className="px-4 py-2 text-md bg-[#52c8fa] text-white font-semibold rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={()=>{}}
                                                    className="px-4 py-2 text-md bg-[#91cc43] text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                                >
                                                    <FaShareAlt />
                                                </button>
                                            </div>
                                           
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/forms/build/${form.id}`)}
                                                    className="px-4 py-2 text-md bg-[#fcad03] text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center gap-2"
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="px-4 py-2 text-sm bg-red-500 text-white font-semibold rounded-lg hover:bg-green-600 flex items-center gap-2"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
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
