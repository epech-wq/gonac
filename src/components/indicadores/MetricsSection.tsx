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

export default function MetricsSection({ storeMetrics, metricasData, onCardClick, enableAnalysis = false }: MetricsSectionProps) {
  const sellThroughPct = metricasData?.sell_through_pct ?? 0.2;
  const coberturaPonderadaPct = metricasData?.cobertura_ponderada_pct ?? 0.823;
  const tasaQuiebrePct = metricasData?.porcentaje_agotados_pct ?? 2.3;
  const ventaPromedioDiaria = metricasData?.avg_venta_promedio_diaria ?? (storeMetrics.ventaPromedio / 7);
  const coberturaPct = metricasData?.cobertura_pct ?? 0.83;

  // Helper function to calculate variation percentage for sell-through
  const getSellThroughVariation = (): number => {
    if (!metricasData?.objetivo_sell_through_pct || metricasData.objetivo_sell_through_pct === 0) {
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
      value: formatCurrency(storeMetrics.ventasTotales),
      subtitle: `${formatNumber(storeMetrics.unidadesVendidas)} unidades vendidas`,
      icon: (
        <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ) as ReactNode,
      color: 'green' as const,
      progressValue: 82,
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
      value: formatPercentage(sellThroughPct),
      subtitle: `Inventario inicial: ${formatNumber(66732)} unidades`,
      icon: <PieChartIcon className="text-white font-bold" /> as ReactNode,
      color: 'blue' as const,
      progressValue: Math.min(((sellThroughPct * 100) / METRIC_TARGETS.SELL_THROUGH) * 100, 100),
      targetVariation:
        metricasData?.objetivo_sell_through_pct !== undefined
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
      showTarget: metricasData?.objetivo_sell_through_pct !== undefined,
    },
  ];

  // Configuration for small metric cards
  const smallMetricCards = [
    {
      id: 'cobertura-numerica',
      title: 'Cobertura Numérica',
      value: `${formatNumber(Math.round(coberturaPct * 100))}%`,
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
      value: formatPercentage(coberturaPonderadaPct),
      color: 'green' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: ((coberturaPonderadaPct * 100) / METRIC_TARGETS.COBERTURA_PONDERADA) * 100,
      targetVariation: metricasData?.variacion_cobertura_ponderada_pct,
      targetValue: formatTargetValue(metricasData?.objetivo_cobertura_ponderada_formatted, true) ||
        (metricasData?.objetivo_cobertura_ponderada_pct !== undefined ? `${Math.round(metricasData.objetivo_cobertura_ponderada_pct * 100)}%` : undefined),
      isInverted: false,
    },
    {
      id: 'dias-inventario',
      title: 'Días de Inventario',
      value: storeMetrics.diasInventario.toFixed(1),
      color: 'red' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: (METRIC_TARGETS.DIAS_INVENTARIO / storeMetrics.diasInventario) * 100,
      targetVariation: metricasData?.variacion_promedio_dias_inventario_pct,
      targetValue: metricasData?.objetivo_promedio_dias_inventario_formatted,
      isInverted: true,
    },
    {
      id: 'tasa-quiebre',
      title: 'Tasa de Quiebre',
      value: `${tasaQuiebrePct.toFixed(1)}%`,
      color: 'orange' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: ((100 - tasaQuiebrePct) / (100 - METRIC_TARGETS.TASA_QUIEBRE)) * 100,
      targetVariation: -95.0,
      targetValue: formatTargetValue(metricasData?.objetivo_porcentaje_agotados_formatted, true) ||
        (metricasData?.objetivo_porcentaje_agotados_pct !== undefined ? `${Math.round(metricasData.objetivo_porcentaje_agotados_pct * 100)}%` : undefined),
      isInverted: true,
    },
    {
      id: 'venta-promedio-diaria',
      title: 'Venta Promedio Diaria',
      value: formatCurrency(ventaPromedioDiaria),
      color: 'purple' as const,
      size: 'small' as const,
      showProgress: false,
      progressValue: 94.7,
      targetVariation: metricasData?.variacion_avg_venta_promedio_diaria_pct,
      targetValue: metricasData?.objetivo_avg_venta_promedio_diaria_formatted,
      isInverted: false,
    },
  ];

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

      {/* Additional Metrics - 5 Small Cards */}
      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-5">
        {smallMetricCards.map((card) => (
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
