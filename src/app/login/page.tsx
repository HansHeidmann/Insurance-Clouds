// /app/login/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthServices } from "@/lib/AuthServices";

export default function Authenticate() {
    const router = useRouter();

    // State for login/signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await AuthServices.getAuthUser();
            if (currentUser) {
                router.push("/"); // Redirect when logged in
            }
        };

        checkUser();
    }, [router]);

    // Handle login/signup
    const handleAuth = async () => {
        setError(null);
        setLoading(true);

        if (!email || !password) {
            setError("Email and Password are required!");
            setLoading(false);
            return;
        }

        try {
            if (isSignup) {
                if (!firstName || !lastName) {
                    setError("Full Name is required for signup!");
                    setLoading(false);
                    return;
                }

                // Sign Up (New User)
                await AuthServices.signUp(firstName, lastName, email, password);
            } else {
                // Log In (Existing User)
                await AuthServices.signIn(email, password);
            }

            router.push("/"); // Redirect on success
        } catch (err) {
            setError(String(err) || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <center>
                    <Image src="/logo.png" alt="Logo" width="100" height="100" quality={100} />
                </center>
                <h1 className="text-2xl pt-4 pb-8 font-bold text-center">Insurance Clouds™</h1>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {/* Full Name Input (Only for Signup) */}
                {isSignup && (
                    <div className="flex gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Email Input */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* Submit Button */}
                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className={`w-full px-4 py-2 text-md font-semibold text-white ${
                        isSignup ? "bg-blue-500" : "bg-blue-500"
                    } rounded-lg shadow-md transition transform hover:scale-95 ${
                        isSignup ? "hover:bg-blue-600" : "hover:bg-blue-600"
                    }`}
                >
                    {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-sm mt-4">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}