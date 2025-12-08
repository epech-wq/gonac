"use client";
import React from "react";

interface ButtonsGroupProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export const ButtonsGroup: React.FC<ButtonsGroupProps> = ({
  options,
  value,
  onChange,
  className = "",
  label,
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-400">
          {label}
        </label>
      )}
      <div className="inline-flex rounded-lg shadow-sm w-full">
        {options.map((option, index) => {
          const isSelected = value === option.value;
          const isFirst = index === 0;
          const isLast = index === options.length - 1;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`
                flex-1 px-4 py-2.5 text-sm font-medium transition-all focus:z-10 focus:ring-2 focus:ring-brand-500
                ${isFirst ? "rounded-l-lg" : "-ml-px"}
                ${isLast ? "rounded-r-lg" : ""}
                ${isSelected
                  ? "bg-brand-500 text-white border border-brand-500 z-10"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"}
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
