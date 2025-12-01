"use client";
import React, { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button/Button";
import DatePicker from "./DatePicker";
import { CloseIcon, BoltIcon, InfoIcon, CheckCircleIcon } from "@/icons";
import type { CoDisenoModalProps } from "./types";
import { formatCurrency } from "@/utils/formatters";

interface OportunidadRow {
  id_store: number;
  sku: number;
  store_name: string;
  region: string;
  segment: string;
  optimo_dias_inventario_actual: number;
  optimo_tamano_pedido_actual: number;
  optimo_frecuencia_actual: number;
  real_dias_inventario: number;
  real_tamano_pedido: number;
  real_frecuencia: number;
  valor_dias_inventario_real: number;
  valor_tamano_pedido_real: number;
  valor_frecuencia_real: number;
  valor_dias_inventario_propuesto: number;
  valor_tamano_pedido_propuesto: number;
  valor_frecuencia_propuesto: number;
  diferencia_valor_dias_inventario: number;
  diferencia_valor_tamano_pedido: number;
  diferencia_valor_frecuencia: number;
  impacto: number;
}

const CoDisenoModal: React.FC<CoDisenoModalProps> = ({ isOpen, onClose, impacto = 0 }) => {
  const [diasInventario, setDiasInventario] = useState(14);
  const [tamanoPedido, setTamanoPedido] = useState(500);
  const [frecuenciaOptima, setFrecuenciaOptima] = useState(7);
  const [responsable, setResponsable] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [oportunidadData, setOportunidadData] = useState<OportunidadRow[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const mountedRef = useRef(false);

  // Debounced function to call the SQL function
  useEffect(() => {
    // Skip on initial mount
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (!isOpen) return;

    setIsCalculating(true);
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/valorizacion/calcular-oportunidad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p_dias_inventario_optimo_propuesto: diasInventario,
            p_tamano_pedido_optimo_propuesto: tamanoPedido,
            p_frecuencia_optima_propuesta: frecuenciaOptima,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (result.success) {
          // Store the returned data
          if (Array.isArray(result.data)) {
            setOportunidadData(result.data);
          }
        } else {
          console.error('Error calculating opportunity:', result.message);
        }
      } catch (error) {
        console.error('Error calling calcular-oportunidad API:', error);
      } finally {
        setIsCalculating(false);
      }
    }, 800); // 800ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [diasInventario, tamanoPedido, frecuenciaOptima, isOpen]);

  // Reset mounted ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      mountedRef.current = false;
      setOportunidadData([]);
      setShowDetails(false);
    }
  }, [isOpen]);

  // Calculate new Valor Actual from the sum of all impacto values
  const nuevoValorActual = oportunidadData.length > 0
    ? oportunidadData.reduce((sum, row) => sum + (Number(row.impacto) || 0), 0)
    : impacto;

  // Get first 5 rows for display
  const displayedRows = oportunidadData.slice(0, 5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header - Dark Blue Background */}
        <div className="bg-brand-600 dark:bg-brand-700 px-8 py-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Ajustar Parametros
            </h2>
            <p className="text-brand-100 text-sm">
              Venta Incremental
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-brand-100 transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Three Indicator Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Valor Actual
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {nuevoValorActual > 0 ? formatCurrency(nuevoValorActual) : '$0'}
              </p>
            </div>
            <div className="bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-800 rounded-xl p-4">
              <p className="text-xs text-success-700 dark:text-success-400 mb-2">
                ROI Proyectado
              </p>
              <p className="text-2xl font-bold text-success-900 dark:text-success-300">
                150%
              </p>
            </div>
            <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
              <p className="text-xs text-brand-700 dark:text-brand-400 mb-2">
                Correlación ML
              </p>
              <p className="text-2xl font-bold text-brand-900 dark:text-brand-300">
                85%
              </p>
            </div>
          </div>

          {/* Adjust Parameters Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BoltIcon />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ajustar Parámetros
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (recálculo en tiempo real)
              </span>
              {isCalculating && (
                <div className="ml-2 flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-500"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Calculando...</span>
                </div>
              )}
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              {/* Dias de inventario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dias de inventario óptimo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={diasInventario}
                    onChange={(e) => setDiasInventario(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <input
                    type="number"
                    value={diasInventario}
                    onChange={(e) => setDiasInventario(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Tamaño de Pedido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tamaño de Pedido
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={tamanoPedido}
                    onChange={(e) => setTamanoPedido(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <input
                    type="number"
                    value={tamanoPedido}
                    onChange={(e) => setTamanoPedido(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Frecuencia Optima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Frecuencia Optima
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={frecuenciaOptima}
                    onChange={(e) => setFrecuenciaOptima(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <input
                    type="number"
                    value={frecuenciaOptima}
                    onChange={(e) => setFrecuenciaOptima(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Responsable (opcional)
              </label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre del responsable"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha límite (Opcional)
              </label>
              <DatePicker
                value={fechaLimite}
                onChange={setFechaLimite}
                placeholder="Seleccionar fecha"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Impact Alert Card */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-0.5">
                <InfoIcon />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Impacto simulado con Vemio IA
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Al ajustar los parámetros seleccionados, el valor estimado de la
                  oportunidad es {nuevoValorActual > 0 ? formatCurrency(nuevoValorActual) : '$0'} con un ROI del 150%. La proyección
                  considera correlaciones ML entre parámetros y el comportamiento
                  histórico en Autoservicio &gt; Centro &gt; Walmart.
                </p>
              </div>
            </div>
          </div>

          {/* Details Dropdown */}
          {oportunidadData.length > 0 && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <InfoIcon />
                  <span className="font-semibold text-gray-900 dark:text-white">
                    Detalle de Oportunidades ({oportunidadData.length} registros)
                  </span>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-600 dark:text-gray-400 transform transition-transform ${
                    showDetails ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDetails && (
                <div className="p-6 bg-white dark:bg-gray-900">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Tienda
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Región
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Segmento
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Impacto
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {displayedRows.map((row, index) => (
                          <tr key={`${row.id_store}-${row.sku}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {row.store_name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {row.sku}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.region}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                              {row.segment}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-green-600 dark:text-green-400">
                              {formatCurrency(Number(row.impacto) || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {oportunidadData.length > 5 && (
                      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
                        Mostrando 5 de {oportunidadData.length} registros
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" size="md" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                // Handle approval
                console.log("Plan aprobado");
                onClose();
              }}
            >
              Aprobar Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoDisenoModal;

