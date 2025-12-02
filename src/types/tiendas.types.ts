/**
 * Type definitions for Tiendas module
 */

import type { ReactNode } from 'react';
import type { TipoAccionGeneral } from '@/components/vemio/modals/WizardAccionesGenerales';

export type RiskLevel = 'Crítico' | 'Alto' | 'Medio' | 'Bajo';

export type OpportunityType = 'agotado' | 'caducidad' | 'sinVenta' | 'ventaIncremental';

export type SegmentType = 'hot' | 'balanceada' | 'slow' | 'critica';

export interface StoreMetrics {
  totalTiendas: number;
  ventasTotales: number;
  unidadesVendidas: number;
  ventaPromedio: number;
  diasInventario: number;
}

export interface Opportunity {
  type: OpportunityType;
  title: string;
  description: string;
  tiendas: number;
  impacto: number;
  risk: RiskLevel;
  impactoColor: string;
}

export interface DetailRecord {
  id: string;
  tienda: string;
  sku: string;
  impactoEstimado: number;
  diasInventario?: number;
  segmentoTienda?: string;
  inventarioRemanente?: number;
  fechaCaducidad?: string;
  fechaDeteccion?: string;
  // Venta Incremental specific fields
  optimoDiasInventario?: number | null;
  optimoPuntoReorden?: number | null;
  optimoTamanoPedido?: number | null;
  optimoFrecuencia?: number | null;
  realDiasInventario?: number | null;
  realPuntoReorden?: number | null;
  realTamanoPedido?: number | null;
  realFrecuencia?: number | null;
}

export interface Action {
  id: TipoAccionGeneral;
  title: string;
  tiendas: number;
  tipo: string;
  description: string;
  icon: ReactNode;
}

