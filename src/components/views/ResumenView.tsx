import { useState } from "react";
import MetricsSection from "../indicadores/MetricsSection";
import { useTiendasData } from "@/hooks/useTiendasData";
import { AdvancedFilterModal, FilterState } from "../filters/AdvancedFilterModal";
import Breadcrumb from "../ui/breadcrumb/Breadcrumb";

// Filter value to label mappings for breadcrumb display
const FILTER_LABELS: Record<string, Record<string, string>> = {
  canal: {
    autoservicio: "Autoservicio",
    mayoreo: "Mayoreo",
    detallista: "Detallista",
    "e-commerce": "E-Commerce",
  },
  geografia: {
    norte: "Norte",
    sur: "Sur",
    centro: "Centro",
    occidente: "Occidente",
    noreste: "Noreste",
  },
  arbol: {
    region_1: "Region 1",
    region_2: "Region 2",
    zona_a: "Zona A",
    zona_b: "Zona B",
  },
  cadenaCliente: {
    walmart: "Walmart",
    soriana: "Soriana",
    chedraui: "Chedraui",
    oxxo: "Oxxo",
    liverpool: "Liverpool",
  },
};

interface ResumenViewProps {
  onCardClick?: (cardData: unknown) => void;
}

export default function ResumenView({ onCardClick }: ResumenViewProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  const {
    storeMetrics,
    metricasData,
  } = useTiendasData();

  const handleApplyFilters = (filters: FilterState) => {
    // Logic to apply filters would go here
    console.log("Filters applied:", filters);
    setAppliedFilters(filters);
    // Future integration: pass filters to useTiendasData or API
  };

  // Build breadcrumb items based on Cliente section filters
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const items: Array<{ label: string; href?: string }> = [{ label: "Home", href: "/" }];

    if (!appliedFilters) {
      items.push({ label: "Cliente" });
      return items;
    }

    // Add Cliente section filters in order: Canal, Geografía, Árbol, Cadena Cliente
    if (appliedFilters.canal) {
      const label = FILTER_LABELS.canal[appliedFilters.canal] || appliedFilters.canal;
      items.push({ label });
    }

    if (appliedFilters.geografia) {
      const label = FILTER_LABELS.geografia[appliedFilters.geografia] || appliedFilters.geografia;
      items.push({ label });
    }

    if (appliedFilters.arbol) {
      const label = FILTER_LABELS.arbol[appliedFilters.arbol] || appliedFilters.arbol;
      items.push({ label });
    }

    if (appliedFilters.cadenaCliente) {
      const label = FILTER_LABELS.cadenaCliente[appliedFilters.cadenaCliente] || appliedFilters.cadenaCliente;
      items.push({ label });
    }

    // If no Cliente filters are selected, show default
    if (items.length === 1) {
      items.push({ label: "Cliente" });
    }

    return items;
  };

  return (
    <>
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
      />

      {/* Controls Bar */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <Breadcrumb
          items={getBreadcrumbItems()}
          variant="chevron"
        />
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Metrics Section - Cards or Charts */}
      <MetricsSection
        storeMetrics={storeMetrics}
        metricasData={metricasData}
        enableAnalysis={true}
        onCardClick={onCardClick}
      />

      {/* Impacto Total Banner */}
      {/* <ImpactoTotalBanner
        impactoTotal={impactoTotal}
        tiendasConOportunidades={tiendasConOportunidades}
        totalTiendas={storeMetrics.totalTiendas}
      /> */}
    </>
  )
}