/**
 * Opportunities Section Component
 */

import { useState } from 'react';
import OpportunityCard from '../cards/OpportunityCard';
import WizardAccionesGenerales from '../modals/WizardAccionesGenerales';
import { CoDisenoModal } from '@/components/vemio-dashboard';
import type { TipoAccionGeneral } from '../modals/WizardAccionesGenerales';
import {
  useAgotadoDetalle,
  useCaducidadDetalle,
  useSinVentasDetalle,
  useVentaIncrementalDetalle
} from '@/hooks/useValorizacion';
import {
  transformAgotadoData,
  transformCaducidadData,
  transformSinVentasData,
  transformVentaIncrementalData
} from '@/utils/tiendas.mappers';
import type { Opportunity, OpportunityType, DetailRecord } from '@/types/tiendas.types';

interface OpportunitiesSectionProps {
  opportunities: Opportunity[];
  onChatOpen?: (cardData: any) => void;
  onVerAnalisisCompleto?: () => void;
}

export default function OpportunitiesSection({ opportunities, onChatOpen, onVerAnalisisCompleto }: OpportunitiesSectionProps) {
  const [expandedOportunidad, setExpandedOportunidad] = useState<OpportunityType | null>(null);
  const [modalAction, setModalAction] = useState<{ tipo: TipoAccionGeneral; opportunity: Opportunity } | null>(null);
  const [coDisenoModalOpen, setCoDisenoModalOpen] = useState(false);
  const [ventaIncrementalImpacto, setVentaIncrementalImpacto] = useState<number>(0);

  // Fetch detailed data
  const { data: agotadoDetalleData, loading: agotadoLoading } = useAgotadoDetalle();
  const { data: caducidadDetalleData, loading: caducidadLoading } = useCaducidadDetalle();
  const { data: sinVentasDetalleData, loading: sinVentasLoading } = useSinVentasDetalle();
  const { data: ventaIncrementalDetalleData, loading: ventaIncrementalLoading } = useVentaIncrementalDetalle();

  const getDetailLoading = (type: OpportunityType): boolean => {
    switch (type) {
      case 'agotado': return agotadoLoading;
      case 'caducidad': return caducidadLoading;
      case 'sinVenta': return sinVentasLoading;
      case 'ventaIncremental': return ventaIncrementalLoading;
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
      case 'ventaIncremental':
        return ventaIncrementalDetalleData ? transformVentaIncrementalData(ventaIncrementalDetalleData) : [];
    }
  };

  const toggleOportunidadExpanded = (type: OpportunityType) => {
    setExpandedOportunidad(expandedOportunidad === type ? null : type);
  };

  const handleActionClick = (actionType: string, opportunity: Opportunity) => {
    if (actionType === 'ajustar_parametro' && opportunity.type === 'ventaIncremental') {
      setVentaIncrementalImpacto(opportunity.impacto);
      setCoDisenoModalOpen(true);
      return;
    }
    setModalAction({
      tipo: actionType as TipoAccionGeneral,
      opportunity
    });
  };

  const handleCloseModal = () => {
    setModalAction(null);
  };

  const handleCompleteAction = (datos: unknown) => {
    console.log('Acción completada:', datos);
    // Aquí puedes agregar lógica adicional como guardar en el historial
  };

  const getActionInfo = () => {
    if (!modalAction) return null;

    const actionTitles: Record<TipoAccionGeneral, { title: string; description: string; tipo: string }> = {
      reabasto_urgente: {
        title: 'Reabasto Urgente',
        description: 'Reponer inventario crítico en tiendas afectadas',
        tipo: 'Reabasto'
      },
      exhibiciones_adicionales: {
        title: 'Exhibiciones Adicionales',
        description: 'Ganar espacio adicional en tiendas con alto ROI',
        tipo: 'Exhibición'
      },
      promocion_evacuar: {
        title: 'Promoción Evacuar Inventario',
        description: 'Aplicar descuentos para evacuar productos próximos a caducar',
        tipo: 'Promoción'
      },
      visita_promotoria: {
        title: 'Visita Promotoría',
        description: 'Auditar y reorganizar productos sin venta',
        tipo: 'Visita'
      },
      cambio_inventario: {
        title: 'Cambio de Inventario',
        description: 'Transferir inventario de tiendas lentas a tiendas con alta rotación',
        tipo: 'Transferencia'
      }
    };

    return {
      id: modalAction.tipo,
      ...actionTitles[modalAction.tipo],
      tiendas: modalAction.opportunity.tiendas
    };
  };

  // Sort opportunities by impacto (highest to lowest)
  const sortedOpportunities = [...opportunities].sort((a, b) => b.impacto - a.impacto);

  // Determine label based on opportunity type
  const getImpactoLabel = (type: OpportunityType): 'Crítico' | 'Alto' | 'Medio' | 'Bajo' => {
    if (type === 'caducidad') return 'Crítico';
    if (type === 'sinVenta') return 'Bajo';
    if (type === 'agotado') return 'Medio';
    if (type === 'ventaIncremental') return 'Alto';
    return 'Medio'; // Default fallback
  };

  return (
    <>
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Áreas de Oportunidades Identificadas
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.type}
              type={opportunity.type}
              title={opportunity.title}
              description={opportunity.description}
              tiendas={opportunity.tiendas}
              impacto={opportunity.impacto}
              risk={opportunity.risk}
              impactoColor={opportunity.impactoColor}
              impactoLabel={getImpactoLabel(opportunity.type)}
              isExpanded={expandedOportunidad === opportunity.type}
              detailData={getDetailData(opportunity.type)}
              isLoading={getDetailLoading(opportunity.type)}
              onToggleExpand={() => toggleOportunidadExpanded(opportunity.type)}
              onActionClick={(actionType) => handleActionClick(actionType, opportunity)}
              onVerAnalisisCompleto={opportunity.type === 'ventaIncremental' ? onVerAnalisisCompleto : undefined}
            />
          ))}
        </div>
      </div>

      {/* Modal de Acciones */}
      {modalAction && getActionInfo() && (
        <WizardAccionesGenerales
          accionInfo={getActionInfo()!}
          onClose={handleCloseModal}
          onComplete={handleCompleteAction}
          onChatOpen={onChatOpen}
        />
      )}

      {/* Co-Diseño Modal */}
      <CoDisenoModal
        isOpen={coDisenoModalOpen}
        onClose={() => setCoDisenoModalOpen(false)}
        impacto={ventaIncrementalImpacto}
      />
    </>
  );
}

