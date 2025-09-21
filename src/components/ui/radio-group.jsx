import React from 'react';

export const RadioGroup = ({ 
  value, 
  onValueChange, 
  children, 
  className = "", 
  name,
  ...props 
}) => {
  return (
    <div className={`grid gap-2 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            checked: child.props.value === value,
            onChange: () => onValueChange && onValueChange(child.props.value),
            name: name || 'radio-group' // Use the name prop passed to RadioGroup
          });
        }
        return child;
      })}
    </div>
  );
};

export const RadioGroupItem = ({ 
  value, 
  checked = false, 
  onChange, 
  name,
  className = "", 
  ...props 
}) => {
  return (
    <input
      type="radio"
      value={value}
      checked={checked}
      onChange={onChange}
      name={name}
      className={`h-4 w-4 border-gray-300 text-burgundy-500 focus:ring-burgundy-500 focus:ring-2 focus:ring-offset-2 cursor-pointer ${className}`}
      {...props}
    />
  );
};
