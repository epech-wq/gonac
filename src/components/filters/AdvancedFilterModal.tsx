"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { MultiSelectCombobox } from "@/components/ui/combobox/MultiSelectCombobox";
import { MultiLevelCombobox } from "@/components/ui/combobox/MultiLevelCombobox";
import { MultiSelectButtonsGroup } from "@/components/ui/buttons-group/MultiSelectButtonsGroup";
import flatpickr from "flatpickr";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.min.css";
import { ComboboxOption } from "@/types/catalogs";

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  catalogOptions: {
    canal: ComboboxOption[];
    geografia: ComboboxOption[];
    arbol: ComboboxOption[];
    cadenaCliente: ComboboxOption[];
    categoria: ComboboxOption[];
    marca: ComboboxOption[];
    sku: ComboboxOption[];
  };
  isLoadingCatalogs: boolean;
}

export interface FilterState {
  // Section 1: Cliente
  canal: string[];
  // Geografia - multiple levels
  geografiaState: string[];
  geografiaCity: string[];
  geografiaRegion: string[];
  // Arbol - multiple levels
  arbolCommercialDirector: string[];
  arbolCommercialManager: string[];
  arbolRegionalLeader: string[];
  arbolCommercialCoordinator: string[];
  cadenaCliente: string[];
  // Section 2: Producto
  categoria: string[];
  marca: string[];
  sku: string[];
  // Section 3: Segmentacion
  segmentacion: string[];
  // Section 4: Fecha
  startDate: string;
  endDate: string;
}

const INITIAL_STATE: FilterState = {
  canal: [],
  geografiaState: [],
  geografiaCity: [],
  geografiaRegion: [],
  arbolCommercialDirector: [],
  arbolCommercialManager: [],
  arbolRegionalLeader: [],
  arbolCommercialCoordinator: [],
  cadenaCliente: [],
  categoria: [],
  marca: [],
  sku: [],
  segmentacion: [],
  startDate: "",
  endDate: "",
};

// Segmentacion options (static)
const SEGMENTACION_OPTIONS: ComboboxOption[] = [
  { value: "HOT", label: "Hot" },
  { value: "BALANCEADA", label: "Balanceadas" },
  { value: "SLOW", label: "Slow" },
];

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  catalogOptions,
  isLoadingCatalogs,
}) => {
  const [filters, setFilters] = useState<FilterState>(INITIAL_STATE);
  const datePickerRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (isOpen && datePickerRef.current) {
      // Destroy existing instance if it exists
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }

      // Create new instance with Date objects for better compatibility
      flatpickrInstance.current = flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "d M Y",
        locale: Spanish,
        minDate: new Date(2024, 0, 1), // January 1, 2024
        maxDate: new Date(2024, 11, 31), // December 31, 2024
        defaultDate: [new Date(2024, 10, 1), new Date(2024, 10, 30)], // November 1-30, 2024 (month is 0-indexed)
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

      // Set initial filter values
      setFilters((prev) => ({
        ...prev,
        startDate: "2024-11-01",
        endDate: "2024-11-30",
      }));
    }

    return () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
        flatpickrInstance.current = null;
      }
    };
  }, [isOpen]);

  const handleApply = () => {
    // Pass filters to parent (ResumenView will handle the API call)
    onApply(filters);
    onClose();
  };

  const updateFilter = (key: keyof FilterState, value: string | string[]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handler for geografia multi-level changes
  const handleGeografiaChange = (level: string, values: string[]) => {
    const levelMap: Record<string, keyof FilterState> = {
      'Estado': 'geografiaState',
      'Ciudad': 'geografiaCity',
      'Región': 'geografiaRegion'
    };
    const key = levelMap[level];
    if (key) {
      setFilters((prev) => ({ ...prev, [key]: values }));
    }
  };

  // Handler for arbol multi-level changes
  const handleArbolChange = (level: string, values: string[]) => {
    const levelMap: Record<string, keyof FilterState> = {
      'Director Comercial': 'arbolCommercialDirector',
      'Gerente Comercial': 'arbolCommercialManager',
      'Líder Regional': 'arbolRegionalLeader',
      'Coordinador Comercial': 'arbolCommercialCoordinator'
    };
    const key = levelMap[level];
    if (key) {
      setFilters((prev) => ({ ...prev, [key]: values }));
    }
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
              <MultiSelectCombobox
                label="Canal"
                options={catalogOptions.canal}
                values={filters.canal}
                onChange={(val) => updateFilter("canal", val)}
                disabled={isLoadingCatalogs}
              />
              <MultiLevelCombobox
                label="Geografía"
                options={catalogOptions.geografia}
                values={{
                  'Estado': filters.geografiaState,
                  'Ciudad': filters.geografiaCity,
                  'Región': filters.geografiaRegion
                }}
                onChange={handleGeografiaChange}
                disabled={isLoadingCatalogs}
                levelLabels={{
                  'Estado': 'state',
                  'Ciudad': 'city',
                  'Región': 'region'
                }}
              />
              <MultiLevelCombobox
                label="Árbol"
                options={catalogOptions.arbol}
                values={{
                  'Director Comercial': filters.arbolCommercialDirector,
                  'Gerente Comercial': filters.arbolCommercialManager,
                  'Líder Regional': filters.arbolRegionalLeader,
                  'Coordinador Comercial': filters.arbolCommercialCoordinator
                }}
                onChange={handleArbolChange}
                disabled={isLoadingCatalogs}
                levelLabels={{
                  'Director Comercial': 'commercial_director',
                  'Gerente Comercial': 'commercial_manager',
                  'Líder Regional': 'regional_leader',
                  'Coordinador Comercial': 'commercial_coordinator'
                }}
              />
              <MultiSelectCombobox
                label="Cadena Cliente"
                options={catalogOptions.cadenaCliente}
                values={filters.cadenaCliente}
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
              <MultiSelectCombobox
                label="Categoría"
                options={catalogOptions.categoria}
                values={filters.categoria}
                onChange={(val) => updateFilter("categoria", val)}
                disabled={isLoadingCatalogs}
              />
              <MultiSelectCombobox
                label="Marca"
                options={catalogOptions.marca}
                values={filters.marca}
                onChange={(val) => updateFilter("marca", val)}
                disabled={isLoadingCatalogs}
              />
              <MultiSelectCombobox
                label="SKU"
                options={catalogOptions.sku}
                values={filters.sku}
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
              <MultiSelectButtonsGroup
                label="Tipo de Segmentación"
                options={SEGMENTACION_OPTIONS}
                values={filters.segmentacion}
                onChange={(val) => updateFilter("segmentacion", val)}
              />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between gap-3">
          <button
            onClick={() => {
              setFilters({
                ...INITIAL_STATE,
                startDate: "2024-11-01",
                endDate: "2024-11-30",
              });
              if (flatpickrInstance.current) {
                flatpickrInstance.current.setDate([new Date(2024, 10, 1), new Date(2024, 10, 30)]);
              }
            }}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            Limpiar
          </button>
          <div className="flex gap-3">
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
      </div>
    </Modal>
  );
};
