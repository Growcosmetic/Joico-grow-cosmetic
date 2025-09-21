import React from 'react';

export const Checkbox = ({ 
  checked = false, 
  onCheckedChange, 
  disabled = false,
  className = "", 
  ...props 
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
      disabled={disabled}
      className={`h-4 w-4 rounded border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
};
