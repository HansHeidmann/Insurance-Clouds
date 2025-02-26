"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    organizationName: JSON;
    email: string;
    avatarURL: string;
};

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User info
    const [user, setUser] = useState<User | null>(null);
    const [displayName, setDisplayName] = useState("");
    const [organizationName, setOrganizationName] = useState("");
    const [email, setEmail] = useState("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileUrl, setProfileUrl] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const { data, error } = await supabase.auth.getUser();

            setLoading(false);
        };

        fetchUser();
    }, []);

    // Handle Profile Picture Upload
    const uploadProfilePicture = async () => {

    };

    // Handle Display Name Update
    const updateDisplayName = async () => {
        const { error } = await supabase.auth.updateUser({ displayName });
        if (error) {
            setError("Error updating email.");
            return;
        }
        // need to update "name" in the users table as well
    };

    // Handle Email Update
    const updateEmail = async () => {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) {
            setError("Error updating email.");
            return;
        }
        // need to update user email in the users table as well


        alert("Email updated! Check your inbox for confirmation.");
    };

    // Handle Password Update
    const updatePassword = async () => {
        if (!password) return;

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError("Error updating password.");
            return;
        }

        alert("Password updated!");
    };

    // Logout Function
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <div className="flex items-center bg-white border-b">
                <button
                    className="mr-auto p-4 flex items-center gap-4  hover:bg-gray-200"
                    onClick={() => router.push("/forms/all")}
                >
                    <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                    <div className="flex flex-col">
                        <div className="mr-auto text-xl font-bold text-gray-700">{organizationName || "[organizationName]"} </div>
                        <div className="mr-auto text-xl font-medium text-gray-700">{displayName}</div>
                    </div>
                </button>

                <div className="flex pr-4">
                    <button
                        className="ml-auto p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                        onClick={() => router.push("/profile")}
                    >
                        <Image
                            src="/default-profile-picture.jpg"
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
                            onClick={() => supabase.auth.signOut()}
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
                                    src={profileUrl || "/default-profile-picture.jpg"}
                                    alt="Profile Picture"
                                    layout="fill"
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
                                    placeholder="John Doe"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                />
                                <button
                                            onClick={()=>{router.push("/organization")}}
                                            className=" items-center mt-4 px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700"
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
                                            onClick={()=>{router.push("/organization")}}
                                            className="items-center mt-4 px-4 py-2 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-700"
                                        >
                                          
                                            Update
                                    </button>
                                </div>
                            </div>

                            {/* Update Organization */}
                            <div className="mt-4">
                                <label className="block text-md font-bold text-gray-700">Organization</label>
                                <div className="flex ">
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={organizationName}
                                        disabled
                                    />
                                    <button
                                        onClick={()=>{router.push("/organization")}}
                                        className="flex gap-1 items-center mt-4 px-4 py-2 text-sm font-bold bg-green-500 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <FaGear />
                                        Settings
                                    </button>
                                </div>
                            </div>
                        

                            {/* Update Button */}
                            <center>
                                
                            </center>

                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
