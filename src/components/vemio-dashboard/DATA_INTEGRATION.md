# Data Integration Guide

This document explains how the Vemio Dashboard components connect to database tables and how to configure data sources.

## Database Connection

The components use Supabase client to connect to PostgreSQL database tables.

### Configuration

Ensure your `.env.local` or environment variables include:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Current Data Integration

### Parámetros de Optimización

**Hook:** `useParametrosOptimos`  
**Table:** `gonac.tab_parametros_optimos`  
**Columns Used:**

| Database Column | Display Name | Card | Unit |
|----------------|--------------|------|------|
| `dias_inventario_optimo` | Objetivo (Vemio) | Días de Inventario | días |
| `dias_inventario_real` | Real | Días de Inventario | días |
| `punto_reorden_optimo` | Objetivo (Vemio) | Punto de Reorden | unidades |
| `punto_reorden_real` | Real | Punto de Reorden | unidades |
| `tamano_pedido_optimo` | Objetivo (Vemio) | Tamaño de Pedido Óptimo | unidades |
| `tamano_pedido_real` | Real | Tamaño de Pedido Óptimo | unidades |
| `frecuencia_optima` | Objetivo (Vemio) | Frecuencia Óptima | días |
| `frecuencia_real` | Real | Frecuencia Óptima | días |

**Implementation:**
```typescript
// Usage in DashboardContent.tsx
const { data: parametrosData, loading, error } = useParametrosOptimos();
```

### Loading States

The component includes:
- ✅ Loading skeleton while fetching data
- ✅ Error message display if fetch fails
- ✅ Fallback to mock data if no data is available

### Previous Period Data

**Note:** The table currently doesn't include historical data for "previousPeriod" values. The component currently calculates this as 95% of the actual value as a placeholder.

**TODO:** To show real historical data, you should:
1. Add historical columns to the table, OR
2. Create a separate historical data table, OR
3. Query data with date filters to get previous period

## Future Data Integrations

### KPIs Section

**Current Status:** Uses mock data  
**Recommended Table Structure:**

```sql
CREATE TABLE gonac.tab_kpis (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  ventas_unidades INTEGER,
  ventas_valor DECIMAL(12,2),
  distribucion_numerica DECIMAL(5,2),
  sell_through DECIMAL(5,2),
  dias_inventario INTEGER,
  -- Add columns for targets and previous period
  ventas_unidades_objetivo INTEGER,
  ventas_valor_objetivo DECIMAL(12,2),
  -- Filters
  canal VARCHAR(100),
  geografia VARCHAR(100),
  categoria VARCHAR(100),
  -- etc.
);
```

### Opportunities Section

**Current Status:** Uses mock data  
**Recommended Table Structure:**

```sql
CREATE TABLE gonac.tab_oportunidades (
  id SERIAL PRIMARY KEY,
  prioridad VARCHAR(20), -- 'Alta', 'Media', 'Critica'
  titulo VARCHAR(200),
  valor_estimado DECIMAL(12,2),
  num_tiendas INTEGER,
  num_skus INTEGER,
  porc_total DECIMAL(5,2),
  causa_principal_tipo VARCHAR(100),
  causa_principal_correlacion INTEGER,
  causa_principal_desvio VARCHAR(20),
  causa_principal_detalle TEXT,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);
```

## Creating New Data Hooks

### Template for New Hook

```typescript
// hooks/useYourData.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface YourDataType {
  // Define your data structure
  field1: string;
  field2: number;
}

export function useYourData() {
  const [data, setData] = useState<YourDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const { data: result, error: fetchError } = await supabase
          .from("your_table_name")
          .select("*")
          .single(); // or .limit() or add filters

        if (fetchError) throw fetchError;

        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch"));
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
```

### Using Filters with Hooks

To filter data based on navigation state:

```typescript
export function useParametrosOptimos(filters: NavigationState) {
  // ... useState declarations

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
          .from("tab_parametros_optimos")
          .select("*");

        // Apply filters
        if (filters.canal) {
          query = query.eq("canal", filters.canal);
        }
        if (filters.geografia) {
          query = query.eq("geografia", filters.geografia);
        }
        // ... more filters

        const { data: result, error: fetchError } = await query.single();

        if (fetchError) throw fetchError;
        setData(result);
      } catch (err) {
        // ... error handling
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [filters.canal, filters.geografia]); // Re-fetch when filters change

  return { data, loading, error };
}
```

## Best Practices

### 1. Error Handling
Always show user-friendly error messages:
```tsx
{error && (
  <div className="bg-error-50 border border-error-200 rounded-lg p-4">
    <p className="text-sm text-error-700">
      {error.message}
    </p>
  </div>
)}
```

### 2. Loading States
Provide visual feedback while loading:
```tsx
{loading ? (
  <SkeletonLoader />
) : (
  <ActualContent />
)}
```

### 3. Fallback Data
Always provide fallback data for better UX:
```typescript
const displayData = data || fallbackData;
```

### 4. Memoization
Use React.memo and useMemo for performance:
```typescript
const processedData = useMemo(() => {
  return data ? transformData(data) : fallbackData;
}, [data]);
```

### 5. Refresh Mechanism
Add ability to refresh data:
```typescript
const { data, loading, error, refetch } = useParametrosOptimos();

<button onClick={refetch}>Refresh</button>
```

## Database Schema Recommendations

### Add Indexes
For better query performance:
```sql
CREATE INDEX idx_parametros_canal ON gonac.tab_parametros_optimos(canal);
CREATE INDEX idx_parametros_geografia ON gonac.tab_parametros_optimos(geografia);
CREATE INDEX idx_parametros_fecha ON gonac.tab_parametros_optimos(fecha);
```

### Add Timestamps
Track when data was last updated:
```sql
ALTER TABLE gonac.tab_parametros_optimos 
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
```

### Add Computed Columns
For frequently calculated values:
```sql
ALTER TABLE gonac.tab_parametros_optimos
ADD COLUMN dias_inventario_desviacion AS 
  ((dias_inventario_real - dias_inventario_optimo) / dias_inventario_optimo * 100);
```

## Testing Data Integration

### Manual Testing
1. Check browser Network tab for API calls
2. Verify data structure matches interface
3. Test with missing/null data
4. Test error scenarios (disconnect internet)

### Example Test Data
```sql
INSERT INTO gonac.tab_parametros_optimos (
  dias_inventario_optimo,
  dias_inventario_real,
  punto_reorden_optimo,
  punto_reorden_real,
  tamano_pedido_optimo,
  tamano_pedido_real,
  frecuencia_optima,
  frecuencia_real
) VALUES (
  45, 52,
  120, 150,
  500, 600,
  7, 10
);
```

## Troubleshooting

### Issue: "relation does not exist"
**Solution:** Verify table name and schema. Use fully qualified name: `gonac.tab_parametros_optimos`

### Issue: "permission denied"
**Solution:** Check Supabase RLS policies. Enable read access for anon users if needed.

### Issue: Data not updating
**Solution:** Check useEffect dependencies and ensure re-fetching triggers on state changes.

### Issue: Slow queries
**Solution:** Add database indexes on frequently queried columns.

## Next Steps

1. **Add Historical Data:** Modify hook to accept date range parameters
2. **Implement Real-time Updates:** Use Supabase subscriptions for live data
3. **Add Caching:** Implement React Query or SWR for better data management
4. **Add Pagination:** For large datasets, implement cursor-based pagination
5. **Add Aggregations:** Calculate totals, averages directly in database queries



