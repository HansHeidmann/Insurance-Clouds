"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaPlusCircle, FaEye, FaTrash, FaShareAlt, FaHammer } from "react-icons/fa";
import { Form, Organization, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";
import DatabaseService from "@/lib/DatabaseService";


export default function FormsPage() {
    const router = useRouter();
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<User[] | null>(null);
    const [forms, setForms] = useState<Form[] | null>(null);
    const [loading, setLoading] = useState(true);


    // Fetch List of Forms for Organization
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const organization = await DatabaseService.getCurrentOrganization();
                setOrganization(organization);

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

            {/* gray bg */}
            <div className="p-8 max-w-5xl mx-auto">
               
                {/* Main Container */}
                <div className="bg-white p-8 rounded-lg shadow-lg">

                    <h1 className="text-2xl font-bold text-black mb-4">All Forms</h1>

                    {loading ? (
                        
                        <Image 
                                                    className="mx-auto"
                                                    src="/loading.gif" 
                                                    alt="loading" 
                                                    width="100" 
                                                    height="100" 
                                                    quality={100}
                                                />

                    ) : forms?.length === 0 ? (
                        <p className="text-gray-500 text-center">No forms found for this organization.</p>
                    ) : (

                        <div className="space-y-2">

                            <div className="flex">
                            
                                <button
                                    className={`flex h-min w-min whitespace-nowrap bg-green-500 hover:bg-green-300 text-white text-md font-bold rounded-lg py-4 px-4 items-center gap-2 shadow-lg ${forms == null ? "animate-pulse" : ""}`}
                                    onClick={() => createForm()}
                                >
                                    <FaPlusCircle className="w-6 h-6 text-white" />
                                    Create New Form
                                </button>

                            </div>
                            

                            {forms?.map((form) => (
                                <div key={form.id} className="bg-white hover:bg-blue-50 p-2 rounded-lg shadow-lg transition">
                                    <div className="flex bg-white p-4 justify-between items-center rounded-md">
                                        {/* Form Info */}
                                        <div className="flex flex-col">
                                            <div className="flex flex-col w-min whitespace-nowrap">
                                                <button className="text-left">
                                                    <h3 className="text-xl text-blue-500 hover:text-blue-300 font-bold">{form.name}</h3>
                                                </button>
                                                
                                                <hr className="w-full border-gray-300 mb-2"></hr>
                                            </div>
                                            
                                            <div>
                                                
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {(() => {
                                                    const date = new Date(form.created_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.author_id);
                                                    return <div>Created on: {date} by {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</div>;
                                                })()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {(() => {
                                                    const date = new Date(form.edited_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.editor_id);
                                                    return <div>Last edited: {date} by {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</div>;
                                                })()}
                                            </div>
                                           
                                            
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2">

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/forms/fill/${form.id}`)}
                                                    className="px-4 py-2 text-lg bg-[#52c8fa] text-white font-semibold rounded-lg hover:bg-black flex items-center gap-2"
                                                >
                                                    <FaEye className="w-5 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={()=>{}}
                                                    className="px-4 py-2 text-lg bg-[#91cc43] text-white font-semibold rounded-lg hover:bg-black flex items-center gap-2"
                                                >
                                                    <FaShareAlt className="w-5 h-4 text-white" />
                                                </button>
                                            </div>
                                           
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => router.push(`/forms/build/${form.id}`)}
                                                    className="px-4 py-2 text-lg bg-[#fcad03] text-white font-semibold rounded-lg hover:bg-black flex items-center gap-2"
                                                >
                                                    <FaHammer className="w-5 h-4 text-white" />
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="px-4 py-2 text-lg bg-red-500 text-white font-semibold rounded-lg hover:bg-black flex items-center gap-2"
                                                >
                                                    <FaTrash className="w-5 h-4 text-white"/>
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
