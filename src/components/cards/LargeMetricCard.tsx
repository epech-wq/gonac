/**
 * Large Metric Card Component
 * Used for prominent KPI displays like Ventas Totales and Sell-Through
 */

import React, { type ReactNode } from 'react';
import { Card, CardTitle } from '../ui/card';
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
}: LargeMetricCardProps) {
  // Helper function to format variation with sign
  const formatVariation = (val: number): string => {
    const sign = val >= 0 ? '+' : '-';
    return `${sign}${Math.abs(val).toFixed(1)}%`;
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <div className="mt-2">
            <div className="text-3xl font-bold">
              {value}
            </div>
            <div className="text-sm mt-1">
              {subtitle}
            </div>
          </div>
        </div>
        <div className={`rounded-full bg-gradient-to-br ${GRADIENT_COLORS[color]} p-3`}>
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
      <div className={`mt-2 h-2 rounded-full ${PROGRESS_BG_COLORS[color]}`}>
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${GRADIENT_COLORS[color]}`}
          style={{ width: `${Math.min(Math.max(progressValue, 0), 100)}%` }}
        />
      </div>
    </Card>
  );
}
