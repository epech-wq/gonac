import { useState, useEffect, useCallback } from 'react';
import { CambioInventarioResponse, RedistribucionCaducidadResponse } from '@/types/cambioInventario';

interface UseCambioInventarioOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface UseCambioInventarioReturn {
  data: CambioInventarioResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch Cambio de Inventario simulation data
 * 
 * @example
 * ```tsx
 * // Auto-fetch on mount
 * const { data, loading, error } = useCambioInventario({ autoFetch: true });
 * 
 * // Auto-refresh every 5 minutes
 * const { data } = useCambioInventario({ 
 *   autoFetch: true, 
 *   refreshInterval: 5 * 60 * 1000 
 * });
 * 
 * // Manual fetch
 * const { data, loading, refetch } = useCambioInventario();
 * await refetch();
 * ```
 */
export function useCambioInventario(
  options: UseCambioInventarioOptions = {}
): UseCambioInventarioReturn {
  const {
    autoFetch = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<CambioInventarioResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/cambio-inventario');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch cambio inventario data');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('useCambioInventario error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

interface UseRedistribucionDetalleOptions {
  autoFetch?: boolean;
  refreshInterval?: number;
}

interface UseRedistribucionDetalleReturn {
  data: RedistribucionCaducidadResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for detailed redistribution data from fn_redistribucion_caducidad
 * 
 * @example
 * ```tsx
 * // Auto-fetch on mount
 * const { data, loading, error } = useRedistribucionDetalle(30, { autoFetch: true });
 * 
 * // Auto-refresh every 5 minutes
 * const { data } = useRedistribucionDetalle(30, { 
 *   autoFetch: true, 
 *   refreshInterval: 5 * 60 * 1000 
 * });
 * 
 * // Manual fetch
 * const { data, loading, refetch } = useRedistribucionDetalle(30);
 * await refetch();
 * ```
 */
export function useRedistribucionDetalle(
  p_dias_maximo_inventario: number = 30,
  options: UseRedistribucionDetalleOptions = {}
): UseRedistribucionDetalleReturn {
  const {
    autoFetch = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<RedistribucionCaducidadResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        format: 'detalle',
        p_dias_maximo_inventario: p_dias_maximo_inventario.toString()
      });

      const response = await fetch(`/api/cambio-inventario?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch redistribucion detalle');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('useRedistribucionDetalle error:', err);
    } finally {
      setLoading(false);
    }
  }, [p_dias_maximo_inventario]);

  // Auto-refetch when parameter changes or autoFetch is enabled
  useEffect(() => {
    if (autoFetch && p_dias_maximo_inventario > 0) {
      fetchData();
    }
  }, [p_dias_maximo_inventario, autoFetch, fetchData]);

  // Auto-refresh functionality
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => clearInterval(intervalId);
    }
  }, [refreshInterval, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

