import TiendasConsolidadas from "@/components/TiendasConsolidadas";
import MetricsSection from "../kpis/MetricsSection";
import ImpactoTotalBanner from "../oportunitiesBanner/ImpactoTotalBanner";
import { useTiendasData } from "@/hooks/useTiendasData";

interface ResumenViewProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: any) => void;
}

export default function ResumenView({ chatOpen, onCardClick }: ResumenViewProps) {
  const {
    storeMetrics,
    metricasData,
    impactoTotal,
    tiendasConOportunidades,
  } = useTiendasData();

  return (
    <>
      {/* Metrics Section */}
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