/**
 * Opportunities Section Component
 */

import { useState, useMemo } from 'react';
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
import { useParametrosOptimos } from '@/hooks/useParametrosOptimos';
import type { CausaData } from '@/components/vemio-dashboard/types';
import TemporalityFilter from '../filters/TemporalityFilter';
import type { TemporalityPeriod } from '../filters/TemporalityFilter';

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
  const [ventaIncrementalCausas, setVentaIncrementalCausas] = useState<any[]>([]);
  const [opportunitiesTemporality, setOpportunitiesTemporality] = useState<TemporalityPeriod>('month');

  const handleOpportunitiesTemporalityChange = (period: TemporalityPeriod) => {
    setOpportunitiesTemporality(period);
    // TODO: Implement data filtering based on period
    console.log('Opportunities temporality period changed to:', period);
  };

  // Fetch parametros data to share with Venta Incremental card
  const { data: parametrosData } = useParametrosOptimos();

  // Transform parametros data into CausaData format for Venta Incremental
  const ventaIncrementalCausasData = useMemo((): CausaData[] => {
    if (!parametrosData?.data) return [];

    const globalData = parametrosData.data;

    const getTendencia = (real: number | null, optimo: number | null): "up" | "down" | "neutral" => {
      if (real === null || optimo === null) return "neutral";
      const diff = real - optimo;
      const diffPct = Math.abs(diff / optimo * 100);

      if (diffPct < 5) return "neutral";
      return real > optimo ? "up" : "down";
    };

    const formatDesvio = (real: number | null, optimo: number | null): string => {
      if (real === null || optimo === null) return "0%";
      const desviacion_pct = ((real - optimo) / optimo) * 100;
      const sign = desviacion_pct >= 0 ? "+" : "";
      return `${sign}${desviacion_pct.toFixed(1)}%`;
    };

    return [
      {
        id: 1,
        titulo: "Días Inventario",
        subtitulo: `Optimización de inventario`,
        tendencia: getTendencia(globalData.dias_inventario_real, globalData.dias_inventario_optimo),
        actual: globalData.dias_inventario_real || 0,
        optimo: globalData.dias_inventario_optimo || 0,
        desvio: formatDesvio(globalData.dias_inventario_real, globalData.dias_inventario_optimo),
        impacto: globalData.valor_dias_inventario || 0,
      },
      {
        id: 2,
        titulo: "Tamaño Pedido",
        subtitulo: `Optimización de pedidos`,
        tendencia: getTendencia(globalData.tamano_pedido_real, globalData.tamano_pedido_optimo),
        actual: globalData.tamano_pedido_real || 0,
        optimo: globalData.tamano_pedido_optimo || 0,
        desvio: formatDesvio(globalData.tamano_pedido_real, globalData.tamano_pedido_optimo),
        impacto: globalData.valor_tamano_pedido || 0,
      },
      {
        id: 3,
        titulo: "Frecuencia",
        subtitulo: `Optimización de frecuencia`,
        tendencia: getTendencia(globalData.frecuencia_real, globalData.frecuencia_optima),
        actual: globalData.frecuencia_real || 0,
        optimo: globalData.frecuencia_optima || 0,
        desvio: formatDesvio(globalData.frecuencia_real, globalData.frecuencia_optima),
        impacto: globalData.valor_frecuencia || 0,
      },
    ];
  }, [parametrosData]);

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

  const handleActionClick = (actionType: string, opportunity: Opportunity, causasData?: any[]) => {
    if (actionType === 'ajustar_parametro' && opportunity.type === 'ventaIncremental') {
      setVentaIncrementalImpacto(opportunity.impacto);
      setVentaIncrementalCausas(ventaIncrementalCausasData);
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

  // Determine label based on position in sorted order (hierarchy: Crítico > Alto > Medio > Bajo)
  // If more than 4 cards, repeat "Medio" for intermediate cards
  const getImpactoLabel = (index: number): 'Crítico' | 'Alto' | 'Medio' | 'Bajo' => {
    // First 4 cards get unique labels
    if (index === 0) return 'Crítico';
    if (index === 1) return 'Alto';
    if (index === 2) return 'Medio';
    if (index === 3) return 'Bajo';

    // Cards beyond the 4th get "Medio" label
    return 'Medio';
  };

  return (
    <>
      <div className="mt-8">
        {/* Title and Temporality Filter */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Áreas de Oportunidades Identificadas
          </h3>
          <TemporalityFilter
            defaultActive="month"
            onChange={handleOpportunitiesTemporalityChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sortedOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.type}
              type={opportunity.type}
              title={opportunity.title}
              description={opportunity.description}
              tiendas={opportunity.tiendas}
              impacto={opportunity.impacto}
              risk={opportunity.risk}
              impactoColor={opportunity.impactoColor}
              impactoLabel={getImpactoLabel(index)}
              isExpanded={expandedOportunidad === opportunity.type}
              detailData={getDetailData(opportunity.type)}
              isLoading={getDetailLoading(opportunity.type)}
              onToggleExpand={() => toggleOportunidadExpanded(opportunity.type)}
              onActionClick={(actionType, causasData) => handleActionClick(actionType, opportunity, causasData)}
              onVerAnalisisCompleto={onVerAnalisisCompleto}
              preloadedCausasData={opportunity.type === 'ventaIncremental' ? ventaIncrementalCausasData : undefined}
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
        onClose={() => {
          setCoDisenoModalOpen(false);
          setVentaIncrementalCausas([]);
        }}
        impacto={ventaIncrementalImpacto}
        causasData={ventaIncrementalCausas}
      />
    </>
  );
}

