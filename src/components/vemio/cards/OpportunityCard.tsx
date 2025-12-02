/**
 * Opportunity Card Component
 */

import { useState } from 'react';
import type { RiskLevel, OpportunityType, DetailRecord } from '@/types/tiendas.types';
import { getBadgeColor, getSegmentColor } from '@/utils/tiendas.mappers';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';

interface CausaData {
  id: number;
  titulo: string;
  subtitulo: string;
  tendencia: "up" | "down" | "neutral";
  actual: number;
  optimo: number;
  desvio: string;
  correlacion: number;
}

interface OpportunityCardProps {
  type: OpportunityType;
  title: string;
  description: string;
  tiendas: number;
  impacto: number;
  risk: RiskLevel;
  impactoColor: string;
  impactoLabel: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  isExpanded: boolean;
  detailData: DetailRecord[];
  isLoading: boolean;
  onToggleExpand: () => void;
  onActionClick?: (actionType: string, causasData?: CausaData[]) => void;
  onVerAnalisisCompleto?: () => void;
}

export default function OpportunityCard({
  type,
  title,
  description,
  tiendas,
  impacto,
  risk,
  impactoColor,
  impactoLabel,
  isExpanded,
  detailData,
  isLoading,
  onToggleExpand,
  onActionClick,
  onVerAnalisisCompleto,
}: OpportunityCardProps) {
  const [showAnalisisCompleto, setShowAnalisisCompleto] = useState(false);

  // Handle opening "Ver análisis completo" - close detail view if open
  const handleToggleAnalisisCompleto = () => {
    if (type === 'ventaIncremental') {
      if (!showAnalisisCompleto && isExpanded) {
        // Close detail view when opening análisis completo
        onToggleExpand();
      }
      setShowAnalisisCompleto(!showAnalisisCompleto);
    }
  };

  // Handle opening "Ver Detalle" - close análisis completo if open
  const handleToggleDetalle = () => {
    if (showAnalisisCompleto) {
      // Close análisis completo when opening detail view
      setShowAnalisisCompleto(false);
    }
    onToggleExpand();
  };

  // Mock data for causas - similar to AnalisisCausasContent
  const causas = [
    {
      id: 1,
      titulo: "Dias Inventario",
      subtitulo: "Autoservicio > Centro > Walmart",
      tendencia: "down" as const,
      actual: 8,
      optimo: 14,
      desvio: "-43%",
      correlacion: 85,
    },
    {
      id: 2,
      titulo: "Tamaño Pedido",
      subtitulo: "Bebidas > RefreshCo",
      tendencia: "up" as const,
      actual: 650,
      optimo: 500,
      desvio: "+30%",
      correlacion: 78,
    },
    {
      id: 3,
      titulo: "Frecuencia",
      subtitulo: "Conveniencia > Norte",
      tendencia: "neutral" as const,
      actual: 72,
      optimo: 85,
      desvio: "-15%",
      correlacion: 65,
    },
  ];

  const getTrendIcon = (tendencia: "up" | "down" | "neutral") => {
    switch (tendencia) {
      case "up":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600 dark:text-green-400"
          >
            <path
              d="M10 15V5M10 5L5 10M10 5L15 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-red-600 dark:text-red-400"
          >
            <path
              d="M10 5V15M10 15L15 10M10 15L5 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "neutral":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-600 dark:text-gray-400"
          >
            <path
              d="M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="relative p-4">
        {/* Impacto Label Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getBadgeColor(impactoLabel as RiskLevel)}`}>
            {impactoLabel}
          </span>
        </div>

        <div className="mb-3">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {formatNumber(tiendas)} tiendas afectadas
          </p>
        </div>

        <div className="mt-3 mb-4">
          <div className="mb-1">
            <div className={`text-2xl font-bold ${impactoColor}`}>
              {formatCurrency(impacto)}
            </div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Impacto potencial
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2 mb-3">
            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h5 className="text-xs font-semibold text-blue-900 dark:text-blue-300">
              Acciones Recomendadas
            </h5>
          </div>

          {/* Grid de 2 columnas para caducidad, 2 columnas para sinVenta */}
          <div className={type === 'caducidad' || type === 'sinVenta' ? 'grid grid-cols-2 gap-2' : ''}>
            {/* Reabasto Urgente - ROJO (Crítico/Urgente) para Agotado */}
            {type === 'agotado' && (
              <button
                onClick={() => onActionClick?.('reabasto_urgente')}
                className="w-full text-left px-3 py-2.5 text-xs font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-red-700 dark:border-red-600"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Reabasto Urgente
                </span>
              </button>
            )}

            {/* Caducidad tiene 2 acciones en grid 2x1 */}
            {type === 'caducidad' && (
              <>
                {/* Promoción Evacuar - NARANJA (Advertencia/Tiempo limitado) */}
                <button
                  onClick={() => onActionClick?.('promocion_evacuar')}
                  className="text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-orange-700 dark:border-orange-600"
                >
                  <span className="flex flex-col items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="leading-tight">Promoción Evacuar Inventario</span>
                  </span>
                </button>

                {/* Cambio de Inventario - TEAL (Optimización/Transferencia) */}
                <button
                  onClick={() => onActionClick?.('cambio_inventario')}
                  className="text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-teal-700 dark:border-teal-600"
                >
                  <span className="flex flex-col items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="leading-tight">Cambio de Inventario</span>
                  </span>
                </button>
              </>
            )}

            {/* Sin Venta tiene 2 acciones en grid 2x1 */}
            {type === 'sinVenta' && (
              <>
                {/* Visita Promotoría - PÚRPURA (Auditoría/Mejora) */}
                <button
                  onClick={() => onActionClick?.('visita_promotoria')}
                  className="text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-purple-700 dark:border-purple-600"
                >
                  <span className="flex flex-col items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="leading-tight">Visita Promotoría</span>
                  </span>
                </button>

                {/* Exhibiciones Adicionales - AZUL (Oportunidad/Crecimiento) */}
                <button
                  onClick={() => onActionClick?.('exhibiciones_adicionales')}
                  className="text-center px-2 py-2 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-blue-700 dark:border-blue-600"
                >
                  <span className="flex flex-col items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="leading-tight">Exhibiciones Adicionales</span>
                  </span>
                </button>
              </>
            )}

            {/* Ajustar Parámetro - VERDE (Optimización) para Venta Incremental */}
            {type === 'ventaIncremental' && (
              <button
                onClick={() => onActionClick?.('ajustar_parametro', causas)}
                className="w-full text-left px-3 py-2.5 text-xs font-medium text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-green-700 dark:border-green-600"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Ajustar Parámetro
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Ver análisis completo link - Show for all cards, but disabled for non-ventaIncremental */}
        {onVerAnalisisCompleto && (
          <div className="mb-3 flex justify-center">
            <button
              onClick={handleToggleAnalisisCompleto}
              disabled={type !== 'ventaIncremental'}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                type === 'ventaIncremental'
                  ? 'text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 cursor-pointer'
                  : 'text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              Ver análisis completo
              <svg
                className={`h-4 w-4 transform transition-transform ${showAnalisisCompleto && type === 'ventaIncremental' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Toggle Detail Button */}
        {isLoading ? (
          <button
            disabled
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg cursor-not-allowed text-sm"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Cargando...
          </button>
        ) : detailData.length > 0 ? (
          <button
            onClick={handleToggleDetalle}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Detalle ({detailData.length} registros)
            <svg
              className={`h-4 w-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        ) : (
          <div className="w-full flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm">
            Sin registros detallados
          </div>
        )}
      </div>

      {/* Expanded Details Table */}
      {isExpanded && detailData.length > 0 && (
        <OpportunityDetailTable type={type} detailData={detailData} />
      )}

      {/* Análisis Completo Dropdown - Only for Venta Incremental */}
      {showAnalisisCompleto && type === 'ventaIncremental' && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Top Causas Principales
          </h3>
          <div className="space-y-4">
            {causas.map((causa) => (
              <div
                key={causa.id}
                className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                {/* Header with number circle, title and trend icon */}
                <div className="flex items-start gap-3 mb-4">
                  {/* Number circle */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-500 text-white font-semibold text-sm flex-shrink-0">
                    {causa.id}
                  </div>
                  {/* Title and subtitle with trend */}
                  <div className="flex-1 flex items-start justify-between min-w-0">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {causa.titulo}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {causa.subtitulo}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {getTrendIcon(causa.tendencia)}
                    </div>
                  </div>
                </div>

                {/* Stats in row - compact layout */}
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                      Actual
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {causa.actual}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                      Óptimo
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {causa.optimo}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                      Desvío
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {causa.desvio}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">
                      Correlación
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {causa.correlacion}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for detail table
function OpportunityDetailTable({
  type,
  detailData
}: {
  type: OpportunityType;
  detailData: DetailRecord[]
}) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Tienda
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                SKU
              </th>
              {type === 'agotado' && (
                <>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Días Inv.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Segmento
                  </th>
                </>
              )}
              {type === 'caducidad' && (
                <>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Inv. Rem.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    F. Cad.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Segmento
                  </th>
                </>
              )}
              {type === 'ventaIncremental' && (
                <>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Segmento
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ópt. Días Inv.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Real Días Inv.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ópt. Pto. Reorden
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Real Pto. Reorden
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ópt. Tamaño Ped.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Real Tamaño Ped.
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Ópt. Frecuencia
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Real Frecuencia
                  </th>
                </>
              )}
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Impacto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
            {detailData.slice(0, 5).map((registro) => (
              <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                  {registro.tienda}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                  {registro.sku}
                </td>
                {type === 'agotado' && (
                  <>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-red-600 font-medium">
                      {registro.diasInventario}d
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getSegmentColor(registro.segmentoTienda || '')}`}>
                        {registro.segmentoTienda}
                      </span>
                    </td>
                  </>
                )}
                {type === 'caducidad' && (
                  <>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-yellow-600 font-medium">
                      {registro.inventarioRemanente}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.fechaCaducidad ? formatDate(registro.fechaCaducidad) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getSegmentColor(registro.segmentoTienda || '')}`}>
                        {registro.segmentoTienda}
                      </span>
                    </td>
                  </>
                )}
                {type === 'ventaIncremental' && (
                  <>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getSegmentColor(registro.segmentoTienda || '')}`}>
                        {registro.segmentoTienda || '-'}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.optimoDiasInventario !== null && registro.optimoDiasInventario !== undefined ? registro.optimoDiasInventario.toFixed(1) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.realDiasInventario !== null && registro.realDiasInventario !== undefined ? registro.realDiasInventario.toFixed(1) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.optimoPuntoReorden !== null && registro.optimoPuntoReorden !== undefined ? registro.optimoPuntoReorden.toFixed(0) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.realPuntoReorden !== null && registro.realPuntoReorden !== undefined ? registro.realPuntoReorden.toFixed(0) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.optimoTamanoPedido !== null && registro.optimoTamanoPedido !== undefined ? registro.optimoTamanoPedido.toFixed(0) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.realTamanoPedido !== null && registro.realTamanoPedido !== undefined ? registro.realTamanoPedido.toFixed(0) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.optimoFrecuencia !== null && registro.optimoFrecuencia !== undefined ? registro.optimoFrecuencia.toFixed(1) : '-'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-white">
                      {registro.realFrecuencia !== null && registro.realFrecuencia !== undefined ? registro.realFrecuencia.toFixed(1) : '-'}
                    </td>
                  </>
                )}
                <td className="px-3 py-2 whitespace-nowrap text-xs text-green-600 font-medium">
                  {formatCurrency(registro.impactoEstimado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {detailData.length > 5 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            Mostrando 5 de {detailData.length} registros
          </div>
        )}
      </div>
    </div>
  );
}

