import { useState, useEffect, useCallback } from 'react';
import {
  ValorizacionResponse,
  ValorizacionSummary,
  ValorizacionItem,
  AgotadoDetalleResponse,
  CaducidadDetalleResponse,
  SinVentasDetalleResponse,
  VentaIncrementalDetalleResponse
} from '@/types/valorizacion';

type FormatType = 'default' | 'summary' | 'percentages' | 'critical' | 'agotado-detalle' | 'caducidad-detalle' | 'sin-ventas-detalle' | 'tiendas-con-oportunidades' | 'venta-incremental' | 'venta-incremental-detalle' | 'agotado-por-tienda' | 'agotado-por-sku' | 'caducidad-por-tienda' | 'caducidad-por-sku' | 'sin-ventas-por-tienda' | 'sin-ventas-por-sku';

interface UseValorizacionOptions {
  format?: FormatType;
  type?: 'Agotado' | 'Caducidad' | 'Sin Ventas';
  autoFetch?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseValorizacionReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * React hook to fetch valorizacion data
 * 
 * @example
 * ```tsx
 * // Default usage
 * const { data, loading, error } = useValorizacion();
 * 
 * // Get summary format
 * const { data, loading } = useValorizacion({ format: 'summary' });
 * 
 * // Get specific type
 * const { data } = useValorizacion({ type: 'Agotado' });
 * 
 * // Auto-refresh every 5 minutes
 * const { data } = useValorizacion({ refreshInterval: 5 * 60 * 1000 });
 * ```
 */
export function useValorizacion<T = ValorizacionResponse>(
  options: UseValorizacionOptions = {}
): UseValorizacionReturn<T> {
  const {
    format = 'default',
    type,
    autoFetch = true,
    refreshInterval,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (format !== 'default') {
        params.append('format', format);
      }
      if (type) {
        params.append('type', type);
      }

      const response = await fetch(`/api/valorizacion?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch data');
      }

      // For detail formats and grouped formats, the API spreads the service response
      // So we get { success: true, data: [...], total: number, timestamp: string }
      // For other formats, we get { success: true, data: {...} }
      // In both cases, result.data contains what we need, but for detail/grouped formats
      // we need to pass the whole result (minus success) to maintain the structure
      if (format.includes('-detalle') || format.includes('-por-')) {
        // For detail and grouped formats, pass the entire response structure
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { success, ...detailData } = result;
        setData(detailData as T);
      } else {
        // For other formats, just pass the data
        setData(result.data);
      }
    } catch (err) {
      setError(err as Error);
      console.error('useValorizacion error:', {
        format,
        type,
        error: err,
        message: (err as Error).message
      });
    } finally {
      setLoading(false);
    }
  }, [format, type]);

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
    refetch: fetchData,
  };
}

/**
 * Hook specifically for summary data
 */
export function useValorizacionSummary() {
  return useValorizacion<ValorizacionSummary>({ format: 'summary' });
}

/**
 * Hook specifically for percentages
 */
export function useValorizacionPercentages() {
  return useValorizacion<Array<ValorizacionItem & { percentage: number }>>({
    format: 'percentages',
  });
}

/**
 * Hook for the most critical valorizacion
 */
export function useValorizacionCritical() {
  return useValorizacion<ValorizacionItem>({ format: 'critical' });
}

/**
 * Hook for detailed Agotado opportunities
 * Returns store and product information for out-of-stock items
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useAgotadoDetalle();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Segment</th>
 *         <th>Store</th>
 *         <th>Product</th>
 *         <th>Days Inventory</th>
 *         <th>Impact</th>
 *         <th>Detected</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {data?.data.map((item, index) => (
 *         <tr key={index}>
 *           <td>{item.segment}</td>
 *           <td>{item.store_name}</td>
 *           <td>{item.product_name}</td>
 *           <td>{item.dias_inventario}</td>
 *           <td>${item.impacto}</td>
 *           <td>{item.detectado}</td>
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * );
 * ```
 */
export function useAgotadoDetalle(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<AgotadoDetalleResponse>({
    format: 'agotado-detalle',
    autoFetch
  });
}

/**
 * Hook for detailed Caducidad opportunities
 * Returns store and product information for near-expiration items
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useCaducidadDetalle();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Segment</th>
 *         <th>Store</th>
 *         <th>Product</th>
 *         <th>Last Sale Date</th>
 *         <th>Days Until Feb 2026</th>
 *         <th>Final Inventory</th>
 *         <th>Impact</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {data?.data.map((item, index) => (
 *         <tr key={index}>
 *           <td>{item.segment}</td>
 *           <td>{item.store_name}</td>
 *           <td>{item.product_name}</td>
 *           <td>{item.last_sale_date}</td>
 *           <td>{item.dias_hasta_febrero_2026}</td>
 *           <td>{item.final_inventory}</td>
 *           <td>${item.impacto}</td>
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * );
 * ```
 */
export function useCaducidadDetalle(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<CaducidadDetalleResponse>({
    format: 'caducidad-detalle',
    autoFetch
  });
}

/**
 * Hook for detailed Sin Ventas opportunities
 * Returns store and product information for non-selling items
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useSinVentasDetalle();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Store</th>
 *         <th>Product</th>
 *         <th>Impact</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {data?.data.map((item, index) => (
 *         <tr key={index}>
 *           <td>{item.store_name}</td>
 *           <td>{item.product_name}</td>
 *           <td>${item.impacto}</td>
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * );
 * ```
 */
export function useSinVentasDetalle(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<SinVentasDetalleResponse>({
    format: 'sin-ventas-detalle',
    autoFetch
  });
}

/**
 * Hook for getting total number of stores with opportunities
 * Fetches from: gonac.metricas_riesgo where valorizacion = 'Total'
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useTiendasConOportunidades();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return <div>Tiendas con Oportunidades: {data}</div>;
 * ```
 */
export function useTiendasConOportunidades(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<number>({
    format: 'tiendas-con-oportunidades',
    autoFetch
  });
}

/**
 * Hook for Venta Incremental data
 * Fetches from: gonac.vw_comparacion_optimo_real using id_store and impacto columns
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useVentaIncremental();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     <div>Tiendas: {data?.tiendas}</div>
 *     <div>Impacto: ${data?.impacto}</div>
 *   </div>
 * );
 * ```
 */
export function useVentaIncremental(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<ValorizacionItem>({
    format: 'venta-incremental',
    autoFetch
  });
}

/**
 * Hook for Agotado data grouped by store
 */
export function useAgotadoPorTienda(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ store_name: string; impacto_total: number; registros: number }>; total: number; timestamp: string }>({
    format: 'agotado-por-tienda',
    autoFetch
  });
}

/**
 * Hook for Agotado data grouped by SKU
 */
export function useAgotadoPorSKU(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>; total: number; timestamp: string }>({
    format: 'agotado-por-sku',
    autoFetch
  });
}

/**
 * Hook for Caducidad data grouped by store
 */
export function useCaducidadPorTienda(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ store_name: string; impacto_total: number; registros: number }>; total: number; timestamp: string }>({
    format: 'caducidad-por-tienda',
    autoFetch
  });
}

/**
 * Hook for Caducidad data grouped by SKU
 */
export function useCaducidadPorSKU(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>; total: number; timestamp: string }>({
    format: 'caducidad-por-sku',
    autoFetch
  });
}

/**
 * Hook for Sin Ventas data grouped by store
 */
export function useSinVentasPorTienda(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ store_name: string; impacto_total: number; registros: number }>; total: number; timestamp: string }>({
    format: 'sin-ventas-por-tienda',
    autoFetch
  });
}

/**
 * Hook for Sin Ventas data grouped by SKU
 */
export function useSinVentasPorSKU(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = false } = options;
  return useValorizacion<{ data: Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>; total: number; timestamp: string }>({
    format: 'sin-ventas-por-sku',
    autoFetch
  });
}

/**
 * Hook for detailed Venta Incremental opportunities
 * Returns store, SKU, segment, region, and impact information from vw_comparacion_optimo_real_tienda
 * 
 * @example
 * ```tsx
 * const { data, loading, error, refetch } = useVentaIncrementalDetalle();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * 
 * return (
 *   <table>
 *     <thead>
 *       <tr>
 *         <th>Store</th>
 *         <th>SKU</th>
 *         <th>Segment</th>
 *         <th>Region</th>
 *         <th>Impact</th>
 *       </tr>
 *     </thead>
 *     <tbody>
 *       {data?.data.map((item, index) => (
 *         <tr key={index}>
 *           <td>{item.store_name}</td>
 *           <td>{item.sku}</td>
 *           <td>{item.segment}</td>
 *           <td>{item.region}</td>
 *           <td>${item.impacto}</td>
 *         </tr>
 *       ))}
 *     </tbody>
 *   </table>
 * );
 * ```
 */
export function useVentaIncrementalDetalle(options: { autoFetch?: boolean } = {}) {
  const { autoFetch = true } = options;

  return useValorizacion<VentaIncrementalDetalleResponse>({
    format: 'venta-incremental-detalle',
    autoFetch
  });
}

