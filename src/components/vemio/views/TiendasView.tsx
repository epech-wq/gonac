import { useState } from "react";
import { VemioData } from "@/data/vemio-mock-data";

interface TiendasViewProps {
  data: VemioData;
}

type SegmentType = 'hot' | 'balanceadas' | 'slow' | 'criticas';

export default function TiendasView({ data }: TiendasViewProps) {
  const [expandedSegment, setExpandedSegment] = useState<SegmentType | null>(null);

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

  const getSegmentConfig = (segment: SegmentType) => {
    const configs = {
      hot: {
        title: 'Hot',
        description: 'Entidades que están haciendo la mayor contribución y donde el objetivo principal es maximizar la venta',
        color: 'red',
        bgColor: 'bg-red-50 dark:bg-red-900/10',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-900 dark:text-red-100',
        badgeColor: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        icon: (
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
          </svg>
        ),
        actions: [
          { label: 'Reabastecimiento Urgente', enabled: true },
          { label: 'Exhibiciones Adicionales', enabled: true },
          { label: 'Promociones Agresivas', enabled: true },
          { label: 'Visita Promotoria', enabled: false }
        ]
      },
      balanceadas: {
        title: 'Balanceadas',
        description: 'Entidades que están performando acorde al plan objetivo y por lo tanto no representan una oportunidad necesaria de ir a capturar',
        color: 'green',
        bgColor: 'bg-green-50 dark:bg-green-900/10',
        borderColor: 'border-green-200 dark:border-green-800',
        textColor: 'text-green-900 dark:text-green-100',
        badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        icon: (
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        actions: [
          { label: 'Reabastecimiento Urgente', enabled: false },
          { label: 'Exhibiciones Adicionales', enabled: false },
          { label: 'Promociones Agresivas', enabled: false },
          { label: 'Visita Promotoria', enabled: false }
        ]
      },
      slow: {
        title: 'Slow',
        description: 'Entidades que tienen un desempeño por debajo de lo esperado y que por lo tanto debemos valorizar el gap que hay vs objetivo',
        color: 'yellow',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        textColor: 'text-yellow-900 dark:text-yellow-100',
        badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: (
          <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        actions: [
          { label: 'Reabastecimiento Urgente', enabled: false },
          { label: 'Exhibiciones Adicionales', enabled: true },
          { label: 'Promociones Agresivas', enabled: true },
          { label: 'Visita Promotoria', enabled: true }
        ]
      },
      criticas: {
        title: 'Críticas',
        description: 'Entidades que es urgente activar un plan de acción porque más allá del retorno, es inaceptable tener un desempeño en 0',
        color: 'purple',
        bgColor: 'bg-purple-50 dark:bg-purple-900/10',
        borderColor: 'border-purple-200 dark:border-purple-800',
        textColor: 'text-purple-900 dark:text-purple-100',
        badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
        icon: (
          <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
        actions: [
          { label: 'Reabastecimiento Urgente', enabled: false },
          { label: 'Exhibiciones Adicionales', enabled: true },
          { label: 'Promociones Agresivas', enabled: true },
          { label: 'Visita Promotoria', enabled: true }
        ]
      }
    };
    return configs[segment];
  };

  const getRecommendations = (segment: SegmentType) => {
    const recommendations = {
      hot: [
        'Asegurar disponibilidad continua de inventario',
        'Maximizar espacios de exhibición',
        'Implementar promociones para acelerar rotación',
        'Monitorear diariamente para prevenir quiebres'
      ],
      balanceadas: [
        'Mantener niveles de inventario actuales',
        'Monitoreo semanal de performance',
        'Continuar con estrategia actual',
        'Evaluar oportunidades de optimización'
      ],
      slow: [
        'Activar promociones para acelerar sell-through',
        'Revisar ubicación y visibilidad en tienda',
        'Evaluar transferencias a tiendas hot',
        'Implementar degustaciones o activaciones'
      ],
      criticas: [
        'Acción inmediata requerida - Visita de campo',
        'Validar exhibición y disponibilidad en anaquel',
        'Promociones agresivas para evacuar inventario',
        'Considerar transferencias urgentes'
      ]
    };
    return recommendations[segment];
  };

  const toggleExpand = (segment: SegmentType) => {
    setExpandedSegment(expandedSegment === segment ? null : segment);
  };

  const segmentData = data.tiendasSegmentacion;
  const totalStores = segmentData.hot.count + segmentData.balanceadas.count + segmentData.slow.count + segmentData.criticas.count;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Segmentación de Tiendas
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Análisis de performance por tienda para identificar oportunidades de maximización de ventas y planes de acción específicos
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total de tiendas:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">{totalStores}</span>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div>
            <span className="text-gray-500">Ventas totales:</span>
            <span className="ml-2 font-semibold text-gray-900 dark:text-white">
              {formatCurrency(segmentData.hot.metrics.ventasValor + segmentData.balanceadas.metrics.ventasValor + segmentData.slow.metrics.ventasValor + segmentData.criticas.metrics.ventasValor)}
            </span>
          </div>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(Object.keys(segmentData) as SegmentType[]).map((segment) => {
          const config = getSegmentConfig(segment);
          const segData = segmentData[segment];
          const isExpanded = expandedSegment === segment;

          return (
            <div
              key={segment}
              className={`rounded-lg border-2 ${config.borderColor} ${config.bgColor} overflow-hidden transition-all`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0">
                        {config.icon}
                      </div>
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${config.badgeColor}`}>
                        {config.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {segData.count}
                        </span>
                        <span className="text-sm text-gray-500">tiendas</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                      {config.description}
                    </p>
                  </div>
                </div>

                {/* Metrics Summary */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">% del Total</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {segData.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">% Contribución</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {segData.contribution.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Ventas Valor</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(segData.metrics.ventasValor)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Ventas Unidades</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatNumber(segData.metrics.ventasUnidades)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Venta Semanal/Tienda</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(segData.metrics.ventaSemanalTienda)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Días Inventario</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {segData.metrics.diasInventario} días
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                    Recomendaciones de Gestión
                  </h4>
                  <div className="space-y-2 mb-4">
                    {getRecommendations(segment).map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {config.actions.map((action, idx) => (
                    <button
                      key={idx}
                      disabled={!action.enabled}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${action.enabled
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                        }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* Expand Button */}
                <button
                  onClick={() => toggleExpand(segment)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Ver Detalle de Tiendas</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {/* Expanded Store Table */}
              {isExpanded && (
                <div className="border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Tienda
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Ventas Valor
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Unidades
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Venta Semanal
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                            Días Inv.
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                        {segData.stores.map((store) => (
                          <tr key={store.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {store.nombre}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {store.ubicacion}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(store.ventasValor)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatNumber(store.ventasUnidades)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {formatCurrency(store.ventaSemanalTienda)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {store.diasInventario}
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
        })}
      </div>
    </div>
  );
}
