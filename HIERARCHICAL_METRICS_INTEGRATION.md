# Hierarchical Metrics Integration

## Overview

The filter modal now calls the `fn_hierarchical_metrics` stored function from Supabase when filters are applied. The results are logged to the console for testing purposes.

## Files Created

### Types

- **src/types/hierarchical-metrics.ts** - Type definitions for function parameters and results

### Repository

- **src/repositories/hierarchical-metrics.repository.ts** - Database calls to the stored function

### Service

- **src/services/hierarchical-metrics.service.ts** - Business logic layer (optional)

### Updated

- **src/components/filters/AdvancedFilterModal.tsx** - Calls the function when "Aplicar Filtros" is clicked
- **src/components/views/ResumenView.tsx** - Calls the function on initial load with last 30 days

## How It Works

### 1. Filter Mapping

The modal filters are mapped to the stored function parameters:

**Cliente Filters:**

- `canal` → `p_filtro_store_channel` (uses channel name)
- `geografia` → `p_filtro_store_region` (uses geography name)
- `arbol` → `p_filtro_store_commercial_coordinator` (uses hierarchy name)
- `cadenaCliente` → `p_filtro_store_chain` (uses chain name)

**Producto Filters:**

- `categoria` → `p_filtro_product_category` (uses category name)
- `marca` → `p_filtro_product_brand` (uses brand name)
- `sku` → `p_filtro_product` (uses product name)

**Segmentacion Filter:**

- `segmentacion` → Not currently used (kept in UI for future use)

**Date Range:**

- `startDate` → `p_begin_date` (YYYY-MM-DD format)
- `endDate` → `p_end_date` (YYYY-MM-DD format)

### 2. Default Grouping

Currently set to `'global'` for all dimensions:

- `p_dim_1: 'global'` - No store grouping
- `p_dim_2: 'global'` - No product grouping
- `p_dim_3: 'global'` - No time grouping

This returns a single aggregated row with all metrics.

### 3. Console Output

When you apply filters, check the browser console for:

```
=== Calling fn_hierarchical_metrics ===
Parameters: { ... }
=== Hierarchical Metrics Result ===
Total rows returned: X
Data: [ ... ]
```

## Example Usage

### Initial Load

When the main page loads (ResumenView component):

- Automatically calls the function with November 2024 data (2024-11-01 to 2024-11-30)
- No filters applied (global view)
- Results are logged to the browser console

### Manual Filtering

1. Open the filter modal
2. Select a date range (required)
3. Select any combination of filters
4. Click "Aplicar Filtros"
5. Open browser console (F12) to see the results

## Function Parameters Reference

### Grouping Dimensions

**p_dim_1 (Store Level):**

- `'region'`, `'channel'`, `'chain'`, `'store'`
- `'segment'` or `'segmentation'`
- `'commercial_director'`, `'commercial_manager'`, `'regional_leader'`, `'commercial_coordinator'`
- `'state'`, `'city'`
- `'global'` (default - no grouping)

**p_dim_2 (Product Level):**

- `'category'`, `'brand'`, `'product'`
- `'global'` (default - no grouping)

**p_dim_3 (Time Level):**

- `'daily'`, `'weekly'`, `'monthly'`
- `'global'` (default - no grouping)

### Filter Parameters

All filter parameters accept arrays of strings (`TEXT[]`):

**Store Filters:**

- `p_filtro_store` - Store names
- `p_filtro_store_channel` - Channel names
- `p_filtro_store_segment` - Segment names
- `p_filtro_store_chain` - Chain names
- `p_filtro_store_commercial_director` - Director names
- `p_filtro_store_commercial_manager` - Manager names
- `p_filtro_store_regional_leader` - Leader names
- `p_filtro_store_commercial_coordinator` - Coordinator names
- `p_filtro_store_state` - State names
- `p_filtro_store_city` - City names
- `p_filtro_store_region` - Region names

**Product Filters:**

- `p_filtro_product` - Product names
- `p_filtro_product_category` - Category names
- `p_filtro_product_brand` - Brand names

## Result Structure

Each row returned contains:

**Dimensions:**

- `dim_store`, `dim_product`, `dim_time` - Grouping values
- `begin_date`, `end_date`, `days_count` - Period info

**Sales Metrics:**

- `total_sales_amount` - Total sales in currency
- `total_units_sold` - Total units sold
- `total_received_units` - Units received (restock)
- `total_lost_units` - Units lost
- `avg_daily_units_sold` - Average daily units
- `avg_daily_sales_amount` - Average daily sales

**Inventory Metrics:**

- `initial_inventory` - Inventory at start
- `final_inventory` - Inventory at end
- `avg_inventory` - Average inventory

**KPIs:**

- `sell_through_pct` - Sell through percentage
- `numeric_distribution_pct` - Distribution percentage
- `inventory_days` - Days of inventory
- `out_of_stock_rate_pct` - Out of stock rate

**Counts:**

- `total_unique_products` - Number of unique products
- `total_unique_stores` - Number of unique stores

## Next Steps

To use the data in your application:

1. Remove the console.log statements
2. Pass the result to a state management solution
3. Update your dashboard/views with the metrics
4. Add loading states during the API call
5. Handle errors gracefully with user feedback
