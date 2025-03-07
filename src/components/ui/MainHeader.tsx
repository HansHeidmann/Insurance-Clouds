"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {   } from "react-icons/fa";
import { FaUser,  } from "react-icons/fa6";
import { FaFileAlt, FaBuilding } from "react-icons/fa";
import { User, Organization } from "@/lib/types"; // Import types
import { AuthServices } from "@/lib/AuthServices";

interface HeaderProps {
    currentUser: User | null;
    organization: Organization | null;
}

export default function Header({ currentUser, organization }: HeaderProps) {
    const router = useRouter();

    return (
        <div className="flex items-center bg-white border-b">
            <button
                className="mr-auto p-4 flex items-center gap-4 hover:bg-gray-200"
                onClick={() => router.push("/")}
            >
                <Image src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                <div className="flex flex-col">
                    <div className="mr-auto text-xl font-bold text-gray-700">{organization?.name}</div>
                    <div className="mr-auto text-xl font-medium text-gray-700">{currentUser?.name}</div>
                </div>
            </button>

            <button
                onClick={() => AuthServices.signOut()}
            >
                Logout test
            </button>

            <div className="flex ml-auto gap-0.5 pr-3">
                {/* Profile Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-purple-500 hover:shadow-md"
                    onClick={() => router.push("/forms")}
                >
                    {currentUser?.avatar_url ? (
                        <Image
                            src={currentUser?.avatar_url}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                            quality={100}
                        />
                    ) : (
                        <div className="w-[50px] h-[50px] bg-purple-500 flex items-center justify-center rounded-full">
                            <FaFileAlt className="text-white text-2xl" />
                        </div>
                    )}
                </button>

                {/* Organization Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-green-500 hover:shadow-md"
                    onClick={() => router.push("/organization")}
                >
                    {organization?.avatar_url ? (
                        <Image
                            src={organization?.avatar_url}
                            alt="Organization"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                            quality={100}
                        />
                    ) : (
                        <div className="w-[50px] h-[50px] bg-green-500 flex items-center justify-center rounded-full">
                            <FaBuilding className="text-white text-2xl" />
                        </div>
                    )}
                </button>

                {/* User Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-md"
                    onClick={() => router.push("/profile")}
                >
                    {currentUser?.avatar_url ? (
                        <Image
                            src={currentUser?.avatar_url}
                            alt="Profile"
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                            quality={100}
                        />
                    ) : (
                        <div className="w-[50px] h-[50px] bg-blue-500 flex items-center justify-center rounded-full">
                            <FaUser className="text-white text-2xl" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
