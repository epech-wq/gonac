"use client";
import React, { useState, useRef, useEffect } from "react";
import { ComboboxOption } from "@/types/catalogs";

interface MultiLevelComboboxProps {
  label: string;
  options: ComboboxOption[];
  values: Record<string, string[]>; // { 'Estado': ['id1', 'id2'], 'Ciudad': ['id3'] }
  onChange: (level: string, values: string[]) => void;
  disabled?: boolean;
  levelLabels: Record<string, string>; // { 'Estado': 'state', 'Ciudad': 'city' }
}

export const MultiLevelCombobox: React.FC<MultiLevelComboboxProps> = ({
  label,
  options,
  values,
  onChange,
  disabled = false,
  levelLabels,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group options by their group property
  const groupedOptions = options.reduce((acc, option) => {
    const groupName = option.group || 'default';
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(option);
    return acc;
  }, {} as Record<string, ComboboxOption[]>);

  // Count total selected items
  const totalSelected = Object.values(values).reduce((sum, arr) => sum + arr.length, 0);

  // Get display text
  const getDisplayText = () => {
    if (totalSelected === 0) return `Seleccionar ${label}`;
    if (totalSelected === 1) {
      // Find the selected option
      for (const [groupName, selectedIds] of Object.entries(values)) {
        if (selectedIds.length > 0) {
          const option = options.find(opt => opt.value === selectedIds[0]);
          if (option) return option.label;
        }
      }
    }
    return `${totalSelected} seleccionados`;
  };

  const toggleOption = (groupName: string, optionValue: string) => {
    const currentValues = values[groupName] || [];
    const newValues = currentValues.includes(optionValue)
      ? currentValues.filter(v => v !== optionValue)
      : [...currentValues, optionValue];
    onChange(groupName, newValues);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      <div
        className={`
          flex items-center justify-between w-full rounded-lg border px-4 py-2.5 text-sm
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-400" : "bg-white cursor-pointer hover:border-brand-500"}
          ${isOpen ? "border-brand-500 ring-1 ring-brand-500" : "border-gray-300 dark:border-gray-700"}
          dark:bg-gray-800 dark:text-white transition-all
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={totalSelected === 0 ? "text-gray-400" : ""}>
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-2">
          {totalSelected > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 rounded-full">
              {totalSelected}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1 p-2">
            {Object.entries(groupedOptions).map(([groupName, groupOptions]) => (
              <div key={groupName} className="mb-3 last:mb-0">
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{groupName}</span>
                  {values[groupName]?.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(groupName, []);
                      }}
                      className="text-brand-500 hover:text-brand-600 text-xs font-normal normal-case"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {groupOptions.map((option) => {
                    const isSelected = values[groupName]?.includes(option.value) || false;
                    return (
                      <div
                        key={option.value}
                        className={`
                          px-3 py-2 text-sm rounded-md cursor-pointer transition-colors flex items-center gap-2
                          ${isSelected
                            ? "bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}
                        `}
                        onClick={() => toggleOption(groupName, option.value)}
                      >
                        <div className={`
                          w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected
                            ? "bg-brand-500 border-brand-500"
                            : "border-gray-300 dark:border-gray-600"}
                        `}>
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span>{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {totalSelected > 0 && (
            <div className="p-2 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  Object.keys(values).forEach(groupName => {
                    onChange(groupName, []);
                  });
                }}
                className="w-full px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
