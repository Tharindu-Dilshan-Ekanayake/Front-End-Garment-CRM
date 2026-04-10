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
        className={`h-11 px-3 rounded-md border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
      />
      {error && (
          <span className="mt-1 text-xs font-medium text-right text-red-500">
           {error}
          </span>
      )}
    </div>
  );
}
