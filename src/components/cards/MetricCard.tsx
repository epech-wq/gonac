/**
 * Reusable Metric Card Component
 */

import React, { type ReactNode } from 'react';
import { Card, CardDescription, CardTitle } from '../ui/card';
import Badge from '../ui/badge/Badge';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
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
  // Target indicator props
  targetVariation?: number;
  targetValue?: string;
  isInverted?: boolean; // For metrics where lower is better (e.g., days inventory, break rate)
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
  targetVariation,
  targetValue,
  isInverted = false,
}: MetricCardProps) {
  const isSmall = size === 'small';
  const barColor = progressColor || PROGRESS_COLORS[color];
  const [showBadge, setShowBadge] = React.useState(false);

  // Helper function to format variation with sign
  // Always shows "+" when value is more than objective, "-" when less
  const formatVariation = (val: number): string => {
    const sign = val >= 0 ? '+' : '-';
    return `${sign}${Math.abs(val).toFixed(1)}%`;
  };

  // Helper function to verify and recalculate variation percentage
  // Ensures the displayed variation matches the actual KPI value vs objective
  const verifyVariation = (
    actualValue: number,
    objectiveValue: number | undefined,
    storedVariation: number | undefined,
    isPercentage: boolean = false
  ): number | undefined => {
    if (objectiveValue === undefined || objectiveValue === 0) {
      return storedVariation;
    }

    // For percentage values, they might be in 0-1 format
    const actual = isPercentage ? actualValue : actualValue;
    const objective = isPercentage ? objectiveValue : objectiveValue;

    // Calculate variation: ((actual - objective) / objective) * 100
    const calculatedVariation = ((actual - objective) / objective) * 100;

    // If stored variation exists and differs significantly (> 0.1%), use calculated value
    if (storedVariation !== undefined && Math.abs(storedVariation - calculatedVariation) > 0.1) {
      console.warn('Variation mismatch detected in MetricCard. Using calculated value:', {
        stored: storedVariation,
        calculated: calculatedVariation,
        actual: actualValue,
        objective: objectiveValue,
        title
      });
      return calculatedVariation;
    }

    return storedVariation !== undefined ? storedVariation : calculatedVariation;
  };

  // Helper function to get arrow icon based on variation
  const getArrowIcon = (variation: number) => {
    const isPositive = isInverted ? variation < 0 : variation > 0;
    return isPositive ? (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
  };

  return (
    <Card>
      {/* Header con título e icono */}
      <CardDescription>
        {title}
      </CardDescription>

      {/* Valor principal */}
      <CardTitle>
        {value}
      </CardTitle>

      {/* Subtítulo */}
      {subtitle && (
        <div className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mb-3`}>
          {subtitle}
        </div>
      )}

      {/* Target Indicator */}
      {targetVariation !== undefined && targetValue && (
        <div className="flex items-center justify-between">
          {(() => {
            // Extract actual value and objective from metricasData if available
            let verifiedVariation = targetVariation;

            if (metricasData) {
              // Determine actual and objective values based on metric type
              let actualVal: number | undefined;
              let objectiveVal: number | undefined;
              let isPct = false;

              if (title === 'Cobertura Numérica' && metricasData.cobertura_pct !== undefined) {
                actualVal = metricasData.cobertura_pct;
                objectiveVal = metricasData.objetivo_cobertura_pct;
                isPct = true;
              } else if (title === 'Cobertura Ponderada' && metricasData.cobertura_ponderada_pct !== undefined) {
                actualVal = metricasData.cobertura_ponderada_pct;
                objectiveVal = metricasData.objetivo_cobertura_ponderada_pct;
                isPct = true;
              } else if (title === 'Días de Inventario' && storeMetrics?.diasInventario !== undefined) {
                actualVal = storeMetrics.diasInventario;
                objectiveVal = metricasData.objetivo_promedio_dias_inventario;
              } else if (title === 'Tasa de Quiebre' && metricasData.porcentaje_agotados_pct !== undefined && targetVariation !== -95.0) {
                // Skip recalculation if targetVariation is hardcoded to -95.0
                actualVal = metricasData.porcentaje_agotados_pct;
                objectiveVal = metricasData.objetivo_porcentaje_agotados_pct;
                isPct = true;
              } else if (title === 'Venta Promedio Diaria' && metricasData.avg_venta_promedio_diaria !== undefined) {
                actualVal = metricasData.avg_venta_promedio_diaria;
                objectiveVal = metricasData.objetivo_avg_venta_promedio_diaria;
              }

              if (actualVal !== undefined && objectiveVal !== undefined) {
                verifiedVariation = verifyVariation(actualVal, objectiveVal, targetVariation, isPct) ?? targetVariation;
              }
            }

            return (
              <div className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${(isInverted ? verifiedVariation < 0 : verifiedVariation > 0)
                ? 'bg-green-50 text-green-700 dark:bg-green-500/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                }`}>
                {getArrowIcon(verifiedVariation)}
                <span>{formatVariation(verifiedVariation)}</span>
              </div>
            );
          })()}
          <span className={`${isSmall ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400`}>
            vs Objetivo: {targetValue}
          </span>
        </div>
      )}
    </Card>
  );
}

