"use client";

import { useState, useEffect, useMemo } from 'react';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { useCambioInventario } from '@/hooks/useCambioInventario';

interface TransferenciaInventario {
  id: string;
  sku: string;
  producto: string;
  tiendaOrigen: string;
  tiendaDestino: string;
  unidades: number;
  valorInventario: number;
  diasInventarioOrigenInicial: number;
  diasInventarioOrigenFinal: number;
  diasInventarioDestinoInicial: number;
  diasInventarioDestinoFinal: number;
  segmentoOrigen: 'slow' | 'dead' | 'critica';
  segmentoDestino: 'hot' | 'balanceada';
}

interface TiendaDetalle {
  id: string;
  nombre: string;
  segmento: string;
  unidadesMovilizar: number;
  valorMovilizar: number;
  diasInventarioInicial: number;
  diasInventarioFinal: number;
  skus: number;
}

interface SKUDetalle {
  id: string;
  sku: string;
  producto: string;
  unidadesMovilizar: number;
  valorMovilizar: number;
  tiendasOrigen: number;
  tiendasDestino: number;
  diasInventarioPromedioOrigenInicial: number;
  diasInventarioPromedioOrigenFinal: number;
  diasInventarioPromedioDestinoInicial: number;
  diasInventarioPromedioDestinoFinal: number;
}

interface CambioInventarioCardProps {
  showTitle?: boolean;
  showConfig?: boolean;
  onChatOpen?: (cardData: any) => void;
  onAprobar?: () => void;
  onAjustar?: () => void;
}

export default function CambioInventarioCard({
  showTitle = true,
  showConfig = false,
  onChatOpen,
  onAprobar,
  onAjustar
}: CambioInventarioCardProps) {
  // Fetch data from database
  const { data: simulacionData, loading, error } = useCambioInventario({ autoFetch: true });

  // Parámetros de Simulación (from database, editable)
  const [maxNivelInventarioDestino, setMaxNivelInventarioDestino] = useState<number>(30);
  const [costoLogisticoPorcentaje, setCostoLogisticoPorcentaje] = useState<number>(5);
  const [minUnidadesMoverA, setMinUnidadesMoverA] = useState<number>(10);
  const [minUnidadesMoverDesde, setMinUnidadesMoverDesde] = useState<number>(20);

  // Estados para vistas de detalle
  const [showDetailByTienda, setShowDetailByTienda] = useState(false);
  const [showDetailBySKU, setShowDetailBySKU] = useState(false);

  // Update local state when data is loaded from database
  useEffect(() => {
    if (simulacionData?.data) {
      setMaxNivelInventarioDestino(simulacionData.data.max_dias_inventario_destino);
      setCostoLogisticoPorcentaje(simulacionData.data.costo_logistico_pct);
      setMinUnidadesMoverA(simulacionData.data.min_unidades_mover_a_tienda);
      setMinUnidadesMoverDesde(simulacionData.data.min_unidades_mover_desde_tienda);
    }
  }, [simulacionData]);

  // Datos de ejemplo de transferencias - enfocado en Slow y Dead stores con riesgo de caducidad
  const transferencias: TransferenciaInventario[] = useMemo(() => [
    {
      id: '1',
      sku: 'SKU-001',
      producto: 'Producto A 500g',
      tiendaOrigen: 'Tienda 045 - Zona Norte',
      tiendaDestino: 'Tienda 012 - Centro',
      unidades: 48,
      valorInventario: 14400,
      diasInventarioOrigenInicial: 85,
      diasInventarioOrigenFinal: 60,
      diasInventarioDestinoInicial: 3,
      diasInventarioDestinoFinal: 12,
      segmentoOrigen: 'slow',
      segmentoDestino: 'hot'
    },
    {
      id: '2',
      sku: 'SKU-003',
      producto: 'Producto C 1kg',
      tiendaOrigen: 'Tienda 078 - Periferia',
      tiendaDestino: 'Tienda 023 - Plaza Principal',
      unidades: 36,
      valorInventario: 12960,
      diasInventarioOrigenInicial: 92,
      diasInventarioOrigenFinal: 68,
      diasInventarioDestinoInicial: 2,
      diasInventarioDestinoFinal: 10,
      segmentoOrigen: 'dead',
      segmentoDestino: 'hot'
    },
    {
      id: '3',
      sku: 'SKU-005',
      producto: 'Producto E 750g',
      tiendaOrigen: 'Tienda 091 - Suburbio',
      tiendaDestino: 'Tienda 012 - Centro',
      unidades: 24,
      valorInventario: 8640,
      diasInventarioOrigenInicial: 78,
      diasInventarioOrigenFinal: 55,
      diasInventarioDestinoInicial: 4,
      diasInventarioDestinoFinal: 11,
      segmentoOrigen: 'slow',
      segmentoDestino: 'balanceada'
    },
    {
      id: '4',
      sku: 'SKU-002',
      producto: 'Producto B 250g',
      tiendaOrigen: 'Tienda 045 - Zona Norte',
      tiendaDestino: 'Tienda 034 - Comercial',
      unidades: 60,
      valorInventario: 10800,
      diasInventarioOrigenInicial: 88,
      diasInventarioOrigenFinal: 65,
      diasInventarioDestinoInicial: 5,
      diasInventarioDestinoFinal: 15,
      segmentoOrigen: 'slow',
      segmentoDestino: 'hot'
    }
  ], []);

  // Calcular métricas de impacto (ROI) - from database or calculated
  const metricas = useMemo(() => {
    // Use database data if available, otherwise calculate from mock transferencias
    if (simulacionData?.data) {
      return {
        inventarioMovilizarUnidades: simulacionData.data.inventario_movilizar_unidades,
        inventarioMovilizarValor: simulacionData.data.inventario_movilizar_pesos,
        numTiendasOrigen: simulacionData.data.num_tiendas_origen,
        numTiendasDestino: simulacionData.data.num_tiendas_destino,
        diasInventarioCriticasInicial: simulacionData.data.dias_inventario_critico_inicial,
        diasInventarioCriticasFinal: simulacionData.data.dias_inventario_critico_final,
        diasInventarioDestinoInicial: simulacionData.data.dias_inventario_destino_inicial,
        diasInventarioDestinoFinal: simulacionData.data.dias_inventario_destino_final,
        costoIniciativa: simulacionData.data.costo_iniciativa
      };
    }

    // Fallback: calculate from mock transferencias
    const totalUnidades = transferencias.reduce((sum, t) => sum + t.unidades, 0);
    const totalValorInventario = transferencias.reduce((sum, t) => sum + t.valorInventario, 0);
    const costoLogistico = totalValorInventario * (costoLogisticoPorcentaje / 100);
    
    const tiendasOrigen = new Set(transferencias.map(t => t.tiendaOrigen));
    const tiendasDestino = new Set(transferencias.map(t => t.tiendaDestino));
    
    const diasInvCriticasInicial = transferencias
      .filter(t => t.segmentoOrigen === 'slow' || t.segmentoOrigen === 'dead')
      .reduce((sum, t) => sum + t.diasInventarioOrigenInicial, 0) / 
      transferencias.filter(t => t.segmentoOrigen === 'slow' || t.segmentoOrigen === 'dead').length || 1;
    
    const diasInvCriticasFinal = transferencias
      .filter(t => t.segmentoOrigen === 'slow' || t.segmentoOrigen === 'dead')
      .reduce((sum, t) => sum + t.diasInventarioOrigenFinal, 0) / 
      transferencias.filter(t => t.segmentoOrigen === 'slow' || t.segmentoOrigen === 'dead').length || 1;
    
    const diasInvDestinoInicial = transferencias
      .reduce((sum, t) => sum + t.diasInventarioDestinoInicial, 0) / transferencias.length || 0;
    
    const diasInvDestinoFinal = transferencias
      .reduce((sum, t) => sum + t.diasInventarioDestinoFinal, 0) / transferencias.length || 0;

    return {
      inventarioMovilizarUnidades: totalUnidades,
      inventarioMovilizarValor: totalValorInventario,
      numTiendasOrigen: tiendasOrigen.size,
      numTiendasDestino: tiendasDestino.size,
      diasInventarioCriticasInicial: Math.round(diasInvCriticasInicial),
      diasInventarioCriticasFinal: Math.round(diasInvCriticasFinal),
      diasInventarioDestinoInicial: Math.round(diasInvDestinoInicial),
      diasInventarioDestinoFinal: Math.round(diasInvDestinoFinal),
      costoIniciativa: costoLogistico
    };
  }, [simulacionData, transferencias, costoLogisticoPorcentaje]);

  // Generar datos de detalle por tienda
  const detallePorTienda = useMemo(() => {
    const tiendasOrigenMap = new Map<string, TiendaDetalle>();
    const tiendasDestinoMap = new Map<string, TiendaDetalle>();

    transferencias.forEach(t => {
      // Agregar a origen
      if (!tiendasOrigenMap.has(t.tiendaOrigen)) {
        tiendasOrigenMap.set(t.tiendaOrigen, {
          id: t.id,
          nombre: t.tiendaOrigen,
          segmento: t.segmentoOrigen,
          unidadesMovilizar: 0,
          valorMovilizar: 0,
          diasInventarioInicial: t.diasInventarioOrigenInicial,
          diasInventarioFinal: t.diasInventarioOrigenFinal,
          skus: 0
        });
      }
      const origen = tiendasOrigenMap.get(t.tiendaOrigen)!;
      origen.unidadesMovilizar += t.unidades;
      origen.valorMovilizar += t.valorInventario;
      origen.skus += 1;

      // Agregar a destino
      if (!tiendasDestinoMap.has(t.tiendaDestino)) {
        tiendasDestinoMap.set(t.tiendaDestino, {
          id: t.id,
          nombre: t.tiendaDestino,
          segmento: t.segmentoDestino,
          unidadesMovilizar: 0,
          valorMovilizar: 0,
          diasInventarioInicial: t.diasInventarioDestinoInicial,
          diasInventarioFinal: t.diasInventarioDestinoFinal,
          skus: 0
        });
      }
      const destino = tiendasDestinoMap.get(t.tiendaDestino)!;
      destino.unidadesMovilizar += t.unidades;
      destino.valorMovilizar += t.valorInventario;
      destino.skus += 1;
    });

    return {
      origen: Array.from(tiendasOrigenMap.values()),
      destino: Array.from(tiendasDestinoMap.values())
    };
  }, [transferencias]);

  // Generar datos de detalle por SKU
  const detallePorSKU = useMemo(() => {
    const skuMap = new Map<string, SKUDetalle>();

    transferencias.forEach(t => {
      if (!skuMap.has(t.sku)) {
        skuMap.set(t.sku, {
          id: t.id,
          sku: t.sku,
          producto: t.producto,
          unidadesMovilizar: 0,
          valorMovilizar: 0,
          tiendasOrigen: 0,
          tiendasDestino: 0,
          diasInventarioPromedioOrigenInicial: 0,
          diasInventarioPromedioOrigenFinal: 0,
          diasInventarioPromedioDestinoInicial: 0,
          diasInventarioPromedioDestinoFinal: 0
        });
      }
      const sku = skuMap.get(t.sku)!;
      sku.unidadesMovilizar += t.unidades;
      sku.valorMovilizar += t.valorInventario;
      sku.tiendasOrigen += 1;
      sku.tiendasDestino += 1;
      sku.diasInventarioPromedioOrigenInicial += t.diasInventarioOrigenInicial;
      sku.diasInventarioPromedioOrigenFinal += t.diasInventarioOrigenFinal;
      sku.diasInventarioPromedioDestinoInicial += t.diasInventarioDestinoInicial;
      sku.diasInventarioPromedioDestinoFinal += t.diasInventarioDestinoFinal;
    });

    // Calcular promedios
    skuMap.forEach(sku => {
      const count = sku.tiendasOrigen;
      sku.diasInventarioPromedioOrigenInicial = Math.round(sku.diasInventarioPromedioOrigenInicial / count);
      sku.diasInventarioPromedioOrigenFinal = Math.round(sku.diasInventarioPromedioOrigenFinal / count);
      sku.diasInventarioPromedioDestinoInicial = Math.round(sku.diasInventarioPromedioDestinoInicial / count);
      sku.diasInventarioPromedioDestinoFinal = Math.round(sku.diasInventarioPromedioDestinoFinal / count);
    });

    return Array.from(skuMap.values());
  }, [transferencias]);

  const handleChatOpen = () => {
    if (onChatOpen) {
      onChatOpen({
        tipo: 'cambio_inventario',
        titulo: 'Mitigar Caducidad - Balanceo de Inventarios',
        contexto: `Simulación de balanceo de inventario desde tiendas Slow y Dead con riesgo de caducidad hacia tiendas con alta rotación. ${metricas.numTiendasOrigen} tiendas origen, ${metricas.numTiendasDestino} tiendas destino.`
      });
    }
  };

  // Show loading state
  if (loading && !simulacionData) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Mitigar Caducidad - Balanceo de Inventarios
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cargando datos de simulación...
            </p>
          </div>
        )}
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Mitigar Caducidad - Balanceo de Inventarios
            </h3>
          </div>
        )}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            Error al cargar datos: {error.message}
          </p>
        </div>
      </div>
    );
  }

  const handleAprobar = () => {
    if (onAprobar) {
      onAprobar();
    } else {
      // Default behavior
      alert('Acción aprobada. La orden de activación ha sido enviada.');
    }
  };

  const handleAjustar = () => {
    if (onAjustar) {
      onAjustar();
    } else {
      handleChatOpen();
    }
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Mitigar Caducidad - Balanceo de Inventarios
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Simulación de transferencias desde tiendas Slow y Dead con riesgo de caducidad hacia tiendas con alta rotación
            </p>
          </div>
          <button
            onClick={handleChatOpen}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Ajustar con VEMIO
          </button>
        </div>
      )}

      {/* Parámetros de Simulación */}
      {showConfig && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Parámetros de Simulación
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Máximo Nivel de Inventario en Destino (días)
              </label>
              <input
                type="number"
                value={maxNivelInventarioDestino}
                onChange={(e) => setMaxNivelInventarioDestino(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Nivel máximo permitido en tiendas destino
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Costo Logístico (% del Valor)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={costoLogisticoPorcentaje}
                  onChange={(e) => setCostoLogisticoPorcentaje(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Porcentaje del valor a movilizar
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mínimo Unidades a Mover a Tienda
              </label>
              <input
                type="number"
                value={minUnidadesMoverA}
                onChange={(e) => setMinUnidadesMoverA(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Unidades mínimas por tienda destino
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mínimo Unidades a Mover desde Tienda
              </label>
              <input
                type="number"
                value={minUnidadesMoverDesde}
                onChange={(e) => setMinUnidadesMoverDesde(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                min="1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Unidades mínimas desde tienda origen
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Métricas de Impacto (ROI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Inventario a Movilizar (Uds)</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {formatNumber(metricas.inventarioMovilizarUnidades)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Inventario a Movilizar ($)</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatCurrency(metricas.inventarioMovilizarValor)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-xs font-medium text-green-700 dark:text-green-300"># Tiendas Origen</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {metricas.numTiendasOrigen}
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300"># Tiendas Destino</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {metricas.numTiendasDestino}
          </div>
        </div>
      </div>

      {/* Métricas de Días de Inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Días de Inventario - Tiendas Críticas (Slow/Dead)
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Inicial</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {Math.round(metricas.diasInventarioCriticasInicial)} días
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Final</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {Math.round(metricas.diasInventarioCriticasFinal)} días
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Días de Inventario - Tiendas Destino
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Inicial</div>
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.round(metricas.diasInventarioDestinoInicial)} días
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Final</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {Math.round(metricas.diasInventarioDestinoFinal)} días
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Costo de la Iniciativa */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Costo de la Iniciativa
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Costo logístico calculado como {costoLogisticoPorcentaje}% del valor a movilizar
            </p>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            {formatCurrency(metricas.costoIniciativa)}
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDetailByTienda(!showDetailByTienda)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {showDetailByTienda ? 'Ocultar' : 'Ver'} Detalle por Tienda
          </button>
          <button
            onClick={() => setShowDetailBySKU(!showDetailBySKU)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            {showDetailBySKU ? 'Ocultar' : 'Ver'} Detalle por SKU
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAjustar}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Ajustar con VEMIO
          </button>
          <button
            onClick={handleAprobar}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl text-sm font-medium"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Aprobar Acción
          </button>
        </div>
      </div>

      {/* Detalle por Tienda */}
      {showDetailByTienda && (
        <div className="space-y-4">
          {/* Tiendas Origen */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Detalle de Tiendas Origen (Slow/Dead)
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tienda</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Segmento</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unidades</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Inicial</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Final</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKUs</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {detallePorTienda.origen.map((tienda) => (
                    <tr key={tienda.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{tienda.nombre}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                          {tienda.segmento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-blue-600 dark:text-blue-400">{formatNumber(tienda.unidadesMovilizar)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{formatCurrency(tienda.valorMovilizar)}</td>
                      <td className="px-4 py-3 text-right text-sm text-red-600 dark:text-red-400">{tienda.diasInventarioInicial}d</td>
                      <td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">{tienda.diasInventarioFinal}d</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{tienda.skus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tiendas Destino */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                Detalle de Tiendas Destino
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Tienda</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Segmento</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unidades</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Inicial</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Final</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKUs</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {detallePorTienda.destino.map((tienda) => (
                    <tr key={tienda.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{tienda.nombre}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          {tienda.segmento}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-blue-600 dark:text-blue-400">{formatNumber(tienda.unidadesMovilizar)}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{formatCurrency(tienda.valorMovilizar)}</td>
                      <td className="px-4 py-3 text-right text-sm text-yellow-600 dark:text-yellow-400">{tienda.diasInventarioInicial}d</td>
                      <td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">{tienda.diasInventarioFinal}d</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{tienda.skus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Detalle por SKU */}
      {showDetailBySKU && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-indigo-50 dark:bg-indigo-900/20">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Detalle por SKU
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Unidades</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Valor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"># Tiendas Origen</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase"># Tiendas Destino</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Origen Inicial</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Origen Final</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Destino Inicial</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Días Inv. Destino Final</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {detallePorSKU.map((sku) => (
                  <tr key={sku.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{sku.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{sku.producto}</td>
                    <td className="px-4 py-3 text-right text-sm text-blue-600 dark:text-blue-400">{formatNumber(sku.unidadesMovilizar)}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{formatCurrency(sku.valorMovilizar)}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{sku.tiendasOrigen}</td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900 dark:text-white">{sku.tiendasDestino}</td>
                    <td className="px-4 py-3 text-right text-sm text-red-600 dark:text-red-400">{sku.diasInventarioPromedioOrigenInicial}d</td>
                    <td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">{sku.diasInventarioPromedioOrigenFinal}d</td>
                    <td className="px-4 py-3 text-right text-sm text-yellow-600 dark:text-yellow-400">{sku.diasInventarioPromedioDestinoInicial}d</td>
                    <td className="px-4 py-3 text-right text-sm text-green-600 dark:text-green-400">{sku.diasInventarioPromedioDestinoFinal}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Nota Informativa */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
              Enfoque de Riesgo de Caducidad
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Esta simulación está focalizada en el inventario con alto riesgo de caducidad en tiendas Slow y Dead.
              El sistema identifica automáticamente oportunidades de transferencia hacia tiendas con alta rotación o niveles de inventario bajo,
              optimizando el balanceo para maximizar el beneficio neto considerando los costos logísticos configurados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
