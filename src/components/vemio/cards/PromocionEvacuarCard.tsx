"use client";

import React, { useState, useEffect } from 'react';
import { useCategoriasConCaducidad, useDescuento, useCategoryStats } from "@/hooks/useDescuento";
import { useCaducidadPorTienda, useCaducidadPorSKU } from '@/hooks/useValorizacion';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface PromocionEvacuarCardProps {
  showTitle?: boolean;
  showConfig?: boolean;
  onChatOpen?: (cardData: any) => void;
}

export default function PromocionEvacuarCard({ showTitle = true, showConfig = true, onChatOpen }: PromocionEvacuarCardProps) {
  const [maxDescuento, setMaxDescuento] = useState(45);
  const [elasticidadPapas, setElasticidadPapas] = useState(1.5);
  const [elasticidadTotopos, setElasticidadTotopos] = useState(1.8);
  const [showDetailBySKU, setShowDetailBySKU] = useState(false);
  const [showDetailByTienda, setShowDetailByTienda] = useState(false);

  // Fetch categories with expiration risk
  const { data: categoriasData, loading: categoriasLoading, error: categoriasError } = useCategoriasConCaducidad({
    limit: 2,
    autoFetch: true
  });

  // Initialize discount calculation hook
  const { data: descuentoData, loading: descuentoLoading, calcular } = useDescuento();

  // Initialize category stats hook
  const { data: categoryStatsData, loading: statsLoading, fetchStats } = useCategoryStats();

  // Fetch grouped data for caducidad
  const { data: caducidadPorTienda, loading: caducidadPorTiendaLoading, refetch: refetchCaducidadPorTienda } = useCaducidadPorTienda({ autoFetch: false });
  const { data: caducidadPorSKU, loading: caducidadPorSKULoading, refetch: refetchCaducidadPorSKU } = useCaducidadPorSKU({ autoFetch: false });

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
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Configuración de Promoción</h4>
            {onChatOpen && (
              <button
                onClick={() => {
                  onChatOpen({
                    title: 'Parámetros de Elasticidad de Promociones',
                    value: `Elasticidad Papas: ${elasticidadPapas}, Elasticidad Mix: ${elasticidadTotopos}`,
                    subtitle: `Descuento máximo: ${maxDescuento}%`,
                    elasticidadPapas,
                    elasticidadTotopos,
                    maxDescuento,
                    tipo: 'elasticidad_promocion'
                  });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
              >
                <svg
                  className="h-4 w-4"
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
                ¿Por qué estos parámetros?
              </button>
            )}
          </div>
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

          {/* Detail View Buttons */}
          <div className="flex flex-wrap gap-3 mt-6">
            {/* Ver detalle por SKU */}
            <button
              onClick={() => {
                if (!showDetailBySKU && !caducidadPorSKU) {
                  refetchCaducidadPorSKU();
                }
                setShowDetailBySKU(!showDetailBySKU);
              }}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                showDetailBySKU
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Ver detalle por SKU
            </button>
            {/* Ver detalle por Tienda */}
            <button
              onClick={() => {
                if (!showDetailByTienda && !caducidadPorTienda) {
                  refetchCaducidadPorTienda();
                }
                setShowDetailByTienda(!showDetailByTienda);
              }}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                showDetailByTienda
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:text-blue-400'
              }`}
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Ver detalle por Tienda
            </button>
          </div>

          {/* Detail by SKU */}
          {showDetailBySKU && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Detalle por SKU
                {caducidadPorSKU && ` (${caducidadPorSKU.total} productos)`}
              </h4>

              {/* Loading State */}
              {caducidadPorSKULoading && (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando detalles por SKU...</p>
                </div>
              )}

              {/* Data Table */}
              {!caducidadPorSKULoading && caducidadPorSKU?.data && caducidadPorSKU.data.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Producto</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Impacto Total</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Registros</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tiendas Afectadas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {caducidadPorSKU.data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white font-medium">{item.product_name}</td>
                          <td className="px-3 py-2 text-sm text-green-600 font-medium">{formatCurrency(item.impacto_total)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(item.registros)}</td>
                          <td className="px-3 py-2 text-sm text-blue-600">{formatNumber(item.tiendas_afectadas)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* No Data State */}
              {!caducidadPorSKULoading && (!caducidadPorSKU || caducidadPorSKU.data.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                </div>
              )}
            </div>
          )}

          {/* Detail by Tienda */}
          {showDetailByTienda && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-6 border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Detalle por Tienda
                {caducidadPorTienda && ` (${caducidadPorTienda.total} tiendas)`}
              </h4>

              {/* Loading State */}
              {caducidadPorTiendaLoading && (
                <div className="text-center py-8">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando detalles por tienda...</p>
                </div>
              )}

              {/* Data Table */}
              {!caducidadPorTiendaLoading && caducidadPorTienda?.data && caducidadPorTienda.data.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tienda</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Impacto Total</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Registros</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {caducidadPorTienda.data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white font-medium">{item.store_name}</td>
                          <td className="px-3 py-2 text-sm text-green-600 font-medium">{formatCurrency(item.impacto_total)}</td>
                          <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{formatNumber(item.registros)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* No Data State */}
              {!caducidadPorTiendaLoading && (!caducidadPorTienda || caducidadPorTienda.data.length === 0) && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">No hay datos disponibles</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

