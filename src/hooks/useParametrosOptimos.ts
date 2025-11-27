import { useState, useEffect, useCallback } from 'react';
import { ParametrosOptimosResponse } from '@/types/parametrosOptimos';

interface UseParametrosOptimosOptions {
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseParametrosOptimosReturn {
  data: ParametrosOptimosResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch optimization parameters
 * 
 * @example
 * ```tsx
 * // Auto-fetch on mount
 * const { data, loading, error } = useParametrosOptimos();
 * 
 * // Manual fetch
 * const { data, refetch } = useParametrosOptimos({ autoFetch: false });
 * 
 * // Auto-refresh every 5 minutes
 * const { data } = useParametrosOptimos({ 
 *   refreshInterval: 5 * 60 * 1000 
 * });
 * ```
 */
export function useParametrosOptimos(
  options: UseParametrosOptimosOptions = {}
): UseParametrosOptimosReturn {
  const {
    autoFetch = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<ParametrosOptimosResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/parametros-optimos');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('useParametrosOptimos error:', err);
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

