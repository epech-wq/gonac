import { useState, useEffect, useCallback } from 'react';
import { CambioInventarioResponse } from '@/types/cambioInventario';

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

