"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function FormViewer() {
  const router = useRouter();
  const [formId, setFormId] = useState("");

  const handleSubmit = () => {
    if (formId.trim()) {
      router.push(`/form-viewer/${formId}`);
    }
  };
  //
  //
  //#Microfreak25!

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Enter Form ID</h1>

      <input
        type="text"
        placeholder="Form ID"
        value={formId}
        onChange={(e) => setFormId(e.target.value)}
        className="p-2 border rounded w-64 text-center mb-4"
      />

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!formId.trim()}
      >
        View Form
      </button>
    </div>
  );
}
