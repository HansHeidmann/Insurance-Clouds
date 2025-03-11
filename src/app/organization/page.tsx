"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Organization, User, Member } from "@/lib/types";
import  DatabaseService  from "@/lib/DatabaseService";
import Header from "@/components/ui/MainHeader";

export default function OrganizationPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<Member[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessCode, setAccessCode] = useState("");
    const [newOrgName, setNewOrgName] = useState("");

    // Fetch User, Organization, and Members
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // Get currentUser, the organization they are in, and that organization's members
                const currentUser = await DatabaseService.getCurrentUser();
                if (!currentUser) {
                    router.push("/login");
                    return;
                }
                setCurrentUser(currentUser);
                
                const org = await DatabaseService.getCurrentOrganization();
                setOrganization(org);

                const members = await DatabaseService.getOrganizationMembers();
                setMembers(members);
                    
                
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);


    async function createOrganization() {
        router.refresh()
        // create org
        await DatabaseService.createOrganization(newOrgName);
        // update page vars
        router.refresh()
        /*
        const org = await DatabaseService.getCurrentOrganization();
        setOrganization(org);
        const members = await DatabaseService.getOrganizationMembers();
        setMembers(members);
        */
    }

    async function joinOrganization() {
        // join org
        await DatabaseService.joinOrganization(accessCode);
        // update page vars
        const org = await DatabaseService.getCurrentOrganization();
        setOrganization(org);
        const members = await DatabaseService.getOrganizationMembers();
        setMembers(members);
    }



    //
    // Page
    //
    return (
        <>
            {/* Header */}
            <Header currentUser={currentUser} organization={organization} />

            {/* Main Section */}
            <div className="flex bg-gray-100 p-8 h-screen justify-center">
                <div className="flex flex-col h-min min-w-[500px] bg-white shadow-lg rounded-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : currentUser && organization && members ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-700 mb-6">{organization?.name}</h1>
                            
                            {/* Members List */}
                            <div className="shadow-md rounded-lg overflow-hidden">
                                {members.length > 0 ? (
                                    members.map((member, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center justify-between space-x-4 p-4 border-b border-gray-300 ${
                                                member.role === "admin" ? "bg-blue-100" : "bg-green-100"
                                            } hover:bg-gray-100`}
                                        >
                                            <div className="flex gap-4 w-auto">
                                                <Image
                                                    src={member.avatar_url || "/default-profile-picture.jpg"}
                                                    alt="Avatar"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full object-cover"
                                                />
                                                <div className="flex flex-col text-black">
                                                    { member.first_name && member.last_name ? (
                                                        <>
                                                            <div>{member.first_name} {member.last_name}</div>
                                                            <div className="text-xs">{member.email}</div>
                                                        </>
                                                    ) : (
                                                       
                                                    <div className="text-xs">{member.email}</div>
                                                    )}
                                                    
                                                </div>
                                            </div>
                                            <div className="ml-auto text-gray-600">
                                                {currentUser.role === "admin" ? (
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => console.log("Update Role:", e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                ) : (
                                                    <span className="border border-gray-300 rounded px-2 py-1">{member.role}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 text-gray-500">No members found.</div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-700 mb-2">Create an Organization</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Organization Name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newOrgName}
                                    onChange={(e) => setNewOrgName(e.target.value)}
                                />
                                <button 
                                    className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg"
                                    onClick={() => createOrganization()}
                                >
                                    Create
                                </button>
                            </div>

                            <h2 className="text-xl font-bold text-gray-700 mb-2 mt-8">Join an Organization</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Access Code"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value)}
                                />
                                <button 
                                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg"
                                    onClick={() => joinOrganization()}
                                >
                                    Join
                                </button>
                            </div>
                            
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
