import { SupabaseClient } from '@supabase/supabase-js';
import {
  ValorizacionItem,
  AgotadoDetalle,
  CaducidadDetalle,
  SinVentasDetalle,
  VentaIncrementalDetalle
} from '@/types/valorizacion';

/**
 * Valorizacion Repository
 * Handles all database operations related to valorizacion data
 */
export class ValorizacionRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Fetches valorizacion data from multiple tables using UNION ALL
   * Retrieves Agotado, Caducidad, and Sin Ventas data
   */
  async getValorizacionData(): Promise<ValorizacionItem[]> {
    const query = `
      SELECT 'Agotado' as valorizacion, 
             COUNT(DISTINCT(id_store))::int as tiendas, 
             SUM(impacto)::numeric as impacto
      FROM gonac.agotamiento_detalle
      UNION ALL
      SELECT 'Caducidad' as valorizacion, 
             COUNT(DISTINCT(id_store))::int as tiendas, 
             SUM(impacto)::numeric as impacto
      FROM gonac.caducidad_detalle
      UNION ALL 
      SELECT 'Sin Ventas' as valorizacion, 
             COUNT(DISTINCT(id_store))::int as tiendas, 
             SUM(impacto)::numeric as impacto
      FROM gonac.sin_ventas_detalle
    `;

    const { data, error } = await this.supabase.rpc('exec_valorizacion_query', {
      query_text: query
    });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return data as ValorizacionItem[];
  }

  /**
   * Alternative method: Fetch data from each table separately
   * Use this if you prefer individual queries over UNION ALL
   */
  async getValorizacionDataSeparate(): Promise<ValorizacionItem[]> {
    try {
      const [agotadoResult, caducidadResult, sinVentasResult] = await Promise.all([
        this.getAgotadoData(),
        this.getCaducidadData(),
        this.getSinVentasData(),
      ]);

      return [agotadoResult, caducidadResult, sinVentasResult];
    } catch (error) {
      throw new Error(`Failed to fetch valorizacion data: ${(error as Error).message}`);
    }
  }

  /**
   * Fetch Agotado (Out of Stock) data
   */
  private async getAgotadoData(): Promise<ValorizacionItem> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('agotamiento_detalle')
      .select('id_store, impacto');

    if (error) {
      throw new Error(`Agotado query error: ${error.message}`);
    }

    const uniqueStores = new Set(data.map((item: Record<string, unknown>) => item.id_store));
    const totalImpacto = data.reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.impacto) || 0), 0);

    return {
      valorizacion: 'Agotado',
      tiendas: uniqueStores.size,
      impacto: totalImpacto,
    };
  }

  /**
   * Fetch Caducidad (Expiration) data
   */
  private async getCaducidadData(): Promise<ValorizacionItem> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('caducidad_detalle')
      .select('id_store, impacto');

    if (error) {
      throw new Error(`Caducidad query error: ${error.message}`);
    }

    const uniqueStores = new Set(data.map((item: Record<string, unknown>) => item.id_store));
    const totalImpacto = data.reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.impacto) || 0), 0);

    return {
      valorizacion: 'Caducidad',
      tiendas: uniqueStores.size,
      impacto: totalImpacto,
    };
  }

  /**
   * Fetch Sin Ventas (No Sales) data
   */
  private async getSinVentasData(): Promise<ValorizacionItem> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('sin_ventas_detalle')
      .select('id_store, impacto');

    if (error) {
      throw new Error(`Sin Ventas query error: ${error.message}`);
    }

    const uniqueStores = new Set(data.map((item: Record<string, unknown>) => item.id_store));
    const totalImpacto = data.reduce((sum: number, item: Record<string, unknown>) => sum + (Number(item.impacto) || 0), 0);

    return {
      valorizacion: 'Sin Ventas',
      tiendas: uniqueStores.size,
      impacto: totalImpacto,
    };
  }

  /**
   * Get data for a specific valorizacion type
   */
  async getValorizacionByType(type: 'Agotado' | 'Caducidad' | 'Sin Ventas'): Promise<ValorizacionItem> {
    switch (type) {
      case 'Agotado':
        return this.getAgotadoData();
      case 'Caducidad':
        return this.getCaducidadData();
      case 'Sin Ventas':
        return this.getSinVentasData();
      default:
        throw new Error(`Invalid valorizacion type: ${type}`);
    }
  }

  /**
   * Get detailed Agotado opportunities with store and product information
   * Joins agotamiento_detalle with core_cat_store and core_cat_product
   */
  async getAgotadoDetalle(): Promise<AgotadoDetalle[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('agotamiento_detalle')
      .select(`
        segment,
        dias_inventario,
        impacto,
        detectado,
        core_cat_store!inner(store_name),
        core_cat_product!inner(product_name)
      `);

    if (error) {
      throw new Error(`Error fetching agotado details: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the nested structure to flat objects
    return data.map((item) => {
      const coreStore = item.core_cat_store as { store_name: string }[] | { store_name: string } | undefined;
      const coreProduct = item.core_cat_product as { product_name: string }[] | { product_name: string } | undefined;

      const storeName = Array.isArray(coreStore)
        ? coreStore[0]?.store_name || ''
        : coreStore?.store_name || '';
      const productName = Array.isArray(coreProduct)
        ? coreProduct[0]?.product_name || ''
        : coreProduct?.product_name || '';

      return {
        segment: String(item.segment || ''),
        store_name: String(storeName),
        product_name: String(productName),
        dias_inventario: Number(item.dias_inventario) || 0,
        impacto: Number(item.impacto) || 0,
        detectado: String(item.detectado || ''),
      };
    });
  }

  /**
   * Get detailed Caducidad opportunities with store and product information
   * Joins caducidad_detalle with core_cat_store and core_cat_product
   */
  async getCaducidadDetalle(): Promise<CaducidadDetalle[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('caducidad_detalle')
      .select(`
        segment,
        fecha_caducidad,
        inventario_remanente,
        impacto,
        detectado,
        core_cat_store!inner(store_name),
        core_cat_product!inner(product_name)
      `);

    if (error) {
      throw new Error(`Error fetching caducidad details: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the nested structure to flat objects
    return data.map((item) => {
      const coreStore = item.core_cat_store as { store_name: string }[] | { store_name: string } | undefined;
      const coreProduct = item.core_cat_product as { product_name: string }[] | { product_name: string } | undefined;

      const storeName = Array.isArray(coreStore)
        ? coreStore[0]?.store_name || ''
        : coreStore?.store_name || '';
      const productName = Array.isArray(coreProduct)
        ? coreProduct[0]?.product_name || ''
        : coreProduct?.product_name || '';

      return {
        segment: String(item.segment || ''),
        store_name: String(storeName),
        product_name: String(productName),
        fecha_caducidad: String(item.fecha_caducidad || ''),
        inventario_remanente: Number(item.inventario_remanente) || 0,
        impacto: Number(item.impacto) || 0,
        detectado: String(item.detectado || ''),
      };
    });
  }

  /**
   * Get detailed Sin Ventas opportunities with store and product information
   * Joins sin_ventas_detalle with core_cat_store and core_cat_product
   */
  async getSinVentasDetalle(): Promise<SinVentasDetalle[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('sin_ventas_detalle')
      .select(`
        impacto,
        core_cat_store!inner(store_name),
        core_cat_product!inner(product_name)
      `);

    if (error) {
      throw new Error(`Error fetching sin ventas details: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the nested structure to flat objects
    return data.map((item) => {
      const coreStore = item.core_cat_store as { store_name: string }[] | { store_name: string } | undefined;
      const coreProduct = item.core_cat_product as { product_name: string }[] | { product_name: string } | undefined;

      const storeName = Array.isArray(coreStore)
        ? coreStore[0]?.store_name || ''
        : coreStore?.store_name || '';
      const productName = Array.isArray(coreProduct)
        ? coreProduct[0]?.product_name || ''
        : coreProduct?.product_name || '';

      return {
        store_name: String(storeName),
        product_name: String(productName),
        impacto: Number(item.impacto) || 0,
      };
    });
  }

  /**
   * Get total number of stores with opportunities from metricas_riesgo table
   * Fetches from: gonac.metricas_riesgo where valorizacion = 'Total'
   * 
   * @returns Number of stores with opportunities
   */
  async getTiendasConOportunidades(): Promise<number> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('metricas_riesgo')
      .select('tiendas')
      .eq('valorizacion', 'Total')
      .single();

    if (error) {
      throw new Error(`Error fetching tiendas con oportunidades: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from metricas_riesgo for Total valorizacion');
    }

    return Number(data.tiendas) || 0;
  }

  /**
   * Get Agotado data grouped by store
   * Returns aggregated impact and count per store
   */
  async getAgotadoPorTienda(): Promise<Array<{ store_name: string; impacto_total: number; registros: number }>> {
    const detalle = await this.getAgotadoDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by store_name
    const storeMap = new Map<string, { impacto: number; count: number }>();
    
    detalle.forEach((item) => {
      const existing = storeMap.get(item.store_name) || { impacto: 0, count: 0 };
      storeMap.set(item.store_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1
      });
    });

    return Array.from(storeMap.entries()).map(([store_name, values]) => ({
      store_name,
      impacto_total: values.impacto,
      registros: values.count
    }));
  }

  /**
   * Get Agotado data grouped by SKU (product)
   * Returns aggregated impact and count per product
   */
  async getAgotadoPorSKU(): Promise<Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>> {
    const detalle = await this.getAgotadoDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by product_name
    const productMap = new Map<string, { impacto: number; count: number; stores: Set<string> }>();
    
    detalle.forEach((item) => {
      const existing = productMap.get(item.product_name) || { impacto: 0, count: 0, stores: new Set<string>() };
      existing.stores.add(item.store_name);
      productMap.set(item.product_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1,
        stores: existing.stores
      });
    });

    return Array.from(productMap.entries()).map(([product_name, values]) => ({
      product_name,
      impacto_total: values.impacto,
      registros: values.count,
      tiendas_afectadas: values.stores.size
    }));
  }

  /**
   * Get Caducidad data grouped by store
   * Returns aggregated impact and count per store
   */
  async getCaducidadPorTienda(): Promise<Array<{ store_name: string; impacto_total: number; registros: number }>> {
    const detalle = await this.getCaducidadDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by store_name
    const storeMap = new Map<string, { impacto: number; count: number }>();
    
    detalle.forEach((item) => {
      const existing = storeMap.get(item.store_name) || { impacto: 0, count: 0 };
      storeMap.set(item.store_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1
      });
    });

    return Array.from(storeMap.entries()).map(([store_name, values]) => ({
      store_name,
      impacto_total: values.impacto,
      registros: values.count
    }));
  }

  /**
   * Get Caducidad data grouped by SKU (product)
   * Returns aggregated impact and count per product
   */
  async getCaducidadPorSKU(): Promise<Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>> {
    const detalle = await this.getCaducidadDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by product_name
    const productMap = new Map<string, { impacto: number; count: number; stores: Set<string> }>();
    
    detalle.forEach((item) => {
      const existing = productMap.get(item.product_name) || { impacto: 0, count: 0, stores: new Set<string>() };
      existing.stores.add(item.store_name);
      productMap.set(item.product_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1,
        stores: existing.stores
      });
    });

    return Array.from(productMap.entries()).map(([product_name, values]) => ({
      product_name,
      impacto_total: values.impacto,
      registros: values.count,
      tiendas_afectadas: values.stores.size
    }));
  }

  /**
   * Get Sin Ventas data grouped by store
   * Returns aggregated impact and count per store
   */
  async getSinVentasPorTienda(): Promise<Array<{ store_name: string; impacto_total: number; registros: number }>> {
    const detalle = await this.getSinVentasDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by store_name
    const storeMap = new Map<string, { impacto: number; count: number }>();
    
    detalle.forEach((item) => {
      const existing = storeMap.get(item.store_name) || { impacto: 0, count: 0 };
      storeMap.set(item.store_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1
      });
    });

    return Array.from(storeMap.entries()).map(([store_name, values]) => ({
      store_name,
      impacto_total: values.impacto,
      registros: values.count
    }));
  }

  /**
   * Get Sin Ventas data grouped by SKU (product)
   * Returns aggregated impact and count per product
   */
  async getSinVentasPorSKU(): Promise<Array<{ product_name: string; impacto_total: number; registros: number; tiendas_afectadas: number }>> {
    const detalle = await this.getSinVentasDetalle();
    
    if (!detalle || detalle.length === 0) {
      return [];
    }

    // Group by product_name
    const productMap = new Map<string, { impacto: number; count: number; stores: Set<string> }>();
    
    detalle.forEach((item) => {
      const existing = productMap.get(item.product_name) || { impacto: 0, count: 0, stores: new Set<string>() };
      existing.stores.add(item.store_name);
      productMap.set(item.product_name, {
        impacto: existing.impacto + item.impacto,
        count: existing.count + 1,
        stores: existing.stores
      });
    });

    return Array.from(productMap.entries()).map(([product_name, values]) => ({
      product_name,
      impacto_total: values.impacto,
      registros: values.count,
      tiendas_afectadas: values.stores.size
    }));
  }

  /**
   * Fetch Venta Incremental data from vw_comparacion_optimo_real
   * Uses id_store and impacto columns to calculate opportunities
   */
  async getVentaIncrementalData(): Promise<ValorizacionItem> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real')
      .select('id_store, impacto');

    if (error) {
      throw new Error(`Venta Incremental query error: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        valorizacion: 'Venta Incremental',
        tiendas: 0,
        impacto: 0,
      };
    }

    // Count distinct stores
    const uniqueStores = new Set(data.map((item: Record<string, unknown>) => item.id_store));
    
    // Sum impacto values
    const totalImpacto = data.reduce((sum: number, item: Record<string, unknown>) => {
      const impacto = Number(item.impacto) || 0;
      return sum + impacto;
    }, 0);

    return {
      valorizacion: 'Venta Incremental',
      tiendas: uniqueStores.size,
      impacto: totalImpacto,
    };
  }

  /**
   * Get detailed Venta Incremental opportunities from vw_comparacion_optimo_real_tienda
   * Returns store, SKU, segment, region, and impact information
   * Note: Since vw_comparacion_optimo_real_tienda is a view, we'll use sku number directly
   * If product names are needed, they can be added via a join in the future
   */
  async getVentaIncrementalDetalle(): Promise<VentaIncrementalDetalle[]> {
    const { data, error } = await this.supabase
      .schema('gonac')
      .from('vw_comparacion_optimo_real_tienda')
      .select(`
        store_name,
        sku,
        segment,
        region,
        impacto,
        optimo_dias_inventario,
        real_dias_inventario,
        desviacion_dias_inventario
      `)
      .order('impacto', { ascending: false, nullsFirst: false });

    if (error) {
      throw new Error(`Error fetching venta incremental details: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform the data to match the expected format
    return data.map((item) => ({
      store_name: String(item.store_name || ''),
      sku: Number(item.sku) || 0,
      segment: String(item.segment || ''),
      region: String(item.region || ''),
      impacto: Number(item.impacto) || 0,
      optimo_dias_inventario: item.optimo_dias_inventario ? Number(item.optimo_dias_inventario) : null,
      real_dias_inventario: item.real_dias_inventario ? Number(item.real_dias_inventario) : null,
      desviacion_dias_inventario: item.desviacion_dias_inventario ? Number(item.desviacion_dias_inventario) : null,
    }));
  }
}

