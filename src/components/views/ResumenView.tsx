import { useState, useEffect, useMemo } from "react";
import MetricsSection from "../indicadores/MetricsSection";
import { useTiendasData } from "@/hooks/useTiendasData";
import { AdvancedFilterModal, FilterState } from "../filters/AdvancedFilterModal";
import Breadcrumb from "../ui/breadcrumb/Breadcrumb";
import { supabase } from "@/lib/supabase";
import { HierarchicalMetricsRepository } from "@/repositories/hierarchical-metrics.repository";
import { HierarchicalMetricsParams, HierarchicalMetricsResult } from "@/types/hierarchical-metrics";
import { CatalogsRepository } from "@/repositories/catalogs.repository";
import { ComboboxOption } from "@/types/catalogs";

interface ResumenViewProps {
  onCardClick?: (cardData: unknown) => void;
}

export default function ResumenView({ onCardClick }: ResumenViewProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);
  const [hierarchicalMetrics, setHierarchicalMetrics] = useState<HierarchicalMetricsResult | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  // Catalog options for label lookup - shared with modal
  const [catalogOptions, setCatalogOptions] = useState({
    canal: [] as ComboboxOption[],
    geografia: [] as ComboboxOption[],
    arbol: [] as ComboboxOption[],
    cadenaCliente: [] as ComboboxOption[],
    categoria: [] as ComboboxOption[],
    marca: [] as ComboboxOption[],
    sku: [] as ComboboxOption[],
  });

  const [isLoadingCatalogs, setIsLoadingCatalogs] = useState(true);

  const {
    storeMetrics: fallbackStoreMetrics,
    metricasData: fallbackMetricasData,
  } = useTiendasData();

  // Map hierarchical metrics to the format expected by the cards
  const storeMetrics = useMemo(() => {
    if (!hierarchicalMetrics) {
      return fallbackStoreMetrics;
    }

    return {
      totalTiendas: hierarchicalMetrics.total_unique_stores,
      ventasTotales: hierarchicalMetrics.total_sales_amount,
      unidadesVendidas: hierarchicalMetrics.total_units_sold,
      ventaPromedio: hierarchicalMetrics.avg_daily_sales_amount * 7, // Convert daily to weekly
      diasInventario: hierarchicalMetrics.inventory_days,
    };
  }, [hierarchicalMetrics, fallbackStoreMetrics]);

  const metricasData = useMemo(() => {
    if (!hierarchicalMetrics) {
      return fallbackMetricasData;
    }

    return {
      sell_through_pct: hierarchicalMetrics.sell_through_pct / 100, // Convert to 0-1 format
      cobertura_ponderada_pct: fallbackMetricasData?.cobertura_ponderada_pct, // Not available in function
      porcentaje_agotados_pct: hierarchicalMetrics.out_of_stock_rate_pct,
      avg_venta_promedio_diaria: hierarchicalMetrics.avg_daily_sales_amount,
      cobertura_pct: hierarchicalMetrics.numeric_distribution_pct / 100, // Convert to 0-1 format
      ventas_totales_unidades: hierarchicalMetrics.total_units_sold,
      ventas_totales_pesos: hierarchicalMetrics.total_sales_amount,
      promedio_dias_inventario: hierarchicalMetrics.inventory_days,
      // Keep target/objective values from fallback if available
      ...fallbackMetricasData,
    };
  }, [hierarchicalMetrics, fallbackMetricasData]);

  // Load initial metrics and catalogs on component mount
  useEffect(() => {
    loadInitialMetrics();
    loadCatalogs();
  }, []);

  const loadCatalogs = async () => {
    setIsLoadingCatalogs(true);
    const catalogsRepo = new CatalogsRepository(supabase);

    try {
      const [
        channels,
        geographies,
        hierarchies,
        chains,
        categories,
        brands,
        products,
      ] = await Promise.all([
        catalogsRepo.getChannels(),
        catalogsRepo.getGeographies(),
        catalogsRepo.getCommercialHierarchies(),
        catalogsRepo.getChains(),
        catalogsRepo.getCategories(),
        catalogsRepo.getBrands(),
        catalogsRepo.getProducts(),
      ]);

      setCatalogOptions({
        canal: channels,
        geografia: geographies,
        arbol: hierarchies,
        cadenaCliente: chains,
        categoria: categories,
        marca: brands,
        sku: products,
      });
    } catch (error) {
      console.error('Error loading catalogs:', error);
    } finally {
      setIsLoadingCatalogs(false);
    }
  };

  const loadInitialMetrics = async () => {
    setIsLoadingMetrics(true);
    const metricsRepo = new HierarchicalMetricsRepository(supabase);

    const params: HierarchicalMetricsParams = {
      p_begin_date: '2024-11-01',
      p_end_date: '2024-11-30',
      // Default grouping: global (no grouping)
      p_dim_1: 'global',
      p_dim_2: 'global',
      p_dim_3: 'global',
    };

    try {
      console.log('=== Loading Initial Metrics (November 2024) ===');
      console.log('Parameters:', JSON.stringify(params, null, 2));

      const result = await metricsRepo.getHierarchicalMetrics(params);

      console.log('=== Initial Metrics Result ===');
      console.log('Total rows returned:', result.length);
      console.log('Data:', JSON.stringify(result, null, 2));

      // Set the first result (should be only one with global grouping)
      if (result.length > 0) {
        setHierarchicalMetrics(result[0]);
      }
    } catch (error) {
      console.error('Error loading initial metrics:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleApplyFilters = async (filters: FilterState) => {
    console.log("Filters applied:", filters);
    setAppliedFilters(filters);

    // Reload metrics with the new filters
    await loadMetricsWithFilters(filters);
  };

  const loadMetricsWithFilters = async (filterState: FilterState) => {
    // Validate date range
    if (!filterState.startDate || !filterState.endDate) {
      console.warn('Date range is required for hierarchical metrics');
      return;
    }

    setIsLoadingMetrics(true);
    const metricsRepo = new HierarchicalMetricsRepository(supabase);

    // Build the parameters for the stored function
    const params: HierarchicalMetricsParams = {
      p_begin_date: filterState.startDate,
      p_end_date: filterState.endDate,
      // Default grouping: global (no grouping)
      p_dim_1: 'global',
      p_dim_2: 'global',
      p_dim_3: 'global',
    };

    // Add filters based on selected values
    // Cliente filters
    if (filterState.canal) {
      const selectedChannel = catalogOptions.canal.find(c => c.value === filterState.canal);
      if (selectedChannel) {
        params.p_filtro_store_channel = [selectedChannel.label];
      }
    }

    if (filterState.geografia) {
      const selectedGeography = catalogOptions.geografia.find(g => g.value === filterState.geografia);
      if (selectedGeography) {
        params.p_filtro_store_region = [selectedGeography.label];
      }
    }

    if (filterState.arbol) {
      const selectedHierarchy = catalogOptions.arbol.find(h => h.value === filterState.arbol);
      if (selectedHierarchy) {
        params.p_filtro_store_commercial_coordinator = [selectedHierarchy.label];
      }
    }

    if (filterState.cadenaCliente) {
      const selectedChain = catalogOptions.cadenaCliente.find(c => c.value === filterState.cadenaCliente);
      if (selectedChain) {
        params.p_filtro_store_chain = [selectedChain.label];
      }
    }

    // Producto filters
    if (filterState.categoria) {
      const selectedCategory = catalogOptions.categoria.find(c => c.value === filterState.categoria);
      if (selectedCategory) {
        params.p_filtro_product_category = [selectedCategory.label];
      }
    }

    if (filterState.marca) {
      const selectedBrand = catalogOptions.marca.find(b => b.value === filterState.marca);
      if (selectedBrand) {
        params.p_filtro_product_brand = [selectedBrand.label];
      }
    }

    if (filterState.sku) {
      const selectedProduct = catalogOptions.sku.find(p => p.value === filterState.sku);
      if (selectedProduct) {
        const productName = selectedProduct.label.split(' - ')[1];
        if (productName) {
          params.p_filtro_product = [productName];
        }
      }
    }

    // Segmentation filter
    if (filterState.segmentacion) {
      params.p_filtro_store_segment = [filterState.segmentacion.toUpperCase()];
    }

    try {
      console.log('=== Loading Metrics with Filters ===');
      console.log('Parameters:', JSON.stringify(params, null, 2));

      const result = await metricsRepo.getHierarchicalMetrics(params);

      console.log('=== Filtered Metrics Result ===');
      console.log('Total rows returned:', result.length);
      console.log('Data:', JSON.stringify(result, null, 2));

      // Update the metrics with the filtered result
      if (result.length > 0) {
        setHierarchicalMetrics(result[0]);
      }
    } catch (error) {
      console.error('Error loading filtered metrics:', error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Build breadcrumb items based on Cliente section filters
  const getBreadcrumbItems = (): Array<{ label: string; href?: string }> => {
    const items: Array<{ label: string; href?: string }> = [{ label: "Home", href: "/" }];

    // If no filters are applied, only show "Home"
    if (!appliedFilters) {
      return items;
    }

    // Add Cliente section filters in order: Canal, Geografía, Árbol, Cadena Cliente
    // Look up the label from catalog options
    if (appliedFilters.canal) {
      const option = catalogOptions.canal.find(opt => opt.value === appliedFilters.canal);
      const label = option?.label || appliedFilters.canal;
      items.push({ label });
    }

    if (appliedFilters.geografia) {
      const option = catalogOptions.geografia.find(opt => opt.value === appliedFilters.geografia);
      const label = option?.label || appliedFilters.geografia;
      items.push({ label });
    }

    if (appliedFilters.arbol) {
      const option = catalogOptions.arbol.find(opt => opt.value === appliedFilters.arbol);
      const label = option?.label || appliedFilters.arbol;
      items.push({ label });
    }

    if (appliedFilters.cadenaCliente) {
      const option = catalogOptions.cadenaCliente.find(opt => opt.value === appliedFilters.cadenaCliente);
      const label = option?.label || appliedFilters.cadenaCliente;
      items.push({ label });
    }

    // If no Cliente filters are selected after applying, still only show "Home"
    return items;
  };

  return (
    <>
      <AdvancedFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        catalogOptions={catalogOptions}
        isLoadingCatalogs={isLoadingCatalogs}
      />

      {/* Controls Bar */}
      <div className="mb-6 flex flex-wrap justify-between items-center gap-4">
        <Breadcrumb
          items={getBreadcrumbItems()}
          variant="chevron"
        />
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Metrics Section - Cards or Charts */}
      <MetricsSection
        storeMetrics={storeMetrics}
        metricasData={metricasData}
        enableAnalysis={true}
        onCardClick={onCardClick}
      />

      {/* Impacto Total Banner */}
      {/* <ImpactoTotalBanner
        impactoTotal={impactoTotal}
        tiendasConOportunidades={tiendasConOportunidades}
        totalTiendas={storeMetrics.totalTiendas}
      /> */}
    </>
  )
}