"use client";
import React, { useState } from "react";
import Select from "../form/Select";
import { DownloadIcon, ChevronDownIcon, ChevronUpIcon } from "@/icons";
import type { NavigationState } from "./types";

interface VemioFiltersProps {
  navigationState: NavigationState;
  onNavigationChange: (state: NavigationState) => void;
  onExport: () => void;
}

const VemioFilters: React.FC<VemioFiltersProps> = ({
  navigationState,
  onNavigationChange,
  onExport,
}) => {
  const [clienteExpanded, setClienteExpanded] = useState(false);
  const [productoExpanded, setProductoExpanded] = useState(false);

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

  const geografias = [
    { value: "norte", label: "Norte" },
    { value: "sur", label: "Sur" },
    { value: "centro", label: "Centro" },
  ];

  const arboles = [
    { value: "arbol1", label: "Árbol 1" },
    { value: "arbol2", label: "Árbol 2" },
    { value: "arbol3", label: "Árbol 3" },
  ];

  const cadenas = [
    { value: "cadena1", label: "Cadena 1" },
    { value: "cadena2", label: "Cadena 2" },
    { value: "cadena3", label: "Cadena 3" },
  ];

  const clientes = [
    { value: "cliente1", label: "Cliente 1" },
    { value: "cliente2", label: "Cliente 2" },
    { value: "cliente3", label: "Cliente 3" },
  ];

  const categorias = [
    { value: "cat1", label: "Categoría 1" },
    { value: "cat2", label: "Categoría 2" },
    { value: "cat3", label: "Categoría 3" },
  ];

  const marcas = [
    { value: "marca1", label: "Marca 1" },
    { value: "marca2", label: "Marca 2" },
    { value: "marca3", label: "Marca 3" },
  ];

  const skus = [
    { value: "sku1", label: "SKU 1" },
    { value: "sku2", label: "SKU 2" },
    { value: "sku3", label: "SKU 3" },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          {/* Eje Cliente Button */}
          <button
            onClick={() => setClienteExpanded(!clienteExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              clienteExpanded || navigationState.canal || navigationState.geografia || navigationState.arbol || navigationState.cadena || navigationState.cliente
                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>Nivel</span>
            {clienteExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          {/* Eje Producto Button */}
          <button
            onClick={() => setProductoExpanded(!productoExpanded)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              productoExpanded || navigationState.categoria || navigationState.marca || navigationState.sku
                ? "bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <span>Producto</span>
            {productoExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Eje Cliente Filters */}
      {clienteExpanded && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Canal
              </label>
              <Select
                options={canales}
                placeholder="Seleccionar Canal"
                onChange={(value) => updateState("canal", value)}
                defaultValue={navigationState.canal || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Geografía
              </label>
              <Select
                options={geografias}
                placeholder="Seleccionar Geografía"
                onChange={(value) => updateState("geografia", value)}
                defaultValue={navigationState.geografia || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Árbol
              </label>
              <Select
                options={arboles}
                placeholder="Seleccionar Árbol"
                onChange={(value) => updateState("arbol", value)}
                defaultValue={navigationState.arbol || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Cadena
              </label>
              <Select
                options={cadenas}
                placeholder="Seleccionar Cadena"
                onChange={(value) => updateState("cadena", value)}
                defaultValue={navigationState.cadena || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Cliente
              </label>
              <Select
                options={clientes}
                placeholder="Seleccionar Cliente"
                onChange={(value) => updateState("cliente", value)}
                defaultValue={navigationState.cliente || ""}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Eje Producto Filters */}
      {productoExpanded && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Categoría
              </label>
              <Select
                options={categorias}
                placeholder="Seleccionar Categoría"
                onChange={(value) => updateState("categoria", value)}
                defaultValue={navigationState.categoria || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                Marca
              </label>
              <Select
                options={marcas}
                placeholder="Seleccionar Marca"
                onChange={(value) => updateState("marca", value)}
                defaultValue={navigationState.marca || ""}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                SKU
              </label>
              <Select
                options={skus}
                placeholder="Seleccionar SKU"
                onChange={(value) => updateState("sku", value)}
                defaultValue={navigationState.sku || ""}
                className="text-xs"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VemioFilters;

