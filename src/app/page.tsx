import Image from "next/image";
import * as React from "react"

export default function Home() {
  return (
    <div className="min-h-screen grid grid-cols-[400px_1fr]">
      {/* Left Panel */}
      <div className="bg-red-300 h-screen sticky top-0 overflow-y-scroll p-4">
        {/* Scrollable Buttons */}
        <div className="flex flex-col gap-4">
          {/* Adding fewer buttons to show scrollbar visibility */}
          {Array.from({ length: 20 }, (_, i) => (
            <button key={i} className="bg-blue-500 text-white px-4 py-2 rounded">
              Button {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center bg-gray-200">
        <h1 className="text-2xl font-bold">Centered Text</h1>
      </div>
    </div>
  );
}