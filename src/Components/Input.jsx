import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      id,
      type = 'text',
      placeholder = '',
      value,
      onChange,
      required = false,
      className = '',
      ...rest
    },
    ref
  ) => {
    const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`px-3 py-2 rounded-md border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
          {...rest}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
