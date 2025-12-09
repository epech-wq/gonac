"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Combobox } from "@/components/ui/combobox/Combobox";
import { ButtonsGroup } from "@/components/ui/buttons-group/ButtonsGroup";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

export interface FilterState {
  // Section 1: Cliente
  canal: string;
  geografia: string;
  arbol: string;
  cadenaCliente: string;
  // Section 2: Producto
  categoria: string;
  marca: string;
  sku: string;
  // Section 3: Segmentacion
  segmentacion: string;
}

const INITIAL_STATE: FilterState = {
  canal: "",
  geografia: "",
  arbol: "",
  cadenaCliente: "",
  categoria: "",
  marca: "",
  sku: "",
  segmentacion: "Hot", // Default as per typical behavior, or empty if preferred
};

// Mock Data
const OPTIONS = {
  canal: [
    { value: "autoservicio", label: "Autoservicio" },
    { value: "mayoreo", label: "Mayoreo" },
    { value: "detallista", label: "Detallista" },
    { value: "e-commerce", label: "E-Commerce" },
  ],
  geografia: [
    { value: "norte", label: "Norte" },
    { value: "sur", label: "Sur" },
    { value: "centro", label: "Centro" },
    { value: "occidente", label: "Occidente" },
    { value: "noreste", label: "Noreste" },
  ],
  arbol: [
    { value: "region_1", label: "Region 1" },
    { value: "region_2", label: "Region 2" },
    { value: "zona_a", label: "Zona A" },
    { value: "zona_b", label: "Zona B" },
  ],
  cadenaCliente: [
    { value: "walmart", label: "Walmart" },
    { value: "soriana", label: "Soriana" },
    { value: "chedraui", label: "Chedraui" },
    { value: "oxxo", label: "Oxxo" },
    { value: "liverpool", label: "Liverpool" },
  ],
  categoria: [
    { value: "bebidas", label: "Bebidas" },
    { value: "alimentos", label: "Alimentos" },
    { value: "limpieza", label: "Limpieza" },
    { value: "personal", label: "Cuidado Personal" },
  ],
  marca: [
    { value: "marca_a", label: "Marca A" },
    { value: "marca_b", label: "Marca B" },
    { value: "marca_c", label: "Marca C" },
    { value: "marca_premium", label: "Marca Premium" },
  ],
  sku: [
    { value: "sku_001", label: "SKU 001 - 500ml" },
    { value: "sku_002", label: "SKU 002 - 1L" },
    { value: "sku_003", label: "SKU 003 - Pack 6" },
    { value: "sku_004", label: "SKU 004 - Ed. Especial" },
  ],
  segmentacion: [
    { value: "Hot", label: "Hot" },
    { value: "Balanceadas", label: "Balanceadas" },
    { value: "Slow", label: "Slow" },
    { value: "Criticas", label: "Críticas" },
  ],
};

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_STATE);

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl w-full mx-4">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filtros Avanzados</h2>
        </div>

        <div className="space-y-8">
          {/* Section 1: Cliente */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
              Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Combobox
                label="Canal"
                options={OPTIONS.canal}
                value={filters.canal}
                onChange={(val) => updateFilter("canal", val)}
              />
              <Combobox
                label="Geografía"
                options={OPTIONS.geografia}
                value={filters.geografia}
                onChange={(val) => updateFilter("geografia", val)}
              />
              <Combobox
                label="Árbol"
                options={OPTIONS.arbol}
                value={filters.arbol}
                onChange={(val) => updateFilter("arbol", val)}
              />
              <Combobox
                label="Cadena Cliente"
                options={OPTIONS.cadenaCliente}
                value={filters.cadenaCliente}
                onChange={(val) => updateFilter("cadenaCliente", val)}
              />
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Section 2: Producto */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Producto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Combobox
                label="Categoría"
                options={OPTIONS.categoria}
                value={filters.categoria}
                onChange={(val) => updateFilter("categoria", val)}
              />
              <Combobox
                label="Marca"
                options={OPTIONS.marca}
                value={filters.marca}
                onChange={(val) => updateFilter("marca", val)}
              />
              <Combobox
                label="SKU"
                options={OPTIONS.sku}
                value={filters.sku}
                onChange={(val) => updateFilter("sku", val)}
              />
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Section 3: Segmentacion */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Segmentación
            </h3>
            <div className="md:w-3/4">
              <ButtonsGroup
                label="Tipo de Segmentación"
                options={OPTIONS.segmentacion}
                value={filters.segmentacion}
                onChange={(val) => updateFilter("segmentacion", val)}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </Modal>
  );
};
