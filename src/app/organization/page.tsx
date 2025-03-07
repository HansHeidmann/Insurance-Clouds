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
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [orgIdInput, setOrgIdInput] = useState("");
    const [newOrgName, setNewOrgName] = useState("");

    // Fetch User, Organization, and Members
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // Get current user
                const currentUser = await DatabaseService.getCurrentUser();
                if (!currentUser) {
                    router.push("/login");
                    return;
                }
                setCurrentUser(currentUser);
                console.log("test");
                

                // Fetch organization
                if (currentUser.organization_id) {
                    console.log("test");
                    
                    const org = await DatabaseService.getCurrentOrganization();
                    setOrganization(org);

                    // Fetch members
                    if (org) {
                        const orgMembers = await DatabaseService.getOrganizationMembers(org.id);
                        setMembers(orgMembers);
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return (
        <>
            {/* Header */}
            <Header currentUser={currentUser} organization={organization} />

            {/* Main Section */}
            <div className="flex bg-gray-100 p-8 h-screen justify-center">
                <div className="flex flex-col h-min min-w-[500px] bg-white shadow-lg rounded-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : currentUser?.organization_id ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-700 mb-6">{organization?.name}</h1>
                            
                            {/* Members List */}
                            <div className="shadow-md rounded-lg overflow-hidden">
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <div
                                            key={member.id}
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
                                                    <div>{member.firstName} {member.lastName}</div>
                                                    <div className="text-xs">{member.email}</div>
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
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Join or Create an Organization</h2>
                            <button className="px-4 py-2 bg-green-500 text-white rounded-lg">Create Organization</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
