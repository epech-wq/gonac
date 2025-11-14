"use client";

import React, { useState, useEffect } from 'react';
import { useCategoriasConCaducidad, useDescuento, useCategoryStats } from "@/hooks/useDescuento";
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface PromocionEvacuarCardProps {
  showTitle?: boolean;
  showConfig?: boolean;
}

export default function PromocionEvacuarCard({ showTitle = true, showConfig = true }: PromocionEvacuarCardProps) {
  const [maxDescuento, setMaxDescuento] = useState(45);
  const [elasticidadPapas, setElasticidadPapas] = useState(1.5);
  const [elasticidadTotopos, setElasticidadTotopos] = useState(1.8);

  // Fetch categories with expiration risk
  const { data: categoriasData, loading: categoriasLoading, error: categoriasError } = useCategoriasConCaducidad({
    limit: 2,
    autoFetch: true
  });

  // Initialize discount calculation hook
  const { data: descuentoData, loading: descuentoLoading, calcular } = useDescuento();

  // Initialize category stats hook
  const { data: categoryStatsData, loading: statsLoading, fetchStats } = useCategoryStats();

  // Calculate discount when categories are loaded or parameters change
  useEffect(() => {
    if (categoriasData?.categorias && categoriasData.categorias.length > 0) {
      const items = categoriasData.categorias.map(cat => ({
        categoria: cat.category,
        elasticidad: cat.category.toUpperCase() === 'PAPAS' ? elasticidadPapas : elasticidadTotopos
      }));

      // Calculate discount with current parameters
      calcular({
        descuento: maxDescuento / 100, // Convert percentage to decimal
        items
      });

      // Fetch category stats
      fetchStats(categoriasData.categorias.map(c => c.category));
    }
  }, [categoriasData, maxDescuento, elasticidadPapas, elasticidadTotopos, calcular, fetchStats]);

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análisis de Promoción para Evacuar Inventario
        </h3>
      )}

      {/* Configuration Card */}
      {showConfig && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Configuración de Promoción</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Máximo Descuento (%)
              </label>
              <input
                type="number"
                value={maxDescuento}
                onChange={(e) => setMaxDescuento(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Elasticidad Papas
              </label>
              <input
                type="number"
                step="0.1"
                value={elasticidadPapas}
                onChange={(e) => setElasticidadPapas(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sugerido: 1.5</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Elasticidad Mix
              </label>
              <input
                type="number"
                step="0.1"
                value={elasticidadTotopos}
                onChange={(e) => setElasticidadTotopos(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sugerido: 1.8</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {(categoriasLoading || descuentoLoading || statsLoading) && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-yellow-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Calculando promociones...</p>
        </div>
      )}

      {/* Error State */}
      {categoriasError && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 mb-6">
          <p className="text-sm text-red-600 dark:text-red-400">Error: {categoriasError.message}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Mostrando datos de ejemplo</p>
        </div>
      )}

      {/* Metrics Cards - Using Real Data */}
      {descuentoData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
              <div className="text-sm text-red-600 dark:text-red-400">Costo Promoción</div>
              <div className="text-xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(
                  Object.values(descuentoData.items).reduce((sum, item) => sum + item.costo, 0)
                )}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="text-sm text-green-600 dark:text-green-400">Valor a Capturar</div>
              <div className="text-xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(
                  Object.values(descuentoData.items).reduce((sum, item) => sum + item.valor, 0)
                )}
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="text-sm text-blue-600 dark:text-blue-400">Reducción Riesgo Promedio</div>
              <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                {((Object.values(descuentoData.items).reduce((sum, item) => sum + item.reduccion, 0) /
                  Object.values(descuentoData.items).length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Product Category Cards - Using Real Data */}
          {categoryStatsData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(descuentoData.items).map(([categoria, metrics], index) => {
                const stats = categoryStatsData.stats.find(s => s.category === categoria);
                const colors = [
                  { from: 'from-orange-50', to: 'to-yellow-50', darkFrom: 'dark:from-orange-900/20', darkTo: 'dark:to-yellow-900/20', border: 'border-orange-200 dark:border-orange-800', accent: 'text-orange-600 dark:text-orange-400' },
                  { from: 'from-blue-50', to: 'to-indigo-50', darkFrom: 'dark:from-blue-900/20', darkTo: 'dark:to-indigo-900/20', border: 'border-blue-200 dark:border-blue-800', accent: 'text-blue-600 dark:text-blue-400' }
                ];
                const color = colors[index % colors.length];

                return (
                  <div key={categoria} className={`bg-gradient-to-br ${color.from} ${color.to} ${color.darkFrom} ${color.darkTo} rounded-lg p-5 border-2 ${color.border}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-lg font-bold text-gray-900 dark:text-white">
                          {categoria.toUpperCase()} {maxDescuento}% descuento
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stats?.unique_products || 0} SKUs en {stats?.unique_stores || 0} tiendas
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Reducción Riesgo</div>
                        <div className={`text-xl font-bold ${color.accent}`}>
                          {(metrics.reduccion * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white dark:bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Inv. Inicial</div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatNumber(Math.round(metrics.inventario_inicial_total))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Ventas +</div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatNumber(Math.round(metrics.ventas_plus))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Costo</div>
                        <div className="text-sm font-semibold text-red-600">
                          {formatCurrency(metrics.costo)}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded p-3">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Valor</div>
                        <div className="text-sm font-semibold text-blue-600">
                          {formatCurrency(metrics.valor)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Calculation Badge */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Cálculo:</span> Incremento ventas = Elasticidad × % Descuento |
              <span className="font-semibold"> Ejemplo:</span> Con {maxDescuento}% descuento y elasticidad {elasticidadPapas}, las ventas aumentan {(elasticidadPapas * maxDescuento).toFixed(0)}%.
            </p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              ✓ Datos en vivo desde la base de datos
            </p>
          </div>
        </>
      )}
    </div>
  );
}

