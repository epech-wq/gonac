import { useState, useEffect, useCallback } from 'react';
import {
  PromotoriaSummaryResponse,
  PromotoriaAggregateResponse,
  PromotoriaProductsResponse,
} from '@/services/promotoria.service';

interface UsePromotoriaOptions {
  autoFetch?: boolean;
  limit?: number;
}

interface UsePromotoriaReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching promotoria summary (tiendas_a_visitar, riesgo_total)
 */
export function usePromotoriaSummary(
  options: UsePromotoriaOptions = {}
): UsePromotoriaReturn<PromotoriaSummaryResponse> {
  const { autoFetch = true } = options;

  const [data, setData] = useState<PromotoriaSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/promotoria/summary');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch promotoria summary');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('usePromotoriaSummary error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching promotoria aggregate data
 */
export function usePromotoriaAggregate(
  options: UsePromotoriaOptions = {}
): UsePromotoriaReturn<PromotoriaAggregateResponse> {
  const { autoFetch = true } = options;

  const [data, setData] = useState<PromotoriaAggregateResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/promotoria/aggregate');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch promotoria aggregate');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('usePromotoriaAggregate error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching products without sales (highest risk)
 */
export function usePromotoriaProductsSinVenta(
  options: UsePromotoriaOptions = {}
): UsePromotoriaReturn<PromotoriaProductsResponse> {
  const { autoFetch = true, limit = 3 } = options;

  const [data, setData] = useState<PromotoriaProductsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const response = await fetch(`/api/promotoria/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch products sin venta');
      }

      setData(result);
    } catch (err) {
      setError(err as Error);
      console.error('usePromotoriaProductsSinVenta error:', err);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

