"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FaUser, FaBuilding, FaFileAlt } from "react-icons/fa";
import { User, Organization } from "@/types"; // Import types

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);

    // Fetch user and organization data
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);

            // Get authenticated user
            const { data: authData, error: authError } = await supabase.auth.getUser();

            if (authError || !authData?.user) {
                router.push("/authenticate");
                return;
            }

            const userId = authData.user.id;

            // Fetch user details from 'users' table
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            if (userError || !userData) {
                setLoading(false);
                return;
            }

            setCurrentUser(userData);

            // If user is in an organization, fetch organization data
            if (userData.organization_id) {
                const { data: orgData, error: orgError } = await supabase
                    .from("organizations")
                    .select("*")
                    .eq("id", userData.organization_id)
                    .single();

                if (!orgError) {
                    setOrganization(orgData);
                }
            }

            setLoading(false);
        };

        fetchUser();

        // Listen for authentication changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                router.push("/authenticate");
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button
                    className="mr-auto p-4 flex items-center gap-4 hover:bg-gray-200"
                    onClick={() => router.push("/")}
                >
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="mr-auto text-xl font-bold text-gray-700">Insurance Clouds™</div>
                </button>

                <div className="pr-4">
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

            {/* Main Content */}
            <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
                {loading ? (
                    <p className="text-gray-500">Checking authentication...</p>
                ) : (
                    <>
                        <h1 className="text-6xl font-bold text-gray-800 mb-4">
                            Welcome {currentUser?.name || ""}
                        </h1>

                        {organization && (
                            <h2 className="text-2xl font-semibold text-gray-600">
                                Organization: {organization.name}
                            </h2>
                        )}

                        {/* Navigation Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                            {/* Forms Button */}
                            <button
                                onClick={() => router.push("/forms")}
                                className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                            >
                                <FaFileAlt className="text-indigo-600 text-4xl mb-2" />
                                <span className="text-lg font-semibold text-gray-800">Forms</span>
                            </button>

                            {/* Organization Button */}
                            <button
                                onClick={() => router.push("/organization")}
                                className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                            >
                                <FaBuilding className="text-green-600 text-4xl mb-2" />
                                <span className="text-lg font-semibold text-gray-800">Organization</span>
                            </button>

                            {/* Profile Button */}
                            <button
                                onClick={() => router.push("/profile")}
                                className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
                            >
                                <FaUser className="text-blue-600 text-4xl mb-2" />
                                <span className="text-lg font-semibold text-gray-800">Profile</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
