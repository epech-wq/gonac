/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { VemioData } from "@/data/vemio-mock-data";

interface OportunidadesViewProps {
  data: VemioData["oportunidades"];
}

type OpportunityType = 'agotado' | 'caducidad' | 'sinVenta';

export default function OportunidadesView({ data }: OportunidadesViewProps) {
  const [expandedCard, setExpandedCard] = useState<OpportunityType | null>(null);

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

  const getCardIcon = (type: OpportunityType, colorClass: string) => {
    switch (type) {
      case 'agotado':
        return (
          <svg className={`h-8 w-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'caducidad':
        return (
          <svg className={`h-8 w-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'sinVenta':
        return (
          <svg className={`h-8 w-8 ${colorClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        );
    }
  };

  const getCardTitle = (type: OpportunityType) => {
    switch (type) {
      case 'agotado':
        return 'Agotado';
      case 'caducidad':
        return 'Caducidad';
      case 'sinVenta':
        return 'Sin Venta';
    }
  };

  const getCardDescription = (type: OpportunityType) => {
    switch (type) {
      case 'agotado':
        return 'Inventario < 10 días (Tiendas Hot y Balanceadas)';
      case 'caducidad':
        return 'Inventario remanente al 1-feb-2025 (Tiendas Slow y Críticas)';
      case 'sinVenta':
        return 'Ventas <= 0 unidades';
    }
  };

  const getCardColor = (type: OpportunityType) => {
    switch (type) {
      case 'agotado':
        return {
          bg: 'bg-red-50 dark:bg-red-900/10',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-400',
          icon: 'text-red-500 dark:text-red-400'
        };
      case 'caducidad':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/10',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-400',
          icon: 'text-amber-500 dark:text-amber-400'
        };
      case 'sinVenta':
        return {
          bg: 'bg-slate-50 dark:bg-slate-900/10',
          border: 'border-slate-200 dark:border-slate-800',
          text: 'text-slate-700 dark:text-slate-400',
          icon: 'text-slate-500 dark:text-slate-400'
        };
    }
  };

  const toggleExpanded = (type: OpportunityType) => {
    setExpandedCard(expandedCard === type ? null : type);
  };

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'hot':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'balanceada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'slow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critica':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const renderOpportunityCard = (type: OpportunityType, opportunityData: any) => {
    const colors = getCardColor(type);
    return (
      <div key={type} className={`rounded-lg shadow-sm border-2 ${colors.bg} ${colors.border}`}>
        {/* Card Header */}
        <div className="p-6 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getCardIcon(type, colors.icon)}
              <div>
                <h3 className={`text-xl font-bold ${colors.text}`}>{getCardTitle(type)}</h3>
                <p className={`text-sm mt-1 ${colors.text} opacity-75`}>{getCardDescription(type)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Metrics */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className={`text-sm ${colors.text} opacity-75`}>Impacto Total</div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {formatCurrency(opportunityData.impacto)}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className={`text-sm ${colors.text} opacity-75`}>Tiendas Afectadas</div>
              <div className={`text-2xl font-bold ${colors.text}`}>
                {opportunityData.tiendas}
              </div>
            </div>
          </div>

          {/* Ver Detalle Button */}
          <button
            onClick={() => toggleExpanded(type)}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Detalle ({opportunityData.registros.length} registros)
            <svg
              className={`h-4 w-4 ml-2 transform transition-transform ${expandedCard === type ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expanded Details */}
        {expandedCard === type && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Registros Detallados - {getCardTitle(type)}
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tienda
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      SKU
                    </th>
                    {type === 'agotado' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Días Inventario
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Segmento
                        </th>
                      </>
                    )}
                    {type === 'caducidad' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Inv. Remanente
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha Caducidad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Segmento
                        </th>
                      </>
                    )}
                    {type === 'sinVenta' && (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Días Sin Venta
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Última Venta
                        </th>
                      </>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Impacto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Detectado
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  {opportunityData.registros.map((registro: any) => (
                    <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {registro.tienda}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {registro.sku}
                      </td>
                      {type === 'agotado' && (
                        <>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {registro.diasInventario} días
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(registro.segmentoTienda)}`}>
                              {registro.segmentoTienda}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'caducidad' && (
                        <>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">
                            {registro.inventarioRemanente} unidades
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(registro.fechaCaducidad).toLocaleDateString('es-MX')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentColor(registro.segmentoTienda)}`}>
                              {registro.segmentoTienda}
                            </span>
                          </td>
                        </>
                      )}
                      {type === 'sinVenta' && (
                        <>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                            {registro.diasSinVenta} días
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(registro.ultimaVenta).toLocaleDateString('es-MX')}
                          </td>
                        </>
                      )}
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(registro.impactoEstimado)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(registro.fechaDeteccion).toLocaleDateString('es-MX')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Oportunidades Detectadas
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Análisis de riesgos operativos y oportunidades de mejora por categoría de problema.
        </p>
      </div>

      {/* Opportunity Cards */}
      <div className="space-y-6">
        {Object.entries(data).map(([type, opportunityData]) =>
          renderOpportunityCard(type as OpportunityType, opportunityData)
        )}
      </div>
    </div>
  );
}