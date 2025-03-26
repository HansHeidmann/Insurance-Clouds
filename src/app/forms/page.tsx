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
                        <div className="space-y-2">
                            <p className="text-gray-500 text-center">No forms found for this organization.</p>
                            <div className="flex">
                                <button
                                    className={`
                                        flex h-min w-min whitespace-nowrap bg-green-500 hover:bg-green-300 text-white 
                                        text-md font-bold rounded-lg py-4 px-4 items-center gap-2 shadow-lg 
                                        animate-pulse
                                    `}
                                    onClick={() => createForm()}
                                >
                                    <FaPlusCircle className="w-6 h-6 text-white" />
                                    New Form
                                </button>
                            </div>
                        </div>
                    ) : (

                        <div className="space-y-4">


                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 mb-1">All Forms</h1>
                                <p className="text-gray-500">Create and manage forms for your organization</p>
                            </div>
                            
                            <div className="flex">
                            
                                <button
                                    className={`
                                        flex h-min w-min whitespace-nowrap border  mx-auto
                                        bg-white text-green-500 border-green-500
                                        hover:bg-green-500 hover:text-white
                                        text-md font-bold rounded-lg py-4 px-4 items-center gap-2 shadow-md 
                                        justify-center
                                        ${forms == null ? "animate-pulse" : ""}
                                    `}
                                    onClick={() => createForm()}
                                >
                                    <FaPlusCircle className="w-6 h-6" />New Form
                                </button>

                            </div>
                            

                            {forms?.map((form) => (
                                <div 
                                    key={form.id} 
                                    className="bg-white p-0.5 rounded-lg transition border border-gray-200"
                                    style={{ 
                                        boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1)",
                                        transition: "box-shadow 0.2s ease-in-out"
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.boxShadow = "0px 0px 20px 0px rgba(0, 0, 0, 0.2)";
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.boxShadow = "0px 0px 5px 0px rgba(0, 0, 0, 0.1)";
                                    }}
                                    onClick={() => router.push(`/forms/fill/${form.id}`)}
                                >
                                    <div className="flex bg-white p-4 justify-between items-start rounded-md">
                                        {/* Form Info - Left Side */}
                                        <div className="flex flex-col">
                                            <div className="flex flex-col w-min whitespace-nowrap">
                                                <button className="text-left z-1">
                                                    <h3 className="text-xl text-blue-600 hover:text-blue-500 font-bold z-10">{form.name}</h3>
                                                </button>
                                                <hr className="w-full border-gray-300 mb-2 -mt-0.5 z-0"></hr>
                                            </div>

                                            {/* Actions Row */}
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => router.push(`/forms/fill/${form.id}`)}
                                                    className="px-4 py-2 text-xs border rounded-lg flex items-center gap-2
                                                    bg-white text-[#52c8fa] border-[#52c8fa]
                                                    hover:bg-[#52c8fa] hover:text-white"
                                                >
                                                    <FaEye className="w-5 h-4" />View
                                                </button>
                                                <button
                                                    onClick={()=>{}}
                                                    className="
                                                    px-4 py-2 text-xs border rounded-lg flex items-center gap-2
                                                    bg-white text-[#91cc43] border-[#91cc43]
                                                    hover:bg-[#91cc43] hover:text-white
                                                    "
                                                >
                                                    <FaShareAlt className="w-5 h-4" />Share
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/forms/build/${form.id}`)}
                                                    className="
                                                    px-4 py-2 text-xs border rounded-lg flex items-center gap-2
                                                    bg-white text-[#fcad03] border-[#fcad03]
                                                    hover:bg-[#fcad03] hover:text-white
                                                    "
                                                >
                                                    <FaHammer className="w-5 h-4" />Build
                                                </button>
                                                <button
                                                    onClick={() => {}}
                                                    className="
                                                    px-4 py-2 text-xs border rounded-lg flex items-center gap-2
                                                    bg-white text-red-500 border-red-500
                                                    hover:bg-red-500 hover:text-white
                                                    "
                                                >
                                                    <FaTrash className="w-5 h-4"/>Delete
                                                </button>
                                            </div>
                                        </div>

                                        {/* Timestamps - Right Side */}
                                        <div className="flex flex-row items-end gap-2 ml-8">
                                            <div className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                {(() => {
                                                    const date = new Date(form.created_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.author_id);
                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-400 text-xs uppercase tracking-wider">Created</span>
                                                            <span className="text-gray-700 font-medium">{date}</span>
                                                            <span className="text-gray-500">by {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div className="text-sm bg-gray-50 rounded-lg p-3 border border-gray-100">
                                                {(() => {
                                                    const date = new Date(form.edited_at).toLocaleString()
                                                    const author = members?.find(member => member.id === form.editor_id);
                                                    return (
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-400 text-xs uppercase tracking-wider">Last Edited</span>
                                                            <span className="text-gray-700 font-medium">{date}</span>
                                                            <span className="text-gray-500">by {author ? `${author.first_name} ${author.last_name}` : "Unknown"}</span>
                                                        </div>
                                                    );
                                                })()}
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
