import { useState } from "react";
import MetricsSection from "../indicadores/MetricsSection";
import ImpactoTotalBanner from "../indicadores/ImpactoTotalBanner";
import { useTiendasData } from "@/hooks/useTiendasData";
import { AdvancedFilterModal, FilterState } from "../filters/AdvancedFilterModal";
import Breadcrumb from "../ui/breadcrumb/Breadcrumb";

interface ResumenViewProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: any) => void;
}

export default function ResumenView({ chatOpen, onCardClick }: ResumenViewProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const {
    storeMetrics,
    metricasData,
    impactoTotal,
    tiendasConOportunidades,
  } = useTiendasData();

  const handleApplyFilters = (filters: FilterState) => {
    // Logic to apply filters would go here
    console.log("Filters applied:", filters);
    // Future integration: pass filters to useTiendasData or API
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
          items={[{ label: "Home", href: "/" }, { label: "Cliente" }]}
          variant="chevron"
        />
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros Avanzados
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
      <ImpactoTotalBanner
        impactoTotal={impactoTotal}
        tiendasConOportunidades={tiendasConOportunidades}
        totalTiendas={storeMetrics.totalTiendas}
      />
    </>
  )
}