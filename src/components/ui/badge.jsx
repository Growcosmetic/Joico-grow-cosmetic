import React from 'react';

export const Badge = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  
  const variants = {
    default: "bg-burgundy-500 text-white",
    secondary: "bg-gray-100 text-gray-900",
    destructive: "bg-red-500 text-white",
    outline: "border border-burgundy-500 text-burgundy-500",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white"
  };
  
  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

