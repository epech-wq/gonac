"use client";
import React from "react";

interface MultiSelectButtonsGroupProps {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  className?: string;
  label?: string;
}

export const MultiSelectButtonsGroup: React.FC<MultiSelectButtonsGroupProps> = ({
  options,
  values,
  onChange,
  className = "",
  label,
}) => {
  const toggleOption = (optionValue: string) => {
    if (values.includes(optionValue)) {
      // Remove if already selected
      onChange(values.filter((v) => v !== optionValue));
    } else {
      // Add if not selected
      onChange([...values, optionValue]);
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="inline-flex rounded-lg shadow-sm w-full">
        {options.map((option, index) => {
          const isSelected = values.includes(option.value);
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleOption(option.value)}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium transition-all focus:z-10 focus:ring-2 focus:ring-brand-500 relative
                ${isFirst ? "rounded-l-lg" : "-ml-px"}
                ${isLast ? "rounded-r-lg" : ""}
                ${isSelected
                  ? "bg-brand-500 text-white border border-brand-500 z-10"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}
              `}
            >
              <span className="flex items-center justify-center gap-2">
                {isSelected && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
      {values.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {values.length} seleccionado{values.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};
