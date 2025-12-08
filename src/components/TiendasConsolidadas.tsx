/**
 * TiendasConsolidadas Component
 * Main component for displaying consolidated store data with metrics, opportunities, and actions
 * Refactored following SOLID principles for better maintainability and reusability
 */

"use client";

import { useState } from 'react';
import MetricsSection from '@/components/indicadores/MetricsSection';
import OpportunitiesSection from '@/components/oportunidadesCards/OpportunitiesSection';
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

        {/* Opportunities Section */}
        {/* <OpportunitiesSection opportunities={opportunities} onChatOpen={onCardClick} /> */}
      </div>
    </div>
  );
}
