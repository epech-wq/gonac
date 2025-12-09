/**
 * Hierarchical Metrics Types
 * Type definitions for the fn_hierarchical_metrics stored function
 */

export interface HierarchicalMetricsParams {
  // Date range (required)
  p_begin_date: string; // YYYY-MM-DD format
  p_end_date: string; // YYYY-MM-DD format

  // Grouping dimensions (optional)
  p_dim_1?: string; // store level: 'region', 'channel', 'chain', 'store', 'segment', 'commercial_director', etc.
  p_dim_2?: string; // product level: 'category', 'brand', 'product', 'global'
  p_dim_3?: string; // time level: 'daily', 'weekly', 'monthly', 'global'

  // Store filters (optional)
  p_filtro_store?: string[];
  p_filtro_store_channel?: string[];
  p_filtro_store_segment?: string[];
  p_filtro_store_chain?: string[];
  p_filtro_store_commercial_director?: string[];
  p_filtro_store_commercial_manager?: string[];
  p_filtro_store_regional_leader?: string[];
  p_filtro_store_commercial_coordinator?: string[];
  p_filtro_store_state?: string[];
  p_filtro_store_city?: string[];
  p_filtro_store_region?: string[];

  // Product filters (optional)
  p_filtro_product?: string[];
  p_filtro_product_category?: string[];
  p_filtro_product_brand?: string[];
}

export interface HierarchicalMetricsResult {
  dim_store: string;
  dim_product: string;
  dim_time: string;
  begin_date: string;
  end_date: string;
  days_count: number;

  // Sales metrics
  total_sales_amount: number;
  total_units_sold: number;
  total_received_units: number;
  total_lost_units: number;
  avg_daily_units_sold: number;
  avg_daily_sales_amount: number;

  // Inventory metrics
  initial_inventory: number;
  final_inventory: number;
  avg_inventory: number;

  // KPIs
  sell_through_pct: number;
  numeric_distribution_pct: number;
  inventory_days: number;
  out_of_stock_rate_pct: number;

  // Counts
  total_unique_products: number;
  total_unique_stores: number;
}
