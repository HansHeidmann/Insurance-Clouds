"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaSignOutAlt, FaUpload } from "react-icons/fa";
import { Organization, User } from "@/lib/types";
import Header from "@/components/ui/MainHeader";
import DatabaseService from "@/lib/DatabaseService";
import { AuthServices } from "@/lib/AuthServices";

export default function AccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // User & Organization State
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [newFirstName, setNewFirstName] = useState<string>("");
    const [newLastName, setNewLastName] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    
    // Fetch user and organization data
    useEffect(() => {
        const fetchData = async () => {
        
            setLoading(true);
            const user = await DatabaseService.getCurrentUser();

            setCurrentUser(user);
            setNewFirstName(user?.first_name || "");
            setNewLastName(user?.last_name || "");
            setNewEmail(user?.email || "");

            if (user?.organization_id) {
                const org = await DatabaseService.getCurrentOrganization();
                setOrganization(org);
            }
         
            setLoading(false);
            
        };

        fetchData();
    }, []);

    // Handle Updating User Info
    const updateUser = async () => {
        try {
            if (!currentUser) return;
            setLoading(true);
            
            await DatabaseService.updateUser(newName, newEmail);
            alert("Profile updated successfully!");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Logout
    const handleLogout = async () => {
        try {
            await AuthServices.signOut();
            router.push("/authenticate");
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Handle Profile Picture Upload
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setProfileImage(file);
        try {
            setLoading(true);
            await DatabaseService.updateUserAvatar(file);
            const updatedUser = await DatabaseService.getCurrentUser()
            setCurrentUser(updatedUser)
            alert("Profile picture updated!");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <Header />

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
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <FaUpload />
                                    </label>
                                </div>
                            </center>

                            {/* Update Name */}
                            <div className="flex mt-8 gap-4">
                                <div>
                                <label className="block text-md font-bold text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newFirstName}
                                    onChange={(e) => setNewFirstName(e.target.value)}
                                />
                                </div>
                                
                                <div> <label className="block text-md font-bold text-gray-700">Last Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newLastName}
                                    onChange={(e) => setNewLastName(e.target.value)}
                                /></div>
                               
                            </div>

                            {/* Update Email */}
                            <div className="mt-4">
                                <label className="block text-md font-bold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
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
