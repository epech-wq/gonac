"use client";

import { useSegmentacionFormatted } from "@/hooks/useSegmentacion";
import { useMetricasFormatted } from "@/hooks/useMetricas";

interface TiendasConsolidadasProps {
  data?: any;
}

type RiskLevel = 'Crítico' | 'Alto' | 'Medio';

export default function TiendasConsolidadas({ data }: TiendasConsolidadasProps) {
  // Fetch real data from hooks
  const { data: segmentacionData, loading: loadingSegmentacion, error: errorSegmentacion } = useSegmentacionFormatted({ autoFetch: true });
  const { data: metricasData, loading: loadingMetricas, error: errorMetricas } = useMetricasFormatted({ autoFetch: true });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  const getBadgeColor = (risk: RiskLevel) => {
    switch (risk) {
      case 'Crítico':
        return 'bg-red-500 text-white';
      case 'Alto':
        return 'bg-orange-500 text-white';
      case 'Medio':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // Calculate risk level based on segment data
  const getRiskLevel = (segment: string, diasInventario: number, contribucion: number): RiskLevel => {
    if (segment.toLowerCase() === 'criticas' || segment.toLowerCase() === 'críticas') {
      return 'Crítico';
    }
    if (segment.toLowerCase() === 'hot' && diasInventario < 30) {
      return 'Crítico';
    }
    if (segment.toLowerCase() === 'slow' && diasInventario > 60) {
      return 'Alto';
    }
    return 'Medio';
  };

  // Calculate potential impact (temporary logic until backend provides it)
  const calcularImpacto = (segment: string, ventasValor: number, diasInventario: number, numTiendas: number): number => {
    const ventas = parseFloat(ventasValor.toString().replace(/[^0-9.-]/g, ''));

    if (segment.toLowerCase() === 'hot') {
      // Opportunity: potential lost sales due to stockouts (15% opportunity)
      return ventas * 0.15;
    }
    if (segment.toLowerCase() === 'slow') {
      // Risk: potential expiry/markdown (20% of current inventory value)
      return ventas * 0.20;
    }
    if (segment.toLowerCase() === 'criticas' || segment.toLowerCase() === 'críticas') {
      // Critical: high risk of total loss (30% of inventory value)
      return ventas * 0.30;
    }
    // Balanceadas: optimization opportunity (5% improvement potential)
    return ventas * 0.05;
  };

  // Parse and prepare store data
  const storeData = {
    totalTiendas: segmentacionData?.summary.total_tiendas || 127,
    ventasTotales: segmentacionData?.summary.total_ventas_valor
      ? parseFloat(segmentacionData.summary.total_ventas_valor.replace(/[^0-9.-]/g, ''))
      : 120619,
    unidadesVendidas: segmentacionData?.summary.total_ventas_unidades
      ? parseFloat(segmentacionData.summary.total_ventas_unidades.replace(/[^0-9.-]/g, ''))
      : 8450,
    ventaPromedio: metricasData?.avg_venta_promedio_diaria
      ? metricasData.avg_venta_promedio_diaria * 7 // Convert daily to weekly
      : 949.75,
    diasInventario: segmentacionData?.summary.promedio_dias_inventario
      ? parseFloat(segmentacionData.summary.promedio_dias_inventario)
      : 45.2,
  };

  // Map segment names to display titles
  const getSegmentTitle = (segment: string): string => {
    const normalized = segment.toLowerCase();
    if (normalized === 'hot') return 'Prevenir Agotados';
    if (normalized === 'slow') return 'Acelerar Venta';
    if (normalized === 'criticas' || normalized === 'críticas') return 'Recuperación';
    if (normalized === 'balanceadas' || normalized === 'balanceada') return 'Optimización';
    return segment;
  };

  const getSegmentSubtitle = (segment: string): string => {
    const normalized = segment.toLowerCase();
    if (normalized === 'hot') return 'Hot';
    if (normalized === 'slow') return 'Slow';
    if (normalized === 'criticas' || normalized === 'críticas') return 'Críticas';
    if (normalized === 'balanceadas' || normalized === 'balanceada') return 'Balanceadas';
    return segment;
  };

  const getImpactoColor = (segment: string): string => {
    const normalized = segment.toLowerCase();
    if (normalized === 'hot') return 'text-red-600 dark:text-red-400';
    if (normalized === 'slow') return 'text-orange-600 dark:text-orange-400';
    if (normalized === 'criticas' || normalized === 'críticas') return 'text-purple-600 dark:text-purple-400';
    return 'text-green-600 dark:text-green-400';
  };

  // Build opportunities from real data
  const oportunidades = segmentacionData?.cards.map(card => {
    const diasInv = parseFloat(card.dias_inventario);
    const contribucion = parseFloat(card.contribucion_porcentaje);
    const ventasValor = parseFloat(card.ventas_valor.replace(/[^0-9.-]/g, ''));

    return {
      title: getSegmentTitle(card.segment),
      subtitle: getSegmentSubtitle(card.segment),
      tiendas: card.num_tiendas_segmento,
      impacto: calcularImpacto(card.segment, ventasValor, diasInv, card.num_tiendas_segmento),
      risk: getRiskLevel(card.segment, diasInv, contribucion),
      impactoColor: getImpactoColor(card.segment),
    };
  }) || [
      {
        title: 'Prevenir Agotados',
        subtitle: 'Hot',
        tiendas: 38,
        impacto: 45000,
        risk: 'Crítico' as RiskLevel,
        impactoColor: 'text-red-600 dark:text-red-400',
      },
      {
        title: 'Acelerar Venta',
        subtitle: 'Slow',
        tiendas: 28,
        impacto: 52600,
        risk: 'Alto' as RiskLevel,
        impactoColor: 'text-orange-600 dark:text-orange-400',
      },
      {
        title: 'Recuperación',
        subtitle: 'Críticas',
        tiendas: 9,
        impacto: 23800,
        risk: 'Crítico' as RiskLevel,
        impactoColor: 'text-purple-600 dark:text-purple-400',
      },
      {
        title: 'Optimización',
        subtitle: 'Balanceadas',
        tiendas: 52,
        impacto: 18200,
        risk: 'Medio' as RiskLevel,
        impactoColor: 'text-green-600 dark:text-green-400',
      },
    ];

  // Find specific segments for actions
  const hotSegment = segmentacionData?.cards.find(c => c.segment.toLowerCase() === 'hot');
  const slowSegment = segmentacionData?.cards.find(c => c.segment.toLowerCase() === 'slow');
  const criticasSegment = segmentacionData?.cards.find(c => c.segment.toLowerCase() === 'criticas' || c.segment.toLowerCase() === 'críticas');

  const acciones = [
    {
      title: 'Prevenir Quiebres',
      tiendas: hotSegment?.num_tiendas_segmento || 38,
      tipo: 'Hot',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
    },
    {
      title: 'Acelerar Ventas',
      tiendas: slowSegment?.num_tiendas_segmento || 28,
      tipo: 'Slow',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: 'Visitas Campo',
      tiendas: criticasSegment?.num_tiendas_segmento || 9,
      tipo: 'Críticas',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'Optimizar Stock',
      tiendas: storeData.totalTiendas,
      tipo: 'Todas las tiendas',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
  ];

  const impactoTotal = oportunidades.reduce((sum, op) => sum + op.impacto, 0);

  // Calculate stores with opportunities (exclude balanceadas)
  const tiendasConOportunidades = segmentacionData?.cards
    .filter(c => {
      const seg = c.segment.toLowerCase();
      return seg === 'hot' || seg === 'slow' || seg === 'criticas' || seg === 'críticas';
    })
    .reduce((sum, c) => sum + c.num_tiendas_segmento, 0) || 71;

  const porcentajeTiendasConOportunidades = ((tiendasConOportunidades / storeData.totalTiendas) * 100).toFixed(0);

  const loading = loadingSegmentacion || loadingMetricas;
  const error = errorSegmentacion || errorMetricas;

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de tiendas...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 shadow-sm border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">Error al cargar datos: {error.message}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Mostrando datos de ejemplo</p>
        </div>
      )}
      {/* Main Card - Visita Consolidada */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
              <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Todas las Tiendas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resumen general del universo de tiendas y oportunidades detectadas
              </p>
            </div>
          </div>
        </div>

        {/* Store Metrics - 5 Cards */}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-3 border border-blue-200 dark:border-blue-800">
            <div className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">
              Total Tiendas
            </div>
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {formatNumber(storeData.totalTiendas)}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
              100% del universo
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-3 border border-green-200 dark:border-green-800">
            <div className="text-xs font-medium text-green-700 dark:text-green-300 mb-1">
              Ventas Totales
            </div>
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {formatCurrency(storeData.ventasTotales)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
              Semana actual
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-3 border border-purple-200 dark:border-purple-800">
            <div className="text-xs font-medium text-purple-700 dark:text-purple-300 mb-1">
              Unidades Vendidas
            </div>
            <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {formatNumber(storeData.unidadesVendidas)}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400 mt-0.5">
              Semana actual
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-3 border border-orange-200 dark:border-orange-800">
            <div className="text-xs font-medium text-orange-700 dark:text-orange-300 mb-1">
              Venta Promedio
            </div>
            <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
              {formatCurrency(storeData.ventaPromedio)}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
              Por tienda/semana
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 p-3 border border-cyan-200 dark:border-cyan-800">
            <div className="text-xs font-medium text-cyan-700 dark:text-cyan-300 mb-1">
              Días Inventario
            </div>
            <div className="text-xl font-bold text-cyan-900 dark:text-cyan-100">
              {storeData.diasInventario.toFixed(1)}
            </div>
            <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">
              Promedio ponderado
            </div>
          </div>
        </div>

        {/* Áreas de Oportunidades */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Áreas de Oportunidades Identificadas
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {oportunidades.map((oportunidad, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-white dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Risk Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getBadgeColor(oportunidad.risk)}`}>
                    {oportunidad.risk}
                  </span>
                </div>

                <div className="mb-2">
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                    {oportunidad.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatNumber(oportunidad.tiendas)} tiendas afectadas
                  </p>
                </div>

                <div className="mt-3">
                  <div className={`text-2xl font-bold mb-0.5 ${oportunidad.impactoColor}`}>
                    {formatCurrency(oportunidad.impacto)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Impacto potencial
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impacto Total Banner */}
        <div className="mt-8 rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 p-6 text-white shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium opacity-90 mb-2">
                Impacto Total
              </div>
              <div className="text-4xl font-bold mb-1">
                {formatCurrency(impactoTotal)}
              </div>
              <div className="text-sm opacity-90">
                Suma de todas las oportunidades detectadas
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-full">
                <div className="text-sm font-medium opacity-90 mb-2">
                  Tiendas con Oportunidades
                </div>
                <div className="text-4xl font-bold mb-1">
                  {formatNumber(tiendasConOportunidades)}
                </div>
                <div className="text-sm opacity-90">
                  {porcentajeTiendasConOportunidades}% del total requiere acción
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones Recomendadas */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Acciones Recomendadas a Nivel General
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {acciones.map((accion, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 border hover:shadow-md transition-shadow ${index === 0
                  ? 'bg-gray-900 dark:bg-black border-gray-900 dark:border-black'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700'
                  }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`mb-2 ${index === 0 ? 'text-white' : 'text-brand-600 dark:text-brand-400'}`}>
                    {accion.icon}
                  </div>

                  <div className={`text-2xl font-bold mb-1 ${index === 0 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {formatNumber(accion.tiendas)}
                  </div>

                  <h4 className={`text-sm font-semibold mb-0.5 ${index === 0 ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    {accion.title}
                  </h4>

                  <div className={`text-xs ${index === 0 ? 'text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                    tiendas {accion.tipo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors shadow-sm">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Ver Plan de Acción Consolidado
          </button>

          <button className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors shadow-sm border border-gray-300 dark:border-gray-600">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Análisis Completo
          </button>
        </div>
      </div>
    </div>
  );
}
