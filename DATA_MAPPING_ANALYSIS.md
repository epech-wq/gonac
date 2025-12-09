# Data Mapping Analysis - Hierarchical Metrics to Cards

## Overview

The main page cards now use data from the `fn_hierarchical_metrics` stored function instead of the previous data sources.

## Data Mapping

### From `fn_hierarchical_metrics` Result → To Card Display

#### Large Cards

**1. Ventas Totales (Sales Total)**

- **Value**: `total_sales_amount` → Formatted as currency
- **Subtitle**: `total_units_sold` → "X unidades vendidas"
- ✅ **Fully Mapped**

**2. Sell-Through**

- **Value**: `sell_through_pct` → Converted from percentage (29.88) to decimal (0.2988)
- **Subtitle**: `initial_inventory` → "Inventario inicial: X unidades"
- ✅ **Fully Mapped**

#### Small Cards

**3. Cobertura Numérica (Numeric Distribution)**

- **Value**: `numeric_distribution_pct` → Converted from percentage (99.88) to decimal (0.9988)
- ✅ **Fully Mapped**

**4. Cobertura Ponderada (Weighted Coverage)**

- **Value**: ❌ **NOT AVAILABLE** in function result
- **Fallback**: Uses previous data source
- ⚠️ **Missing Data**

**5. Días de Inventario (Inventory Days)**

- **Value**: `inventory_days` → Direct mapping (32.1)
- ✅ **Fully Mapped**

**6. Tasa de Quiebre (Out of Stock Rate)**

- **Value**: `out_of_stock_rate_pct` → Direct mapping (1.86%)
- ✅ **Fully Mapped**

**7. Venta Promedio Diaria (Average Daily Sales)**

- **Value**: `avg_daily_sales_amount` → Formatted as currency
- ✅ **Fully Mapped**

## Additional Metrics Available (Currently Unused)

The function returns these metrics that are NOT currently displayed in cards:

1. **`total_received_units`** (251,302) - Units received/restocked
2. **`total_lost_units`** (141,375) - Units lost
3. **`avg_daily_units_sold`** (3,680.2) - Average daily units sold
4. **`final_inventory`** (113,301) - Inventory at end of period
5. **`avg_inventory`** (118,024) - Average inventory during period
6. **`total_unique_products`** (90) - Number of unique products
7. **`total_unique_stores`** (9) - Number of unique stores
8. **`days_count`** (30) - Number of days in the period

## Missing Data (Not in Function Result)

These values are used by cards but NOT available in the function:

1. **Cobertura Ponderada** (`cobertura_ponderada_pct`)

   - Currently falls back to previous data source
   - May need to be added to the stored function

2. **Target/Objective Values**

   - `objetivo_ventas_totales_pesos`
   - `objetivo_sell_through_pct`
   - `objetivo_cobertura_pct`
   - `objetivo_promedio_dias_inventario`
   - `objetivo_porcentaje_agotados_pct`
   - `objetivo_avg_venta_promedio_diaria`
   - Currently falls back to previous data source

3. **Variation Percentages**
   - `variacion_ventas_totales_pct`
   - `variacion_cobertura_pct`
   - `variacion_promedio_dias_inventario_pct`
   - `variacion_porcentaje_agotados_pct`
   - `variacion_avg_venta_promedio_diaria_pct`
   - Currently falls back to previous data source

## Implementation Details

### State Management

```typescript
const [hierarchicalMetrics, setHierarchicalMetrics] =
  useState<HierarchicalMetricsResult | null>(null);
const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
```

### Data Transformation

The component uses `useMemo` to transform the hierarchical metrics data into the format expected by the cards:

```typescript
const storeMetrics = useMemo(() => {
  if (!hierarchicalMetrics) return fallbackStoreMetrics;

  return {
    totalTiendas: hierarchicalMetrics.total_unique_stores,
    ventasTotales: hierarchicalMetrics.total_sales_amount,
    unidadesVendidas: hierarchicalMetrics.total_units_sold,
    ventaPromedio: hierarchicalMetrics.avg_daily_sales_amount * 7,
    diasInventario: hierarchicalMetrics.inventory_days,
  };
}, [hierarchicalMetrics, fallbackStoreMetrics]);
```

### Fallback Strategy

- If `hierarchicalMetrics` is null (loading or error), uses the previous data source
- Preserves target/objective values from the previous source
- Ensures the UI never breaks due to missing data

## Recommendations

### 1. Add Missing Metrics to Function

Consider adding these to `fn_hierarchical_metrics`:

- Weighted coverage calculation
- Target/objective values (from configuration or historical data)
- Variation percentages (comparing to previous period or targets)

### 2. Use Additional Available Metrics

Consider creating new cards or insights using:

- `total_received_units` - Restock efficiency
- `total_lost_units` - Loss/shrinkage tracking
- `avg_inventory` - Inventory health
- `final_inventory` - Current stock levels

### 3. Remove Unused Data Sources

Once all metrics are migrated, consider:

- Removing or deprecating old hooks/services
- Cleaning up unused API calls
- Simplifying the data flow

## Testing Checklist

- ✅ Ventas Totales displays correct value
- ✅ Sell-Through displays correct percentage
- ✅ Cobertura Numérica displays correct value
- ⚠️ Cobertura Ponderada uses fallback (expected)
- ✅ Días de Inventario displays correct value
- ✅ Tasa de Quiebre displays correct value
- ✅ Venta Promedio Diaria displays correct value
- ✅ Loading state works correctly
- ✅ Error handling works correctly
- ✅ Fallback to previous data source works
