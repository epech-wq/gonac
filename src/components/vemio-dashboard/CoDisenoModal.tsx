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
  pct_valor_capturado?: number;
}

// Helper function to calculate dynamic range that positions Real at 20% and Optimo at 80%
const calculateDynamicRange = (
  actual: number | undefined,
  optimo: number | undefined,
  defaultMin: number,
  defaultMax: number
): { min: number; max: number } => {
  // If no optimo value, use default range
  if (optimo === undefined || optimo === null) {
    return { min: defaultMin, max: defaultMax };
  }

  // Determine which value should be at 20% and which at 80%
  const values = [optimo];
  if (actual !== undefined && actual !== null) {
    values.push(actual);
  }

  // Sort values to determine left (20%) and right (80%) positions
  const sortedValues = [...values].sort((a, b) => a - b);
  const leftValue = sortedValues[0]; // Lower value at 20%
  const rightValue = sortedValues[sortedValues.length - 1]; // Higher value at 80%

  // Calculate range where leftValue is at 20% and rightValue is at 80%
  // Formula: leftValue = min + 0.2 * (max - min)
  //          rightValue = min + 0.8 * (max - min)
  // Solving: rightValue - leftValue = 0.6 * (max - min)
  //          (max - min) = (rightValue - leftValue) / 0.6

  const valueSpan = rightValue - leftValue;

  // If values are the same, create a reasonable range around the value
  if (valueSpan === 0) {
    const center = optimo;
    const range = Math.max(center * 0.5, 10); // 50% of value or minimum 10 units
    return {
      min: Math.max(defaultMin, center - range / 2),
      max: Math.min(defaultMax, center + range / 2)
    };
  }

  // Calculate total range needed (60% of range = valueSpan)
  const totalRange = valueSpan / 0.6;

  // Calculate min (leftValue should be at 20% of range)
  const calculatedMin = leftValue - (0.2 * totalRange);
  const calculatedMax = calculatedMin + totalRange;

  // Ensure we don't exceed default bounds but keep decimal precision
  let actualMin = Math.max(defaultMin, calculatedMin);
  let actualMax = Math.min(defaultMax, calculatedMax);

  // Ensure min < max with a small buffer
  if (actualMax - actualMin < 1) {
    // If range is too small, expand it
    const center = (actualMin + actualMax) / 2;
    actualMin = Math.max(defaultMin, center - 0.5);
    actualMax = Math.min(defaultMax, center + 0.5);
  }

  return {
    min: actualMin,
    max: actualMax
  };
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
  // Ranges are calculated to position Real at 20% and Optimo at 80% of slider width
  const diasInventarioRange = useMemo(() => calculateDynamicRange(
    diasInventarioCausa?.actual,
    diasInventarioCausa?.optimo,
    5,
    30
  ), [diasInventarioCausa?.actual, diasInventarioCausa?.optimo]);

  const tamanoPedidoRange = useMemo(() => calculateDynamicRange(
    tamanoPedidoCausa?.actual,
    tamanoPedidoCausa?.optimo,
    0,
    150
  ), [tamanoPedidoCausa?.actual, tamanoPedidoCausa?.optimo]);

  const frecuenciaRange = useMemo(() => {
    return calculateDynamicRange(
      frecuenciaCausa?.actual,
      frecuenciaCausa?.optimo,
      1,
      120
    );
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
    getInitialValue(tamanoPedidoCausa?.optimo, 80, tamanoPedidoRange)
  );
  const [frecuenciaOptima, setFrecuenciaOptima] = useState(() =>
    getInitialValue(frecuenciaCausa?.optimo, 7, frecuenciaRange)
  );
  const [responsable, setResponsable] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [oportunidadData, setOportunidadData] = useState<OportunidadRow[]>([]);
  const [impactoGlobalTotal, setImpactoGlobalTotal] = useState<number>(0);
  const [diferenciaImpacto, setDiferenciaImpacto] = useState<number>(0);
  const [pctValorCapturado, setPctValorCapturado] = useState<number>(0);
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

  // Function to fetch impact data from API
  const fetchImpactoData = async (dias: number, tamano: number, frecuencia: number) => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/valorizacion/calcular-oportunidad', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          p_dias_inventario_optimo_propuesto: dias,
          p_tamano_pedido_optimo_propuesto: tamano,
          p_frecuencia_optima_propuesta: frecuencia,
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
          // Extract impacto_global_total, diferencia_impacto, and pct_valor_capturado from the first row
          if (result.data.length > 0) {
            if (result.data[0].impacto_global_total !== undefined) {
              setImpactoGlobalTotal(result.data[0].impacto_global_total);
            }
            if (result.data[0].diferencia_impacto !== undefined) {
              setDiferenciaImpacto(result.data[0].diferencia_impacto);
            }
            if (result.data[0].pct_valor_capturado !== undefined) {
              setPctValorCapturado(result.data[0].pct_valor_capturado);
            }
          }
        }
      } else {
        console.error('Error calculating opportunity:', result.message);
      }
    } catch (error) {
      console.error('Error calling calcular-oportunidad API:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Call API when modal opens with initial values
  useEffect(() => {
    if (isOpen && !mountedRef.current) {
      mountedRef.current = true;
      // Call immediately with initial values
      fetchImpactoData(diasInventario, tamanoPedido, frecuenciaOptima);
    }
  }, [isOpen]);

  // Debounced function to call the SQL function when parameters change
  useEffect(() => {
    // Skip if modal is not open or if this is the initial mount
    if (!isOpen || !mountedRef.current) return;

    const timer = setTimeout(() => {
      fetchImpactoData(diasInventario, tamanoPedido, frecuenciaOptima);
    }, 800); // 800ms debounce delay

    return () => {
      clearTimeout(timer);
    };
  }, [diasInventario, tamanoPedido, frecuenciaOptima]);

  // Reset mounted ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      mountedRef.current = false;
      setOportunidadData([]);
      setImpactoGlobalTotal(0);
      setDiferenciaImpacto(0);
      setPctValorCapturado(0);
    }
  }, [isOpen]);

  // Calculate new Valor Actual from the sum of all impacto values
  const nuevoValorActual = oportunidadData.length > 0
    ? oportunidadData.reduce((sum, row) => sum + (Number(row.impacto) || 0), 0)
    : impacto;

  // Helper function to calculate marker position percentage
  const calculateMarkerPosition = (value: number, min: number, max: number): number => {
    if (max <= min) return 50; // Fallback if range is invalid
    const position = ((value - min) / (max - min)) * 100;
    // Clamp between 0 and 100 to prevent markers from going outside the slider
    return Math.max(0, Math.min(100, position));
  };

  // Use pct_valor_capturado from database if available, otherwise calculate
  // Multiply by 100 to convert from decimal (e.g., 0.15) to percentage (15%)
  const percentageDifference = pctValorCapturado !== 0
    ? pctValorCapturado * 100
    : (impacto > 0 ? ((impactoGlobalTotal - impacto) / impacto) * 100 : 0);

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

    // Force static positions: Real at 20%, Optimo at 80%
    // Determine which value is lower to assign correct positions
    const realPos = real !== undefined && optimo !== undefined
      ? (real < optimo ? 20 : 80)
      : real !== undefined
        ? 20
        : null;

    const optimoPos = real !== undefined && optimo !== undefined
      ? (optimo > real ? 80 : 20)
      : 80;

    // Calculate the difference from optimo value
    const deltaFromOptimo = optimo !== undefined && optimo !== null
      ? localValue - optimo
      : 0;

    // Format the delta display with +/- sign (always show sign) - truncate instead of round
    const formatDelta = (delta: number): string => {
      if (delta === 0) return '0';
      const sign = delta > 0 ? '+' : '';
      const truncated = Math.trunc(delta * 10) / 10; // Truncate to 1 decimal
      return `${sign}${truncated.toFixed(1)}`;
    };

    // Helper to truncate number to 1 decimal place
    const truncateToOneDecimal = (num: number): string => {
      const truncated = Math.trunc(num * 10) / 10;
      return truncated.toFixed(1);
    };

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

    const handleDeltaChange = (deltaValue: number) => {
      // Calculate the new absolute value from the delta
      const newAbsoluteValue = (optimo ?? 0) + deltaValue;
      // Clamp value to min/max range
      const clampedValue = Math.min(Math.max(newAbsoluteValue, validMin), validMax);
      setLocalValue(clampedValue);
      onChange(clampedValue); // Immediate update for number input
    };

    // Calculate current slider position for collision detection
    const currentPos = calculateMarkerPosition(localValue, validMin, validMax);

    // Check if slider is too close to markers (within 10% threshold)
    const isNearReal = realPos !== null && Math.abs(currentPos - realPos) < 10;
    const isNearOptimo = Math.abs(currentPos - optimoPos) < 10;

    // Determine if Real tooltip should be below
    const realTooltipBelow = isNearReal;
    // Determine if Optimo tooltip should be below
    const optimoTooltipBelow = isNearOptimo;

    return (
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative pt-10 pb-10">
            {/* Background track */}
            <div className="h-2 bg-gray-200 rounded-lg dark:bg-gray-700"></div>

            {/* Markers on track - dots with tooltips */}
            <div className="absolute top-10 left-0 right-0 h-2 pointer-events-none">
              {/* Real marker dot with tooltip */}
              {real !== undefined && (
                <div
                  className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${realPos}%` }}
                >
                  {/* Tooltip - position changes based on proximity to slider */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 ${realTooltipBelow ? 'top-6' : '-top-8'}`}>
                    <div className="bg-white dark:bg-gray-900 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      <div className="text-center">Real</div>
                      <div className="text-center font-bold">{truncateToOneDecimal(real)}</div>
                    </div>
                    {/* Arrow pointing up or down based on position */}
                    <div className={`absolute left-1/2 transform -translate-x-1/2 ${realTooltipBelow ? '-top-1' : '-bottom-1'}`}>
                      {realTooltipBelow ? (
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-blue-600 dark:border-b-blue-500"></div>
                      ) : (
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-blue-600 dark:border-t-blue-500"></div>
                      )}
                    </div>
                  </div>
                  {/* Dot */}
                  <div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-400 border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
              )}
              {/* Optimo marker dot with tooltip */}
              <div
                className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${optimoPos}%` }}
              >
                {/* Tooltip - position changes based on proximity to slider */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 ${optimoTooltipBelow ? 'top-6' : '-top-8'}`}>
                  <div className="bg-white dark:bg-gray-900 border-2 border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                    <div className="text-center">Óptimo</div>
                    <div className="text-center font-bold">{optimo !== undefined ? truncateToOneDecimal(optimo) : '-'}</div>
                  </div>
                  {/* Arrow pointing up or down based on position */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 ${optimoTooltipBelow ? '-top-1' : '-bottom-1'}`}>
                    {optimoTooltipBelow ? (
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-l-transparent border-r-transparent border-b-green-600 dark:border-b-green-500"></div>
                    ) : (
                      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[5px] border-l-transparent border-r-transparent border-t-green-600 dark:border-t-green-500"></div>
                    )}
                  </div>
                </div>
                {/* Dot */}
                <div className="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 shadow-sm"></div>
              </div>
            </div>

            {/* Slider input */}
            <input
              type="range"
              min={validMin}
              max={validMax}
              step="any"
              value={localValue}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="absolute top-10 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-brand-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />

            {/* Tooltip showing current value above slider thumb */}
            <div
              className="absolute top-0 transform -translate-x-1/2 pointer-events-none z-20"
              style={{ left: `${currentPos}%` }}
            >
              <div className="bg-brand-600 dark:bg-brand-700 text-white text-xs font-semibold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {truncateToOneDecimal(localValue)}
              </div>
              {/* Arrow pointing down */}
              <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-1">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-brand-600 dark:border-t-brand-700"></div>
              </div>
            </div>
          </div>
          <input
            type="text"
            value={formatDelta(deltaFromOptimo)}
            onChange={(e) => {
              // Parse the input, handling +/- signs
              const inputValue = e.target.value.trim();
              const numValue = Number(inputValue);
              if (!isNaN(numValue)) {
                handleDeltaChange(numValue);
              }
            }}
            className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-center"
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
                {formatCurrency(impacto)}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                    Impacto
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">
                    {impactoGlobalTotal > 0 ? formatCurrency(impactoGlobalTotal) : '$0'}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                    Cambio
                  </p>
                  <p className={`text-lg font-bold ${percentageDifference > 0
                    ? 'text-green-600 dark:text-green-400'
                    : percentageDifference < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                    }`}>
                    {percentageDifference > 0 ? '+' : ''}{percentageDifference.toFixed(1)}%
                  </p>
                </div>
              </div>
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
                  step={0.1}
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
                  step={0.1}
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
                  step={0.1}
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
                  oportunidad es {impactoGlobalTotal > 0 ? formatCurrency(impactoGlobalTotal) : '$0'} con un ROI del 150%. La proyección
                  considera correlaciones ML entre parámetros y el comportamiento
                  histórico en Autoservicio &gt; Centro &gt; Walmart.
                </p>
              </div>
            </div>
          </div>

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

