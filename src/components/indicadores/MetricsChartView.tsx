"use client";
import React from "react";
import type { StoreMetrics } from '@/types/tiendas.types';
import type { MetricasData } from '@/types/metrics.types';
import SingleMetricChart from "./SingleMetricChart";

interface MetricsChartViewProps {
  storeMetrics: StoreMetrics;
  metricasData: MetricasData | null;
}

/**
 * MetricsChartView Component
 * 
 * Displays historical trend charts for all metrics.
 */
export default function MetricsChartView({ storeMetrics, metricasData }: MetricsChartViewProps) {

  const chartIds = [
    "ventas-totales",
    "sell-through",
    "cobertura-numerica",
    "cobertura-ponderada",
    "tasa-quiebre",
    "venta-promedio-diaria",
    "dias-inventario"
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {chartIds.map((id) => (
          <div
            key={id}
            className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <SingleMetricChart
              metricId={id}
              storeMetrics={storeMetrics}
              metricasData={metricasData}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

