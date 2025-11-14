/**
 * Reusable Metric Card Component
 */

import type { ReactNode } from 'react';

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
}: MetricCardProps) {
  const isSmall = size === 'small';
  const barColor = progressColor || PROGRESS_COLORS[color];
  
  return (
    <div className={`rounded-lg bg-white dark:bg-gray-800 ${isSmall ? 'p-4' : 'p-6'} border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow`}>
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
    </div>
  );
}

