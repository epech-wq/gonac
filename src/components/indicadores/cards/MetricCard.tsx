/**
 * Reusable Metric Card Component
 */

import React from 'react';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  showProgress?: boolean;
  progressValue?: number;
  size?: 'small' | 'large';
  enableAnalysis?: boolean;
  onAnalysisClick?: () => void;
  storeMetrics?: unknown;
  metricasData?: unknown;
  // Target indicator props
  targetVariation?: number;
  targetValue?: string;
  isInverted?: boolean; // For metrics where lower is better (e.g., days inventory, break rate)
}

export default function MetricCard({
  title,
  value,
  subtitle,
  size = 'large',
  storeMetrics,
  metricasData,
  targetVariation,
  targetValue,
  isInverted = false,
}: MetricCardProps) {
  const isSmall = size === 'small';

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
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.03] hover:border-gray-300 dark:hover:border-gray-600 group relative">
      {/* Persistent chart icon button - top right */}
      <button
        className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 group-hover:scale-110"
        aria-label="Ver gráfico"
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

      {/* Header con título e icono */}
      <CardDescription>
        {title}
      </CardDescription>

      {/* Valor principal */}
      <CardTitle className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
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
        <div className="flex items-center justify-between mt-2">
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

