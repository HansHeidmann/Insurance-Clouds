"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FaUser, FaBuilding, FaFileAlt } from "react-icons/fa";

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState("/default-profile-picture.jpg");

    // Check authentication status using Supabase
    useEffect(() => {
        const checkUser = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (!data.session) {
                console.log("nooope");
                
                router.push("/authenticate");
                return;
            }

            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
                setUser(userData.user);
                setAvatarUrl(userData.user.user_metadata?.avatar_url || "/default-profile-picture.jpg");
            }

            setLoading(false);
        };

        checkUser();

        // Listen for auth changes (logout/login)
        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
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
                            src={avatarUrl}
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
                            Welcome {user?.email || ""}
                        </h1>

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
