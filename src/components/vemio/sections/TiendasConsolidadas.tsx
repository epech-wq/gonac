/**
 * TiendasConsolidadas Component
 * Main component for displaying consolidated store data with metrics, opportunities, and actions
 * Refactored following SOLID principles for better maintainability and reusability
 */

"use client";

import { useState } from 'react';
import MetricsSection from './MetricsSection';
import OpportunitiesSection from './OpportunitiesSection';
import ImpactoTotalBanner from './ImpactoTotalBanner';
import ParametrosOptimizacionSection from './ParametrosOptimizacionSection';
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

export default function TiendasConsolidadas({ chatOpen = false, onCardClick }: TiendasConsolidadasProps) {
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

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de tiendas...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 shadow-sm border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">Error al cargar datos: {error.message}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Mostrando datos de ejemplo</p>
        </div>
      )}

      {/* Main Card - Consolidated View */}
      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-brand-100 dark:bg-brand-900/20 p-2">
              <svg className="h-6 w-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Todas las Tiendas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resumen general del universo de tiendas y oportunidades detectadas
              </p>
            </div>
          </div>
          
          {/* Segment Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSegment('')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedSegment === ''
                  ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Todas las Tiendas
            </button>
            
            <button
              onClick={() => setSelectedSegment('Hot')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedSegment === 'Hot'
                  ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
              Hot
            </button>
            
            <button
              onClick={() => setSelectedSegment('Balanceadas')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedSegment === 'Balanceadas'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Balanceadas
            </button>
            
            <button
              onClick={() => setSelectedSegment('Slow')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedSegment === 'Slow'
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Slow
            </button>
          </div>
        </div>

        {/* Metrics Section */}
        <MetricsSection 
          storeMetrics={storeMetrics} 
          metricasData={metricasData}
          enableAnalysis={true}
          onCardClick={onCardClick}
        />

        {/* Parámetros de Optimización Section */}
        <ParametrosOptimizacionSection />

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
    </div>
  );
}
