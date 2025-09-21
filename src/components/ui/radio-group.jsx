import React from 'react';

export const RadioGroup = ({ 
  value, 
  onValueChange, 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div className={`grid gap-2 ${className}`} {...props}>
      {React.Children.map(children, (child) => 
        React.cloneElement(child, { 
          checked: child.props.value === value,
          onChange: () => onValueChange && onValueChange(child.props.value)
        })
      )}
    </div>
  );
};

export const RadioGroupItem = ({ 
  value, 
  checked = false, 
  onChange, 
  className = "", 
  ...props 
}) => {
  return (
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 ${className}`}
      {...props}
    />
  );
};
