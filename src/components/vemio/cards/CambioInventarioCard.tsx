"use client";

import { useState } from 'react';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface TransferenciaInventario {
  id: string;
  sku: string;
  producto: string;
  tiendaOrigen: string;
  tiendaDestino: string;
  unidades: number;
  valorInventario: number;
  diasInventarioOrigen: number;
  diasInventarioDestino: number;
}

interface CambioInventarioCardProps {
  showTitle?: boolean;
  showConfig?: boolean;
  onChatOpen?: (cardData: any) => void;
}

export default function CambioInventarioCard({
  showTitle = true,
  showConfig = false,
  onChatOpen
}: CambioInventarioCardProps) {
  const [costoTransportePorUnidad] = useState(2.5);
  const [inventarioMinimoDias] = useState(7);

  // Datos de ejemplo de transferencias recomendadas
  const transferencias: TransferenciaInventario[] = [
    {
      id: '1',
      sku: 'SKU-001',
      producto: 'Producto A 500g',
      tiendaOrigen: 'Tienda 045 - Zona Norte',
      tiendaDestino: 'Tienda 012 - Centro',
      unidades: 48,
      valorInventario: 14400,
      diasInventarioOrigen: 85,
      diasInventarioDestino: 3
    },
    {
      id: '2',
      sku: 'SKU-003',
      producto: 'Producto C 1kg',
      tiendaOrigen: 'Tienda 078 - Periferia',
      tiendaDestino: 'Tienda 023 - Plaza Principal',
      unidades: 36,
      valorInventario: 12960,
      diasInventarioOrigen: 92,
      diasInventarioDestino: 2
    },
    {
      id: '3',
      sku: 'SKU-005',
      producto: 'Producto E 750g',
      tiendaOrigen: 'Tienda 091 - Suburbio',
      tiendaDestino: 'Tienda 012 - Centro',
      unidades: 24,
      valorInventario: 8640,
      diasInventarioOrigen: 78,
      diasInventarioDestino: 4
    },
    {
      id: '4',
      sku: 'SKU-002',
      producto: 'Producto B 250g',
      tiendaOrigen: 'Tienda 045 - Zona Norte',
      tiendaDestino: 'Tienda 034 - Comercial',
      unidades: 60,
      valorInventario: 10800,
      diasInventarioOrigen: 88,
      diasInventarioDestino: 5
    }
  ];

  const totalUnidades = transferencias.reduce((sum, t) => sum + t.unidades, 0);
  const totalValorInventario = transferencias.reduce((sum, t) => sum + t.valorInventario, 0);
  const costoTotalTransporte = totalUnidades * costoTransportePorUnidad;
  const ahorroEstimado = totalValorInventario * 0.15; // 15% de ahorro por evitar caducidad

  const handleChatOpen = () => {
    if (onChatOpen) {
      onChatOpen({
        tipo: 'cambio_inventario',
        titulo: 'Cambio de Inventario',
        contexto: `Análisis de transferencias de inventario entre tiendas. Total de ${transferencias.length} movimientos recomendados.`
      });
    }
  };

  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Cambio de Inventario
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Transferencias recomendadas de tiendas con bajo movimiento a tiendas con alta rotación
            </p>
          </div>
          <button
            onClick={handleChatOpen}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Consultar con VEMIO
          </button>
        </div>
      )}

      {/* Resumen de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Transferencias</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {transferencias.length}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Movimientos recomendados
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-xs font-medium text-green-700 dark:text-green-300">Unidades</span>
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatNumber(totalUnidades)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Total a transferir
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">Valor Inventario</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatCurrency(totalValorInventario)}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Valor total a mover
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-xs font-medium text-orange-700 dark:text-orange-300">Costo Transporte</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {formatCurrency(costoTotalTransporte)}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400 mt-1">
            ${costoTransportePorUnidad}/unidad
          </div>
        </div>
      </div>

      {/* Análisis de Impacto */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <div className="bg-green-100 dark:bg-green-800/30 rounded-full p-2">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
              Impacto Estimado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Ahorro por Evitar Caducidad</div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(ahorroEstimado)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Costo de Operación</div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                  {formatCurrency(costoTotalTransporte)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Beneficio Neto</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(ahorroEstimado - costoTotalTransporte)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Transferencias */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Detalle de Transferencias Recomendadas
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Origen
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Destino
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unidades
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Días Inv. Origen
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Días Inv. Destino
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {transferencias.map((transferencia) => (
                <tr key={transferencia.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {transferencia.sku}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {transferencia.producto}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transferencia.tiendaOrigen}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {transferencia.tiendaDestino}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatNumber(transferencia.unidades)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      {transferencia.diasInventarioOrigen}d
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                      {transferencia.diasInventarioDestino}d
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(transferencia.valorInventario)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Parámetros de Configuración */}
      {showConfig && (
        <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Parámetros de Configuración
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Inventario Mínimo (días)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={inventarioMinimoDias}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">días</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Días mínimos de inventario a mantener en tienda destino
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                Costo de Transporte por Unidad
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">$</span>
                <input
                  type="number"
                  value={costoTransportePorUnidad}
                  readOnly
                  step="0.1"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
                <span className="text-xs text-gray-500 dark:text-gray-400">MXN</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Costo estimado por unidad transferida
              </p>
            </div>
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
              Optimización Inteligente
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Las transferencias se calculan automáticamente identificando tiendas con exceso de inventario
              (más de {inventarioMinimoDias} días) y tiendas con necesidad crítica (menos de {inventarioMinimoDias} días).
              El sistema prioriza movimientos que maximicen el beneficio neto considerando costos de transporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
