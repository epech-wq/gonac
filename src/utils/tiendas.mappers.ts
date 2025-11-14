/**
 * Mapper functions for Tiendas data transformations
 */

import type { 
  RiskLevel, 
  SegmentType, 
  OpportunityType, 
  DetailRecord 
} from '@/types/tiendas.types';
import { 
  RISK_COLORS, 
  SEGMENT_COLORS, 
  OPPORTUNITY_COLORS,
  SEGMENT_TITLES,
  OPPORTUNITY_DESCRIPTIONS 
} from '@/constants/tiendas.constants';

export const getRiskLevel = (
  segment: string, 
  diasInventario: number, 
  contribucion: number
): RiskLevel => {
  const normalized = segment.toLowerCase();
  
  if (normalized === 'criticas' || normalized === 'críticas') {
    return 'Crítico';
  }
  if (normalized === 'hot' && diasInventario < 30) {
    return 'Crítico';
  }
  if (normalized === 'slow' && diasInventario > 60) {
    return 'Alto';
  }
  return 'Medio';
};

export const getBadgeColor = (risk: RiskLevel): string => {
  return RISK_COLORS[risk] || 'bg-gray-500 text-white';
};

export const getSegmentColor = (segment: string): string => {
  const normalized = segment.toLowerCase() as SegmentType;
  return SEGMENT_COLORS[normalized] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
};

export const getOportunidadRiskLevel = (type: string): RiskLevel => {
  switch (type) {
    case 'agotado':
      return 'Crítico';
    case 'caducidad':
      return 'Alto';
    case 'sinVenta':
      return 'Medio';
    default:
      return 'Medio';
  }
};

export const getOportunidadTitle = (type: string): string => {
  const titles: Record<string, string> = {
    agotado: 'Agotado',
    caducidad: 'Caducidad',
    sinVenta: 'Sin Venta',
  };
  return titles[type] || type;
};

export const getOportunidadDescription = (type: string): string => {
  return OPPORTUNITY_DESCRIPTIONS[type] || '';
};

export const getOportunidadColor = (type: string): string => {
  return OPPORTUNITY_COLORS[type] || 'text-gray-600 dark:text-gray-400';
};

export const getSegmentTitle = (segment: string): string => {
  const normalized = segment.toLowerCase();
  return SEGMENT_TITLES[normalized] || segment;
};

export const getSegmentSubtitle = (segment: string): string => {
  const normalized = segment.toLowerCase();
  const subtitles: Record<string, string> = {
    hot: 'Hot',
    slow: 'Slow',
    criticas: 'Críticas',
    críticas: 'Críticas',
    balanceadas: 'Balanceadas',
    balanceada: 'Balanceadas',
  };
  return subtitles[normalized] || segment;
};

export const getImpactoColor = (segment: string): string => {
  const normalized = segment.toLowerCase();
  const colors: Record<string, string> = {
    hot: 'text-red-600 dark:text-red-400',
    slow: 'text-orange-600 dark:text-orange-400',
    criticas: 'text-purple-600 dark:text-purple-400',
    críticas: 'text-purple-600 dark:text-purple-400',
  };
  return colors[normalized] || 'text-green-600 dark:text-green-400';
};

// Data transformation functions
export const transformAgotadoData = (response: any): DetailRecord[] => {
  if (!response?.data || !Array.isArray(response.data)) return [];
  
  return response.data.map((item: any, index: number) => ({
    id: `agotado-${index}`,
    tienda: item.store_name,
    sku: item.product_name,
    diasInventario: item.dias_inventario,
    segmentoTienda: item.segment?.toLowerCase(),
    impactoEstimado: item.impacto,
    fechaDeteccion: item.detectado,
  }));
};

export const transformCaducidadData = (response: any): DetailRecord[] => {
  if (!response?.data || !Array.isArray(response.data)) return [];
  
  return response.data.map((item: any, index: number) => ({
    id: `caducidad-${index}`,
    tienda: item.store_name,
    sku: item.product_name,
    inventarioRemanente: item.inventario_remanente,
    fechaCaducidad: item.fecha_caducidad,
    segmentoTienda: item.segment?.toLowerCase(),
    impactoEstimado: item.impacto,
    fechaDeteccion: item.detectado,
  }));
};

export const transformSinVentasData = (response: any): DetailRecord[] => {
  if (!response?.data || !Array.isArray(response.data)) return [];
  
  return response.data.map((item: any, index: number) => ({
    id: `sinventa-${index}`,
    tienda: item.store_name,
    sku: item.product_name,
    impactoEstimado: item.impacto,
  }));
};

