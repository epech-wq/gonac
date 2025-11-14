/**
 * Action definitions and utilities for Tiendas
 */

import type { Action } from '@/types/tiendas.types';
import type { TipoAccionGeneral } from '@/components/vemio/modals/WizardAccionesGenerales';

interface ActionConfig {
  id: TipoAccionGeneral;
  title: string;
  tipo: string;
  description: string;
}

const ACTION_CONFIGS: ActionConfig[] = [
  {
    id: 'reabasto_urgente',
    title: 'Reabasto Urgente',
    tipo: 'Tiendas HOT y Balanceadas',
    description: 'Prevenir quiebres de stock en tiendas de alto desempeño',
  },
  {
    id: 'exhibiciones_adicionales',
    title: 'Exhibiciones Adicionales',
    tipo: 'Tiendas HOT con ROI positivo',
    description: 'Identificadas tiendas HOT donde exhibiciones adicionales generarían retorno positivo sobre inversión',
  },
  {
    id: 'promocion_evacuar',
    title: 'Promoción Evacuar Inventario',
    tipo: 'Tiendas Slow y Dead',
    description: 'Activar promociones para reducir inventario en riesgo de caducidad',
  },
  {
    id: 'visita_promotoria',
    title: 'Visita Promotoría',
    tipo: 'Tiendas Críticas',
    description: 'Visitas de campo para activar ventas en tiendas con bajo desempeño',
  },
];

const ACTION_ICONS = {
  reabasto_urgente: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  exhibiciones_adicionales: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  promocion_evacuar: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  visita_promotoria: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

interface SegmentData {
  num_tiendas_segmento?: number;
}

interface Segments {
  hot?: SegmentData;
  slow?: SegmentData;
  balanceadas?: SegmentData;
  criticas?: SegmentData;
}

export const buildActions = (segments: Segments): Action[] => {
  const tiendasReabastoUrgente = (segments.hot?.num_tiendas_segmento || 38) + (segments.balanceadas?.num_tiendas_segmento || 52);
  const tiendasPromocionEvacuar = (segments.slow?.num_tiendas_segmento || 28) + (segments.criticas?.num_tiendas_segmento || 9);
  const tiendasExhibicionesAdicionales = Math.round((segments.hot?.num_tiendas_segmento || 38) * 0.25);

  const tiendasCounts: Record<TipoAccionGeneral, number> = {
    reabasto_urgente: tiendasReabastoUrgente,
    exhibiciones_adicionales: tiendasExhibicionesAdicionales,
    promocion_evacuar: tiendasPromocionEvacuar,
    visita_promotoria: segments.criticas?.num_tiendas_segmento || 9,
  };

  return ACTION_CONFIGS.map(config => ({
    ...config,
    tiendas: tiendasCounts[config.id],
    icon: ACTION_ICONS[config.id],
  }));
};

