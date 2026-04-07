import React from 'react';

export default function InputComponent({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
}) {
  return (
    <div className="flex flex-col w-full gap-1 mb-4">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-left text-gray-dark"
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`h-10 px-3 rounded border border-gray-light focus:outline-none focus:border-blue focus:ring-1 focus:ring-blue text-gray-dark ${className}  border-black`}
      />
      {error && (
        <span className="mt-1 text-xs text-orange">{error}</span>
      )}
    </div>
  );
}
