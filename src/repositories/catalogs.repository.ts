import { SupabaseClient } from '@supabase/supabase-js';
import { ComboboxOption } from '@/types/catalogs';
import { getDbSchema } from '@/lib/schema';

/**
 * Catalogs Repository
 * Handles all database operations related to catalog data
 */
export class CatalogsRepository {
  constructor(private supabase: SupabaseClient) { }

  /**
   * Cliente Catalogs
   */

  async getChannels(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_cat_channel')
      .select('id_channel, channel_code, channel_name')
      .eq('is_active', true)
      .order('channel_name');

    if (error) {
      console.error('Error fetching channels:', error);
      return [];
    }

    return (data || []).map(item => ({
      value: item.id_channel.toString(),
      label: item.channel_name
    }));
  }

  async getChains(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_cat_chain')
      .select('id_chain, chain_code, chain_name')
      .eq('is_active', true)
      .order('chain_name');

    if (error) {
      console.error('Error fetching chains:', error);
      return [];
    }

    return (data || []).map(item => ({
      value: item.id_chain.toString(),
      label: item.chain_name
    }));
  }

  async getGeographies(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_cat_geography')
      .select('id_geography, geography_code, geography_level, geography_name')
      .eq('is_active', true)
      .order('geography_level, geography_name');

    if (error) {
      console.error('Error fetching geographies:', error);
      return [];
    }

    // Map geography_level to display names
    const levelNames: Record<string, string> = {
      'state': 'Estado',
      'city': 'Ciudad',
      'region': 'Región'
    };

    return (data || []).map(item => ({
      value: item.id_geography.toString(),
      label: item.geography_name,
      group: levelNames[item.geography_level] || item.geography_level
    }));
  }

  async getCommercialHierarchies(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_cat_commercial_hierarchy')
      .select('id_commercial_hierarchy, hierarchy_code, hierarchy_level, hierarchy_name')
      .eq('is_active', true)
      .order('hierarchy_level, hierarchy_name');

    if (error) {
      console.error('Error fetching commercial hierarchies:', error);
      return [];
    }

    // Map hierarchy_level to display names
    const levelNames: Record<string, string> = {
      'commercial_director': 'Director Comercial',
      'commercial_manager': 'Gerente Comercial',
      'regional_leader': 'Líder Regional',
      'commercial_coordinator': 'Coordinador Comercial'
    };

    return (data || []).map(item => ({
      value: item.id_commercial_hierarchy.toString(),
      label: item.hierarchy_name,
      group: levelNames[item.hierarchy_level] || item.hierarchy_level
    }));
  }

  /**
   * Producto Catalogs
   */

  async getCategories(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_dim_category')
      .select('id_category, category_name, description')
      .eq('is_active', true)
      .order('category_name');

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return (data || []).map(item => ({
      value: item.id_category.toString(),
      label: item.category_name
    }));
  }

  async getBrands(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_cat_brand')
      .select('id_brand, brand_code, brand_name')
      .eq('is_active', true)
      .order('brand_name');

    if (error) {
      console.error('Error fetching brands:', error);
      return [];
    }

    return (data || []).map(item => ({
      value: item.id_brand.toString(),
      label: item.brand_name
    }));
  }

  async getProducts(): Promise<ComboboxOption[]> {
    const { data, error } = await this.supabase
      .schema(getDbSchema())
      .from('core_dim_product')
      .select('id_product, external_sku, product_name')
      .eq('is_active', true)
      .order('product_name');

    if (error) {
      console.error('Error fetching products:', error);
      return [];
    }

    return (data || []).map(item => ({
      value: item.id_product.toString(),
      label: `${item.external_sku} - ${item.product_name}`
    }));
  }
}
