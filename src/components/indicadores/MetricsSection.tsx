/**
 * Metrics Section Component - Main KPIs Display
 */

import MetricCard from './cards/MetricCard';
import LargeMetricCard from './cards/LargeMetricCard';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';
import { METRIC_TARGETS } from '@/constants/tiendas.constants';
import type { MetricsSectionProps } from '@/types/metrics.types';
import { PieChartIcon } from '@/icons';
import type { ReactNode } from 'react';
import Popover from '@/components/ui/popover/Popover';
import SingleMetricChart from './SingleMetricChart';

export default function MetricsSection({ storeMetrics, metricasData, onCardClick, enableAnalysis = false, isLoading = false }: MetricsSectionProps) {
  const sellThroughPct = metricasData?.sell_through_pct;
  const coberturaPonderadaPct = metricasData?.cobertura_ponderada_pct;
  const tasaQuiebrePct = metricasData?.porcentaje_agotados_pct;
  const ventaPromedioDiaria = metricasData?.avg_venta_promedio_diaria;
  const coberturaPct = metricasData?.cobertura_pct;

  // Helper function to calculate variation percentage for sell-through
  const getSellThroughVariation = (): number => {
    if (!metricasData?.objetivo_sell_through_pct || metricasData.objetivo_sell_through_pct === 0 || sellThroughPct == null) {
      return 0;
    }
    // Both are in 0-1 format, calculate variation as percentage
    return ((sellThroughPct - metricasData.objetivo_sell_through_pct) / metricasData.objetivo_sell_through_pct) * 100;
  };

  // Helper function to verify and recalculate variation percentage
  // Ensures the displayed variation matches the actual KPI value vs objective
  const verifyVariation = (
    actualValue: number,
    objectiveValue: number,
    storedVariation?: number
  ): number => {
    if (objectiveValue === 0) return 0;
    // Calculate variation: ((actual - objective) / objective) * 100
    const calculatedVariation = ((actualValue - objectiveValue) / objectiveValue) * 100;

    // If stored variation exists and differs significantly (> 0.1%), use calculated value
    if (storedVariation !== undefined && Math.abs(storedVariation - calculatedVariation) > 0.1) {
      console.warn('Variation mismatch detected. Using calculated value:', {
        stored: storedVariation,
        calculated: calculatedVariation,
        actual: actualValue,
        objective: objectiveValue
      });
      return calculatedVariation;
    }

    return storedVariation !== undefined ? storedVariation : calculatedVariation;
  };

  // Helper function to format target value, multiplying by 100 for percentage cards
  const formatTargetValue = (value: string | undefined, isPercentage: boolean = false): string => {
    if (!value) return '';
    if (isPercentage) {
      // For percentage cards, the target is in 0-1 format, multiply by 100
      const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numValue)) {
        return `${Math.round(numValue * 100)}%`;
      }
    }
    return value;
  };

  // Configuration for large metric cards
  const largeMetricCards = [
    {
      id: 'ventas-totales',
      title: 'Ventas Totales',
      value: storeMetrics.ventasTotales != null && storeMetrics.ventasTotales > 0 ? formatCurrency(storeMetrics.ventasTotales) : '-',
      subtitle: storeMetrics.unidadesVendidas != null && storeMetrics.unidadesVendidas > 0 ? `${formatNumber(storeMetrics.unidadesVendidas)} unidades vendidas` : '-',
      icon: (
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ) as ReactNode,
      color: 'green' as const,
      progressValue: 82,
      showProgress: false,
      targetVariation:
        metricasData?.variacion_ventas_totales_pct !== undefined &&
          metricasData?.objetivo_ventas_totales_pesos !== undefined
          ? verifyVariation(
            storeMetrics.ventasTotales,
            metricasData.objetivo_ventas_totales_pesos,
            metricasData.variacion_ventas_totales_pct
          )
          : undefined,
      targetValue: metricasData?.objetivo_ventas_totales_pesos_formatted,
      showTarget:
        metricasData?.variacion_ventas_totales_pct !== undefined &&
        metricasData?.objetivo_ventas_totales_pesos_formatted !== undefined &&
        metricasData?.objetivo_ventas_totales_pesos !== undefined,
    },
    {
      id: 'sell-through',
      title: 'Sell-Through',
      value: sellThroughPct != null ? formatPercentage(sellThroughPct) : '-',
      subtitle: metricasData?.initial_inventory != null ? `Inventario inicial: ${formatNumber(metricasData.initial_inventory)} unidades` : '-',
      icon: <PieChartIcon className="text-white font-bold" /> as ReactNode,
      color: 'blue' as const,
      progressValue: sellThroughPct != null ? Math.min(((sellThroughPct * 100) / METRIC_TARGETS.SELL_THROUGH) * 100, 100) : 0,
      showProgress: false,
      targetVariation:
        metricasData?.objetivo_sell_through_pct !== undefined && sellThroughPct != null
          ? verifyVariation(
            sellThroughPct,
            metricasData.objetivo_sell_through_pct,
            getSellThroughVariation()
          )
          : undefined,
      targetValue:
        metricasData?.objetivo_sell_through_pct !== undefined
          ? formatTargetValue(metricasData.objetivo_sell_through_formatted, true) ||
          `${Math.round(metricasData.objetivo_sell_through_pct * 100)}%`
          : undefined,
      showTarget: metricasData?.objetivo_sell_through_pct !== undefined && sellThroughPct != null,
    },
  ];

  // Configuration for small metric cards
  const smallMetricCards = [
    {
      id: 'cobertura-numerica',
      title: 'Distribución Numérica',
      value: coberturaPct != null ? `${formatNumber(Math.round(coberturaPct * 100))}%` : '-',
      color: 'blue' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: 100,
      targetVariation: metricasData?.variacion_cobertura_pct,
      targetValue: formatTargetValue(metricasData?.objetivo_cobertura_formatted, true) ||
        (metricasData?.objetivo_cobertura_pct !== undefined ? `${Math.round(metricasData.objetivo_cobertura_pct * 100)}%` : undefined),
      isInverted: false,
    },
    {
      id: 'cobertura-ponderada',
      title: 'Cobertura Ponderada',
      value: coberturaPonderadaPct != null ? formatPercentage(coberturaPonderadaPct) : '-',
      color: 'green' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: coberturaPonderadaPct != null ? ((coberturaPonderadaPct * 100) / METRIC_TARGETS.COBERTURA_PONDERADA) * 100 : 0,
      targetVariation: metricasData?.variacion_cobertura_ponderada_pct,
      targetValue: formatTargetValue(metricasData?.objetivo_cobertura_ponderada_formatted, true) ||
        (metricasData?.objetivo_cobertura_ponderada_pct !== undefined ? `${Math.round(metricasData.objetivo_cobertura_ponderada_pct * 100)}%` : undefined),
      isInverted: false,
    },
    {
      id: 'dias-inventario',
      title: 'Días de Inventario',
      value: storeMetrics.diasInventario != null && storeMetrics.diasInventario > 0 ? storeMetrics.diasInventario.toFixed(1) : '-',
      color: 'red' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: storeMetrics.diasInventario > 0 ? (METRIC_TARGETS.DIAS_INVENTARIO / storeMetrics.diasInventario) * 100 : 0,
      targetVariation: metricasData?.variacion_promedio_dias_inventario_pct,
      targetValue: metricasData?.objetivo_promedio_dias_inventario_formatted,
      isInverted: true,
    },
    {
      id: 'tasa-agotados',
      title: 'Tasa de Agotados',
      value: tasaQuiebrePct != null ? `${tasaQuiebrePct.toFixed(1)}%` : '-',
      color: 'orange' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: tasaQuiebrePct != null ? ((100 - tasaQuiebrePct) / (100 - METRIC_TARGETS.TASA_QUIEBRE)) * 100 : 0,
      targetVariation: -95.0,
      targetValue: formatTargetValue(metricasData?.objetivo_porcentaje_agotados_formatted, true) ||
        (metricasData?.objetivo_porcentaje_agotados_pct !== undefined ? `${Math.round(metricasData.objetivo_porcentaje_agotados_pct * 100)}%` : undefined),
      isInverted: true,
    },
    {
      id: 'venta-promedio-diaria',
      title: 'Venta Promedio Diaria',
      value: ventaPromedioDiaria != null && ventaPromedioDiaria > 0 ? formatCurrency(ventaPromedioDiaria) : '-',
      color: 'purple' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: 94.7,
      targetVariation: metricasData?.variacion_avg_venta_promedio_diaria_pct,
      targetValue: metricasData?.objetivo_avg_venta_promedio_diaria_formatted,
      isInverted: false,
    },
  ];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <>
      {/* Large cards skeleton */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
              </div>
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        ))}
      </div>

      {/* Small cards skeleton */}
      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3"></div>
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    </>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {/* Main KPIs - 2 Large Cards */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {largeMetricCards.map((card) => (
          <Popover
            key={card.id}
            position="bottom"
            className="w-full"
            popoverClassName="w-auto"
            trigger={
              <LargeMetricCard
                title={card.title}
                value={card.value}
                subtitle={card.subtitle}
                icon={card.icon}
                color={card.color}
                progressValue={card.progressValue}
                targetVariation={card.targetVariation}
                targetValue={card.targetValue}
                showTarget={card.showTarget}
                showProgress={card.showProgress}
              />
            }
          >
            <div className="p-2 w-[500px] max-w-[90vw]">
              <SingleMetricChart
                metricId={card.id}
                storeMetrics={storeMetrics}
                metricasData={metricasData}
                height={250}
              />
            </div>
          </Popover>
        ))}
      </div>

      {/* Additional Metrics - 4 Small Cards (Cobertura Ponderada hidden) */}
      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {smallMetricCards.filter(card => card.id !== 'cobertura-ponderada').map((card) => (
          <Popover
            key={card.id}
            position="bottom"
            className="w-full"
            popoverClassName="w-auto"
            trigger={
              <MetricCard
                title={card.title}
                value={card.value}
                color={card.color}
                size={card.size}
                showProgress={card.showProgress}
                progressValue={card.progressValue}
                enableAnalysis={enableAnalysis}
                onAnalysisClick={() => {
                  if (onCardClick) {
                    onCardClick({
                      title: card.title,
                      value: card.value,
                      storeMetrics,
                      metricasData,
                    });
                  }
                }}
                storeMetrics={storeMetrics}
                metricasData={metricasData}
                targetVariation={card.targetVariation}
                targetValue={card.targetValue}
                isInverted={card.isInverted}
              />
            }
          >
            <div className="p-2 w-[400px] max-w-[80vw]">
              <SingleMetricChart
                metricId={card.id}
                storeMetrics={storeMetrics}
                metricasData={metricasData}
                height={200}
              />
            </div>
          </Popover>
        ))}
      </div>
    </>
  );
}
