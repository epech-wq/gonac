# Historial de Acciones - Usage Guide

This guide explains how to use the newly created acciones (task history) functionality.

## Overview

The acciones module provides access to comprehensive task and action statistics from the `gonac.vw_resumen_acciones` database view.

## Files Created

1. **Types**: `src/types/acciones.ts` - TypeScript type definitions
2. **Repository**: `src/repositories/acciones.repository.ts` - Database operations
3. **Service**: `src/services/acciones.service.ts` - Business logic
4. **API Route**: `src/app/api/acciones/route.ts` - Next.js API endpoint
5. **Hook**: `src/hooks/useAcciones.ts` - React hook for data fetching

## Data Structure

The API returns the following data:

```typescript
interface AccionesResumen {
  total_tareas: number;
  completadas: number;
  activas: number;
  canceladas: number;
  valor_capturado: string;
  roi_promedio: string;
  tasa_exito_pct: string;
  tiempo_promedio_ejecucion_dias: string;
  cantidad_reabasto: number;
  cantidad_exhibicion: number;
  cantidad_promocion: number;
  cantidad_visita: number;
  costo_total_completadas: string;
  total_skus: number;
  monto_total_estimado: string;
  monto_total_real: string;
  roi_promedio_calculado: string;
}
```

## API Endpoints

### GET /api/acciones

Fetch task history summary data or detailed action list.

**Query Parameters:**
- `format`: `'default'` | `'with-metrics'` | `'detalle'` (optional)

**Examples:**

```bash
# Default format (summary)
GET /api/acciones

# With calculated metrics
GET /api/acciones?format=with-metrics

# Detailed action list
GET /api/acciones?format=detalle
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_tareas": 5,
    "completadas": 3,
    "activas": 1,
    "canceladas": 1,
    "valor_capturado": "1719.00",
    "roi_promedio": "2.24",
    "tasa_exito_pct": "75.0",
    "tiempo_promedio_ejecucion_dias": "0.0",
    "cantidad_reabasto": 2,
    "cantidad_exhibicion": 1,
    "cantidad_promocion": 1,
    "cantidad_visita": 1,
    "costo_total_completadas": "488.80",
    "total_skus": 14,
    "monto_total_estimado": "4717.73",
    "monto_total_real": "1719.00",
    "roi_promedio_calculado": "3.52"
  },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### POST /api/acciones/refresh

Manually trigger data refresh.

**Response:**

```json
{
  "success": true,
  "message": "Data refreshed successfully",
  "data": { ... },
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

## React Hook Usage

### Basic Usage (Summary Data)

```tsx
import { useAcciones } from '@/hooks/useAcciones';

function AccionesOverview() {
  const { data, loading, error, refetch } = useAcciones();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="acciones-summary">
      <h2>Historial de Tareas y Acciones</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tareas</h3>
          <p>{data.total_tareas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Completadas</h3>
          <p>{data.completadas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Activas</h3>
          <p>{data.activas}</p>
        </div>
        
        <div className="stat-card">
          <h3>Canceladas</h3>
          <p>{data.canceladas}</p>
        </div>
      </div>

      <div className="financial-metrics">
        <div className="metric">
          <label>Valor Capturado:</label>
          <span>${data.valor_capturado}</span>
        </div>
        
        <div className="metric">
          <label>ROI Promedio:</label>
          <span>{data.roi_promedio}x</span>
        </div>
        
        <div className="metric">
          <label>Tasa de Éxito:</label>
          <span>{data.tasa_exito_pct}%</span>
        </div>
        
        <div className="metric">
          <label>Tiempo Promedio:</label>
          <span>{data.tiempo_promedio_ejecucion_dias} días</span>
        </div>
      </div>

      <div className="action-distribution">
        <h3>Distribución por Tipo</h3>
        <div className="distribution-grid">
          <div>Reabasto: {data.cantidad_reabasto}</div>
          <div>Exhibición: {data.cantidad_exhibicion}</div>
          <div>Promoción: {data.cantidad_promocion}</div>
          <div>Visita: {data.cantidad_visita}</div>
        </div>
      </div>

      <button onClick={refetch}>Refresh Data</button>
    </div>
  );
}
```

### With Calculated Metrics

```tsx
import { useAccionesWithMetrics } from '@/hooks/useAcciones';

function AccionesWithMetrics() {
  const { data, loading, error } = useAccionesWithMetrics();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <h2>Métricas Calculadas</h2>
      
      {/* Original data */}
      <div>Completadas: {data.completadas}</div>
      <div>Valor Capturado: ${data.valor_capturado}</div>
      
      {/* Calculated metrics (if format is 'with-metrics') */}
      <div>Tasa Completado: {data.tasa_completado}%</div>
      <div>Tasa Cancelado: {data.tasa_cancelado}%</div>
      <div>Valor Promedio por Tarea: ${data.valor_promedio_por_tarea}</div>
      <div>Costo Promedio por Tarea: ${data.costo_promedio_por_tarea}</div>
    </div>
  );
}
```

### Detailed Actions List

```tsx
import { useAccionesDetalle } from '@/hooks/useAcciones';

function AccionesDetailTable() {
  const { data, loading, error, refetch } = useAccionesDetalle();

  if (loading) return <div>Cargando acciones...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>;

  return (
    <div className="acciones-detail">
      <div className="header">
        <h2>Historial de Acciones</h2>
        <p>Total: {data.total} acciones</p>
        <button onClick={refetch}>Actualizar</button>
      </div>

      <table className="acciones-table">
        <thead>
          <tr>
            <th>Folio</th>
            <th>Tipo</th>
            <th>Tienda</th>
            <th>Región</th>
            <th>Responsable</th>
            <th>Status</th>
            <th>Prioridad</th>
            <th>SKUs</th>
            <th>Monto Estimado</th>
            <th>Impacto Real</th>
            <th>ROI</th>
            <th>Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((accion) => (
            <tr key={accion.id_accion}>
              <td>{accion.folio}</td>
              <td>{accion.tipo_accion}</td>
              <td>{accion.store_name}</td>
              <td>{accion.region}</td>
              <td>{accion.responsable}</td>
              <td>
                <span className={`badge badge-${accion.status.toLowerCase()}`}>
                  {accion.status}
                </span>
              </td>
              <td>
                <span className={`badge badge-${accion.prioridad.toLowerCase()}`}>
                  {accion.prioridad}
                </span>
              </td>
              <td>{accion.cantidad_skus}</td>
              <td>${accion.monto_estimado}</td>
              <td>{accion.impacto_real ? `$${accion.impacto_real}` : 'N/A'}</td>
              <td>{accion.roi_calculado ? `${accion.roi_calculado}x` : 'N/A'}</td>
              <td>{new Date(accion.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="metadata">
        <small>Última actualización: {new Date(data.timestamp).toLocaleString()}</small>
      </div>
    </div>
  );
}
```

### Detailed Actions with Filtering

```tsx
import { useAccionesDetalle } from '@/hooks/useAcciones';
import { useState, useMemo } from 'react';

function AccionesDetailFiltered() {
  const { data, loading, error } = useAccionesDetalle();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tipoFilter, setTipoFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    return data.data.filter((accion) => {
      const matchesStatus = statusFilter === 'all' || accion.status === statusFilter;
      const matchesTipo = tipoFilter === 'all' || accion.tipo_accion === tipoFilter;
      return matchesStatus && matchesTipo;
    });
  }, [data, statusFilter, tipoFilter]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="filters">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">Todos los Status</option>
          <option value="Completada">Completada</option>
          <option value="Activa">Activa</option>
          <option value="Cancelada">Cancelada</option>
        </select>

        <select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)}>
          <option value="all">Todos los Tipos</option>
          <option value="Reabasto">Reabasto</option>
          <option value="Exhibición">Exhibición</option>
          <option value="Promoción">Promoción</option>
          <option value="Visita">Visita</option>
        </select>
      </div>

      <p>Mostrando {filteredData.length} de {data?.total} acciones</p>

      <table>
        {/* Render filtered data */}
        <tbody>
          {filteredData.map((accion) => (
            <tr key={accion.id_accion}>
              <td>{accion.folio}</td>
              <td>{accion.tipo_accion}</td>
              <td>{accion.status}</td>
              {/* More columns */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Auto-Refresh

```tsx
import { useAcciones } from '@/hooks/useAcciones';

function AccionesWithAutoRefresh() {
  // Refresh every 5 minutes (300000 milliseconds)
  const { data, loading } = useAcciones({
    refreshInterval: 5 * 60 * 1000,
  });

  return (
    <div>
      {loading && <div className="loading-indicator">Updating...</div>}
      {/* Your component UI */}
    </div>
  );
}
```

### Manual Fetch Control

```tsx
import { useAcciones } from '@/hooks/useAcciones';

function AccionesManual() {
  const { data, loading, error, refetch } = useAcciones({
    autoFetch: false, // Don't fetch on mount
  });

  return (
    <div>
      <button onClick={refetch}>Load Data</button>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && (
        <div>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

## Direct API Usage

If you need to call the API directly (e.g., in server-side code):

```typescript
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { AccionesRepository } from '@/repositories/acciones.repository';
import { AccionesService } from '@/services/acciones.service';

async function getAccionesData() {
  const supabase = createServerSupabaseClient();
  const repository = new AccionesRepository(supabase);
  const service = new AccionesService(repository);

  const result = await service.getAccionesResumen();
  return result;
}
```

## Service Layer Methods

The `AccionesService` provides additional utility methods:

```typescript
import { AccionesService } from '@/services/acciones.service';

const service = new AccionesService(repository);

// Format currency
const formatted = service.formatCurrency('1719.00'); // "$1,719.00"

// Format percentage
const percent = service.formatPercentage('75.0'); // "75.0%"

// Calculate additional metrics
const metrics = service.calculateMetrics(data);
// Returns data with additional calculated fields:
// - tasa_completado
// - tasa_cancelado
// - valor_promedio_por_tarea
// - costo_promedio_por_tarea
```

## Testing

You can test the API endpoint directly:

```bash
# Using curl - Summary data
curl http://localhost:3000/api/acciones

# Using curl - With calculated metrics
curl http://localhost:3000/api/acciones?format=with-metrics

# Using curl - Detailed actions list
curl http://localhost:3000/api/acciones?format=detalle

# Refresh data
curl -X POST http://localhost:3000/api/acciones/refresh
```

### Example Response (Detalle Format)

```json
{
  "success": true,
  "data": [
    {
      "id_accion": 7,
      "folio": "TSK-2025-100",
      "tipo_accion": "Reabasto",
      "id_store": 768,
      "store_name": "30014 SUPERCITO LUIS SPOTA BENITO JUAREZ 01-20",
      "region": "01 ZONA V DE M SELECTO",
      "cantidad_skus": 3,
      "monto_estimado": "225.00",
      "responsable": "Juan Pérez",
      "impacto_real": "225.00",
      "fecha_creacion": "2025-11-11 08:00:00",
      "fecha_inicio": "2025-11-11 09:30:00",
      "fecha_completada": "2025-11-11 14:45:00",
      "roi_real": "2.25",
      "tiempo_ejecucion_horas": "1.50",
      "tiempo_ejecucion_dias": "0.06",
      "cantidad_evidencias": 3,
      "notas": "Reabasto completado sin incidencias. Stock verificado.",
      "status": "Completada",
      "prioridad": "Crítica",
      "riesgo_potencial": "225.00",
      "costo_accion": "100.00",
      "roi_calculado": "2.25",
      "dias_desde_creacion": "2.8963774499421296",
      "inserted_at": "2025-11-12 21:09:16.859974",
      "updated_at": "2025-11-12 21:09:16.859974"
    }
  ],
  "total": 1,
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

## Error Handling

All methods include proper error handling:

```tsx
const { data, error } = useAcciones();

if (error) {
  console.error('Failed to load acciones:', error.message);
  // Handle error appropriately
  return <ErrorComponent message={error.message} />;
}
```

## Available Hooks

### Summary Hooks
- `useAcciones()` - Main hook for summary data
- `useAccionesWithMetrics()` - Summary with calculated metrics

### Detail Hook
- `useAccionesDetalle()` - Complete list of all actions with full details

## Field Descriptions (Detalle Format)

| Field | Type | Description |
|-------|------|-------------|
| `id_accion` | number | Unique action identifier |
| `folio` | string | Action tracking number (e.g., "TSK-2025-100") |
| `tipo_accion` | string | Action type (Reabasto, Exhibición, Promoción, Visita) |
| `id_store` | number | Store ID |
| `store_name` | string | Store name |
| `region` | string | Store region |
| `cantidad_skus` | number | Number of SKUs involved |
| `monto_estimado` | string | Estimated amount |
| `responsable` | string | Person responsible |
| `impacto_real` | string\|null | Real impact amount |
| `fecha_creacion` | string | Creation date |
| `fecha_inicio` | string\|null | Start date |
| `fecha_completada` | string\|null | Completion date |
| `roi_real` | string\|null | Real ROI |
| `tiempo_ejecucion_horas` | string\|null | Execution time in hours |
| `tiempo_ejecucion_dias` | string\|null | Execution time in days |
| `cantidad_evidencias` | number | Number of evidence items |
| `notas` | string\|null | Notes |
| `status` | string | Status (Completada, Activa, Cancelada) |
| `prioridad` | string | Priority level (Crítica, Alta, Media, Baja) |
| `riesgo_potencial` | string | Potential risk value |
| `costo_accion` | string | Action cost |
| `roi_calculado` | string\|null | Calculated ROI |
| `dias_desde_creacion` | string | Days since creation |
| `inserted_at` | string | Database insert timestamp |
| `updated_at` | string | Database update timestamp |

## Notes

- Summary data comes from the `gonac.vw_resumen_acciones` database view
- Detailed data comes from the `gonac.vw_detalle_acciones` database view
- All numeric values like `valor_capturado`, `roi_promedio`, etc. are returned as strings from the database
- The hooks automatically handle loading states and errors
- You can enable auto-refresh for real-time updates
- The API route includes both GET and POST methods for flexibility
- Detailed actions are sorted by creation date (most recent first)

