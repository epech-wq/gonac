/**
 * Parámetros de Optimización Section Component
 * Displays optimization parameters with optimized vs actual values
 */

"use client";

import Badge from "@/components/ui/badge/Badge";
import {
  TimeIcon,
  BoxTapped,
  BoxIconLine,
  CalenderIcon,
} from "@/icons";
import { useParametrosOptimos } from "@/hooks/useParametrosOptimos";

export default function ParametrosOptimizacionSection() {
  const { data, loading, error } = useParametrosOptimos();

  // Build parameters array from database data
  const parameters = data?.data ? [
    {
      id: 1,
      title: "Días de Inventario",
      optimized: data.data.dias_inventario_optimo,
      actual: data.data.dias_inventario_real,
      unit: "días",
      icon: <TimeIcon />,
    },
    {
      id: 2,
      title: "Punto de Reorden",
      optimized: data.data.punto_reorden_optimo,
      actual: data.data.punto_reorden_real,
      unit: "unidades",
      icon: <BoxTapped />,
    },
    {
      id: 3,
      title: "Tamaño de Pedido Óptimo",
      optimized: data.data.tamano_pedido_optimo,
      actual: data.data.tamano_pedido_real,
      unit: "unidades",
      icon: <BoxIconLine />,
    },
    {
      id: 4,
      title: "Frecuencia Óptima",
      optimized: data.data.frecuencia_optima,
      actual: data.data.frecuencia_real,
      unit: "días",
      icon: <CalenderIcon />,
    },
  ] : [];

  // Calculate deviation from target with color coding
  // Different rules for different parameters:
  // - días inventario, punto de reorden, tamaño de pedido: greater is better (green if actual > optimized)
  // - frecuencia optima: less is better (green if actual < optimized)
  const calculateDeviationFromTarget = (target: number, actual: number, paramId: number) => {
    const deviation = ((actual - target) / target) * 100;
    let color: "success" | "warning" | "error" = "success";
    
    // Frecuencia Óptima (id: 4) - less is better
    if (paramId === 4) {
      if (actual < target) {
        color = "success"; // Verde: actual es menor que optimizado (mejor)
      } else if (actual <= target * 1.1) {
        color = "warning"; // Amarillo: hasta 10% más que optimizado
      } else {
        color = "error"; // Rojo: más de 10% sobre optimizado
      }
    } else {
      // Días inventario, Punto de reorden, Tamaño de pedido - greater is better
      if (actual > target) {
        color = "success"; // Verde: actual es mayor que optimizado (mejor)
      } else if (actual >= target * 0.9) {
        color = "warning"; // Amarillo: hasta 10% menos que optimizado
      } else {
        color = "error"; // Rojo: más de 10% bajo optimizado
      }
    }
    
    return {
      value: Math.abs(deviation).toFixed(1),
      isPositive: deviation > 0,
      color,
      rawDeviation: deviation,
    };
  };

  return (
    <div className="mt-8">
      {/* Subtitle */}
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Parámetros de Optimización
      </h3>
      
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((id) => (
            <div
              key={id}
              className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800"
            >
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            Error al cargar parámetros de optimización: {error.message}
          </p>
        </div>
      )}

      {/* Parameters Grid */}
      {!loading && !error && parameters.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parameters.map((param) => {
            const deviation = calculateDeviationFromTarget(param.optimized, param.actual, param.id);

            return (
              <div
                key={param.id}
                className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800 transition-all"
              >
                {/* Header with title and icon on the right */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {param.title}
                  </h4>
                  <div className="flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 flex-shrink-0">
                    <div className="text-gray-700 dark:text-gray-300">
                      {param.icon}
                    </div>
                  </div>
                </div>

                {/* Two columns for Optimized and Actual */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  {/* Optimized Value */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Objetivo (Vemio)
                    </p>
                    <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
                      {param.optimized.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {param.unit}
                    </p>
                  </div>

                  {/* Actual Value */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Real
                    </p>
                    <p className="text-xl font-semibold text-gray-800 dark:text-white/90">
                      {param.actual.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {param.unit}
                    </p>
                  </div>
                </div>

                {/* Badge below the values with label */}
                <div className="flex items-center gap-2">
                  <Badge color={deviation.color} size="sm">
                    {deviation.isPositive ? "+" : "-"}
                    {deviation.value}%
                  </Badge>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Desviación del objetivo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && parameters.length === 0 && (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No hay datos de parámetros de optimización disponibles.
          </p>
        </div>
      )}
    </div>
  );
}


