/**
 * Metrics Section Component - Main KPIs Display
 */

import MetricCard from '../cards/MetricCard';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/formatters';
import { METRIC_TARGETS } from '@/constants/tiendas.constants';
import type { StoreMetrics } from '@/types/tiendas.types';

interface MetricasData {
  sell_through_pct?: number;
  cobertura_ponderada_pct?: number;
  crecimiento_vs_semana_anterior_pct?: number;
  porcentaje_agotados_pct?: number;
  avg_venta_promedio_diaria?: number;
  cobertura_pct?: number;
  ventas_totales_unidades?: number;
  inventario_inicial_total?: number;
  // Target data
  objetivo_ventas_totales_pesos?: number;
  objetivo_ventas_totales_pesos_formatted?: string;
  objetivo_sell_through_pct?: number;
  objetivo_sell_through_formatted?: string;
  objetivo_cobertura_pct?: number;
  objetivo_cobertura_formatted?: string;
  objetivo_cobertura_ponderada_pct?: number;
  objetivo_cobertura_ponderada_formatted?: string;
  objetivo_promedio_dias_inventario?: number;
  objetivo_promedio_dias_inventario_formatted?: string;
  objetivo_porcentaje_agotados_pct?: number;
  objetivo_porcentaje_agotados_formatted?: string;
  objetivo_avg_venta_promedio_diaria?: number;
  objetivo_avg_venta_promedio_diaria_formatted?: string;
  // Variation data
  variacion_ventas_totales_pct?: number;
  variacion_ventas_totales_formatted?: string;
  variacion_cobertura_pct?: number;
  variacion_cobertura_formatted?: string;
  variacion_cobertura_ponderada_pct?: number;
  variacion_cobertura_ponderada_formatted?: string;
  variacion_promedio_dias_inventario_pct?: number;
  variacion_promedio_dias_inventario_formatted?: string;
  variacion_porcentaje_agotados_pct?: number;
  variacion_porcentaje_agotados_formatted?: string;
  variacion_avg_venta_promedio_diaria_pct?: number;
  variacion_avg_venta_promedio_diaria_formatted?: string;
  diferencia_sell_through_pct?: number;
}

interface MetricsSectionProps {
  storeMetrics: StoreMetrics;
  metricasData: MetricasData | null;
  onCardClick?: (cardData: any) => void;
  enableAnalysis?: boolean;
}

export default function MetricsSection({ storeMetrics, metricasData, onCardClick, enableAnalysis = false }: MetricsSectionProps) {
  const sellThroughPct = metricasData?.sell_through_pct ?? 0.2;
  const coberturaPonderadaPct = metricasData?.cobertura_ponderada_pct ?? 0.823;
  const crecimientoPct = metricasData?.crecimiento_vs_semana_anterior_pct ?? 0.125;
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

  // Helper function to format variation with sign
  // Always shows "+" when value is more than objective, "-" when less
  const formatVariation = (value: number): string => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${Math.abs(value).toFixed(1)}%`;
  };

  // Helper function to get arrow icon based on variation
  const getArrowIcon = (variation: number, isInverted: boolean = false) => {
    const isPositive = isInverted ? variation < 0 : variation > 0;
    return isPositive ? (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ) : (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    );
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

  return (
    <>
      {/* Main KPIs - 2 Large Cards */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Ventas Totales */}
        <div
          className={`relative rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-6 text-white shadow-lg transition-all flex flex-col justify-between ${enableAnalysis ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : ''}`}
          onMouseEnter={(e) => {
            if (enableAnalysis) {
              const badge = e.currentTarget.querySelector('.vemio-badge');
              if (badge) badge.classList.remove('hidden');
            }
          }}
          onMouseLeave={(e) => {
            if (enableAnalysis) {
              const badge = e.currentTarget.querySelector('.vemio-badge');
              if (badge) badge.classList.add('hidden');
            }
          }}
          onClick={() => {
            if (enableAnalysis && onCardClick) {
              onCardClick({
                title: 'Ventas Totales',
                value: formatCurrency(storeMetrics.ventasTotales),
                subtitle: `${formatNumber(storeMetrics.unidadesVendidas)} unidades vendidas`,
                storeMetrics,
                metricasData,
              });
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Ventas Totales</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold">
                  {formatCurrency(storeMetrics.ventasTotales)}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  {formatNumber(storeMetrics.unidadesVendidas)} unidades vendidas
                </div>
              </div>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            {metricasData?.variacion_ventas_totales_pct !== undefined && metricasData?.objetivo_ventas_totales_pesos_formatted && metricasData?.objetivo_ventas_totales_pesos !== undefined && (
              <div className="mt-4 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  {(() => {
                    // Verify variation matches actual vs objective
                    const verifiedVariation = verifyVariation(
                      storeMetrics.ventasTotales,
                      metricasData.objetivo_ventas_totales_pesos,
                      metricasData.variacion_ventas_totales_pct
                    );
                    return (
                      <div className={`flex items-center rounded-full px-2 py-1 text-sm ${verifiedVariation >= 0
                        ? 'bg-white/20 text-white'
                        : 'bg-white/10 text-white/80'
                        }`}>
                        {getArrowIcon(verifiedVariation)}
                        <span className="ml-1">{formatVariation(verifiedVariation)}</span>
                      </div>
                    );
                  })()}
                  <span className="text-sm opacity-90">vs Objetivo: {metricasData.objetivo_ventas_totales_pesos_formatted}</span>
                </div>
              </div>
            )}
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div className="h-2 rounded-full bg-white" style={{ width: '82%' }}></div>
            </div>
          </div>
          {/* Vemio Analysis Badge */}
          {enableAnalysis && (
            <div className="vemio-badge absolute top-4 right-4 hidden z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all">
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

        {/* Sell-Through */}
        <div
          className={`relative rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white shadow-lg transition-all flex flex-col justify-between ${enableAnalysis ? 'cursor-pointer hover:shadow-xl hover:scale-[1.02]' : ''}`}
          onMouseEnter={(e) => {
            if (enableAnalysis) {
              const badge = e.currentTarget.querySelector('.vemio-badge');
              if (badge) badge.classList.remove('hidden');
            }
          }}
          onMouseLeave={(e) => {
            if (enableAnalysis) {
              const badge = e.currentTarget.querySelector('.vemio-badge');
              if (badge) badge.classList.add('hidden');
            }
          }}
          onClick={() => {
            if (enableAnalysis && onCardClick) {
              onCardClick({
                title: 'Sell-Through',
                value: formatPercentage(sellThroughPct),
                storeMetrics,
                metricasData,
              });
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">Sell-Through</h3>
              <div className="mt-2">
                <div className="text-3xl font-bold">
                  {formatPercentage(sellThroughPct)}
                </div>
                <div className="text-sm opacity-90 mt-1">
                  Inventario inicial: {formatNumber(metricasData?.inventario_inicial_total || 0)} unidades
                </div>
                <div className="text-xs opacity-75 mt-2 font-mono border-t border-white/20 pt-2">
                  Ventas / (Entradas + Inventario)
                </div>
              </div>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-auto">
            {metricasData?.objetivo_sell_through_pct !== undefined && (
              <div className="mt-4 flex items-center justify-end">
                <div className="flex items-center gap-2">
                  {(() => {
                    // Verify variation matches actual vs objective
                    const calculatedVariation = getSellThroughVariation();
                    const verifiedVariation = verifyVariation(
                      sellThroughPct,
                      metricasData.objetivo_sell_through_pct,
                      calculatedVariation
                    );
                    return (
                      <>
                        <div className={`flex items-center rounded-full px-2 py-1 text-sm ${verifiedVariation >= 0
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-white/80'
                          }`}>
                          {getArrowIcon(verifiedVariation)}
                          <span className="ml-1">{formatVariation(verifiedVariation)}</span>
                        </div>
                        <span className="text-sm opacity-90">vs Objetivo: {formatTargetValue(metricasData.objetivo_sell_through_formatted, true) || `${Math.round(metricasData.objetivo_sell_through_pct * 100)}%`}</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div
                className="h-2 rounded-full bg-white"
                style={{ width: `${Math.min(((sellThroughPct * 100) / METRIC_TARGETS.SELL_THROUGH) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          {/* Vemio Analysis Badge */}
          {enableAnalysis && (
            <div className="vemio-badge absolute top-4 right-4 hidden z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-lg transition-all">
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
      </div>

      {/* Additional Metrics - 5 Small Cards */}
      <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Cobertura Numérica"
          value={`${formatNumber(Math.round(coberturaPct * 100))}%`}
          color="blue"
          size="small"
          showProgress={false}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
          progressValue={100}
          enableAnalysis={enableAnalysis}
          onAnalysisClick={() => {
            if (onCardClick) {
              onCardClick({
                title: 'Cobertura Numérica',
                value: `${formatNumber(Math.round(coberturaPct * 100))}%`,
                storeMetrics,
                metricasData,
              });
            }
          }}
          storeMetrics={storeMetrics}
          metricasData={metricasData}
          targetVariation={metricasData?.variacion_cobertura_pct}
          targetVariationFormatted={metricasData?.variacion_cobertura_formatted}
          targetValue={formatTargetValue(metricasData?.objetivo_cobertura_formatted, true) || (metricasData?.objetivo_cobertura_pct !== undefined ? `${Math.round(metricasData.objetivo_cobertura_pct * 100)}%` : undefined)}
        />

        <MetricCard
          title="Cobertura Ponderada"
          value={formatPercentage(coberturaPonderadaPct)}
          color="green"
          size="small"
          showProgress={false}
          icon={
            <svg className="h-5 w-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          }
          progressValue={((coberturaPonderadaPct * 100) / METRIC_TARGETS.COBERTURA_PONDERADA) * 100}
          enableAnalysis={enableAnalysis}
          onAnalysisClick={() => {
            if (onCardClick) {
              onCardClick({
                title: 'Cobertura Ponderada',
                value: formatPercentage(coberturaPonderadaPct),
                storeMetrics,
                metricasData,
              });
            }
          }}
          storeMetrics={storeMetrics}
          metricasData={metricasData}
          targetVariation={metricasData?.variacion_cobertura_ponderada_pct}
          targetVariationFormatted={metricasData?.variacion_cobertura_ponderada_formatted}
          targetValue={formatTargetValue(metricasData?.objetivo_cobertura_ponderada_formatted, true) || (metricasData?.objetivo_cobertura_ponderada_pct !== undefined ? `${Math.round(metricasData.objetivo_cobertura_ponderada_pct * 100)}%` : undefined)}
        />

        <MetricCard
          title="Días de Inventario"
          value={storeMetrics.diasInventario.toFixed(1)}
          color="red"
          size="small"
          showProgress={false}
          icon={
            <svg className="h-5 w-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          progressValue={(METRIC_TARGETS.DIAS_INVENTARIO / storeMetrics.diasInventario) * 100}
          enableAnalysis={enableAnalysis}
          onAnalysisClick={() => {
            if (onCardClick) {
              onCardClick({
                title: 'Días de Inventario',
                value: storeMetrics.diasInventario.toFixed(1),
                storeMetrics,
                metricasData,
              });
            }
          }}
          storeMetrics={storeMetrics}
          metricasData={metricasData}
          targetVariation={metricasData?.variacion_promedio_dias_inventario_pct}
          targetVariationFormatted={metricasData?.variacion_promedio_dias_inventario_formatted}
          targetValue={metricasData?.objetivo_promedio_dias_inventario_formatted}
          isInverted={true}
        />

        <MetricCard
          title="Tasa de Agotados"
          value={`${tasaQuiebrePct.toFixed(1)}%`}
          color="orange"
          size="small"
          showProgress={false}
          icon={
            <svg className="h-5 w-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
          progressValue={((100 - tasaQuiebrePct) / (100 - METRIC_TARGETS.TASA_QUIEBRE)) * 100}
          enableAnalysis={enableAnalysis}
          onAnalysisClick={() => {
            if (onCardClick) {
              onCardClick({
                title: 'Tasa de Agotados',
                value: `${tasaQuiebrePct.toFixed(1)}%`,
                storeMetrics,
                metricasData,
              });
            }
          }}
          storeMetrics={storeMetrics}
          metricasData={metricasData}
          targetVariation={-95.0}
          targetVariationFormatted={metricasData?.variacion_porcentaje_agotados_formatted}
          targetValue={formatTargetValue(metricasData?.objetivo_porcentaje_agotados_formatted, true) || (metricasData?.objetivo_porcentaje_agotados_pct !== undefined ? `${Math.round(metricasData.objetivo_porcentaje_agotados_pct * 100)}%` : undefined)}
          isInverted={true}
        />

        <MetricCard
          title="Venta Promedio Diaria"
          value={formatCurrency(ventaPromedioDiaria)}
          color="purple"
          size="small"
          showProgress={false}
          icon={
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          progressValue={94.7}
          enableAnalysis={enableAnalysis}
          onAnalysisClick={() => {
            if (onCardClick) {
              onCardClick({
                title: 'Venta Promedio Diaria',
                value: formatCurrency(ventaPromedioDiaria),
                storeMetrics,
                metricasData,
              });
            }
          }}
          storeMetrics={storeMetrics}
          metricasData={metricasData}
          targetVariation={metricasData?.variacion_avg_venta_promedio_diaria_pct}
          targetVariationFormatted={metricasData?.variacion_avg_venta_promedio_diaria_formatted}
          targetValue={metricasData?.objetivo_avg_venta_promedio_diaria_formatted}
        />
      </div>
    </>
  );
}

