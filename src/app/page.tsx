"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase client

export default function Home() {
  const router = useRouter();

  // State for login/signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); // Toggle login/signup
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect based on whether user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        router.push("/forms/all"); // Redirects if user is logged in
      }
    };
    checkUser();
  }, [router]);

  
  // Submit Button Pressed
  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Email and Password are required!");
      setLoading(false);
      return;
    }

    let response;
    if (isSignup) {
      // Sign up new user
      response = await supabase.auth.signUp({ email, password });
    } else {
      // Log in existing user
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    setLoading(false);

    if (response.error) {
      setError(response.error.message);
    } else {
      // Redirect to form-builder after successful login/signup
      router.push("/forms");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <center>
          <Image src="/logo.png" alt="" width="100" height="100" quality={100} />
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
          className={`w-full px-4 py-2 text-md font-semibold text-white bg-blue-600 rounded-lg shadow-md transition transform hover:scale-105 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </button>

        {/* Toggle Login/Signup */}
        <p className="text-center text-sm mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-500 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
