# Cambio de Inventario - Database Column Mapping

## Overview
This document describes the mapping between the database view `gonac.vw_simulacion_reabastecimiento` and the UI components in the Cambio de Inventario action.

## Database View: `gonac.vw_simulacion_reabastecimiento`

### Column Mapping

| Database Column | UI Field | Component Location | Status |
|----------------|----------|-------------------|--------|
| `max_dias_inventario_destino` | `maxNivelInventarioDestino` | Simulation Parameters | ✅ Used |
| `costo_logistico_pct` | `costoLogisticoPorcentaje` | Simulation Parameters | ✅ Used |
| `min_unidades_mover_a_tienda` | `minUnidadesMoverA` | Simulation Parameters | ✅ Used |
| `min_unidades_mover_desde_tienda` | `minUnidadesMoverDesde` | Simulation Parameters | ✅ Used |
| `inventario_movilizar_unidades` | `inventarioMovilizarUnidades` | ROI Metrics | ✅ Used |
| `inventario_movilizar_pesos` | `inventarioMovilizarValor` | ROI Metrics | ✅ Used |
| `num_tiendas_origen` | `numTiendasOrigen` | ROI Metrics | ✅ Used |
| `num_tiendas_destino` | `numTiendasDestino` | ROI Metrics | ✅ Used |
| `dias_inventario_critico_inicial` | `diasInventarioCriticasInicial` | Days of Inventory - Critical Stores | ✅ Used |
| `dias_inventario_critico_final` | `diasInventarioCriticasFinal` | Days of Inventory - Critical Stores | ✅ Used |
| `dias_inventario_destino_inicial` | `diasInventarioDestinoInicial` | Days of Inventory - Destination Stores | ✅ Used |
| `dias_inventario_destino_final` | `diasInventarioDestinoFinal` | Days of Inventory - Destination Stores | ✅ Used |
| `costo_iniciativa` | `costoIniciativa` | Cost of Initiative | ✅ Used |

## Summary

✅ **All 13 columns from the view are being used** - No unused columns

## Data Not Available in View

The following UI sections use mock/calculated data because they are not available in the `vw_simulacion_reabastecimiento` view:

### 1. Transferencias Detalladas (Detailed Transfers Table)
- **Status**: Mock data
- **Reason**: The view provides aggregated metrics, not individual transfer records
- **Data Needed**: Individual transfer records with:
  - SKU/Product information
  - Origin store details
  - Destination store details
  - Units and value per transfer
  - Days of inventory before/after per transfer

### 2. Detalle por Tienda (Detail by Store)
- **Status**: Calculated from mock transferencias
- **Reason**: Requires individual transfer records grouped by store
- **Data Needed**: Store-level aggregation of transfers

### 3. Detalle por SKU (Detail by SKU)
- **Status**: Calculated from mock transferencias
- **Reason**: Requires individual transfer records grouped by SKU
- **Data Needed**: SKU-level aggregation of transfers

## Architecture

### Files Created

1. **Types** (`src/types/cambioInventario.ts`)
   - `CambioInventarioSimulacion`: Interface matching database view structure
   - `CambioInventarioResponse`: API response format

2. **Repository** (`src/repositories/cambioInventario.repository.ts`)
   - `getSimulacion()`: Fetches data from `gonac.vw_simulacion_reabastecimiento`

3. **Service** (`src/services/cambioInventario.service.ts`)
   - `getSimulacion()`: Business logic layer

4. **API Route** (`src/app/api/cambio-inventario/route.ts`)
   - `GET /api/cambio-inventario`: REST endpoint

5. **Hook** (`src/hooks/useCambioInventario.ts`)
   - `useCambioInventario()`: React hook for fetching data

### Data Flow

```
React Component (CambioInventarioCard)
    ↓
useCambioInventario Hook
    ↓
GET /api/cambio-inventario
    ↓
CambioInventarioService
    ↓
CambioInventarioRepository
    ↓
gonac.vw_simulacion_reabastecimiento (Supabase)
```

## Future Enhancements

To fully populate the detail views, consider:

1. **Create additional view/table** for individual transfer records:
   - `gonac.detalle_transferencias_inventario` or similar
   - Include: SKU, origin store, destination store, units, value, dates

2. **Add API endpoints** for detail views:
   - `GET /api/cambio-inventario/por-tienda`
   - `GET /api/cambio-inventario/por-sku`
   - `GET /api/cambio-inventario/transferencias`

3. **Update repository** to fetch detailed transfer records when available

## Notes

- The simulation parameters (max_dias_inventario_destino, costo_logistico_pct, etc.) are loaded from the database but can be edited in the UI
- When parameters are changed, the view should be recalculated (this would require a POST endpoint or recalculation trigger)
- Currently, parameter changes are only local to the component and don't trigger database recalculation

