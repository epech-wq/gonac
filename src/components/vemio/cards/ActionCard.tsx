/**
 * Action Card Component
 */

import type { ReactNode } from 'react';
import { formatNumber } from '@/utils/formatters';

interface ActionCardProps {
  title: string;
  tiendas: number;
  tipo: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}

export default function ActionCard({
  title,
  tiendas,
  tipo,
  description,
  icon,
  onClick,
}: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg p-4 border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:border-brand-400 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
      title={description}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 text-brand-600 dark:text-brand-400">
          {icon}
        </div>

        <div className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {formatNumber(tiendas)}
        </div>

        <h4 className="text-sm font-semibold mb-1 text-gray-900 dark:text-white">
          {title}
        </h4>

        <div className="text-xs text-gray-600 dark:text-gray-400">
          {tipo}
        </div>

        <div className="mt-2 text-xs leading-relaxed text-gray-500 dark:text-gray-500">
          {description}
        </div>

        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium rounded-full transition-colors">
          <span>Planificar</span>
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}

