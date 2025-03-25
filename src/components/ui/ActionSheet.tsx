"use client";

import React from "react";
import { createPortal } from "react-dom";
import { FaExclamation } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

interface ActionSheetProps {
visible: boolean;

title: string;
description: string;
warning?: string;

primaryLabel: string;
primaryButtonColorCSS: string;
primaryButtonColorHoverCSS: string;
primaryAction: () => void;

secondaryLabel: string;
secondaryButtonColorCSS: string;
secondaryButtonColorHoverCSS: string;
secondaryAction: () => void;



}

const ActionSheet: React.FC<ActionSheetProps> = ({
visible,

title,
description,
warning,

primaryLabel = "OK",
primaryButtonColorCSS,
primaryButtonColorHoverCSS,

secondaryLabel = "Cancel",
secondaryButtonColorCSS,
secondaryButtonColorHoverCSS,

primaryAction,
secondaryAction,

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
            <div className="mb-4 bg-yellow-200 p-4 rounded-md whitespace-nowrap">
                <div className="flex gap-2 items-center">
                    <FaTriangleExclamation className="text-lg text-red-500" />
                    <div className="text-sm">{warning}</div>
                </div>
            </div>
        )}

        {description && (
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        )}

        <div className="flex justify-end gap-3">
        <button
            className={`px-4 py-2 rounded ${secondaryButtonColorCSS} ${secondaryButtonColorHoverCSS} text-gray-800 text-sm`}
            onClick={secondaryAction}
        >
            {secondaryLabel}
        </button>
        <button
            className={`px-4 py-2 rounded ${primaryButtonColorCSS} ${primaryButtonColorHoverCSS} text-white text-sm`}
            onClick={primaryAction}
        >
            {primaryLabel}
        </button>
        </div>
    </div>
    </div>,
    document.body
);
};

export default ActionSheet;
