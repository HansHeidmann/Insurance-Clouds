"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";

export default function Authenticate() {
    const router = useRouter();

    // State for login/signup
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true); // Track authentication check

    // Check if user is already logged in
    useEffect(() => {
        const checkUser = async () => {
            const { data: session } = await supabase.auth.getSession();
            if (session?.session) {
                router.push("/"); // Redirect to home if already logged in
                return;
            }
            setCheckingAuth(false); // Allow form to load
        };

        checkUser();

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.push("/"); // Redirect when logged in
            }
        });

        return () => {
            listener.subscription.unsubscribe(); // Cleanup listener
        };
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

        let authResponse;
        if (isSignup) {
            // Sign Up (New User)
            authResponse = await supabase.auth.signUp({
                email,
                password,
            });

            if (authResponse.error) {
                setError(authResponse.error.message || "Signup failed");
                setLoading(false);
                return;
            }

            const user = authResponse.data.user;
            if (user) {
                // Insert into users table
                const { error: userError } = await supabase.from("users").insert([
                    {
                        id: user.id,
                        email: user.email,
                        name: email.split("@")[0], // Use email prefix as default name
                        avatar_url: null,
                        role: "member",
                        organization_id: null
                    }
                ]);

                if (userError) {
                    setError("Failed to create user profile.");
                    setLoading(false);
                    return;
                }
            }
        } else {
            // Log In (Existing User)
            authResponse = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authResponse.error) {
                setError(authResponse.error.message || "Login failed");
                setLoading(false);
                return;
            }
        }

        setLoading(false);
        router.push("/"); // Redirect on success
    };

    // Prevent showing the form until authentication check is complete
    if (checkingAuth) {
        return <div className="flex items-center justify-center h-screen text-gray-600">Checking authentication...</div>;
    }

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <center>
                    <Image src="/logo.png" alt="Logo" width="100" height="100" quality={100} />
                </center>
                <h1 className="text-2xl pt-4 pb-8 font-bold text-center">Insurance Clouds™</h1>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                {/* Email Input */}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* Password Input */}
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
                    className={`w-full px-4 py-2 text-md font-semibold text-white 
                        ${isSignup ? "bg-green-600" : "bg-blue-600"}  rounded-lg shadow-md transition transform hover:scale-105 
                        ${isSignup ? "hover:bg-green-500" : "hover:bg-blue-500"}
                    `}
                >
                    {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-sm mt-4">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        onClick={() => setIsSignup(!isSignup)}
                        className={`${isSignup ? "text-blue-600" : "text-green-600"} font-semibold hover:underline`}
                    >
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}
