/**
 * Catalog Types
 * Type definitions for catalog data from database tables
 */

// Cliente catalogs
export interface Channel {
  id_channel: number;
  channel_code: string;
  channel_name: string;
  is_active: boolean;
}

export interface Chain {
  id_chain: number;
  chain_code: string;
  chain_name: string;
  is_active: boolean;
}

export interface Geography {
  id_geography: number;
  geography_code: string;
  geography_level: string;
  geography_name: string;
  is_active: boolean;
}

export interface CommercialHierarchy {
  id_commercial_hierarchy: number;
  hierarchy_code: string;
  hierarchy_level: string;
  hierarchy_name: string;
  is_active: boolean;
}

// Producto catalogs
export interface Category {
  id_category: number;
  category_name: string;
  description?: string;
  is_active: boolean;
}

export interface Brand {
  id_brand: number;
  brand_code: string;
  brand_name: string;
  is_active: boolean;
}

export interface Product {
  id_product: number;
  external_sku: string;
  product_name: string;
  is_active: boolean;
}

// Combobox option format
export interface ComboboxOption {
  value: string;
  label: string;
}
