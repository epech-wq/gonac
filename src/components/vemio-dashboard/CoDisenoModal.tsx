"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Button from "@/components/ui/button/Button";
import DatePicker from "./DatePicker";
import { CloseIcon, BoltIcon, InfoIcon, CheckCircleIcon } from "@/icons";
import type { CoDisenoModalProps } from "./types";
import { formatCurrency } from "@/utils/formatters";
import type { CausaData } from "./types";

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

// Helper function to calculate dynamic range with padding
const calculateDynamicRange = (
  actual: number | undefined,
  optimo: number | undefined,
  defaultMin: number,
  defaultMax: number,
  paddingPercent: number = 0.3 // 30% padding on each side
): { min: number; max: number } => {
  if (actual === undefined && optimo === undefined) {
    return { min: defaultMin, max: defaultMax };
  }

  const values = [actual, optimo].filter((v): v is number => v !== undefined);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  // Calculate range with padding
  const range = maxValue - minValue;
  // If range is 0 (actual === optimo), use a percentage of the value as padding
  const padding = range === 0 
    ? Math.max(minValue * paddingPercent, (defaultMax - defaultMin) * 0.1)
    : Math.max(range * paddingPercent, range * 0.2); // At least 20% padding
  
  const calculatedMin = Math.max(defaultMin, Math.floor(minValue - padding));
  const calculatedMax = Math.min(defaultMax, Math.ceil(maxValue + padding));
  
  // Ensure we have a reasonable range (at least 10% of default range)
  const minRange = (defaultMax - defaultMin) * 0.1;
  if (calculatedMax - calculatedMin < minRange) {
    const center = (calculatedMin + calculatedMax) / 2;
    return {
      min: Math.max(defaultMin, Math.floor(center - minRange / 2)),
      max: Math.min(defaultMax, Math.ceil(center + minRange / 2))
    };
  }
  
  return { min: calculatedMin, max: calculatedMax };
};

const CoDisenoModal: React.FC<CoDisenoModalProps> = ({ isOpen, onClose, impacto = 0, causasData = [] }) => {
  // Extract values from causas data
  const diasInventarioCausa = causasData.find(c => 
    c.titulo.toLowerCase().includes('dias') || 
    c.titulo.toLowerCase().includes('inventario') ||
    c.titulo.toLowerCase().includes('días')
  );
  const tamanoPedidoCausa = causasData.find(c => 
    c.titulo.toLowerCase().includes('tamaño') || 
    c.titulo.toLowerCase().includes('pedido') ||
    c.titulo.toLowerCase().includes('tamano')
  );
  const frecuenciaCausa = causasData.find(c => 
    c.titulo.toLowerCase().includes('frecuencia') ||
    c.titulo.toLowerCase() === 'frecuencia' ||
    c.titulo.toLowerCase().includes('frecuencia optima') ||
    c.titulo.toLowerCase().includes('frecuencia óptima')
  );

  // Calculate dynamic ranges (recalculate when causasData changes)
  const diasInventarioRange = useMemo(() => calculateDynamicRange(
    diasInventarioCausa?.actual,
    diasInventarioCausa?.optimo,
    5,
    30,
    0.3
  ), [diasInventarioCausa?.actual, diasInventarioCausa?.optimo]);
  
  const tamanoPedidoRange = useMemo(() => calculateDynamicRange(
    tamanoPedidoCausa?.actual,
    tamanoPedidoCausa?.optimo,
    100,
    1000,
    0.3
  ), [tamanoPedidoCausa?.actual, tamanoPedidoCausa?.optimo]);
  
  const frecuenciaRange = useMemo(() => {
    const range = calculateDynamicRange(
      frecuenciaCausa?.actual,
      frecuenciaCausa?.optimo,
      1,
      120, // Increased max to 120 to allow values up to 100+
      0.3
    );
    // Ensure min < max (at least a range of 1)
    if (range.min >= range.max) {
      return { min: 1, max: 120 };
    }
    return range;
  }, [frecuenciaCausa?.actual, frecuenciaCausa?.optimo]);

  // Initialize sliders with optimo values from causas, clamped to dynamic ranges
  const getInitialValue = (optimo: number | undefined, defaultVal: number, range: { min: number; max: number }) => {
    const value = optimo !== undefined ? optimo : defaultVal;
    return Math.min(Math.max(value, range.min), range.max);
  };

  const [diasInventario, setDiasInventario] = useState(() => 
    getInitialValue(diasInventarioCausa?.optimo, 14, diasInventarioRange)
  );
  const [tamanoPedido, setTamanoPedido] = useState(() => 
    getInitialValue(tamanoPedidoCausa?.optimo, 500, tamanoPedidoRange)
  );
  const [frecuenciaOptima, setFrecuenciaOptima] = useState(() => 
    getInitialValue(frecuenciaCausa?.optimo, 7, frecuenciaRange)
  );
  const [responsable, setResponsable] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [oportunidadData, setOportunidadData] = useState<OportunidadRow[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const mountedRef = useRef(false);

  // Update sliders when causasData changes, clamping to dynamic ranges
  useEffect(() => {
    if (diasInventarioCausa?.optimo !== undefined) {
      const clamped = Math.min(Math.max(diasInventarioCausa.optimo, diasInventarioRange.min), diasInventarioRange.max);
      setDiasInventario(clamped);
    }
    if (tamanoPedidoCausa?.optimo !== undefined) {
      const clamped = Math.min(Math.max(tamanoPedidoCausa.optimo, tamanoPedidoRange.min), tamanoPedidoRange.max);
      setTamanoPedido(clamped);
    }
    if (frecuenciaCausa?.optimo !== undefined) {
      const clamped = Math.min(Math.max(frecuenciaCausa.optimo, frecuenciaRange.min), frecuenciaRange.max);
      setFrecuenciaOptima(clamped);
    }
  }, [causasData, diasInventarioCausa?.optimo, tamanoPedidoCausa?.optimo, frecuenciaCausa?.optimo, diasInventarioRange, tamanoPedidoRange, frecuenciaRange]);

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

  // Helper function to calculate marker position percentage
  const calculateMarkerPosition = (value: number, min: number, max: number): number => {
    if (max <= min) return 50; // Fallback if range is invalid
    const position = ((value - min) / (max - min)) * 100;
    // Clamp between 0 and 100 to prevent markers from going outside the slider
    return Math.max(0, Math.min(100, position));
  };

  // Helper component for slider with markers
  const SliderWithMarkers = ({ 
    value, 
    onChange, 
    min, 
    max, 
    step = 1,
    optimo, 
    real,
    label 
  }: { 
    value: number; 
    onChange: (value: number) => void; 
    min: number; 
    max: number; 
    step?: number;
    optimo?: number; 
    real?: number;
    label: string;
  }) => {
    // Ensure min < max (handle edge cases)
    const validMin = min < max ? min : Math.max(1, min - 1);
    const validMax = max > min ? max : min + 1; // Use min + 1 as fallback instead of hardcoded 30
    
    const [localValue, setLocalValue] = useState(() => {
      const clamped = Math.min(Math.max(value, validMin), validMax);
      return clamped;
    });
    
    const optimoPos = optimo !== undefined && optimo !== null && validMin < validMax 
      ? calculateMarkerPosition(optimo, validMin, validMax) 
      : null;
    const realPos = real !== undefined && real !== null && validMin < validMax
      ? calculateMarkerPosition(real, validMin, validMax) 
      : null;

    // Sync local value with prop value (clamped to min/max)
    useEffect(() => {
      const clampedValue = Math.min(Math.max(value, validMin), validMax);
      setLocalValue(clampedValue);
    }, [value, validMin, validMax]);

    // Debounced onChange
    useEffect(() => {
      const timer = setTimeout(() => {
        if (localValue !== value) {
          onChange(localValue);
        }
      }, 300); // 300ms debounce

      return () => clearTimeout(timer);
    }, [localValue, onChange, value]);

    const handleSliderChange = (newValue: number) => {
      const clampedValue = Math.min(Math.max(newValue, validMin), validMax);
      setLocalValue(clampedValue);
    };

    const handleNumberChange = (newValue: number) => {
      // Clamp value to min/max range
      const clampedValue = Math.min(Math.max(newValue, validMin), validMax);
      setLocalValue(clampedValue);
      onChange(clampedValue); // Immediate update for number input
    };

    return (
      <div className="relative">
        {/* Markers above slider */}
        {(optimoPos !== null || realPos !== null) && (
          <div className="relative h-6 mb-2">
            {/* Optimo marker */}
            {optimoPos !== null && (
              <div
                className="absolute transform -translate-x-1/2"
                style={{ left: `${optimoPos}%` }}
              >
                <div className="text-center">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Optimo</span>
                </div>
              </div>
            )}
            {/* Real marker */}
            {realPos !== null && (
              <div
                className="absolute transform -translate-x-1/2"
                style={{ left: `${realPos}%` }}
              >
                <div className="text-center">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Real</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            {/* Background track */}
            <div className="h-2 bg-gray-200 rounded-lg dark:bg-gray-700"></div>
            
            {/* Markers on track - dots */}
            {(optimoPos !== null || realPos !== null) && (
              <div className="absolute top-0 left-0 right-0 h-2 pointer-events-none">
                {/* Optimo marker dot */}
                {optimoPos !== null && (
                  <div
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${optimoPos}%` }}
                  >
                    <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                  </div>
                )}
                {/* Real marker dot */}
                {realPos !== null && (
                  <div
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${realPos}%` }}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                  </div>
                )}
              </div>
            )}
            
            {/* Slider input */}
            <input
              type="range"
              min={validMin}
              max={validMax}
              step={step}
              value={localValue}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
          <input
            type="number"
            min={validMin}
            max={validMax}
            step={step}
            value={localValue}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              if (!isNaN(numValue)) {
                handleNumberChange(numValue);
              }
            }}
            className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
    );
  };

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
          {/* Two Indicator Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Valor Actual
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {nuevoValorActual > 0 ? formatCurrency(nuevoValorActual) : '$0'}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                Impacto
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                {nuevoValorActual > 0 ? formatCurrency(nuevoValorActual) : '$0'}
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
                <SliderWithMarkers
                  value={diasInventario}
                  onChange={setDiasInventario}
                  min={diasInventarioRange.min}
                  max={diasInventarioRange.max}
                  optimo={diasInventarioCausa?.optimo}
                  real={diasInventarioCausa?.actual}
                  label="Dias de inventario"
                />
              </div>

              {/* Tamaño de Pedido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tamaño de Pedido
                </label>
                <SliderWithMarkers
                  value={tamanoPedido}
                  onChange={setTamanoPedido}
                  min={tamanoPedidoRange.min}
                  max={tamanoPedidoRange.max}
                  step={Math.max(10, Math.floor((tamanoPedidoRange.max - tamanoPedidoRange.min) / 50))}
                  optimo={tamanoPedidoCausa?.optimo}
                  real={tamanoPedidoCausa?.actual}
                  label="Tamaño de Pedido"
                />
              </div>

              {/* Frecuencia Optima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Frecuencia Optima
                </label>
                <SliderWithMarkers
                  value={frecuenciaOptima}
                  onChange={setFrecuenciaOptima}
                  min={frecuenciaRange.min}
                  max={frecuenciaRange.max}
                  step={1}
                  optimo={frecuenciaCausa?.optimo}
                  real={frecuenciaCausa?.actual}
                  label="Frecuencia Optima"
                />
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

