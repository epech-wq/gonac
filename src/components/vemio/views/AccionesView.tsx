/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { VemioData } from "@/data/vemio-mock-data";

interface AccionesViewProps {
  data: VemioData["acciones"];
}

type ActionType = 'minimizarAgotados' | 'exhibicionesAdicionales' | 'promocionesHot' | 'promocionesSlow' | 'visitaPromotoria';

export default function AccionesView({ data }: AccionesViewProps) {
  const [expandedAction, setExpandedAction] = useState<ActionType | null>(null);
  const [showVemioAgent, setShowVemioAgent] = useState<ActionType | null>(null);

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

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case 'minimizarAgotados':
        return (
          <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'exhibicionesAdicionales':
        return (
          <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'promocionesHot':
        return (
          <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'promocionesSlow':
        return (
          <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'visitaPromotoria':
        return (
          <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const getActionTitle = (actionType: ActionType) => {
    switch (actionType) {
      case 'minimizarAgotados':
        return 'Minimizar Agotados';
      case 'exhibicionesAdicionales':
        return 'Exhibiciones Adicionales';
      case 'promocionesHot':
        return 'Promociones HOT';
      case 'promocionesSlow':
        return 'Promociones SLOW';
      case 'visitaPromotoria':
        return 'Visita Promotoría';
    }
  };

  const getROI = (valorPotencial: number, costoEjecucion: number) => {
    if (costoEjecucion === 0) return "∞";
    return ((valorPotencial / costoEjecucion) * 100).toFixed(1) + "%";
  };

  const toggleExpanded = (actionType: ActionType) => {
    setExpandedAction(expandedAction === actionType ? null : actionType);
  };

  const handleExecuteAction = (actionType: ActionType) => {
    alert(`Ejecutando acción: ${getActionTitle(actionType)}`);
  };

  const handleVemioAgent = (actionType: ActionType) => {
    setShowVemioAgent(showVemioAgent === actionType ? null : actionType);
  };

  const renderActionCard = (actionType: ActionType, actionData: Record<string, any>, actionNumber: number) => (
    <div key={actionType} className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 shadow-md border-2 border-blue-200 dark:border-blue-900">
      {/* Header */}
      <div className="p-6 border-b border-blue-200 dark:border-blue-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getActionIcon(actionType)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Acción #{actionNumber}: {getActionTitle(actionType)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {actionData.insight}
              </p>
            </div>
          </div>
          <button
            onClick={() => toggleExpanded(actionType)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className={`h-5 w-5 transform transition-transform ${expandedAction === actionType ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Costo de Ejecución</div>
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {actionData.costoEjecucion === 0 ? "Sin costo directo" : formatCurrency(actionData.costoEjecucion)}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-sm text-green-600 dark:text-green-400">Valor Potencial</div>
            <div className="text-xl font-bold text-green-700 dark:text-green-300">
              {formatCurrency(actionData.valorPotencial.pesos)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {formatNumber(actionData.valorPotencial.cantidad)} unidades
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400">ROI</div>
            <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
              {getROI(actionData.valorPotencial.pesos, actionData.costoEjecucion)}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExecuteAction(actionType)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Ejecutar Automáticamente
          </button>
          <button
            onClick={() => handleVemioAgent(actionType)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Agente VEMIO
          </button>
          <button
            onClick={() => toggleExpanded(actionType)}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Detalles
          </button>
        </div>
      </div>

      {/* VEMIO Agent Chat */}
      {showVemioAgent === actionType && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-purple-50 dark:bg-purple-900/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-900 dark:text-white">
                  <strong>Agente VEMIO:</strong> Hola, estoy aquí para ayudarte con la acción &quot;{getActionTitle(actionType)}&quot;.
                  ¿Te gustaría ajustar algún parámetro o tienes alguna pregunta sobre esta recomendación?
                </p>
              </div>
              <div className="mt-3 flex space-x-2">
                <input
                  type="text"
                  placeholder="Escribe tu pregunta o ajuste..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      {expandedAction === actionType && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
          {renderActionDetails(actionType, actionData)}
        </div>
      )}
    </div>
  );

  const renderActionDetails = (actionType: ActionType, actionData: Record<string, any>) => {
    switch (actionType) {
      case 'minimizarAgotados':
        return (
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Detalles del Plan de Reabastecimiento</h4>
            <div className="space-y-4">
              {actionData.detalles.tiendas.map((tienda: Record<string, any>) => (
                <div key={tienda.id} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">{tienda.nombre}</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                      <thead>
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Días Agotado</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inv. Actual</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Inv. Óptimo</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                        {tienda.skus.map((sku: Record<string, any>) => (
                          <tr key={sku.id}>
                            <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{sku.nombre}</td>
                            <td className="px-3 py-2 text-sm text-red-600 font-medium">{sku.diasAgotado}</td>
                            <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{sku.inventarioActual}</td>
                            <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">{sku.inventarioOptimo}</td>
                            <td className="px-3 py-2 text-sm text-green-600 font-medium">{sku.pedidoSugerido}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'exhibicionesAdicionales':
        return (
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Plan de Exhibiciones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {actionData.detalles.exhibiciones.map((exhibicion: Record<string, any>, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white">{exhibicion.tienda}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{exhibicion.sku}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Costo:</span>
                      <span className="text-gray-900 dark:text-white">{formatCurrency(exhibicion.costoExhibicion)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">V. Incremental:</span>
                      <span className="text-green-600 font-medium">{formatCurrency(exhibicion.ventaIncremental)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ROI:</span>
                      <span className="text-blue-600 font-medium">{exhibicion.retorno.toFixed(1)}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'promocionesSlow':
        return (
          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Plan de Promociones para Mitigar Caducidad</h4>
            <div className="space-y-4">
              {actionData.detalles.promociones.map((promocion: Record<string, any>, index: number) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h5 className="font-medium text-gray-900 dark:text-white">{promocion.tienda}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{promocion.sku}</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                      {promocion.descuento}% descuento
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Inv. Riesgo:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{promocion.inventarioRiesgo}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Inv. Evacuado:</span>
                      <div className="font-medium text-green-600">{promocion.inventarioEvacuado}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">% Evacuado:</span>
                      <div className="font-medium text-blue-600">{promocion.porcentajeEvacuado}%</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Costo:</span>
                      <div className="font-medium text-red-600">{formatCurrency(promocion.costoPromocion)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">Detalles específicos para esta acción en desarrollo</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-2">
          Plan de Acción Generado por VEMIO
        </h2>
        <p className="text-sm text-blue-50 mb-6">
          Cada insight/oportunidad identificada tiene recomendaciones específicas con costo de ejecución y valor potencial a capturar.
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-6">
        {Object.entries(data).map(([actionType, actionData], index) =>
          renderActionCard(actionType as ActionType, actionData, index + 1)
        )}
      </div>
    </div>
  );
}