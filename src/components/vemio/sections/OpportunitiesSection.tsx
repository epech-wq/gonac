/**
 * Opportunities Section Component
 */

import { useState } from 'react';
import OpportunityCard from '../cards/OpportunityCard';
import { 
  useAgotadoDetalle,
  useCaducidadDetalle,
  useSinVentasDetalle 
} from '@/hooks/useValorizacion';
import { 
  transformAgotadoData, 
  transformCaducidadData, 
  transformSinVentasData 
} from '@/utils/tiendas.mappers';
import type { Opportunity, OpportunityType, DetailRecord } from '@/types/tiendas.types';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
}

export default function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const [expandedOportunidad, setExpandedOportunidad] = useState<OpportunityType | null>(null);

  // Fetch detailed data
  const { data: agotadoDetalleData, loading: agotadoLoading } = useAgotadoDetalle();
  const { data: caducidadDetalleData, loading: caducidadLoading } = useCaducidadDetalle();
  const { data: sinVentasDetalleData, loading: sinVentasLoading } = useSinVentasDetalle();

  const getDetailLoading = (type: OpportunityType): boolean => {
    switch (type) {
      case 'agotado': return agotadoLoading;
      case 'caducidad': return caducidadLoading;
      case 'sinVenta': return sinVentasLoading;
    }
  };

  const getDetailData = (type: OpportunityType): DetailRecord[] => {
    switch (type) {
      case 'agotado':
        return agotadoDetalleData ? transformAgotadoData(agotadoDetalleData) : [];
      case 'caducidad':
        return caducidadDetalleData ? transformCaducidadData(caducidadDetalleData) : [];
      case 'sinVenta':
        return sinVentasDetalleData ? transformSinVentasData(sinVentasDetalleData) : [];
    }
  };

  const toggleOportunidadExpanded = (type: OpportunityType) => {
    setExpandedOportunidad(expandedOportunidad === type ? null : type);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Áreas de Oportunidades Identificadas
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.type}
            type={opportunity.type}
            title={opportunity.title}
            description={opportunity.description}
            tiendas={opportunity.tiendas}
            impacto={opportunity.impacto}
            risk={opportunity.risk}
            impactoColor={opportunity.impactoColor}
            isExpanded={expandedOportunidad === opportunity.type}
            detailData={getDetailData(opportunity.type)}
            isLoading={getDetailLoading(opportunity.type)}
            onToggleExpand={() => toggleOportunidadExpanded(opportunity.type)}
          />
        ))}
      </div>
    </div>
  );
}

