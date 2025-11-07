import { useState, useCallback, useEffect } from 'react';
import { PromocionResponse, CalcularPromocionRequest } from '@/types/descuento';

interface UseDescuentoOptions {
  descuento?: number;
  elasticidad_papas?: number;
  elasticidad_totopos?: number;
  autoFetch?: boolean;
}

interface UseDescuentoReturn {
  data: PromocionResponse | null;
  loading: boolean;
  error: Error | null;
  calcular: (params: CalcularPromocionRequest) => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * React hook to calculate discount promotion metrics
 * 
 * @example
 * ```tsx
 * const { data, loading, calcular } = useDescuento();
 * 
 * // Calculate for 41% discount
 * await calcular({ descuento: 0.41 });
 * 
 * // Access results
 * console.log(data.papas.costo_promocion);
 * console.log(data.totopos.valor_capturar);
 * ```
 */
export function useDescuento(options: UseDescuentoOptions = {}): UseDescuentoReturn {
  const {
    descuento,
    elasticidad_papas,
    elasticidad_totopos,
    autoFetch = false,
  } = options;

  const [data, setData] = useState<PromocionResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const calcular = useCallback(async (params: CalcularPromocionRequest) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        descuento: params.descuento.toString(),
      });

      if (params.elasticidad_papas) {
        queryParams.append('elasticidad_papas', params.elasticidad_papas.toString());
      }
      if (params.elasticidad_totopos) {
        queryParams.append('elasticidad_totopos', params.elasticidad_totopos.toString());
      }
      if (params.categorias) {
        queryParams.append('categorias', params.categorias.join(','));
      }

      const response = await fetch(`/api/descuento?${queryParams.toString()}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to calculate discount');
      }

      setData(result.data);
    } catch (err) {
      setError(err as Error);
      console.error('useDescuento error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (descuento) {
      await calcular({
        descuento,
        elasticidad_papas,
        elasticidad_totopos,
      });
    }
  }, [descuento, elasticidad_papas, elasticidad_totopos, calcular]);

  // Auto-fetch on mount if configured
  useEffect(() => {
    if (autoFetch && descuento) {
      refetch();
    }
  }, [autoFetch, refetch, descuento]);

  return {
    data,
    loading,
    error,
    calcular,
    refetch,
  };
}

/**
 * Hook for comparing multiple discount scenarios
 */
export function useCompararDescuentos() {
  const [data, setData] = useState<PromocionResponse[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const comparar = useCallback(
    async (
      descuentos: number[],
      elasticidad_papas?: number,
      elasticidad_totopos?: number
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/descuento/comparar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            descuentos,
            elasticidad_papas,
            elasticidad_totopos,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || 'Failed to compare discounts');
        }

        setData(result.data);
      } catch (err) {
        setError(err as Error);
        console.error('useCompararDescuentos error:', err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    data,
    loading,
    error,
    comparar,
  };
}

