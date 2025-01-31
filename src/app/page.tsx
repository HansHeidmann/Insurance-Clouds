"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">

      <button
        onClick={() => router.push("/form-builder")}
        className="mx-2 px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105"
      >
        Form Builder
      </button>
      <button
        onClick={() => router.push("/form-viewer")}
        className="mx-2 px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition transform hover:scale-105"
      >
        Form Viewer
      </button>
    </div>
  );
}