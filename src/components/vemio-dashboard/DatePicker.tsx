"use client";
import React, { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Seleccionar fecha",
  className = "",
  minDate,
  maxDate,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (inputRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: "Y-m-d",
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates, dateStr) => {
          onChange(dateStr);
        },
        disableMobile: true, // Use flatpickr on mobile devices too
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, []);

  // Update options when props change
  useEffect(() => {
    if (flatpickrInstance.current) {
      flatpickrInstance.current.set("minDate", minDate);
      flatpickrInstance.current.set("maxDate", maxDate);
    }
  }, [minDate, maxDate]);

  // Update value when prop changes
  useEffect(() => {
    if (flatpickrInstance.current && value !== undefined) {
      flatpickrInstance.current.setDate(value || "", false);
    }
  }, [value]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        readOnly
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  );
};

export default DatePicker;


