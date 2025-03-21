import React from "react";
import {
  FaCaretLeft,
  FaCaretRight,
  FaArrowLeft,
  FaArrowRight,
  FaGripLinesVertical,
} from "react-icons/fa";
import { FaArrowsLeftRightToLine, FaTrash, FaXmark } from "react-icons/fa6";

interface FloatingToolbarProps {
  x: number;
  y: number;
  onDelete: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
  onExpand?: () => void;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  x,
  y,
  onDelete,
  onMoveLeft,
  onMoveRight,
  onExpand,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${y}px`,
        left: `${x}px`,
        transform: "translate(-50%, -100%)",
        zIndex: 1000,
      }}
      className="flex items-center bg-white border border-gray-300 rounded-xl shadow-xl px-3 py-2 space-x-2 transition-all"
    >
      {/* Move Left */}
      <button
        onClick={onMoveLeft}
        className="p-2 rounded-md transition-colors hover:bg-blue-500 hover:text-white"
        title="Move Left"
      >
        <FaCaretLeft className="w-4 h-4" />
      </button>

      {/* Move Right */}
      <button
        onClick={onMoveRight}
        className="p-2 rounded-md transition-colors hover:bg-blue-500 hover:text-white"
        title="Move Right"
      >
        <FaCaretRight className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Expand Full Width */}
      <button
        onClick={onExpand}
        className="p-2 rounded-md transition-colors hover:bg-indigo-500 hover:text-white"
        title="Expand"
      >
        <FaArrowsLeftRightToLine className="w-4 h-4" />
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Center Grip */}
      <div
        className="p-2 rounded-md flex items-center transition-colors hover:bg-purple-400 hover:text-white"
        title="Shrink"
      >
        <FaArrowRight className="w-2 h-2" />
        <FaGripLinesVertical className="w-2 h-3 " />
        <FaArrowLeft className="w-2 h-2" />
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-gray-300 mx-1" />

      {/* Delete */}
      <button
        onClick={onDelete}
        className="p-2 rounded-md text-black-600 transition-colors hover:bg-red-500 hover:text-white"
        title="Delete"
      >
        <FaXmark className="w-4 h-4 subpixel-antialiased" />
      </button>
    </div>
  );
};

export default FloatingToolbar;
