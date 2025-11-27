"use client";
import React, { useState, useMemo } from "react";
import Badge from "../ui/badge/Badge";
import {
  BoxIconLine,
  TimeIcon,
  BoxTapped,
  CalenderIcon,
  DollarLineIcon,
  PieChartIcon,
} from "@/icons";
import NavigationFilters from "./NavigationFilters";
import NavigationBreadcrumb from "./NavigationBreadcrumb";
import type { NavigationState, TimePeriod, BreadcrumbItem, ParameterData, KPIData } from "./types";

const DashboardContent: React.FC = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("mes");

  // Generate breadcrumb items from navigation state
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    const items: BreadcrumbItem[] = [];
    
    if (navigationState.canal) {
      items.push({
        label: `Canal: ${navigationState.canal}`,
        level: "canal",
        value: navigationState.canal,
      });
    }
    if (navigationState.geografia) {
      items.push({
        label: `Geografía: ${navigationState.geografia}`,
        level: "geografia",
        value: navigationState.geografia,
      });
    }
    if (navigationState.arbol) {
      items.push({
        label: `Árbol: ${navigationState.arbol}`,
        level: "arbol",
        value: navigationState.arbol,
      });
    }
    if (navigationState.cadena) {
      items.push({
        label: `Cadena: ${navigationState.cadena}`,
        level: "cadena",
        value: navigationState.cadena,
      });
    }
    if (navigationState.cliente) {
      items.push({
        label: `Cliente: ${navigationState.cliente}`,
        level: "cliente",
        value: navigationState.cliente,
      });
    }
    if (navigationState.categoria) {
      items.push({
        label: `Categoría: ${navigationState.categoria}`,
        level: "categoria",
        value: navigationState.categoria,
      });
    }
    if (navigationState.marca) {
      items.push({
        label: `Marca: ${navigationState.marca}`,
        level: "marca",
        value: navigationState.marca,
      });
    }
    if (navigationState.sku) {
      items.push({
        label: `SKU: ${navigationState.sku}`,
        level: "sku",
        value: navigationState.sku,
      });
    }
    if (navigationState.segmentacion) {
      items.push({
        label: `Segmentación: ${navigationState.segmentacion}`,
        level: "segmentacion",
        value: navigationState.segmentacion,
      });
    }
    
    return items;
  }, [navigationState]);

  const handleNavigate = (level: string, value: string) => {
    const newState: NavigationState = {};
    
    // Build state up to the clicked level
    if (level === "canal") {
      newState.canal = value;
    } else if (level === "geografia") {
      newState.canal = navigationState.canal;
      newState.geografia = value;
    } else if (level === "arbol") {
      newState.canal = navigationState.canal;
      newState.geografia = navigationState.geografia;
      newState.arbol = value;
    } else if (level === "cadena") {
      newState.canal = navigationState.canal;
      newState.geografia = navigationState.geografia;
      newState.arbol = navigationState.arbol;
      newState.cadena = value;
    } else if (level === "cliente") {
      newState.canal = navigationState.canal;
      newState.geografia = navigationState.geografia;
      newState.arbol = navigationState.arbol;
      newState.cadena = navigationState.cadena;
      newState.cliente = value;
    } else if (level === "categoria") {
      newState.categoria = value;
    } else if (level === "marca") {
      newState.categoria = navigationState.categoria;
      newState.marca = value;
    } else if (level === "sku") {
      newState.categoria = navigationState.categoria;
      newState.marca = navigationState.marca;
      newState.sku = value;
    } else if (level === "segmentacion") {
      newState.segmentacion = value as "Hot" | "Balanceadas" | "Slow" | "Críticas" | undefined;
    }
    
    // Preserve other axes
    if (level !== "canal" && level !== "geografia" && level !== "arbol" && 
        level !== "cadena" && level !== "cliente") {
      newState.canal = navigationState.canal;
      newState.geografia = navigationState.geografia;
      newState.arbol = navigationState.arbol;
      newState.cadena = navigationState.cadena;
      newState.cliente = navigationState.cliente;
    }
    if (level !== "categoria" && level !== "marca" && level !== "sku") {
      newState.categoria = navigationState.categoria;
      newState.marca = navigationState.marca;
      newState.sku = navigationState.sku;
    }
    if (level !== "segmentacion") {
      newState.segmentacion = navigationState.segmentacion;
    }
    
    setNavigationState(newState);
  };

  const handleExport = () => {
    // Create Excel export data
    const data = {
      parameters: parameters.map(p => ({
        Parametro: p.title,
        Optimizado: `${p.optimized} ${p.unit}`,
        Actual: `${p.actual} ${p.unit}`,
        Desviacion: `${calculateDeviationFromTarget(p.optimized, p.actual).value}%`,
      })),
      kpis: kpis.map(k => ({
        Indicador: k.title,
        Valor: k.value,
        Unidad: k.unit || "",
      })),
      filtros: navigationState,
    };

    // Convert to CSV format (simplified Excel export)
    const csvContent = [
      "Parámetros de Optimización",
      "Parametro,Optimizado,Actual,Desviacion",
      ...data.parameters.map(p => `${p.Parametro},${p.Optimizado},${p.Actual},${p.Desviacion}`),
      "",
      "Indicadores Clave (KPIs)",
      "Indicador,Valor,Unidad",
      ...data.kpis.map(k => `${k.Indicador},${k.Valor},${k.Unidad}`),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vemio_dashboard_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parameter cards data with previous period
  const parameters: ParameterData[] = [
    {
      id: 1,
      title: "Días de Inventario",
      optimized: 45,
      actual: 52,
      previousPeriod: 48,
      unit: "días",
      icon: <TimeIcon />,
    },
    {
      id: 2,
      title: "Punto de Reorden",
      optimized: 120,
      actual: 150,
      previousPeriod: 140,
      unit: "unidades",
      icon: <BoxTapped />,
    },
    {
      id: 3,
      title: "Tamaño de Pedido Óptimo",
      optimized: 500,
      actual: 600,
      previousPeriod: 580,
      unit: "unidades",
      icon: <BoxIconLine />,
    },
    {
      id: 4,
      title: "Frecuencia Óptima",
      optimized: 7,
      actual: 10,
      previousPeriod: 9,
      unit: "días",
      icon: <CalenderIcon />,
    },
  ];

  // KPI cards data with targets and previous period
  const kpis: KPIData[] = [
    {
      id: 1,
      title: "Ventas de unidades",
      value: 12450,
      previousPeriod: 11800,
      target: 13000,
      unit: "unidades",
      icon: <BoxIconLine />,
    },
    {
      id: 2,
      title: "Ventas en Valor",
      value: 245680,
      previousPeriod: 232000,
      target: 260000,
      unit: "$",
      icon: <DollarLineIcon />,
    },
    {
      id: 3,
      title: "Distribución Numérica",
      value: 78.5,
      previousPeriod: 75.2,
      target: 80,
      unit: "%",
      icon: <PieChartIcon />,
    },
    {
      id: 4,
      title: "Sell Through",
      value: 65.2,
      previousPeriod: 62.8,
      target: 70,
      unit: "%",
      icon: <BoxTapped />,
    },
    {
      id: 5,
      title: "Días de Inventario",
      value: 45,
      previousPeriod: 48,
      target: 45,
      unit: "días",
      icon: <TimeIcon />,
    },
  ];

  // Calculate deviation from target with color coding
  const calculateDeviationFromTarget = (target: number, actual: number) => {
    const deviation = ((actual - target) / target) * 100;
    let color: "success" | "warning" | "error" = "success";
    
    if (deviation <= -10) {
      color = "error"; // Rojo: <-10%
    } else if (deviation < 0) {
      color = "warning"; // Amarillo: -10% a 0%
    } else {
      color = "success"; // Verde: cumple o supera
    }
    
    return {
      value: Math.abs(deviation).toFixed(1),
      isPositive: deviation > 0,
      color,
      rawDeviation: deviation,
    };
  };

  return (
    <div className="space-y-6">
      {/* Navigation Filters */}
      <NavigationFilters
        navigationState={navigationState}
        onNavigationChange={setNavigationState}
        onExport={handleExport}
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
      />

      {/* Breadcrumb Navigation */}
      {breadcrumbItems.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 rounded-lg">
          <NavigationBreadcrumb
            items={breadcrumbItems}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      {/* Parameters Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Parámetros de Optimización
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parameters.map((param) => {
            const deviation = calculateDeviationFromTarget(param.optimized, param.actual);

            return (
              <div
                key={param.id}
                className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800 transition-all"
              >
                {/* Header with icon, title and badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 flex-shrink-0">
                      <div className="text-gray-700 dark:text-gray-300">
                        {param.icon}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {param.title}
                    </h3>
                  </div>
                  <Badge color={deviation.color} size="sm">
                    {deviation.isPositive ? "+" : "-"}
                    {deviation.value}%
                  </Badge>
                </div>

                {/* Two columns for Optimized and Actual */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Optimized Value */}
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Objetivo (Vemio)
                    </p>
                    <p className="text-xl font-semibold text-brand-600 dark:text-brand-400">
                      {param.optimized}
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
                      {param.actual}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {param.unit}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPIs Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90 mb-4">
          Indicadores Clave (KPIs)
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
          {kpis.map((kpi) => {
            // Calculate variation vs previous period
            const variation = ((kpi.value - kpi.previousPeriod) / kpi.previousPeriod) * 100;
            const variationColor: "success" | "error" | "default" = 
              variation > 0 ? "success" : variation < 0 ? "error" : "default";

            // Calculate 90-day projection (simple linear projection)
            const projection = kpi.value * 3; // Assuming monthly data, 90d = 3 months

            const formatValue = (val: number) => {
              if (kpi.unit === "$") {
                return `$${val.toLocaleString()}`;
              }
              if (kpi.unit === "%") {
                return `${val.toFixed(1)}%`;
              }
              return val.toLocaleString();
            };

            return (
              <div
                key={kpi.id}
                className="rounded-2xl border p-5 bg-white dark:bg-white/[0.03] border-gray-200 dark:border-gray-800 transition-all"
              >
                {/* Header with icon, title and variation badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center min-w-[2.5rem] min-h-[2.5rem] w-10 h-10 bg-gray-100 rounded-lg dark:bg-gray-800 flex-shrink-0">
                      <div className="text-gray-700 dark:text-gray-300">
                        {kpi.icon}
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {kpi.title}
                    </h3>
                  </div>
                  <Badge color={variationColor} size="sm">
                    {variation > 0 ? "+" : ""}{variation.toFixed(1)}%
                  </Badge>
                </div>

                {/* Main KPI Value */}
                <div className="mb-4">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white/90">
                    {formatValue(kpi.value)}
                  </p>
                </div>

                {/* Previous Period */}
                <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Período Anterior
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formatValue(kpi.previousPeriod)}
                  </p>
                </div>

                {/* 90-day Projection */}
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Proyección 90d
                  </p>
                  <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                    {formatValue(projection)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
