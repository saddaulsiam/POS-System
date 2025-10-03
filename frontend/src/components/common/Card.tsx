import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = "", padding = true, hover = false }) => {
  const paddingStyle = padding ? "p-6" : "";
  const hoverStyle = hover ? "hover:shadow-lg transition-shadow duration-200" : "";

  return (
    <div className={`bg-white rounded-lg shadow ${paddingStyle} ${hoverStyle} ${className}`.trim()}>{children}</div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "", actions }) => {
  return (
    <div className={`pb-4 mb-4 border-b border-gray-200 ${className}`.trim()}>
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">{children}</h3>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = "" }) => {
  return <div className={className}>{children}</div>;
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "", align = "right" }) => {
  const alignStyles = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div className={`pt-4 mt-4 border-t border-gray-200 flex gap-2 ${alignStyles[align]} ${className}`.trim()}>
      {children}
    </div>
  );
};
