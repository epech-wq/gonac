/**
 * Large Metric Card Component
 * Used for prominent KPI displays like Ventas Totales and Sell-Through
 */

import React, { type ReactNode } from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon } from '@/icons';

interface LargeMetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'red' | 'orange' | 'purple';
  progressValue: number; // 0-100
  targetVariation?: number;
  targetValue?: string;
  showTarget?: boolean;
  showProgress?: boolean;
}

// Gradient colors for icons and progress bars
const GRADIENT_COLORS = {
  green: 'from-green-500 to-green-600',
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
};

// Light background colors for progress bars
const PROGRESS_BG_COLORS = {
  green: 'bg-green-100',
  blue: 'bg-blue-100',
  red: 'bg-red-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
};

// Badge colors for variations
const BADGE_COLORS = {
  positive: 'bg-green-100 text-green-700',
  negative: 'bg-red-100 text-red-700',
};

export default function LargeMetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
  progressValue,
  targetVariation,
  targetValue,
  showTarget = true,
  showProgress = true,
}: LargeMetricCardProps) {
  // Helper function to format variation with sign
  const formatVariation = (val: number): string => {
    const sign = val >= 0 ? '+' : '-';
    return `${sign}${Math.abs(val).toFixed(1)}%`;
  };

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-600 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {/* Persistent chart icon button */}
            <button
              className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 group-hover:scale-110"
              aria-label="Ver gráfico histórico"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              {value}
            </div>
            <div className="text-sm mt-1">
              {subtitle}
            </div>
          </div>
        </div>
        <div className={`rounded-full bg-gradient-to-br ${GRADIENT_COLORS[color]} p-3 group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>

      {/* Target Variation Indicator */}
      {showTarget && targetVariation !== undefined && targetValue && (
        <div className="mt-4 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className={`flex items-center rounded-full px-2 py-1 text-sm ${targetVariation >= 0
              ? BADGE_COLORS.positive
              : BADGE_COLORS.negative
              }`}>
              {ArrowUpIcon}
              <span className="ml-1">{formatVariation(targetVariation)}</span>
            </div>
            <span className="text-sm">vs Objetivo: {targetValue}</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div className={`mt-2 h-2 rounded-full ${PROGRESS_BG_COLORS[color]}`}>
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${GRADIENT_COLORS[color]} transition-all duration-300`}
            style={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
}
