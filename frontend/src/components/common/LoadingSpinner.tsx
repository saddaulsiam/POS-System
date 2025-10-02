import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "" }) => {
  return (
    <div className={`flex justify-center items-center ${className}`} role="status" aria-label="Loading">
      <svg
        className="animate-spin h-10 w-10 text-blue-600 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
