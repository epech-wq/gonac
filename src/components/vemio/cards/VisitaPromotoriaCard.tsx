"use client";

import React, { useEffect } from 'react';
import {
  usePromotoriaSummary,
  usePromotoriaTienda,
  usePromotoriaProductsSinVentaByStore
} from "@/hooks/usePromotoria";
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface VisitaPromotoriaCardProps {
  showTitle?: boolean;
  showPhoneMockup?: boolean;
  onChatOpen?: (cardData: any) => void;
}

export default function VisitaPromotoriaCard({ showTitle = true, showPhoneMockup = true, onChatOpen }: VisitaPromotoriaCardProps) {
  const { data: promotoriaSummary, loading: promotoriaSummaryLoading } = usePromotoriaSummary();
  const { data: promotoriaTienda, loading: promotoriaTiendaLoading } = usePromotoriaTienda();
  const { data: promotoriaProducts, loading: promotoriaProductsLoading, refetch: refetchProducts } = usePromotoriaProductsSinVentaByStore({
    id_store: promotoriaTienda?.data.id_store,
    limit: 3,
    autoFetch: false
  });

  // Fetch products when store ID is available
  useEffect(() => {
    if (promotoriaTienda?.data.id_store) {
      refetchProducts(promotoriaTienda.data.id_store);
    }
  }, [promotoriaTienda?.data.id_store, refetchProducts]);

  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Análisis de Visita Promotoría
        </h3>
      )}

      {/* Loading State */}
      {(promotoriaSummaryLoading || promotoriaTiendaLoading) && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de promotoría...</p>
        </div>
      )}

      {/* Parameter Inputs - Disabled inputs showing Vemio's calculated parameters */}
      {!promotoriaSummaryLoading && promotoriaSummary && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Parámetros de Cálculo (Calculados por VEMIO)
            </h4>
            {onChatOpen && (
              <button
                onClick={() => {
                  onChatOpen({
                    title: 'Parámetros de Visita Promotoría',
                    value: 'Parámetros calculados automáticamente por VEMIO',
                    subtitle: 'Explicación de la elección de parámetros óptimos',
                    tipo: 'promotoria_parametros_completos',
                    parametros: {
                      venta_critica: {
                        nombre: 'Venta critica',
                        valor: 0,
                        unidad: ''
                      }
                    }
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
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Venta critica
              </label>
              <input
                type="number"
                value={0}
                disabled
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards - Using Real Data */}
      {!promotoriaSummaryLoading && promotoriaSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-sm text-purple-600 dark:text-purple-400">Tiendas a Visitar</div>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {promotoriaSummary.data.tiendas_a_visitar}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="text-sm text-red-600 dark:text-red-400">Riesgo a Recuperar</div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {formatCurrency(promotoriaSummary.data.riesgo_total)}
            </div>
          </div>
        </div>
      )}

      {/* Phone Mockup */}
      {showPhoneMockup && (
        <div className="mb-6 flex justify-center">
          <div className="relative w-80 h-[600px] bg-gray-900 rounded-[3rem] shadow-2xl border-8 border-gray-800">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-3xl z-10"></div>

            {/* Phone screen */}
            <div className="absolute inset-2 bg-white rounded-[2.5rem] overflow-hidden">
              {/* Status bar */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 flex justify-between items-center text-white text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* App header */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 text-white">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-base font-bold">VEMIO Promotoria</h3>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Nuevo</span>
                </div>
                <p className="text-[10px] opacity-90">Tarea asignada - Urgente</p>
              </div>

              {/* App content */}
              <div className="p-3 space-y-3 overflow-y-auto h-[calc(100%-100px)]">
                {/* Tienda info */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-[10px] text-gray-500 mb-1">Tienda</div>
                  <div className="text-xl font-bold text-gray-900">
                    {promotoriaTienda?.data.store_name || '798'}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-1">
                    Ventas Acumuladas
                  </div>
                  <div className="text-xs text-gray-900">
                    {promotoriaTienda?.data.ventas_acumuladas || 0} unidades
                  </div>
                </div>

                {/* Products Without Sales */}
                <div className="bg-white rounded-lg border-2 border-red-400 p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <svg className="h-3 w-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h4 className="font-semibold text-gray-900 text-xs">Productos Sin Venta</h4>
                  </div>
                  <div className="space-y-2">
                    {promotoriaProductsLoading ? (
                      <div className="text-center py-2">
                        <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-purple-600 border-r-transparent"></div>
                      </div>
                    ) : promotoriaProducts && promotoriaProducts.data.length > 0 ? (
                      promotoriaProducts.data.map((product, index) => (
                        <div key={index} className="text-[10px] text-gray-700 flex justify-between items-center py-1">
                          <span>{product.product_name}</span>
                          <span className="text-gray-500">{product.inventario_sin_rotacion} uds</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="text-[10px] text-gray-700 flex justify-between items-center py-1">
                          <span>Botana Chidas Francesas 65 Gr</span>
                          <span className="text-gray-500">30 uds</span>
                        </div>
                        <div className="text-[10px] text-gray-700 flex justify-between items-center py-1">
                          <span>Mix Chidas Hot 50 Gr</span>
                          <span className="text-gray-500">30 uds</span>
                        </div>
                        <div className="text-[10px] text-gray-700 flex justify-between items-center py-1">
                          <span>Papas Chidas Con Sal 85 Gr</span>
                          <span className="text-gray-500">30 uds</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Riesgo */}
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-center gap-1 mb-1">
                    <svg className="h-3 w-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-900">Riesgo</span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {promotoriaTienda ? formatCurrency(promotoriaTienda.data.riesgo_total) : '$1.7K'}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-[10px] text-gray-600 leading-relaxed">
                      Hay <span className="font-semibold text-gray-900">{promotoriaTienda ? formatNumber(Number(promotoriaTienda.data.inventario_sin_rotacion_total)) : '240'} unidades</span> en bodega sin rotar. Habla con el gerente para ganar espacio adicional en piso. Realiza exhibición extra. Toma fotos y marca como completado.
                    </div>
                  </div>
                </div>

                {/* Photo button */}
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-lg font-medium text-xs flex items-center justify-center gap-2 shadow-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  📷 Tomar Foto de Evidencia
                </button>

                {/* Checkbox */}
                <label className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-2.5 cursor-pointer">
                  <input type="checkbox" className="rounded text-green-600 w-4 h-4" />
                  <span className="text-xs text-gray-700">✓ Marcar como Realizado</span>
                </label>
              </div>
            </div>

            {/* Home button */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
}

