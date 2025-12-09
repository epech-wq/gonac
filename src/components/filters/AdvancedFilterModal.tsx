"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Combobox } from "@/components/ui/combobox/Combobox";
import { ButtonsGroup } from "@/components/ui/buttons-group/ButtonsGroup";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import { supabase } from "@/lib/supabase";
import { CatalogsRepository } from "@/repositories/catalogs.repository";
import { ComboboxOption } from "@/types/catalogs";

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
  // Section 4: Fecha
  startDate: string;
  endDate: string;
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
  startDate: "",
  endDate: "",
};

// Segmentacion options (static)
const SEGMENTACION_OPTIONS: ComboboxOption[] = [
  { value: "Hot", label: "Hot" },
  { value: "Balanceadas", label: "Balanceadas" },
  { value: "Slow", label: "Slow" },
  { value: "Criticas", label: "Críticas" },
];

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_STATE);
  const datePickerRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  // Catalog options state
  const [catalogOptions, setCatalogOptions] = useState({
    canal: [] as ComboboxOption[],
    geografia: [] as ComboboxOption[],
    arbol: [] as ComboboxOption[],
    cadenaCliente: [] as ComboboxOption[],
    categoria: [] as ComboboxOption[],
    marca: [] as ComboboxOption[],
    sku: [] as ComboboxOption[],
  });

  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  // Load catalog data
  useEffect(() => {
    if (isOpen) {
      loadCatalogs();
    }
  }, [isOpen]);

  const loadCatalogs = async () => {
    setIsLoadingCatalogs(true);
    const catalogsRepo = new CatalogsRepository(supabase);

    try {
      const [
        channels,
        geographies,
        hierarchies,
        chains,
        categories,
        brands,
        products,
      ] = await Promise.all([
        catalogsRepo.getChannels(),
        catalogsRepo.getGeographies(),
        catalogsRepo.getCommercialHierarchies(),
        catalogsRepo.getChains(),
        catalogsRepo.getCategories(),
        catalogsRepo.getBrands(),
        catalogsRepo.getProducts(),
      ]);

      setCatalogOptions({
        canal: channels,
        geografia: geographies,
        arbol: hierarchies,
        cadenaCliente: chains,
        categoria: categories,
        marca: brands,
        sku: products,
      });
    } catch (error) {
      console.error('Error loading catalogs:', error);
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  useEffect(() => {
    if (isOpen && datePickerRef.current && !flatpickrInstance.current) {
      flatpickrInstance.current = flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        locale: Spanish,
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            setFilters((prev) => ({
              ...prev,
              startDate: selectedDates[0].toISOString().split("T")[0],
              endDate: selectedDates[1].toISOString().split("T")[0],
            }));
          } else if (selectedDates.length === 1) {
            setFilters((prev) => ({
              ...prev,
              startDate: selectedDates[0].toISOString().split("T")[0],
              endDate: "",
            }));
          } else {
            setFilters((prev) => ({
              ...prev,
              startDate: "",
              endDate: "",
            }));
          }
        },
      });
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, [isOpen]);

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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Filtros</h2>
        </div>

        <div className="space-y-8">
          {/* Section 1: Periodo */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-green-500 rounded-full"></span>
              Periodo
            </h3>
            <div className="md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Seleccionar Rango
              </label>
              <input
                ref={datePickerRef}
                type="text"
                placeholder="Selecciona un rango de fechas"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                readOnly
              />
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Section 2: Cliente */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-brand-500 rounded-full"></span>
              Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Combobox
                label="Canal"
                options={catalogOptions.canal}
                value={filters.canal}
                onChange={(val) => updateFilter("canal", val)}
                disabled={isLoadingCatalogs}
              />
              <Combobox
                label="Geografía"
                options={catalogOptions.geografia}
                value={filters.geografia}
                onChange={(val) => updateFilter("geografia", val)}
                disabled={isLoadingCatalogs}
              />
              <Combobox
                label="Árbol"
                options={catalogOptions.arbol}
                value={filters.arbol}
                onChange={(val) => updateFilter("arbol", val)}
                disabled={isLoadingCatalogs}
              />
              <Combobox
                label="Cadena Cliente"
                options={catalogOptions.cadenaCliente}
                value={filters.cadenaCliente}
                onChange={(val) => updateFilter("cadenaCliente", val)}
                disabled={isLoadingCatalogs}
              />
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Section 3: Producto */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
              Producto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Combobox
                label="Categoría"
                options={catalogOptions.categoria}
                value={filters.categoria}
                onChange={(val) => updateFilter("categoria", val)}
                disabled={isLoadingCatalogs}
              />
              <Combobox
                label="Marca"
                options={catalogOptions.marca}
                value={filters.marca}
                onChange={(val) => updateFilter("marca", val)}
                disabled={isLoadingCatalogs}
              />
              <Combobox
                label="SKU"
                options={catalogOptions.sku}
                value={filters.sku}
                onChange={(val) => updateFilter("sku", val)}
                disabled={isLoadingCatalogs}
              />
            </div>
          </section>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Section 4: Segmentacion */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Segmentación
            </h3>
            <div className="md:w-3/4">
              <ButtonsGroup
                label="Tipo de Segmentación"
                options={SEGMENTACION_OPTIONS}
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
