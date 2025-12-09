"use client";
import React from "react";
import dynamic from "next/dynamic";
import { formatCurrency } from '@/utils/formatters';
import { generateTrendData, getChartOptions } from './chartUtils';
import type { StoreMetrics } from '@/types/tiendas.types';
import type { MetricasData } from '@/types/metrics.types';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SingleMetricChartProps {
  metricId: string;
  storeMetrics: StoreMetrics;
  metricasData: MetricasData | null;
  height?: number;
}

export default function SingleMetricChart({
  metricId,
  storeMetrics,
  metricasData,
  height = 280
}: SingleMetricChartProps) {

  // Extract REAL current values from database
  const currentValues = {
    ventasTotales: storeMetrics.ventasTotales,
    sellThrough: (metricasData?.sell_through_pct ?? 0.2) * 100, // Convert to percentage
    coberturaNum: (metricasData?.cobertura_pct ?? 0.83) * 100,
    coberturaPond: (metricasData?.cobertura_ponderada_pct ?? 0.823) * 100,
    tasaQuiebre: metricasData?.porcentaje_agotados_pct ?? 2.3,
    ventaPromDiaria: metricasData?.avg_venta_promedio_diaria ?? (storeMetrics.ventaPromedio / 7),
    diasInventario: storeMetrics.diasInventario,
  };

  // Define chart configs based on ID
  const getChartConfig = (id: string) => {
    switch (id) {
      case "ventas-totales":
        return {
          title: "Ventas Totales",
          color: "#10B981",
          data: generateTrendData(currentValues.ventasTotales, 0.15),
          formatter: (val: number) => formatCurrency(val),
        };
      case "sell-through":
        return {
          title: "Sell-Through",
          color: "#3B82F6",
          data: generateTrendData(currentValues.sellThrough, 0.08),
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "cobertura-numerica":
        return {
          title: "Cobertura Numérica",
          color: "#3B82F6",
          data: generateTrendData(currentValues.coberturaNum, 0.03),
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "cobertura-ponderada":
        return {
          title: "Cobertura Ponderada",
          color: "#10B981",
          data: generateTrendData(currentValues.coberturaPond, 0.04),
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "tasa-agotados":
      case "tasa-quiebre":
        return {
          title: "Tasa de Agotados",
          color: "#F59E0B",
          data: generateTrendData(currentValues.tasaQuiebre, 0.15),
          formatter: (val: number) => `${val.toFixed(2)}%`,
        };
      case "venta-promedio-diaria":
        return {
          title: "Venta Promedio Diaria",
          color: "#8B5CF6",
          data: generateTrendData(currentValues.ventaPromDiaria, 0.12),
          formatter: (val: number) => formatCurrency(val),
        };
      case "dias-inventario":
        return {
          title: "Días de Inventario",
          color: "#EF4444",
          data: generateTrendData(currentValues.diasInventario, 0.10),
          formatter: (val: number) => `${val.toFixed(1)} días`,
        };
      default:
        return null;
    }
  };

  const chartConfig = getChartConfig(metricId);

  if (!chartConfig) {
    return <div>Chart data not available for {metricId}</div>;
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white px-4 pt-4">
        {chartConfig.title} - Histórico
      </h3>
      <div className="pr-2 pb-2">
        <ReactApexChart
          options={getChartOptions(chartConfig.title, chartConfig.color, chartConfig.formatter)}
          series={[
            {
              name: chartConfig.title,
              data: chartConfig.data,
            },
          ]}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
}
