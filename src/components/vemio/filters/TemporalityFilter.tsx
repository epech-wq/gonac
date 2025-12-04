/**
 * TemporalityFilter Component
 * Display-only component showing time period buttons (Year, Month, Week)
 * The active button is determined by the defaultActive prop and cannot be changed
 */

"use client";

export type TemporalityPeriod = 'year' | 'month' | 'week';

interface TemporalityFilterProps {
  defaultActive?: TemporalityPeriod;
  onChange?: (period: TemporalityPeriod) => void;
}

export default function TemporalityFilter({
  defaultActive = 'year',
  onChange
}: TemporalityFilterProps) {
  // Fixed active state - buttons are display-only
  const activePeriod = defaultActive;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activePeriod === 'year'
          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/30'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-60'
          }`}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Último Año
      </div>

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activePeriod === 'month'
          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/30'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-60'
          }`}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Último Mes
      </div>

      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activePeriod === 'week'
          ? 'bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md shadow-green-500/30'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 opacity-60'
          }`}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Última Semana
      </div>
    </div>
  );
}
