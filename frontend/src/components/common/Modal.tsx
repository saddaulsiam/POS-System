import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  closeOnOverlayClick?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}) => {
  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className={`bg-white rounded-lg shadow-xl ${sizeStyles[size]} w-full max-h-[90vh] flex flex-col`}>
        {/* Header */}
        {title && (
          <div className="flex justify-between items-start px-6 py-4 border-b">
            {typeof title === "string" ? (
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            ) : (
              <div className="flex-1">{title}</div>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none focus:outline-none ml-4 flex-shrink-0"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-4 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">{footer}</div>}
      </div>
    </div>
  );
};
