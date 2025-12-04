/**
 * TiendasConsolidadas Component
 * Main component for displaying consolidated store data with metrics, opportunities, and actions
 * Refactored following SOLID principles for better maintainability and reusability
 */

"use client";

import { useState } from 'react';
import MetricsSection from '@/components/kpis/MetricsSection';
import OpportunitiesSection from '@/components/oportunidadesCards/OpportunitiesSection';
import ImpactoTotalBanner from '@/components/oportunitiesBanner/ImpactoTotalBanner';
import SegmentationButtons from '@/components/segmentationButtons/SegmentationButtons';
import { useTiendasData } from '@/hooks/useTiendasData';

interface TiendasConsolidadasProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: any) => void;
}

type SegmentFilter = 'Hot' | 'Balanceadas' | 'Slow' | '';

// Map display names to actual database segment values
const SEGMENT_MAP: Record<string, string> = {
  'Hot': 'Hot',
  'Balanceadas': 'Balanceada', // Table uses singular "Balanceada"
  'Slow': 'Slow',
  '': '',
};

export default function TiendasConsolidadas({ onCardClick }: TiendasConsolidadasProps) {
  const [selectedSegment, setSelectedSegment] = useState<SegmentFilter>('');

  // Map the display segment to the actual database segment value
  const dbSegment = selectedSegment ? SEGMENT_MAP[selectedSegment] : undefined;

  const {
    storeMetrics,
    opportunities,
    metricasData,
    impactoTotal,
    tiendasConOportunidades,
    loading,
    error,
  } = useTiendasData(dbSegment);

  if (loading) return (<div className="h-[600px] w-full flex items-center justify-center gap-2 text-center">
    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de tiendas...</p>
  </div>);

  if (error) return (<div className="h-[600px] w-full flex items-center justify-center gap-2 text-center">
    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Error al cargar datos: {error.message}</p>
  </div>);

  return (
    <div className="relative">
      {/* Main Card - Consolidated View */}
      <div className="dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Todas las Tiendas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resumen general del universo de tiendas y oportunidades detectadas
              </p>
            </div>
          </div>
        </div>

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

        {/* Opportunities Section */}
        <OpportunitiesSection opportunities={opportunities} onChatOpen={onCardClick} />
      </div>
    </div>
  );
}
