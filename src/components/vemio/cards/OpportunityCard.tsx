/**
 * Opportunity Card Component
 */

import type { RiskLevel, OpportunityType, DetailRecord } from '@/types/tiendas.types';
import { getBadgeColor, getSegmentColor } from '@/utils/tiendas.mappers';
import { formatCurrency, formatNumber, formatDate } from '@/utils/formatters';

interface OpportunityCardProps {
  type: OpportunityType;
  title: string;
  description: string;
  tiendas: number;
  impacto: number;
  risk: RiskLevel;
  impactoColor: string;
  isExpanded: boolean;
  detailData: DetailRecord[];
  isLoading: boolean;
  onToggleExpand: () => void;
  onActionClick?: (actionType: string) => void;
}

export default function OpportunityCard({
  type,
  title,
  description,
  tiendas,
  impacto,
  risk,
  impactoColor,
  isExpanded,
  detailData,
  isLoading,
  onToggleExpand,
  onActionClick,
}: OpportunityCardProps) {
  return (
    <div className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="relative p-4">
        {/* Risk Badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getBadgeColor(risk)}`}>
            {risk}
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
          <div className={`text-2xl font-bold mb-0.5 ${impactoColor}`}>
            {formatCurrency(impacto)}
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
          
          {/* Grid de 2 columnas cuando hay múltiples acciones */}
          <div className={type === 'sinVenta' ? 'grid grid-cols-2 gap-2' : ''}>
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
            
            {/* Promoción Evacuar - NARANJA (Advertencia/Tiempo limitado) */}
            {type === 'caducidad' && (
              <button
                onClick={() => onActionClick?.('promocion_evacuar')}
                className="w-full text-left px-3 py-2.5 text-xs font-medium text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 rounded shadow-sm hover:shadow-md transition-all duration-200 border border-orange-700 dark:border-orange-600"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Promoción Evacuar Inventario
                </span>
              </button>
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
          </div>
        </div>

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
            onClick={onToggleExpand}
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

