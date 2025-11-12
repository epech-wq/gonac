"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type AlertFilter = "all" | "hot" | "balanceadas" | "slow" | "criticas";

interface AlertCardData {
  type: "agotado" | "caducidad" | "sinventa";
  title: string;
  icon: string;
  impacto: number;
  tiendas: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface KPICardData {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  variation: number;
  trend: "up" | "down";
  color: string;
  bgGradient: string;
  icon: string;
}

export default function AgenticoView() {
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("all");

  // Alert data
  const alerts: AlertCardData[] = [
    {
      type: "agotado",
      title: "Agotado",
      icon: "🔴",
      impacto: 152000,
      tiendas: 47,
      color: "text-error-600",
      bgColor: "bg-error-50 dark:bg-error-500/10",
      borderColor: "border-error-200 dark:border-error-500/20",
    },
    {
      type: "caducidad",
      title: "Caducidad",
      icon: "🟡",
      impacto: 89500,
      tiendas: 23,
      color: "text-warning-600",
      bgColor: "bg-warning-50 dark:bg-warning-500/10",
      borderColor: "border-warning-200 dark:border-warning-500/20",
    },
    {
      type: "sinventa",
      title: "Sin Venta",
      icon: "🔵",
      impacto: 67200,
      tiendas: 31,
      color: "text-blue-light-600",
      bgColor: "bg-blue-light-50 dark:bg-blue-light-500/10",
      borderColor: "border-blue-light-200 dark:border-blue-light-500/20",
    },
  ];

  // KPI data
  const kpis: KPICardData[] = [
    {
      title: "Ventas Totales",
      value: "$178,923",
      unit: "12,788 unidades vendidas",
      subtitle: "Datos en vivo",
      variation: 0.6,
      trend: "up",
      color: "text-success-600",
      bgGradient: "from-success-500 to-success-600",
      icon: "💰",
    },
    {
      title: "Sell-Through",
      value: "20.0%",
      unit: "vs 15% objetivo",
      subtitle: "Inventario inicial $1,300,000",
      variation: 5.0,
      trend: "up",
      color: "text-blue-light-600",
      bgGradient: "from-blue-light-500 to-blue-light-600",
      icon: "📊",
    },
    {
      title: "Riesgo Total",
      value: "47",
      unit: "oportunidades detectadas",
      subtitle: "23 Detectadas • 8 Críticas",
      variation: -12.5,
      trend: "down",
      color: "text-error-600",
      bgGradient: "from-error-500 to-error-600",
      icon: "⚠️",
    },
    {
      title: "Días de Inventario",
      value: "83.5",
      unit: "vs 45 objetivo",
      subtitle: "Cobertura Numérica 93.4%",
      variation: -2.3,
      trend: "down",
      color: "text-orange-600",
      bgGradient: "from-orange-500 to-orange-600",
      icon: "📦",
    },
  ];

  // Category impact data for chart
  const categoryImpactOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        dataLabels: { position: "top" },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `$${(val as number / 1000).toFixed(0)}K`,
      offsetX: 35,
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
    },
    colors: ["#F04438", "#F79009", "#0BA5EC"],
    xaxis: {
      categories: ["Papas", "Totopos", "Botanas", "Dulces", "Bebidas"],
      labels: {
        formatter: (val) => `$${(Number(val) / 1000).toFixed(0)}K`,
      },
    },
    grid: {
      borderColor: "#E4E7EC",
    },
    tooltip: {
      y: {
        formatter: (val) => `$${val.toLocaleString("es-MX")}`,
      },
    },
    legend: { show: false },
  };

  const categoryImpactSeries = [
    {
      name: "Impacto",
      data: [45000, 38000, 29000, 22000, 18000],
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filters: { key: AlertFilter; label: string; color: string }[] = [
    { key: "all", label: "Todas", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
    { key: "hot", label: "🔥 HOT", color: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" },
    { key: "balanceadas", label: "Balanceadas", color: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
    { key: "slow", label: "Slow", color: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
    { key: "criticas", label: "⚡ Críticas", color: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard Agéntico
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Monitoreo inteligente de alertas y KPIs principales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span className="size-2 rounded-full bg-success-500 animate-pulse" />
            Actualización en tiempo real
          </span>
        </div>
      </div>

      {/* Alert Intelligence Section */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              🎯 Alertas Inteligentes
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Oportunidades detectadas con impacto estimado
            </p>
          </div>
          
          {/* Filter Chips */}
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter.key
                    ? filter.color + " ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alert Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.type}
                className={`${alert.bgColor} ${alert.borderColor} border-2 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{alert.icon}</span>
                    <h4 className={`text-base font-semibold ${alert.color}`}>
                      {alert.title}
                    </h4>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Impacto Total
                    </p>
                    <p className={`text-2xl font-bold ${alert.color}`}>
                      {formatCurrency(alert.impacto)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tiendas afectadas
                    </span>
                    <span className={`font-semibold ${alert.color}`}>
                      {alert.tiendas}
                    </span>
                  </div>

                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                      alert.type === "agotado"
                        ? "bg-error-600 hover:bg-error-700 text-white"
                        : alert.type === "caducidad"
                        ? "bg-warning-600 hover:bg-warning-700 text-white"
                        : "bg-blue-light-600 hover:bg-blue-light-700 text-white"
                    }`}
                  >
                    Resolver ahora →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Impact by Category Chart */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Impacto por Categoría
            </h4>
            <ReactApexChart
              options={categoryImpactOptions}
              series={categoryImpactSeries}
              type="bar"
              height={250}
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          📈 Métricas Principales
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Header with Icon */}
              <div className="flex items-center justify-between mb-4">
                <div className={`size-12 rounded-xl bg-gradient-to-br ${kpi.bgGradient} flex items-center justify-center text-2xl`}>
                  {kpi.icon}
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  kpi.trend === "up" 
                    ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" 
                    : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400"
                }`}>
                  <span>{kpi.trend === "up" ? "↑" : "↓"}</span>
                  <span>{Math.abs(kpi.variation)}%</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {kpi.title}
              </h4>

              {/* Main Value */}
              <div className="mb-3">
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {kpi.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {kpi.unit}
                </p>
              </div>

              {/* Subtitle */}
              <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-gray-400" />
                  {kpi.subtitle}
                </p>
              </div>

              {/* Mini Trend Chart (Visual Enhancement) */}
              <div className="mt-4 h-12 relative">
                <div className="absolute inset-0 flex items-end justify-between gap-1">
                  {[40, 55, 35, 70, 50, 80, 65, 90, 75, 85].map((height, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t bg-gradient-to-t ${kpi.bgGradient} opacity-20`}
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-brand-50 to-blue-light-50 dark:from-brand-500/10 dark:to-blue-light-500/10 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              🚀 Acciones Sugeridas
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              El agente recomienda estas acciones basadas en el análisis actual
            </p>
          </div>
          <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition-colors duration-200">
            Ver todas las acciones
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-error-100 dark:bg-error-500/20 flex items-center justify-center text-xl">
                📦
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Reabasto Urgente
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  47 tiendas con productos agotados
                </p>
                <span className="text-xs font-medium text-error-600 dark:text-error-400">
                  Prioridad Alta
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-warning-100 dark:bg-warning-500/20 flex items-center justify-center text-xl">
                ⏰
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Gestión Caducidad
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  23 productos próximos a vencer
                </p>
                <span className="text-xs font-medium text-warning-600 dark:text-warning-400">
                  Prioridad Media
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-lg bg-blue-light-100 dark:bg-blue-light-500/20 flex items-center justify-center text-xl">
                📢
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Promoción Productos
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  31 SKUs sin movimiento
                </p>
                <span className="text-xs font-medium text-blue-light-600 dark:text-blue-light-400">
                  Optimización
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

