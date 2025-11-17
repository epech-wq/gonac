/**
 * Reusable Metric Card Component
 */

import React, { type ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  color: 'green' | 'blue' | 'red' | 'orange' | 'purple';
  showProgress?: boolean;
  progressValue?: number;
  progressColor?: string;
  badge?: string;
  size?: 'small' | 'large';
  enableAnalysis?: boolean;
  onAnalysisClick?: () => void;
  storeMetrics?: any;
  metricasData?: any;
}

// Colores para iconos - más saturados y distintivos
const ICON_COLORS = {
  green: 'text-green-600 dark:text-green-400',
  blue: 'text-blue-600 dark:text-blue-400',
  red: 'text-red-600 dark:text-red-400',
  orange: 'text-orange-600 dark:text-orange-400',
  purple: 'text-purple-600 dark:text-purple-400',
};

// Fondos de iconos - sutiles
const ICON_BG_COLORS = {
  green: 'bg-green-50 dark:bg-green-500/10',
  blue: 'bg-blue-50 dark:bg-blue-500/10',
  red: 'bg-red-50 dark:bg-red-500/10',
  orange: 'bg-orange-50 dark:bg-orange-500/10',
  purple: 'bg-purple-50 dark:bg-purple-500/10',
};

// Colores de barras de progreso
const PROGRESS_COLORS = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  purple: 'bg-purple-500',
};

const BADGE_COLORS = {
  green: 'text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-500/20',
  blue: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-500/20',
  red: 'text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-500/20',
  orange: 'text-orange-700 bg-orange-100 dark:text-orange-300 dark:bg-orange-500/20',
  purple: 'text-purple-700 bg-purple-100 dark:text-purple-300 dark:bg-purple-500/20',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
  showProgress = true,
  progressValue = 0,
  progressColor,
  badge,
  size = 'large',
  enableAnalysis = false,
  onAnalysisClick,
  storeMetrics,
  metricasData,
}: MetricCardProps) {
  const isSmall = size === 'small';
  const barColor = progressColor || PROGRESS_COLORS[color];
  const [showBadge, setShowBadge] = React.useState(false);
  
  return (
    <div 
      className={`relative rounded-lg bg-white dark:bg-gray-800 ${isSmall ? 'p-4' : 'p-6'} border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer ${enableAnalysis ? 'hover:border-brand-300 dark:hover:border-brand-600' : ''}`}
      onMouseEnter={() => enableAnalysis && setShowBadge(true)}
      onMouseLeave={() => enableAnalysis && setShowBadge(false)}
      onClick={() => enableAnalysis && onAnalysisClick && onAnalysisClick()}
    >
      {/* Header con título e icono */}
      <div className="flex items-center justify-between mb-3">
        <h4 className={`${isSmall ? 'text-xs' : 'text-sm'} font-medium text-gray-600 dark:text-gray-400`}>
          {title}
        </h4>
        <div className={`rounded-lg ${ICON_BG_COLORS[color]} ${isSmall ? 'p-2' : 'p-2.5'} ${ICON_COLORS[color]}`}>
          {icon}
        </div>
      </div>
      
      {/* Valor principal */}
      <div className={`${isSmall ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 dark:text-white mb-1`}>
        {value}
      </div>
      
      {/* Subtítulo */}
      {subtitle && (
        <div className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mb-3`}>
          {subtitle}
        </div>
      )}
      
      {/* Barra de progreso con color específico */}
      {showProgress && (
        <div className={`${isSmall ? 'h-1.5' : 'h-2'} rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`}>
          <div 
            className={`${isSmall ? 'h-1.5' : 'h-2'} rounded-full ${barColor} transition-all duration-300`} 
            style={{ width: `${Math.min(progressValue, 100)}%` }}
          ></div>
        </div>
      )}
      
      {/* Badge opcional */}
      {badge && (
        <div className="mt-2">
          <span className={`text-xs font-medium ${BADGE_COLORS[color]} px-2 py-1 rounded-full`}>
            {badge}
          </span>
        </div>
      )}

      {/* Vemio Analysis Badge - appears on hover */}
      {enableAnalysis && showBadge && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Vemio Analysis
          </span>
        </div>
      )}
    </div>
  );
}

