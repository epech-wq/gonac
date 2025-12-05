/**
 * Custom hook for managing Tiendas data and business logic
 */

import { useMemo } from 'react';
import { useSegmentacionFormatted } from '@/hooks/useSegmentacion';
import { useMetricasFormatted } from '@/hooks/useMetricas';
import { useValorizacionSummary, useTiendasConOportunidades, useVentaIncremental } from '@/hooks/useValorizacion';
import type { StoreMetrics, Opportunity } from '@/types/tiendas.types';
import { DEFAULT_METRICS } from '@/constants/tiendas.constants';
import {
  getOportunidadRiskLevel,
  getOportunidadTitle,
  getOportunidadDescription,
  getOportunidadColor,
} from '@/utils/tiendas.mappers';

export const useTiendasData = (segment?: string) => {
  const { data: segmentacionData, loading: loadingSegmentacion, error: errorSegmentacion } =
    useSegmentacionFormatted({ autoFetch: true });
  const { data: metricasData, loading: loadingMetricas, error: errorMetricas } =
    useMetricasFormatted({ autoFetch: true, segment });
  const { data: valorizacionData, loading: loadingValorizacion } =
    useValorizacionSummary();
  const { data: tiendasConOportunidadesData, loading: loadingTiendasConOportunidades } =
    useTiendasConOportunidades();
  const { data: ventaIncrementalData, loading: loadingVentaIncremental } =
    useVentaIncremental();

  const storeMetrics: StoreMetrics = useMemo(() => ({
    totalTiendas: segmentacionData?.summary.total_tiendas || DEFAULT_METRICS.totalTiendas,
    // Use metricasData from mvw_metricas_consolidadas_segmentadas (respects segment filter)
    // Fallback to segmentacionData if metricasData is not available
    ventasTotales: metricasData?.ventas_totales_pesos !== undefined && metricasData.ventas_totales_pesos !== null
      ? metricasData.ventas_totales_pesos
      : (segmentacionData?.summary.total_ventas_valor
        ? parseFloat(segmentacionData.summary.total_ventas_valor.replace(/[^0-9.-]/g, ''))
        : DEFAULT_METRICS.ventasTotales),
    unidadesVendidas: metricasData?.ventas_totales_unidades !== undefined && metricasData.ventas_totales_unidades !== null
      ? metricasData.ventas_totales_unidades
      : (segmentacionData?.summary.total_ventas_unidades
        ? parseFloat(segmentacionData.summary.total_ventas_unidades.replace(/[^0-9.-]/g, ''))
        : DEFAULT_METRICS.unidadesVendidas),
    ventaPromedio: metricasData?.avg_venta_promedio_diaria
      ? metricasData.avg_venta_promedio_diaria * 7
      : DEFAULT_METRICS.ventaPromedio,
    diasInventario: metricasData?.promedio_dias_inventario !== undefined && metricasData.promedio_dias_inventario !== null
      ? metricasData.promedio_dias_inventario
      : (segmentacionData?.summary.promedio_dias_inventario
        ? parseFloat(segmentacionData.summary.promedio_dias_inventario)
        : DEFAULT_METRICS.diasInventario),
  }), [segmentacionData, metricasData]);

  const opportunities: Opportunity[] = useMemo(() => {
    if (!valorizacionData) {
      return [
        {
          type: 'agotado',
          title: 'Agotado',
          description: 'Riesgo de agotado, escenario de planeación 10 días',
          tiendas: 38,
          impacto: 45000,
          risk: 'Crítico',
          impactoColor: 'text-red-600 dark:text-red-400',
        },
        {
          type: 'caducidad',
          title: 'Exceso de Inventario',
          description: 'Capital de trabajo e inventario de baja rotación',
          tiendas: 28,
          impacto: 52600,
          risk: 'Alto',
          impactoColor: 'text-orange-600 dark:text-orange-400',
        },
        {
          type: 'sinVenta',
          title: 'Venta Crítica',
          description: 'Ventas <= 0 unidades',
          tiendas: 9,
          impacto: 23800,
          risk: 'Crítico',
          impactoColor: 'text-purple-600 dark:text-purple-400',
        },
        {
          type: 'ventaIncremental',
          title: 'Venta Incremental',
          description: 'Oportunidad de optimización de parámetros para incrementar ventas',
          tiendas: ventaIncrementalData?.tiendas || 0,
          impacto: ventaIncrementalData?.impacto || 0,
          risk: 'Alto',
          impactoColor: 'text-green-600 dark:text-green-400',
        },
      ];
    }

    return [
      {
        type: 'agotado',
        title: getOportunidadTitle('agotado'),
        description: getOportunidadDescription('agotado'),
        tiendas: valorizacionData.agotado.tiendas,
        impacto: valorizacionData.agotado.impacto,
        risk: getOportunidadRiskLevel('agotado'),
        impactoColor: getOportunidadColor('agotado'),
      },
      {
        type: 'caducidad',
        title: getOportunidadTitle('caducidad'),
        description: getOportunidadDescription('caducidad'),
        tiendas: valorizacionData.caducidad.tiendas,
        impacto: valorizacionData.caducidad.impacto,
        risk: getOportunidadRiskLevel('caducidad'),
        impactoColor: getOportunidadColor('caducidad'),
      },
      {
        type: 'sinVenta',
        title: getOportunidadTitle('sinVenta'),
        description: getOportunidadDescription('sinVenta'),
        tiendas: valorizacionData.sinVentas.tiendas,
        impacto: valorizacionData.sinVentas.impacto,
        risk: getOportunidadRiskLevel('sinVenta'),
        impactoColor: getOportunidadColor('sinVenta'),
      },
      {
        type: 'ventaIncremental',
        title: 'Venta Incremental',
        description: 'Oportunidad de optimización de parámetros para incrementar ventas',
        tiendas: ventaIncrementalData?.tiendas || 0,
        impacto: ventaIncrementalData?.impacto || 0,
        risk: 'Alto',
        impactoColor: 'text-green-600 dark:text-green-400',
      },
    ];
  }, [valorizacionData, ventaIncrementalData]);

  const segments = useMemo(() => ({
    hot: segmentacionData?.cards.find(c => c.segment.toLowerCase() === 'hot'),
    slow: segmentacionData?.cards.find(c => c.segment.toLowerCase() === 'slow'),
    balanceadas: segmentacionData?.cards.find(c =>
      c.segment.toLowerCase() === 'balanceadas' || c.segment.toLowerCase() === 'balanceada'
    ),
    criticas: segmentacionData?.cards.find(c =>
      c.segment.toLowerCase() === 'criticas' || c.segment.toLowerCase() === 'críticas'
    ),
  }), [segmentacionData]);

  const impactoTotal = useMemo(
    () => opportunities.reduce((sum, op) => sum + op.impacto, 0),
    [opportunities]
  );

  const tiendasConOportunidades = useMemo(() =>
    tiendasConOportunidadesData !== null && tiendasConOportunidadesData !== undefined
      ? tiendasConOportunidadesData.tiendas
      : (valorizacionData
        ? valorizacionData.agotado.tiendas + valorizacionData.caducidad.tiendas + valorizacionData.sinVentas.tiendas
        : 71),
    [tiendasConOportunidadesData, valorizacionData]
  );

  const porcentajeTiendasConOportunidades = useMemo(() =>
    tiendasConOportunidadesData !== null && tiendasConOportunidadesData !== undefined
      ? tiendasConOportunidadesData.porcentaje
      : 0,
    [tiendasConOportunidadesData]
  );

  return {
    // Data
    storeMetrics,
    opportunities,
    segments,
    metricasData,
    impactoTotal,
    tiendasConOportunidades,
    porcentajeTiendasConOportunidades,

    // Loading states
    loading: loadingSegmentacion || loadingMetricas || loadingValorizacion || loadingTiendasConOportunidades || loadingVentaIncremental,
    error: errorSegmentacion || errorMetricas,
  };
};

