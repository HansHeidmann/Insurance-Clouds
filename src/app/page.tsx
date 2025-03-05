"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaBuilding, FaFileAlt, FaHome } from "react-icons/fa";
import { Organization, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";
import { DatabaseService } from "@/lib/DatabaseService";

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);

    // ✅ Fetch user and organization data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // Get the current user
                const user = await DatabaseService.getCurrentUser();

                if (!user) {
                    router.push("/authenticate");
                    return;
                }

                setCurrentUser(user);

                // Fetch organization details if user is in an organization
                if (user.organization_id) {
                    const org = await DatabaseService.getCurrentOrganization(user.organization_id);
                    setOrganization(org);
                }
            } catch (error) {
                console.error("Error fetching user/org:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            
            {/* Header */}
            <Header currentUser={currentUser} organization={organization} />

            {/* Main Content */}
            <div className="bg-gray-100 p-8 flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    
                    <center>
                        <FaHome className="size-60 text-gray-500" />
                    </center>

                    {loading ? (
                        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Loading...</h1>
                    ) : (
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">
                            Welcome back, {currentUser?.name || ""}!
                        </h1>
                    )}

                    {/* Navigation Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                        
                        {/* Forms Button */}
                        <button
                            onClick={() => router.push("/forms")}
                            className="flex flex-col items-center justify-center bg-purple-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-purple-300"
                        >
                            <FaFileAlt className="text-white text-4xl mb-2" />
                            <span className="text-lg font-semibold text-white">Forms</span>
                        </button>

                        {/* Organization Button */}
                        <button
                            onClick={() => router.push("/organization")}
                            className="flex flex-col items-center justify-center bg-green-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-green-300"
                        >
                            <FaBuilding className="text-white text-4xl mb-2" />
                            <span className="text-lg font-semibold text-white">Organization</span>
                        </button>

                        {/* Profile Button */}
                        <button
                            onClick={() => router.push("/profile")}
                            className="flex flex-col items-center justify-center bg-blue-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-blue-300"
                        >
                            <FaUser className="text-white text-4xl mb-2" />
                            <span className="text-lg font-semibold text-white">Profile</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
