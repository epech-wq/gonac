/**
 * Constants and configuration for Tiendas module
 */

import type { RiskLevel, SegmentType } from '@/types/tiendas.types';

export const METRIC_TARGETS = {
  SELL_THROUGH: 33, // percentage
  COBERTURA_PONDERADA: 90, // percentage
  DIAS_INVENTARIO: 30, // days
  TASA_QUIEBRE: 5, // percentage
} as const;

export const RISK_COLORS: Record<RiskLevel, string> = {
  'Crítico': 'bg-red-500 text-white',
  'Alto': 'bg-orange-500 text-white',
  'Medio': 'bg-yellow-500 text-white',
} as const;

export const SEGMENT_COLORS: Record<SegmentType, string> = {
  hot: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  balanceada: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  slow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  critica: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
} as const;

export const OPPORTUNITY_COLORS: Record<string, string> = {
  agotado: 'text-red-600 dark:text-red-400',
  caducidad: 'text-orange-600 dark:text-orange-400',
  sinVenta: 'text-purple-600 dark:text-purple-400',
} as const;

export const SEGMENT_TITLES: Record<string, string> = {
  hot: 'Prevenir Agotados',
  slow: 'Acelerar Venta',
  criticas: 'Recuperación',
  críticas: 'Recuperación',
  balanceadas: 'Optimización',
  balanceada: 'Optimización',
} as const;

export const OPPORTUNITY_DESCRIPTIONS: Record<string, string> = {
  agotado: 'Inventario < 10 días (Tiendas Hot y Balanceadas)',
  caducidad: 'Inventario remanente post fecha de caducidad (Tiendas Slow y Críticas)',
  sinVenta: 'Ventas <= 0 unidades',
} as const;

export const DEFAULT_METRICS = {
  totalTiendas: 127,
  ventasTotales: 120619,
  unidadesVendidas: 8450,
  ventaPromedio: 949.75,
  diasInventario: 45.2,
} as const;

