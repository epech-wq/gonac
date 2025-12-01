import useSWR from 'swr';
import { ParametrosFilters, DashboardParametros } from '@/types/parametros';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Hook para obtener comparación detallada con status
 */
export function useParametros(filters?: ParametrosFilters) {
  const params = new URLSearchParams();
  params.append('view', 'detalle');
  
  if (filters?.id_store) params.append('id_store', filters.id_store.toString());
  if (filters?.sku) params.append('sku', filters.sku.toString());
  if (filters?.category) params.append('category', filters.category);
  if (filters?.brand) params.append('brand', filters.brand);
  if (filters?.segment) params.append('segment', filters.segment);
  if (filters?.region) params.append('region', filters.region);
  if (filters?.ranking_limit) params.append('ranking_limit', filters.ranking_limit.toString());
  if (filters?.min_impacto) params.append('min_impacto', filters.min_impacto.toString());
  if (filters?.tendencia) params.append('tendencia', filters.tendencia);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/parametros?${params.toString()}`,
    fetcher
  );

  return {
    parametros: data?.data,
    resumen: data?.resumen,
    total: data?.total,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook para obtener dashboard consolidado completo
 */
export function useParametrosDashboard() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/parametros?view=dashboard',
    fetcher
  );

  return {
    dashboard: data as DashboardParametros | undefined,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook para obtener comparación por tienda
 */
export function useParametrosPorTienda(filters?: ParametrosFilters) {
  const params = new URLSearchParams();
  params.append('view', 'tienda');
  
  if (filters?.id_store) params.append('id_store', filters.id_store.toString());
  if (filters?.segment) params.append('segment', filters.segment);
  if (filters?.region) params.append('region', filters.region);
  if (filters?.ranking_limit) params.append('ranking_limit', filters.ranking_limit.toString());

  const { data, error, isLoading, mutate } = useSWR(
    `/api/parametros?${params.toString()}`,
    fetcher
  );

  return {
    tiendas: data?.data,
    total: data?.total,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook para obtener datos globales
 */
export function useParametrosGlobal() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/parametros?view=global',
    fetcher
  );

  return {
    global: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook para obtener distribución por segmento
 */
export function useDistribucionPorSegmento() {
  const { data, error, isLoading, mutate } = useSWR(
    '/api/parametros?view=segmento',
    fetcher
  );

  return {
    segmentos: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

