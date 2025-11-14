/**
 * Reabasto Urgente Card Component
 * Muestra las métricas y detalles de reabasto urgente con datos en vivo
 */

"use client";

import { useState } from "react";
import {
  useAccionReabastoSummary,
  useAccionReabastoPorTienda,
  useAccionReabastoDetalle
} from "@/hooks/useAccionReabasto";

interface ReabastoUrgenteCardProps {
  showTitle?: boolean;
  showButtons?: boolean;
}

export default function ReabastoUrgenteCard({ 
  showTitle = false,
  showButtons = true 
}: ReabastoUrgenteCardProps) {
  const [showDetailBySKU, setShowDetailBySKU] = useState(false);
  const [showDetailByTienda, setShowDetailByTienda] = useState(false);

  // Fetch data using hooks
  const { data: reabastoSummary, loading: reabastoSummaryLoading } = useAccionReabastoSummary();
  const { data: reabastoPorTienda, loading: reabastoPorTiendaLoading } = useAccionReabastoPorTienda();
  const { data: reabastoDetalle, loading: reabastoDetalleLoading } = useAccionReabastoDetalle();

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
            Acción #1: Reabasto Urgente (Tiendas HOT y Balanceadas)
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Focalizado en tiendas de alto desempeño para evitar pérdida de ventas
          </p>
        </div>
      )}

      {/* Loading State */}
      {reabastoSummaryLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de reabasto...</p>
        </div>
      )}

      {/* Metrics Cards - Using Real Data */}
      {!reabastoSummaryLoading && reabastoSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Monto Total</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {formatCurrency(reabastoSummary.data.monto_total)}
            </div>
            <div className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
              Inversión requerida
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Unidades Totales</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {formatNumber(reabastoSummary.data.unidades_totales)}
            </div>
            <div className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
              Total a reabastecer
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Tiendas Impactadas</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              {reabastoSummary.data.tiendas_impactadas}
            </div>
            <div className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">
              HOT y Balanceadas
            </div>
          </div>
        </div>
      )}

      {/* Fallback to placeholder if no data */}
      {!reabastoSummaryLoading && !reabastoSummary && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ No hay datos disponibles en este momento. Por favor, intenta nuevamente más tarde.
          </p>
        </div>
      )}

      {/* Detail View Buttons */}
      {showButtons && ((reabastoDetalle && reabastoDetalle.data.length > 0) || (reabastoPorTienda && reabastoPorTienda.data.length > 0)) && (
        <div className="flex flex-wrap gap-3">
          {/* Ver detalle por SKU */}
          {reabastoDetalle && reabastoDetalle.data.length > 0 && (
            <button
              onClick={() => setShowDetailBySKU(!showDetailBySKU)}
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
          )}
          
          {/* Ver detalle por Tienda */}
          {reabastoPorTienda && reabastoPorTienda.data.length > 0 && (
            <button
              onClick={() => setShowDetailByTienda(!showDetailByTienda)}
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
          )}
        </div>
      )}

      {/* Detail by SKU */}
      {showDetailBySKU && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Detalle por SKU
            {reabastoDetalle && ` (${reabastoDetalle.total} registros)`}
          </h4>

          {reabastoDetalleLoading && (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando detalles...</p>
            </div>
          )}

          {!reabastoDetalleLoading && reabastoDetalle && reabastoDetalle.data.length > 0 && (
            <div className="space-y-4">
              {Object.entries(
                reabastoDetalle.data.reduce((acc: Record<string, typeof reabastoDetalle.data>, item) => {
                  if (!acc[item.store_name]) {
                    acc[item.store_name] = [];
                  }
                  acc[item.store_name].push(item);
                  return acc;
                }, {})
              ).map(([storeName, products]) => (
                <div key={storeName} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                    <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Tienda {storeName}
                  </h5>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Producto</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unidades</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Monto</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Días Post-Reabasto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
                        {products.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{item.product_name}</td>
                            <td className="px-3 py-3 text-sm text-gray-900 dark:text-white">{formatNumber(item.unidades_a_pedir)}</td>
                            <td className="px-3 py-3 text-sm text-green-600 font-medium">{formatCurrency(item.monto_necesario_pedido)}</td>
                            <td className="px-3 py-3 text-sm text-blue-600">{item.dias_inventario_post_reabasto} días</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detail by Tienda */}
      {showDetailByTienda && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            Detalle por Tienda
            {reabastoPorTienda && ` (${reabastoPorTienda.total} tiendas)`}
          </h4>

          {reabastoPorTiendaLoading && (
            <div className="text-center py-8">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando detalles por tienda...</p>
            </div>
          )}

          {!reabastoPorTiendaLoading && reabastoPorTienda && reabastoPorTienda.data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Tienda</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unidades a Pedir</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Monto Necesario</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {reabastoPorTienda.data.map((tienda, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-3 py-2 text-sm text-gray-900 dark:text-white font-medium">{tienda.store_name}</td>
                      <td className="px-3 py-2 text-sm text-blue-600">{formatNumber(tienda.unidades_a_pedir)} unidades</td>
                      <td className="px-3 py-2 text-sm text-green-600 font-medium">{formatCurrency(tienda.monto_necesario_pedido)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

