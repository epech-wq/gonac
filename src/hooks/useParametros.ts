import { useState, useEffect, useCallback } from 'react';
import { ParametrosFilters, DashboardParametros } from '@/types/parametros';

/**
 * Hook para obtener comparación detallada con status
 */
export function useParametros(filters?: ParametrosFilters) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
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

      const response = await fetch(`/api/parametros?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
  const [data, setData] = useState<DashboardParametros | undefined>(undefined);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/parametros?view=dashboard');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result as DashboardParametros);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    dashboard: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook para obtener comparación por tienda
 */
export function useParametrosPorTienda(filters?: ParametrosFilters) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      params.append('view', 'tienda');
      
      if (filters?.id_store) params.append('id_store', filters.id_store.toString());
      if (filters?.segment) params.append('segment', filters.segment);
      if (filters?.region) params.append('region', filters.region);
      if (filters?.ranking_limit) params.append('ranking_limit', filters.ranking_limit.toString());

      const response = await fetch(`/api/parametros?${params.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/parametros?view=global');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

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
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/parametros?view=segmento');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mutate = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    segmentos: data?.data,
    isLoading,
    isError: error,
    mutate,
  };
}

