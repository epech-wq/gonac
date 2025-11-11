import { useState, useEffect, useCallback } from 'react';
import {
  SegmentacionMetricsResponse,
  SegmentacionDetalleResponse,
  SegmentacionDetalleGrouped,
  SegmentacionFormatted,
} from '@/types/segmentacion';

type SegmentacionFormat = 'raw' | 'formatted' | 'detalle' | 'grouped';

interface UseSegmentacionOptions {
  format?: SegmentacionFormat;
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseSegmentacionReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for fetching segmentation data
 */
export function useSegmentacion<T = SegmentacionMetricsResponse>(
  options: UseSegmentacionOptions = {}
): UseSegmentacionReturn<T> {
  const { format = 'raw', autoFetch = true, refreshInterval } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        format,
      });

      const response = await fetch(`/api/segmentacion?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      setData(result as T);
    } catch (err) {
      setError(err as Error);
      console.error('useSegmentacion error:', err);
    } finally {
      setLoading(false);
    }
  }, [format]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

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
    refetch: fetchData,
  };
}

/**
 * Hook for fetching raw segmentation metrics
 */
export function useSegmentacionMetrics(
  options?: Omit<UseSegmentacionOptions, 'format'>
) {
  return useSegmentacion<SegmentacionMetricsResponse>({
    format: 'raw',
    ...options,
  });
}

/**
 * Hook for fetching formatted segmentation data with cards and summary
 */
export function useSegmentacionFormatted(
  options?: Omit<UseSegmentacionOptions, 'format'>
) {
  return useSegmentacion<SegmentacionFormatted>({
    format: 'formatted',
    ...options,
  });
}

/**
 * Hook for fetching detailed segmentation data by store and segment
 */
export function useSegmentacionDetalle(
  options?: Omit<UseSegmentacionOptions, 'format'>
) {
  return useSegmentacion<SegmentacionDetalleResponse>({
    format: 'detalle',
    ...options,
  });
}

/**
 * Hook for fetching detailed segmentation data grouped by segment
 */
export function useSegmentacionDetalleGrouped(
  options?: Omit<UseSegmentacionOptions, 'format'>
) {
  return useSegmentacion<SegmentacionDetalleGrouped>({
    format: 'grouped',
    ...options,
  });
}
