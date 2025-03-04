"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { Organization, User } from "@/lib/types";

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User & Organization State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [newName, setNewName] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");

    // Fetch Current User from Supabase
    useEffect(() => {
        const fetchUser = async () => {
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

                // Fetch user details from 'users' table
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", userId)
                    .single();

                if (userError || !user) {
                    throw new Error("Failed to load user data.");
                }

                setCurrentUser(user);
                setNewName(user.name);
                setNewEmail(user.email);

                // Fetch organization details if user belongs to one
                if (user.organization_id) {
                    const { data: orgData, error: orgError } = await supabase
                        .from("organizations")
                        .select("*")
                        .eq("id", user.organization_id)
                        .single();

                    if (!orgError) {
                        setOrganization(orgData);
                    }
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    // Update User Info (Name & Email)
    // Update User Info (Name & Email)
    const updateUser = async () => {
        if (!currentUser) return;

        try {
            // Step 1: Update Email in Supabase Auth
            if (newEmail !== currentUser.email) {
                const { error: authError } = await supabase.auth.updateUser({ email: newEmail });

                if (authError) {
                    setError("Error updating email in authentication: " + authError.message);
                    return;
                }

                alert("Email updated! Please check your inbox to confirm the new email.");
            }

            // Step 2: Update User Info in Database
            const { error: userError } = await supabase
                .from("users")
                .update({ name: newName, email: newEmail })
                .eq("id", currentUser.id);

            if (userError) {
                setError("Error updating user profile.");
                return;
            }

            // Step 3: Update Local State
            setCurrentUser({ ...currentUser, name: newName, email: newEmail });

            alert("User information updated successfully!");
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Logout
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/authenticate");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button
                    className="mr-auto p-4 flex items-center gap-4 hover:bg-gray-200"
                    onClick={() => router.push("/")}
                >
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="flex flex-col">
                        <div className="mr-auto text-xl font-bold text-gray-700">{organization?.name || "No Organization"}</div>
                        <div className="mr-auto text-xl font-medium text-gray-700">{currentUser?.name}</div>
                    </div>
                </button>

                <div className="flex pr-4">
                    <button
                        className="ml-auto p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}
                    >
                        <Image
                            src={currentUser?.avatar_url || "/default-profile-picture.jpg"}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                        />
                    </button>
                </div>
            </div>

            {/* Account Section */}
            <div className="bg-gray-100 p-8 flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex">
                        <h1 className="text-2xl font-bold text-gray-700 mb-6">Account Settings</h1>
                        <button
                            className="ml-auto flex h-min bg-red-500 text-white text-xs font-bold rounded-lg py-2 px-2 items-center gap-2"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                    {loading ? (
                        <p className="text-gray-500 text-center">Loading...</p>
                    ) : (
                        <>
                            <center>
                                {/* Profile Picture */}
                                <div className="relative w-[100px] h-[100px]">
                                    <Image
                                        src={currentUser?.avatar_url || "/default-profile-picture.jpg"}
                                        alt="Profile Picture"
                                        width={100}
                                        height={100}
                                        className="rounded-full border"
                                        quality={100}
                                    />
                                    <label className="absolute bottom-0 right-0 bg-gray-700 text-white text-xs p-2 rounded-full cursor-pointer">
                                        <FaUpload />
                                    </label>
                                </div>
                            </center>

                            {/* Update Display Name */}
                            <div className="mt-4">
                                <label className="block text-md font-bold text-gray-700">Full Name</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Update Email */}
                            <div className="mt-4">
                                <label className="block text-md font-bold text-gray-700">Email</label>
                                <div className="flex">
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={updateUser}
                                className="mt-4 w-full px-4 py-2 text-md font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
