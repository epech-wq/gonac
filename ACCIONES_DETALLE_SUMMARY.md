# Acciones Detalle - Feature Summary

## Overview
Added a new method to retrieve detailed information about individual actions from the `gonac.vw_detalle_acciones` database view.

## Changes Made

### 1. Types (`src/types/acciones.ts`)
**Added:**
- `AccionDetalle` interface with all 25 fields from the database view
- `AccionesDetalleResponse` interface for API responses

```typescript
interface AccionDetalle {
  id_accion: number;
  folio: string;
  tipo_accion: string;
  id_store: number;
  store_name: string;
  region: string;
  cantidad_skus: number;
  monto_estimado: string;
  responsable: string;
  impacto_real: string | null;
  fecha_creacion: string;
  fecha_inicio: string | null;
  fecha_completada: string | null;
  roi_real: string | null;
  tiempo_ejecucion_horas: string | null;
  tiempo_ejecucion_dias: string | null;
  cantidad_evidencias: number;
  notas: string | null;
  status: string;
  prioridad: string;
  riesgo_potencial: string;
  costo_accion: string;
  roi_calculado: string | null;
  dias_desde_creacion: string;
  inserted_at: string;
  updated_at: string;
}
```

### 2. Repository (`src/repositories/acciones.repository.ts`)
**Added:**
- `getAccionesDetalle()` method to fetch all action details
- Queries the `gonac.vw_detalle_acciones` view
- Orders results by `fecha_creacion` (descending - most recent first)

### 3. Service (`src/services/acciones.service.ts`)
**Added:**
- `getAccionesDetalle()` method that wraps the repository call
- Returns data with metadata (total count and timestamp)

### 4. API Route (`src/app/api/acciones/route.ts`)
**Modified:**
- Added support for `format=detalle` query parameter
- Returns the complete list of actions with all fields

**New Endpoint:**
```
GET /api/acciones?format=detalle
```

**Response Structure:**
```json
{
  "success": true,
  "data": [
    {
      "id_accion": 7,
      "folio": "TSK-2025-100",
      "tipo_accion": "Reabasto",
      "store_name": "30014 SUPERCITO LUIS SPOTA...",
      "status": "Completada",
      "prioridad": "Crítica",
      ...
    }
  ],
  "total": 10,
  "timestamp": "2025-11-14T10:30:00.000Z"
}
```

### 5. React Hook (`src/hooks/useAcciones.ts`)
**Added:**
- `useAccionesDetalle()` hook for easy React integration
- Supports all standard hook features:
  - Auto-fetch on mount
  - Manual refetch
  - Loading and error states
  - TypeScript type safety

**Usage:**
```tsx
import { useAccionesDetalle } from '@/hooks/useAcciones';

function MyComponent() {
  const { data, loading, error, refetch } = useAccionesDetalle();
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h2>Total Acciones: {data?.total}</h2>
      {data?.data.map(accion => (
        <div key={accion.id_accion}>
          {accion.folio} - {accion.tipo_accion}
        </div>
      ))}
    </div>
  );
}
```

### 6. Documentation
**Updated:**
- `ACCIONES_USAGE.md` with comprehensive examples
- Added detailed actions table example
- Added filtering example
- Added field descriptions table
- Added example API responses

## Key Features

✅ **Complete Data Access**: All 25 fields from the database view
✅ **Sorted Results**: Most recent actions first
✅ **Type Safety**: Full TypeScript support
✅ **Easy Integration**: React hook for simple usage
✅ **Consistent Pattern**: Follows the same structure as valorizacion module
✅ **Flexible Usage**: Can be used with auto-fetch or manual control
✅ **Error Handling**: Comprehensive error handling throughout
✅ **No Linting Errors**: All code passes linting checks

## Testing

Test the new endpoint:

```bash
# Get detailed actions list
curl http://localhost:3000/api/acciones?format=detalle

# Test in React component
import { useAccionesDetalle } from '@/hooks/useAcciones';
const { data } = useAccionesDetalle();
```

## Example Use Cases

1. **Action Dashboard**: Display all actions in a table
2. **Status Filtering**: Filter by status (Completada, Activa, Cancelada)
3. **Type Filtering**: Filter by action type (Reabasto, Exhibición, etc.)
4. **ROI Analysis**: Analyze ROI across different action types
5. **Performance Tracking**: Monitor execution times and completion rates
6. **Store Analytics**: View actions by store or region

## Database View
Data comes from: `gonac.vw_detalle_acciones`

This view provides comprehensive information about each action including:
- Basic info (folio, type, store)
- Assignment (responsible person)
- Status and priority
- Financial metrics (estimated amount, real impact, ROI)
- Timing (creation, start, completion dates)
- Additional details (SKUs, evidence count, notes)

## Integration Pattern

This implementation follows the exact same pattern as the valorizacion module:

```
Types → Repository → Service → API Route → React Hook
```

This consistency makes it easy for developers to understand and maintain the code.

