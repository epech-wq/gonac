"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { AngleLeftIcon, BoltIcon } from "@/icons";
import ProgressBar from "@/components/progress-bar/ProgressBar";
import CoDisenoModal from "./CoDisenoModal";
import type { CausaCard, AnalisisCausasContentProps } from "./types";

const AnalisisCausasContent: React.FC<AnalisisCausasContentProps> = ({
  onVolver,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const causas: CausaCard[] = [
    {
      id: 1,
      titulo: "Dias Inventario",
      subtitulo: "Autoservicio > Centro > Walmart",
      tendencia: "down",
      actual: 8,
      optimo: 14,
      desvio: "-43%",
      correlacion: 85,
      impactoProgreso: 85,
    },
    {
      id: 2,
      titulo: "Tamaño Pedido",
      subtitulo: "Bebidas > RefreshCo",
      tendencia: "up",
      actual: 650,
      optimo: 500,
      desvio: "+30%",
      correlacion: 78,
      impactoProgreso: 78,
    },
    {
      id: 3,
      titulo: "Distancia numérica",
      subtitulo: "Conveniencia > Norte",
      tendencia: "neutral",
      actual: 72,
      optimo: 85,
      desvio: "-15%",
      correlacion: 65,
      impactoProgreso: 65,
    },
  ];

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
        <button
          onClick={onVolver}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition"
        >
          <AngleLeftIcon />
          Volver a oportunidades
        </button>
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

      {/* Top 3 Causas Principales */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top 3 Causas Principales
        </h3>
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
                    {causa.actual}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Óptimo
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {causa.optimo}
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
                    Correlación
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {causa.correlacion}%
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Impacto en Oportunidad (Correlación ML)
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
      </div>

      {/* Co-Diseño Modal */}
      <CoDisenoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default AnalisisCausasContent;

