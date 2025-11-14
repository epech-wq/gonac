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

const COLOR_VARIANTS = {
  green: 'from-green-500 to-green-600',
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600',
  purple: 'from-purple-500 to-purple-600',
};

const BADGE_COLORS = {
  green: 'text-green-100 bg-green-600/30',
  blue: 'text-blue-100 bg-blue-600/30',
  red: 'text-red-100 bg-red-600/30',
  orange: 'text-orange-100 bg-orange-600/30',
  purple: 'text-purple-100 bg-purple-600/30',
};

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  color,
  showProgress = true,
  progressValue = 0,
  progressColor = 'bg-white',
  badge,
  size = 'large',
}: MetricCardProps) {
  const isSmall = size === 'small';
  
  return (
    <div className={`rounded-lg bg-gradient-to-br ${COLOR_VARIANTS[color]} ${isSmall ? 'p-4' : 'p-6'} text-white shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`${isSmall ? 'text-sm' : 'text-lg'} font-medium opacity-90`}>
          {title}
        </h4>
        <div className={`rounded-full bg-white/20 ${isSmall ? 'p-2' : 'p-3'}`}>
          {icon}
        </div>
      </div>
      
      <div className={`${isSmall ? 'text-2xl' : 'text-3xl'} font-bold mb-1`}>
        {value}
      </div>
      
      {subtitle && (
        <div className={`${isSmall ? 'text-xs' : 'text-sm'} opacity-90 mb-3`}>
          {subtitle}
        </div>
      )}
      
      {showProgress && (
        <div className={`${isSmall ? 'h-1.5' : 'h-2'} rounded-full bg-white/20`}>
          <div 
            className={`${isSmall ? 'h-1.5' : 'h-2'} rounded-full ${progressColor}`} 
            style={{ width: `${Math.min(progressValue, 100)}%` }}
          ></div>
        </div>
      )}
      
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

