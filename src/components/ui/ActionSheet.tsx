"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FaExclamation } from "react-icons/fa";

interface ActionSheetProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  warning: string;
  confirmLabel?: string;
  cancelLabel?: string;
  primaryButtonColorCSS: string;
}

const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onCancel,
  onConfirm,
  title,
  description,
  warning,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  primaryButtonColorCSS
}) => {
  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

        {warning && (
          <div className="flex items-center gap-2 text-red-600 mb-4">
            <FaExclamation className="text-lg" />
            <span className="text-sm">{warning}</span>
          </div>
        )}

        {description && (
          <p className="text-sm text-gray-600 mb-6">{description}</p>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className={`px-4 py-2 rounded ${primaryButtonColorCSS} hover:bg-red-600 text-white text-sm`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ActionSheet;
