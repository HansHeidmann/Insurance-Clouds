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
    const [fullName, setFullName] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

    // Handle Avatar Preview
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    // Upload Avatar to Supabase Storage and Get Public URL
    const uploadAvatar = async (userId: string) => {
        if (!avatarFile) return null;

        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { data, error } = await supabase.storage.from("avatars").upload(filePath, avatarFile, {
            cacheControl: "3600",
            upsert: true,
        });

        if (error) {
            setError("Error uploading avatar.");
            return null;
        }

        // Get Public URL
        const { data: publicURL } = supabase.storage.from("avatars").getPublicUrl(filePath);
        return publicURL.publicUrl;
    };

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
        let avatarUrl = null;

        if (isSignup) {

            if (!fullName) {
                setError("Full Name is required for signup!");
                setLoading(false);
                return;
            }
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
                // Upload avatar to storage
                avatarUrl = await uploadAvatar(user.id);

                // Insert user into users table
                const { error: userError } = await supabase.from("users").insert([
                    {
                        id: user.id,
                        email: user.email,
                        name: fullName,
                        avatar_url: avatarUrl,
                        role: "member",
                        organization_id: null,
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

                {/* Full Name Input (Only for Signup) */}
                {isSignup && (
                    <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </>
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

                {/* Avatar Upload (Only for Signup) */}
                {isSignup && (
                    <>
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                            <label className="text-xs font-medium text-gray-500 mb-1">(optional)</label>
                        </div>
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="mb-3" />
                        {avatarPreview && (
                            <Image
                                src={avatarPreview}
                                alt="Avatar Preview"
                                width={80}
                                height={80}
                                className="rounded-full object-cover mb-3"
                            />
                        )}
                    </>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleAuth}
                    disabled={loading}
                    className={`w-full px-4 py-2 text-md font-semibold text-white 
                        ${isSignup ? "bg-green-600" : "bg-blue-600"} rounded-lg shadow-md transition transform hover:scale-105 
                        ${isSignup ? "hover:bg-green-500" : "hover:bg-blue-500"}
                    `}
                >
                    {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
                </button>

                {/* Toggle Login/Signup */}
                <p className="text-center text-sm mt-4">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button onClick={() => setIsSignup(!isSignup)} className="text-blue-600 font-semibold hover:underline">
                        {isSignup ? "Login" : "Sign Up"}
                    </button>
                </p>
            </div>
        </div>
    );
}
