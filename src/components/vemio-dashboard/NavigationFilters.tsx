"use client";
import React from "react";
import Select from "../form/Select";
import { DownloadIcon } from "@/icons";
import type { NavigationState, TimePeriod } from "./types";

interface NavigationFiltersProps {
  navigationState: NavigationState;
  onNavigationChange: (state: NavigationState) => void;
  onExport: () => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
}

const NavigationFilters: React.FC<NavigationFiltersProps> = ({
  navigationState,
  onNavigationChange,
  onExport,
  timePeriod,
  onTimePeriodChange,
}) => {
  const updateState = (key: keyof NavigationState, value: string) => {
    const newState = { ...navigationState, [key]: value || undefined };
    // Reset dependent fields when parent changes
    if (key === "canal") {
      newState.geografia = undefined;
      newState.arbol = undefined;
      newState.cadena = undefined;
      newState.cliente = undefined;
    }
    if (key === "geografia") {
      newState.arbol = undefined;
      newState.cadena = undefined;
      newState.cliente = undefined;
    }
    if (key === "arbol") {
      newState.cadena = undefined;
      newState.cliente = undefined;
    }
    if (key === "cadena") {
      newState.cliente = undefined;
    }
    if (key === "categoria") {
      newState.marca = undefined;
      newState.sku = undefined;
    }
    if (key === "marca") {
      newState.sku = undefined;
    }
    onNavigationChange(newState);
  };

  // Mock data - replace with real data
  const canales = [
    { value: "retail", label: "Retail" },
    { value: "mayorista", label: "Mayorista" },
    { value: "online", label: "Online" },
  ];

  const geografias = navigationState.canal
    ? [
        { value: "norte", label: "Norte" },
        { value: "sur", label: "Sur" },
        { value: "centro", label: "Centro" },
      ]
    : [];

  const arboles = navigationState.geografia
    ? [
        { value: "arbol1", label: "Árbol 1" },
        { value: "arbol2", label: "Árbol 2" },
      ]
    : [];

  const cadenas = navigationState.arbol
    ? [
        { value: "cadena1", label: "Cadena 1" },
        { value: "cadena2", label: "Cadena 2" },
      ]
    : [];

  const clientes = navigationState.cadena
    ? [
        { value: "cliente1", label: "Cliente 1" },
        { value: "cliente2", label: "Cliente 2" },
      ]
    : [];

  const categorias = [
    { value: "cat1", label: "Categoría 1" },
    { value: "cat2", label: "Categoría 2" },
  ];

  const marcas = navigationState.categoria
    ? [
        { value: "marca1", label: "Marca 1" },
        { value: "marca2", label: "Marca 2" },
      ]
    : [];

  const skus = navigationState.marca
    ? [
        { value: "sku1", label: "SKU 1" },
        { value: "sku2", label: "SKU 2" },
      ]
    : [];

  const segmentaciones = [
    { value: "Hot", label: "Hot" },
    { value: "Balanceadas", label: "Balanceadas" },
    { value: "Slow", label: "Slow" },
    { value: "Críticas", label: "Críticas" },
  ];

  const timePeriodOptions = [
    { value: "mes", label: "Mes Actual" },
    { value: "trimestre", label: "Trimestre Actual" },
    { value: "3meses", label: "Últimos 3 Meses" },
    { value: "6meses", label: "Últimos 6 Meses" },
    { value: "año", label: "Año Actual" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          {/* Período */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Período
            </label>
            <Select
              options={timePeriodOptions}
              placeholder="Seleccionar período"
              onChange={(value) => onTimePeriodChange(value as TimePeriod)}
              defaultValue={timePeriod}
              className="text-xs"
            />
          </div>
          {/* Eje Cliente */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Eje Cliente
            </label>
            <div className="flex gap-2">
              <Select
                options={canales}
                placeholder="Canal"
                onChange={(value) => updateState("canal", value)}
                defaultValue={navigationState.canal || ""}
                className="text-xs"
              />
              {navigationState.canal && (
                <Select
                  options={geografias}
                  placeholder="Geografía"
                  onChange={(value) => updateState("geografia", value)}
                  defaultValue={navigationState.geografia || ""}
                  className="text-xs"
                />
              )}
              {navigationState.geografia && (
                <Select
                  options={arboles}
                  placeholder="Árbol"
                  onChange={(value) => updateState("arbol", value)}
                  defaultValue={navigationState.arbol || ""}
                  className="text-xs"
                />
              )}
              {navigationState.arbol && (
                <Select
                  options={cadenas}
                  placeholder="Cadena"
                  onChange={(value) => updateState("cadena", value)}
                  defaultValue={navigationState.cadena || ""}
                  className="text-xs"
                />
              )}
              {navigationState.cadena && (
                <Select
                  options={clientes}
                  placeholder="Cliente"
                  onChange={(value) => updateState("cliente", value)}
                  defaultValue={navigationState.cliente || ""}
                  className="text-xs"
                />
              )}
            </div>
          </div>

          {/* Eje Producto */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Eje Producto
            </label>
            <div className="flex gap-2">
              <Select
                options={categorias}
                placeholder="Categoría"
                onChange={(value) => updateState("categoria", value)}
                defaultValue={navigationState.categoria || ""}
                className="text-xs"
              />
              {navigationState.categoria && (
                <Select
                  options={marcas}
                  placeholder="Marca"
                  onChange={(value) => updateState("marca", value)}
                  defaultValue={navigationState.marca || ""}
                  className="text-xs"
                />
              )}
              {navigationState.marca && (
                <Select
                  options={skus}
                  placeholder="SKU"
                  onChange={(value) => updateState("sku", value)}
                  defaultValue={navigationState.sku || ""}
                  className="text-xs"
                />
              )}
            </div>
          </div>

          {/* Eje Segmentación */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Segmentación
            </label>
            <Select
              options={segmentaciones}
              placeholder="Segmentación"
              onChange={(value) => updateState("segmentacion", value as "Hot" | "Balanceadas" | "Slow" | "Críticas")}
              defaultValue={navigationState.segmentacion || ""}
              className="text-xs"
            />
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <DownloadIcon />
          Exportar a Excel
        </button>
      </div>
    </div>
  );
};

export default NavigationFilters;

