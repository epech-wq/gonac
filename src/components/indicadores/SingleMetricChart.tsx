"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { formatCurrency } from '@/utils/formatters';
import { getChartOptions } from './chartUtils';
import { HierarchicalMetricsResult } from '@/types/hierarchical-metrics';

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface SingleMetricChartProps {
  metricId: string;
  monthlyMetrics: HierarchicalMetricsResult[];
  height?: number;
}

// Helper function to format month labels (YYYY-MM -> "Month YYYY")
const formatMonthLabel = (dimTime: string): string => {
  const [year, month] = dimTime.split('-');
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

export default function SingleMetricChart({
  metricId,
  monthlyMetrics,
  height = 280
}: SingleMetricChartProps) {

  // Transform data based on metric ID
  const chartData = useMemo(() => {
    return monthlyMetrics.map((row: HierarchicalMetricsResult) => {
      let value = 0;

      switch (metricId) {
        case "ventas-totales":
          value = row.total_sales_amount;
          break;
        case "sell-through":
          value = row.sell_through_pct;
          break;
        case "cobertura-numerica":
          value = row.numeric_distribution_pct;
          break;
        case "tasa-agotados":
        case "tasa-quiebre":
          value = row.out_of_stock_rate_pct;
          break;
        case "venta-promedio-diaria":
          value = row.avg_daily_sales_amount;
          break;
        case "dias-inventario":
          value = row.inventory_days;
          break;
        default:
          value = 0;
      }

      return {
        x: formatMonthLabel(row.dim_time), // Format: "Enero 2024"
        y: value,
      };
    });
  }, [monthlyMetrics, metricId]);

  // Define chart configs based on ID
  const getChartConfig = (id: string) => {
    switch (id) {
      case "ventas-totales":
        return {
          title: "Ventas Totales",
          color: "#10B981",
          formatter: (val: number) => formatCurrency(val),
        };
      case "sell-through":
        return {
          title: "Sell-Through",
          color: "#3B82F6",
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "cobertura-numerica":
        return {
          title: "Distribución Numérica",
          color: "#3B82F6",
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "cobertura-ponderada":
        return {
          title: "Cobertura Ponderada",
          color: "#10B981",
          formatter: (val: number) => `${val.toFixed(1)}%`,
        };
      case "tasa-agotados":
      case "tasa-quiebre":
        return {
          title: "Tasa de Agotados",
          color: "#F59E0B",
          formatter: (val: number) => `${val.toFixed(2)}%`,
        };
      case "venta-promedio-diaria":
        return {
          title: "Venta Promedio Diaria",
          color: "#8B5CF6",
          formatter: (val: number) => formatCurrency(val),
        };
      case "dias-inventario":
        return {
          title: "Días de Inventario",
          color: "#EF4444",
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

  if (chartData.length === 0) {
    return (
      <div className="w-full p-8 text-center text-gray-500 dark:text-gray-400">
        No hay datos disponibles
      </div>
    );
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
              data: chartData,
            },
          ]}
          type="area"
          height={height}
        />
      </div>
    </div>
  );
}
