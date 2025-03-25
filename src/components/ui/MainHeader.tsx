"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {   } from "react-icons/fa";
import { FaUser,  } from "react-icons/fa6";
import { FaFileAlt, FaBuilding } from "react-icons/fa";
import { User, Organization } from "@/lib/types"; 
import DatabaseService from "@/lib/DatabaseService";


export default function Header() {

    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [organization, setOrganization] = useState<Organization | null>(null);

    // Fetch user and organization data
    useEffect(() => {
        const fetchData = async () => {

            const user = await DatabaseService.getCurrentUser();
            if(user) setCurrentUser(user);

            if (user?.organization_id) {
                const org = await DatabaseService.getCurrentOrganization();
                if (org) setOrganization(org);
            }     
        };

        fetchData();
    }, []);

    return (
        <div className="flex items-center bg-white border-b">
            <button
                className="mr-auto p-4 flex items-center gap-4 transition duration-500 hover:scale-10  hover:animate-pulse"
                onClick={() => router.push("/")}
            >
                <Image className="" src="/logo.png" alt="Logo" width="75" height="75" quality={100} />
                <div className="flex flex-col">
                    <div className="mr-auto text-xl font-semibold ">Insurance Clouds™</div>
                    {/*}
                    <div className="mr-auto text-xl font-bold text-gray-700">{organization?.name}</div>
                    <div className="mr-auto text-xl font-medium text-gray-700">{currentUser?.name}</div>
                    */}
                </div>
            </button>


            <div className="flex ml-auto gap-0.5 pr-3">
                {/* Profile Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-green-500 hover:shadow-md hover:animate-pulse"
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
                        <div className="w-[50px] h-[50px] bg-green-500 flex items-center justify-center rounded-full shadow-md">
                            <FaFileAlt className="text-white text-2xl" />
                        </div>
                    )}
                </button>

                {/* Organization Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-purple-500 hover:shadow-md hover:animate-pulse"
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
                        <div className="w-[50px] h-[50px] bg-purple-500 flex items-center justify-center rounded-full shadow-md">
                            <FaBuilding className="text-white text-2xl" />
                        </div>
                    )}
                </button>

                {/* User Button */}
                <button
                    className="p-1 group relative items-center rounded-full border-2 border-transparent transition-all hover:border-blue-500 hover:shadow-m hover:animate-pulse"
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
                        <div className="w-[50px] h-[50px] bg-blue-500 flex items-center justify-center rounded-full shadow-md">
                            <FaUser className="text-white text-2xl" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
