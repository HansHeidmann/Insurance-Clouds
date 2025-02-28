"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FaSignOutAlt, FaUpload, FaGear } from "react-icons/fa";

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User State
    const [userId, setUserId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [email, setEmail] = useState("");
    const [profileUrl, setProfileUrl] = useState("/default-profile-picture.jpg");

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
                setUserId(userId);

                // Fetch user details from 'users' table
                const { data: user, error: userError } = await supabase
                    .from("users")
                    .select("id, name, email, avatar_url, organization_id")
                    .eq("id", userId)
                    .single();

                if (userError || !user) {
                    throw new Error("Failed to load user data.");
                }

                setDisplayName(user.name || "");
                setEmail(user.email || "");
                setProfileUrl(user.avatar_url || "/default-profile-picture.jpg");

                // Fetch organization name
                if (user.organization_id) {
                    const { data: org, error: orgError } = await supabase
                        .from("organizations")
                        .select("name")
                        .eq("id", user.organization_id)
                        .single();

                    if (!orgError) {
                        setOrganizationName(org.name);
                    }
                } else {
                    setOrganizationName("No Organization");
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    // Update Display Name
    const updateDisplayName = async () => {
        if (!userId) return;

        const { error } = await supabase
            .from("users")
            .update({ name: displayName })
            .eq("id", userId);

        if (error) {
            setError("Error updating display name.");
        } else {
            alert("Display name updated!");
        }
    };

    // Update Email
    const updateEmail = async () => {
        if (!userId) return;

        // Update Supabase Auth email
        const { error: authError } = await supabase.auth.updateUser({ email });

        if (authError) {
            setError("Error updating email in authentication.");
            return;
        }

        // Update email in 'users' table
        const { error: userError } = await supabase
            .from("users")
            .update({ email })
            .eq("id", userId);

        if (userError) {
            setError("Error updating email.");
        } else {
            alert("Email updated! Check your inbox for confirmation.");
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
                        <div className="mr-auto text-xl font-bold text-gray-700">{organizationName}</div>
                        <div className="mr-auto text-xl font-medium text-gray-700">{displayName}</div>
                    </div>
                </button>

                <div className="flex pr-4">
                    <button
                        className="ml-auto p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}
                    >
                        <Image
                            src={profileUrl}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                        />
                    </button>
                </div>
            </div>

            {/* Account Section */}
            <div className="bg-gray-100 p-8 flex-grow flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <div className="flex">
                        <button
                            className="ml-auto flex bg-red-500 text-white text-xs font-bold rounded-lg py-2 px-2 items-center gap-2"
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
                                        src={profileUrl}
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
                                <label className="block text-md font-bold text-gray-700">Name</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                    <button
                                        onClick={updateDisplayName}
                                        className="ml-2 px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>

                            {/* Update Email */}
                            <div className="mt-4">
                                <label className="block text-md font-bold text-gray-700">Email</label>
                                <div className="flex">
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        onClick={updateEmail}
                                        className="ml-2 px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
