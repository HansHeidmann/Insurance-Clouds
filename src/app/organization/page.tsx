"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

type User = {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role: string;
    organization_id: string | null;
};

type Organization = {
    id: string;
    name: string;
    admin_id: string;
};

export default function OrganizationPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orgIdInput, setOrgIdInput] = useState(""); // Join organization input
    const [newOrgName, setNewOrgName] = useState(""); // Create organization input

    // Fetch the current user and organization data
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
                    .select("id, name, role")
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
            // Insert into organizations table
            const { data, error } = await supabase
                .from("organizations")
                .insert([{ name: newOrgName, admin_id: currentUser?.id }])
                .select("id")
                .single();

            if (error) {
                alert("Error creating organization: " + error.message);
                return;
            }

            // Update user with new organization_id
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

    return (
        <>
            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button className="mr-auto p-4 flex items-center gap-4 hover:bg-gray-200" onClick={() => router.push("/")}>
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="mr-auto text-2xl font-bold text-gray-700">Insurance Clouds™</div>
                </button>

                <div className="flex gap-4 items-center pr-4">
                    <div className="flex flex-col">
                        <div className="ml-auto text-xl font-bold text-gray-700">
                            {organization?.name || "No Organization"}
                        </div>
                        <div className="ml-auto text-xl font-medium text-gray-700">
                            {currentUser ? currentUser.name : "Loading..."}
                        </div>
                    </div>

                    <button className="ml-auto p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}>
                        <Image src={currentUser?.avatar_url || "/default-profile-picture.jpg"} alt="Profile"
                            width={50} height={50} className="rounded-full object-cover" />
                    </button>
                </div>
            </div>

            {/* Organization Section */}
            <div className="bg-gray-100 p-8 min-h-screen flex justify-center">
                <div className="bg-white w-full max-w-4xl shadow-lg rounded-lg p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : currentUser?.organization_id ? (
                        <>
                            <h1 className="text-2xl font-bold text-gray-700 mb-6">{organization?.name}</h1>

                            {/* Members Table */}
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h2 className="text-lg font-bold text-gray-700 mb-3">Members</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200 text-gray-700">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Member Name</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.length > 0 ? (
                                            members.map((member) => (
                                                <tr key={member.id} className="bg-white hover:bg-gray-50">
                                                    <td className="border border-gray-300 px-4 py-2">{member.name}</td>
                                                    <td className="border border-gray-300 px-4 py-2">{member.role}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={2} className="text-center p-4 text-gray-500">No members found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="text-right">
                                <button onClick={leaveOrganization}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
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
