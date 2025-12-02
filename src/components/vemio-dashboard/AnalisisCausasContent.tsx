"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/ui/button/Button";
import { AngleLeftIcon, BoltIcon } from "@/icons";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import CoDisenoModal from "./CoDisenoModal";
import type { CausaCard, AnalisisCausasContentProps } from "./types";
import type { ComparacionOptimoRealGlobal } from "@/types/parametros";

const AnalisisCausasContent: React.FC<AnalisisCausasContentProps> = ({
  onVolver,
  backButtonLabel = "Volver a oportunidades",
  showBackButton = true,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [causas, setCausas] = useState<CausaCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCausasData();
  }, []);

  const fetchCausasData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/parametros?view=global');
      
      if (!response.ok) {
        throw new Error('Failed to fetch parametros data');
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }
      
      const globalData: ComparacionOptimoRealGlobal = result.data;
      
      // Transform the data into CausaCard format
      const causasData: CausaCard[] = [
        {
          id: 1,
          titulo: "Días Inventario",
          subtitulo: `${globalData.total_tiendas || 0} tiendas • ${globalData.total_skus || 0} SKUs`,
          tendencia: getTendencia(globalData.real_dias_inventario, globalData.optimo_dias_inventario),
          actual: globalData.real_dias_inventario || 0,
          optimo: globalData.optimo_dias_inventario || 0,
          desvio: formatDesvio(globalData.desviacion_dias_inventario_pct),
          impacto: globalData.valor_dias_inventario || 0,
          impactoProgreso: getImpactoProgreso(globalData.valor_dias_inventario, globalData.impacto),
        },
        {
          id: 2,
          titulo: "Tamaño Pedido",
          subtitulo: `${globalData.total_tiendas || 0} tiendas • ${globalData.total_skus || 0} SKUs`,
          tendencia: getTendencia(globalData.real_tamano_pedido, globalData.optimo_tamano_pedido),
          actual: globalData.real_tamano_pedido || 0,
          optimo: globalData.optimo_tamano_pedido || 0,
          desvio: formatDesvio(globalData.desviacion_tamano_pedido_pct),
          impacto: globalData.valor_tamano_pedido || 0,
          impactoProgreso: getImpactoProgreso(globalData.valor_tamano_pedido, globalData.impacto),
        },
        {
          id: 3,
          titulo: "Frecuencia",
          subtitulo: `${globalData.total_tiendas || 0} tiendas • ${globalData.total_skus || 0} SKUs`,
          tendencia: getTendencia(globalData.real_frecuencia, globalData.optimo_frecuencia),
          actual: globalData.real_frecuencia || 0,
          optimo: globalData.optimo_frecuencia || 0,
          desvio: formatDesvio(globalData.desviacion_frecuencia_pct),
          impacto: globalData.valor_frecuencia || 0,
          impactoProgreso: getImpactoProgreso(globalData.valor_frecuencia, globalData.impacto),
        },
      ];
      
      setCausas(causasData);
    } catch (err) {
      console.error('Error fetching causas data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTendencia = (real: number | null, optimo: number | null): "up" | "down" | "neutral" => {
    if (real === null || optimo === null) return "neutral";
    const diff = real - optimo;
    const diffPct = Math.abs(diff / optimo * 100);
    
    if (diffPct < 5) return "neutral";
    return real > optimo ? "up" : "down";
  };

  const formatDesvio = (desviacion_pct: number | null): string => {
    if (desviacion_pct === null) return "0%";
    const sign = desviacion_pct >= 0 ? "+" : "";
    return `${sign}${desviacion_pct.toFixed(1)}%`;
  };

  const getImpactoProgreso = (valor: number | null, impactoTotal: number | null): number => {
    if (!valor || !impactoTotal || impactoTotal === 0) return 0;
    return Math.min(100, Math.round((valor / impactoTotal) * 100));
  };

  const getTrendIcon = (tendencia: "up" | "down" | "neutral") => {
    switch (tendencia) {
      case "up":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 15V5M10 5L5 10M10 5L15 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-success-600 dark:text-success-400"
            />
          </svg>
        );
      case "down":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 5V15M10 15L15 10M10 15L5 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-error-600 dark:text-error-400"
            />
          </svg>
        );
      case "neutral":
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 10H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600 dark:text-gray-400"
            />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        {showBackButton && onVolver && (
          <button
            onClick={onVolver}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
          >
            <AngleLeftIcon />
            {backButtonLabel}
          </button>
        )}
        {!showBackButton && <div />}
        <Button
          variant="primary"
          size="sm"
          startIcon={<BoltIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Co-diseñar Plan
        </Button>
      </div>

      {/* Title and subtitle */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          Análisis de Causas
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Identificación de factores que impactan en ventas increméntales
        </p>
      </div>

      {/* Gap */}
      <div className="h-6" />

      {/* Top Causas Principales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Causas Principales
        </h3>
        
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
          </div>
        )}
        
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400">
            Error al cargar los datos: {error}
          </div>
        )}
        
        {!isLoading && !error && (
          <div className="grid grid-cols-1 gap-6">
            {causas.map((causa) => (
              <div
                key={causa.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
              >
                {/* Header with number circle, title and trend icon */}
                <div className="flex items-start gap-4 mb-6">
                  {/* Number circle */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-500 text-white font-bold text-lg flex-shrink-0">
                    {causa.id}
                  </div>
                  {/* Title and subtitle with trend */}
                  <div className="flex-1 flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        {causa.titulo}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {causa.subtitulo}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {getTrendIcon(causa.tendencia)}
                    </div>
                  </div>
                </div>

                {/* Stats in row */}
                <div className="flex justify-around mb-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Actual
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(Math.trunc(causa.actual * 10) / 10).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Óptimo
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {(Math.trunc(causa.optimo * 10) / 10).toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Desvío
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {causa.desvio}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Impacto
                    </p>
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ${(Math.trunc((causa.impacto / 1000) * 10) / 10).toFixed(1)}K
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Contribución al Impacto Total
                  </p>
                  <ProgressBar
                    progress={causa.impactoProgreso}
                    size="md"
                    label="none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Co-Diseño Modal */}
      <CoDisenoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        causasData={causas}
      />
    </div>
  );
};

export default AnalisisCausasContent;

