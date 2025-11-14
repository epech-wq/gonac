/**
 * Exhibiciones Adicionales Card Component
 * Muestra configuración, métricas y cálculos de exhibiciones con datos en vivo
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useExhibicionResumen } from "@/hooks/useExhibiciones";

interface ExhibicionesAdicionalesCardProps {
  showTitle?: boolean;
  showConfig?: boolean;
}

export default function ExhibicionesAdicionalesCard({ 
  showTitle = false,
  showConfig = true 
}: ExhibicionesAdicionalesCardProps) {
  const [costoExhibicion, setCostoExhibicion] = useState(500);
  const [incrementoVentas, setIncrementoVentas] = useState(50);
  const [exhibicionMounted, setExhibicionMounted] = useState(false);

  // Fetch Exhibiciones data
  const {
    data: exhibicionResumen,
    loading: exhibicionLoading,
    refetch: refetchExhibicion
  } = useExhibicionResumen({
    dias_mes: 30,
    costo_exhibicion: costoExhibicion,
    incremento_venta: incrementoVentas / 100,
    format: 'raw',
    autoFetch: true
  });

  // Extract resumen data safely
  const resumenData = exhibicionResumen && 'resumen' in exhibicionResumen
    ? exhibicionResumen.resumen
    : null;

  // Mark as mounted after initial render
  useEffect(() => {
    setExhibicionMounted(true);
  }, []);

  // Debounce exhibicion params changes
  useEffect(() => {
    if (!exhibicionMounted) return;

    const timer = setTimeout(() => {
      refetchExhibicion({
        costo_exhibicion: costoExhibicion,
        incremento_venta: incrementoVentas / 100,
        dias_mes: 30
      });
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costoExhibicion, incrementoVentas, exhibicionMounted]);

  const handleCostoChange = useCallback((value: number) => {
    setCostoExhibicion(value);
  }, []);

  const handleIncrementoChange = useCallback((value: number) => {
    setIncrementoVentas(value);
  }, []);

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

  return (
    <div className="space-y-6">
      {showTitle && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Acción #2: Exhibiciones Adicionales (Oportunidades Viables)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Identificadas tiendas HOT donde exhibiciones adicionales generarían retorno positivo sobre inversión
          </p>
        </div>
      )}

      {/* Configuration Card */}
      {showConfig && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configuración de Exhibiciones
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Costo Mensual por Exhibición (MXN)
              </label>
              <input
                type="number"
                value={costoExhibicion}
                onChange={(e) => handleCostoChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Costo que cobra el autoservicio por rentar el espacio de exhibición
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Incremento Esperado en Ventas (%)
              </label>
              <input
                type="number"
                value={incrementoVentas}
                onChange={(e) => handleIncrementoChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Incremento proyectado en ventas diarias por la exhibición adicional
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {exhibicionLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Calculando exhibiciones...</p>
        </div>
      )}

      {/* Results Summary - Viable Opportunities */}
      {!exhibicionLoading && resumenData && resumenData.tiendas_viables > 0 ? (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                Exhibiciones Viables
              </div>
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {resumenData.tiendas_viables}
              </div>
              <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
                Tiendas HOT con ROI+
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">
                Retorno Mensual
              </div>
              <div className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(resumenData.retorno_mensual_neto)}
              </div>
              <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                Ganancia neta
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
              <div className="text-sm text-red-600 dark:text-red-400 font-medium mb-1">
                Costo Total
              </div>
              <div className="text-xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(resumenData.costo_total_exhibicion)}
              </div>
              <div className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                Inversión mensual
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                ROI Promedio
              </div>
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                {resumenData.roi_promedio_x.toFixed(2)}x
              </div>
              <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
                Retorno sobre inversión
              </div>
            </div>
          </div>

          {/* Pedido Extraordinario Card */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg p-6 border-2 border-orange-300 dark:border-orange-800">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  📦 Pedido Extraordinario Requerido
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Para soportar el incremento del {incrementoVentas}% en ventas, se requiere el siguiente pedido adicional:
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Unidades Totales
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(resumenData.unidades_totales_pedido)}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Valor del Pedido
                </div>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(resumenData.valor_total_pedido)}
                </div>
              </div>
            </div>
          </div>

          {/* Viability Explanation */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                  💡 ROI: Solo se implementarán exhibiciones con ROI positivo en {resumenData.tiendas_viables} tiendas HOT seleccionadas.
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Las métricas mostradas se calculan automáticamente basándose en el costo de {formatCurrency(costoExhibicion)} 
                  y un incremento esperado del {incrementoVentas}% en ventas diarias.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : !exhibicionLoading && (!resumenData || resumenData.tiendas_viables === 0) ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 dark:text-gray-400 italic mb-2 font-medium">
            No hay oportunidades viables con los parámetros actuales
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Intenta ajustar el costo de exhibición o el incremento esperado en ventas
          </p>
        </div>
      ) : null}
    </div>
  );
}

