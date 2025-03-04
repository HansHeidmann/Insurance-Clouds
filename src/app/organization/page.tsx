"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Organization, User } from "@/lib/types";

//
// only admins should be able to publish a form
// admins can change the role of other members in the org
// admins can create forms and delete any other forms in the org
// members can create forms and delete their own


export default function OrganizationPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orgIdInput, setOrgIdInput] = useState("");
    const [newOrgName, setNewOrgName] = useState("");

    // Fetch user and organization data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Get authenticated user
                const { data: authData, error: authError } = await supabase.auth.getUser();
                if (authError || !authData?.user) {
                    router.push("/authenticate");
                    return;
                }

                const userId = authData.user.id;

                // Fetch user details
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", userId)
                    .single();

                if (userError || !user) {
                    throw new Error("Failed to load user data.");
                }

                setCurrentUser(user);

                // If user is not in an organization, reset state
                if (!user.organization_id) {
                    setOrganization(null);
                    setMembers([]);
                    setLoading(false);
                    return;
                }

                // Fetch organization details
                const { data: orgData, error: orgError } = await supabase
                    .from("organizations")
                    .select("*")
                    .eq("id", user.organization_id)
                    .single();

                if (orgError) {
                    throw new Error("Failed to load organization.");
                }

                setOrganization(orgData);

                // Fetch organization members
                const { data: membersData, error: membersError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("organization_id", user.organization_id);

                if (membersError) {
                    throw new Error("Failed to load organization members.");
                }

                setMembers(membersData);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Join an organization
    const joinOrganization = async () => {
        if (!orgIdInput) {
            alert("Please enter an Organization ID.");
            return;
        }

        const { error } = await supabase
            .from("users")
            .update({ organization_id: orgIdInput })
            .eq("id", currentUser?.id);

        if (error) {
            alert("Error joining organization: " + error.message);
        } else {
            location.reload();
        }
    };

    // Create a new organization
    const createOrganization = async () => {
        if (!newOrgName) {
            alert("Organization name is required.");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("organizations")
                .insert([{ name: newOrgName, admin_id: currentUser?.id }])
                .select("id")
                .single();

            if (error) {
                alert("Error creating organization: " + error.message);
                return;
            }

            await supabase
                .from("users")
                .update({ organization_id: data.id })
                .eq("id", currentUser?.id);

            location.reload();
        } catch (error) {
            alert("Something went wrong.");
        }
    };

    // Leave an organization
    const leaveOrganization = async () => {
        if (!confirm("Are you sure you want to leave this organization?")) return;

        const { error } = await supabase
            .from("users")
            .update({ organization_id: null })
            .eq("id", currentUser?.id);

        if (error) {
            alert("Error leaving organization: " + error.message);
        } else {
            location.reload();
        }
    };

    // Update member role
    const updateUserRole = async (userId: string, newRole: string) => {
        if (!(currentUser?.role == "admin")) {
            return;
        }

        if (newRole === "member") {
            const { count, error } = await supabase
                .from("users")
                .select("*", { count: "exact" }) // Get the exact count of admins
                .eq("organization_id", organization?.id)
                .eq("role", "admin");
    
            if (error) {
                alert("Error finding organization members: " + error.message);
                return;
            }

            if (!count) return;
    
            if (count <= 1) {
                alert("There must be at least one admin in the organization.");
                return;
            }
        }


        const { error } = await supabase
            .from("users")
            .update({ role: newRole })
            .eq("id", userId);

        if (error) {
            alert("Error updating role: " + error.message);
        } else {
            location.reload();
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button className="mr-auto p-4 flex items-center gap-4 hover:bg-gray-200" onClick={() => router.push("/")}>
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="mr-auto text-2xl font-bold text-gray-700">Insurance Clouds™</div>
                </button>
            </div>

            {/* Main Section */}
            <div className="flex bg-gray-100 p-8 h-screen justify-center">
                <div className="flex flex-col h-min min-w-[500] bg-white shadow-lg rounded-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : currentUser?.organization_id ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-700 mb-6">{organization?.name}</h1>
                            
                            {/* Members List */}
                            
                            {/* Members List */}
                            <div className="shadow-md rounded-lg overflow-hidden">
                                {members && members.length > 0 ? (
                                    members.map((member) => (
                                        <div
                                            key={member.id}
                                            className={`flex items-center justify-between space-x-4 p-4 border-b border-gray-300 transition ${
                                                member.role == "admin" ? "bg-blue-100" : "bg-green-100"
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
                                                    <div>{member.name}</div>
                                                    <div className="text-xs">{member.email}</div>
                                                </div>
                                            </div>
                                           
                                            <div className="ml-auto text-gray-600">
                                                {currentUser.role === "admin" ? (
                                                    <select
                                                        value={member.role}
                                                        onChange={(e) => updateUserRole(member.id, e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="member">Member</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                ) : (
                                                    <select
                                                        value={member.role}
                                                        disabled
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value={member.role}>{member.role}</option>
                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center p-4 text-gray-500">No members found.</div>
                                )}
                            </div>


                            <div className="text-right">
                                <button onClick={leaveOrganization} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                    Leave Organization
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-xl font-bold text-gray-700 mb-4">Join or Create an Organization</h2>
                            <input type="text" placeholder="Enter Organization ID" className="border p-2 rounded-lg w-full"
                                value={orgIdInput} onChange={(e) => setOrgIdInput(e.target.value)} />
                            <button onClick={joinOrganization} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg">Join</button>
                            <input type="text" placeholder="Organization Name" className="border p-2 rounded-lg w-full mt-4"
                                value={newOrgName} onChange={(e) => setNewOrgName(e.target.value)} />
                            <button onClick={createOrganization} className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg">Create</button>
                        </>
                    )}


                </div>
            </div>
        </>
    );
}
