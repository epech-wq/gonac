# 📊 Módulo de Parámetros Óptimos

Implementación completa para **Épica 2: Cálculo de Parámetros Óptimos e Indicadores**

## 📋 User Stories Cubiertas

### ✅ US-2.1: Cálculo automático de parámetros óptimos
- Parámetros óptimos calculados por ETL de Airflow
- 4 parámetros principales: Días Inventario, Punto Reorden, Tamaño Pedido, Frecuencia
- Fecha de último cálculo disponible
- Datos base para explicación del agente Vemio

### ✅ US-2.2: Cálculo de indicadores de desempeño
- 5 indicadores clave: Ventas (unidades/valor), Sell Through, Días de Inventario, Tasa de Agotados
- Distribución Numérica → **En backlog**
- Indicadores actualizados con cada carga de datos

### ✅ US-2.3: Visualización consolidada
- Navegación por Eje Cliente (Región, Segmento, Tienda)
- Navegación por Eje Producto (Categoría, Marca, SKU)
- Drill-down con múltiples niveles de agregación
- Código de colores automático (verde/amarillo/rojo)

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│   React Components  │
│   (useParametros)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   API Route         │
│   /api/parametros   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  ParametrosService  │
│  (Business Logic)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ ParametrosRepository│
│  (Database Layer)   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────┐
│         Supabase (PostgreSQL)           │
│                                         │
│  • tab_parametros_optimos               │
│  • vw_comparacion_optimo_real           │
│  • vw_comparacion_optimo_real_tienda    │
│  • vw_comparacion_optimo_real_global    │
└─────────────────────────────────────────┘
```

---

## 📁 Archivos Creados

### Core Files
```
✅ src/types/parametros.ts                   # TypeScript types
✅ src/repositories/parametros.repository.ts # Database layer
✅ src/services/parametros.service.ts        # Business logic
✅ src/app/api/parametros/route.ts          # API endpoint
✅ src/hooks/useParametros.ts               # React hooks
```

### Documentation
```
✅ docs/parametros/README_PARAMETROS.md     # This file
✅ docs/parametros/API_ENDPOINTS.md         # API documentation
```

---

## 🚀 Quick Start

### 1. Verificar que el ETL esté corriendo

Los datos se calculan automáticamente por el ETL de Airflow. Verifica que las tablas tengan datos:

```sql
-- Verificar datos en tabla base
SELECT COUNT(*) FROM gonac.tab_parametros_optimos;

-- Verificar última fecha de cálculo
SELECT MAX(fecha_calculo) FROM gonac.tab_parametros_optimos;

-- Verificar vistas
SELECT COUNT(*) FROM gonac.vw_comparacion_optimo_real;
```

### 2. Probar el API

```bash
# Vista detallada con status de colores
curl http://localhost:3000/api/parametros?view=detalle

# Dashboard consolidado
curl http://localhost:3000/api/parametros?view=dashboard

# Vista por tienda
curl http://localhost:3000/api/parametros?view=tienda

# Vista global
curl http://localhost:3000/api/parametros?view=global

# Con filtros
curl http://localhost:3000/api/parametros?view=detalle&segment=Hot&ranking_limit=10
```

### 3. Usar en Componentes React

```tsx
import { useParametros, useParametrosDashboard } from '@/hooks/useParametros';

function MiComponente() {
  // Opción 1: Vista detallada con filtros
  const { parametros, resumen, isLoading } = useParametros({
    segment: 'Hot',
    ranking_limit: 20
  });

  // Opción 2: Dashboard completo
  const { dashboard, isLoading: dashboardLoading } = useParametrosDashboard();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Resumen de Status</h2>
      <div>✅ Verde: {resumen?.green}</div>
      <div>⚠️ Amarillo: {resumen?.yellow}</div>
      <div>🚨 Rojo: {resumen?.red}</div>

      <h2>SKUs Críticos</h2>
      {parametros?.map(p => (
        <div key={`${p.id_store}-${p.sku}`}>
          {p.store_name} - SKU {p.sku}: {p.desviacion_dias_inventario_pct_formatted}
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Código de Colores (Status)

El sistema calcula automáticamente el status de color basado en la desviación porcentual:

| Color | Criterio | Significado |
|-------|----------|-------------|
| 🟢 **Verde** | Desviación ≤ 5% | Cumplimiento óptimo |
| 🟡 **Amarillo** | Desviación > 5% y ≤ 10% | Alerta - requiere atención |
| 🔴 **Rojo** | Desviación > 10% | Crítico - acción inmediata |

---

## 🎯 Vistas Disponibles

### 1. Vista Detallada (`view=detalle`)

**Uso:** Análisis granular por SKU-Tienda

```typescript
GET /api/parametros?view=detalle&segment=Hot&ranking_limit=10

Response:
{
  success: true,
  data: ComparacionOptimoRealFormatted[],
  resumen: {
    total: 100,
    green: 60,
    yellow: 25,
    red: 15,
    green_pct: 60,
    yellow_pct: 25,
    red_pct: 15
  },
  total: 100,
  timestamp: "2024-12-01T..."
}
```

**Campos clave:**
- `status_dias_inventario`, `status_punto_reorden`, etc. (colores)
- `desviacion_*_pct` (porcentajes de desviación)
- `impacto` (valor monetario de oportunidad)
- `ranking_desviacion` (ordenado por criticidad)

### 2. Dashboard Consolidado (`view=dashboard`)

**Uso:** Vista ejecutiva completa

```typescript
GET /api/parametros?view=dashboard

Response:
{
  global: ComparacionOptimoRealGlobal,
  porTienda: ComparacionOptimoRealTienda[],
  topDesviaciones: ComparacionOptimoReal[],
  topImpacto: ComparacionOptimoReal[],
  resumenStatus: ResumenPorStatus,
  ultimaActualizacion: "2024-12-01"
}
```

**Componentes:**
- `global`: Métricas agregadas de toda la operación
- `porTienda`: Top 10 tiendas por impacto
- `topDesviaciones`: Top 20 SKUs con mayor desviación
- `topImpacto`: Top 20 oportunidades por valor monetario

### 3. Vista por Tienda (`view=tienda`)

**Uso:** Agregación a nivel tienda

```typescript
GET /api/parametros?view=tienda&region=Norte&ranking_limit=5

Response:
{
  success: true,
  data: ComparacionOptimoRealTienda[],
  total: 5,
  timestamp: "2024-12-01T..."
}
```

### 4. Vista Global (`view=global`)

**Uso:** Métricas consolidadas globales

```typescript
GET /api/parametros?view=global

Response:
{
  success: true,
  data: {
    total_tiendas: 127,
    total_skus: 9,
    total_combinaciones_sku_tienda: 1143,
    optimo_dias_inventario: 12.5,
    real_dias_inventario: 15.2,
    desviacion_dias_inventario_pct: 21.6,
    impacto: 450000,
    ...
  }
}
```

### 5. Vista por Segmento (`view=segmento`)

**Uso:** Distribución por segmento de tienda

```typescript
GET /api/parametros?view=segmento

Response:
{
  success: true,
  data: [
    { segment: "Hot", count: 45, impacto_total: 250000 },
    { segment: "Balanceadas", count: 60, impacto_total: 150000 },
    { segment: "Slow", count: 22, impacto_total: 50000 }
  ]
}
```

---

## 🔍 Filtros Disponibles

Todos los endpoints soportan los siguientes filtros:

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `id_store` | number | Filtrar por tienda específica | `?id_store=123` |
| `sku` | number | Filtrar por SKU específico | `?sku=456` |
| `category` | string | Filtrar por categoría | `?category=Lacteos` |
| `brand` | string | Filtrar por marca | `?brand=MarcaX` |
| `segment` | string | Filtrar por segmento | `?segment=Hot` |
| `region` | string | Filtrar por región | `?region=Norte` |
| `ranking_limit` | number | Limitar resultados | `?ranking_limit=10` |
| `min_impacto` | number | Impacto mínimo en pesos | `?min_impacto=1000` |
| `tendencia` | string | Filtrar por tendencia | `?tendencia=sobre` |

**Ejemplos combinados:**

```bash
# Top 10 tiendas Hot con impacto > 5000
/api/parametros?view=tienda&segment=Hot&min_impacto=5000&ranking_limit=10

# SKUs de categoría Lacteos en región Norte
/api/parametros?view=detalle&category=Lacteos&region=Norte

# Dashboard de tiendas Slow
/api/parametros?view=dashboard (filtrar después en el servicio)
```

---

## 📈 Campos Clave por Vista

### Tabla Base: `tab_parametros_optimos`
- `dias_inventario_optimo`, `dias_inventario_real`
- `punto_reorden`, `punto_reorden_real`
- `tamano_pedido_optimo`, `tamano_pedido_real`
- `frecuencia_optima`, `frecuencia_real`
- `demanda_promedio_diaria`, `desviacion_estandar_diaria`
- `stock_seguridad`, `stock_exhibicion`
- `lead_time`, `z_score`, `dias_exhibicion`

### Vista Detalle: `vw_comparacion_optimo_real`
**Dimensiones:**
- `category`, `brand`, `store_name`, `region`, `segment`

**Parámetros:**
- `optimo_*` vs `real_*` (4 parámetros)

**Desviaciones:**
- `desviacion_*` (absoluta)
- `desviacion_*_pct` (porcentual) ← **Usado para código de colores**

**Valores monetarios:**
- `valor_oportunidad_*` (cuánto se puede ganar cerrando la brecha)
- `impacto` (suma total de oportunidad)

**Otros:**
- `gap_*` (brecha entre óptimo y real)
- `tendencia_*` (texto: "sobre", "bajo", etc.)
- `ranking_desviacion` (orden de criticidad)

---

## 💡 Casos de Uso

### Caso 1: Identificar tiendas críticas

```tsx
const { tiendas } = useParametrosPorTienda({
  segment: 'Hot',
  min_impacto: 10000,
  ranking_limit: 10
});

// Tiendas Hot con mayor oportunidad de mejora (>$10K)
```

### Caso 2: Análisis por categoría

```tsx
const { parametros } = useParametros({
  category: 'Lacteos',
  ranking_limit: 20
});

// Top 20 SKUs de Lacteos con desviaciones
```

### Caso 3: Dashboard ejecutivo

```tsx
const { dashboard } = useParametrosDashboard();

// Vista completa:
// - Métricas globales
// - Top tiendas
// - Top oportunidades
// - Resumen por status
```

### Caso 4: Monitoreo de segmento específico

```tsx
const { parametros, resumen } = useParametros({
  segment: 'Slow',
  tendencia: 'sobre'
});

// SKUs Slow con inventario sobre el óptimo
// Resumen: cuántos están en verde/amarillo/rojo
```

---

## 🎨 Componente de Ejemplo

Ver: `docs/parametros/COMPONENT_EXAMPLE.md`

---

## 🔄 Próximos Pasos

### Fase 1: ✅ Completado
- [x] Types definidos
- [x] Repository implementado
- [x] Service con lógica de negocio
- [x] API endpoint funcional
- [x] Hooks de React

### Fase 2: Por implementar
- [ ] Componente UI de dashboard
- [ ] Navegación jerárquica (drill-down/drill-up)
- [ ] Exportar a Excel
- [ ] Gráficos de tendencias
- [ ] Breadcrumb de navegación

### Fase 3: Agente Vemio
- [ ] Explicar cálculo de parámetros en lenguaje natural
- [ ] Interpretar tendencias y anomalías
- [ ] Cambiar temporalidad con comandos de voz/texto

### Backlog
- [ ] Distribución Numérica (nuevo indicador)
- [ ] Vistas por Canal y Geografía
- [ ] Comparativo vs período anterior
- [ ] Proyección al cierre

---

## 🐛 Troubleshooting

### Error: "No data returned from comparacion global"

**Causa:** La vista global está vacía o no devuelve un registro único.

**Solución:**
```sql
-- Verificar estructura de la vista
SELECT * FROM gonac.vw_comparacion_optimo_real_global;

-- Si devuelve múltiples filas, ajustar el repository para agregar
```

### Error: "Error fetching parametros optimos"

**Causa:** Problema de permisos o tabla vacía.

**Solución:**
```sql
-- Verificar permisos
GRANT SELECT ON gonac.tab_parametros_optimos TO authenticated;

-- Verificar datos
SELECT COUNT(*) FROM gonac.tab_parametros_optimos;
```

### Error: Status siempre "green"

**Causa:** Las desviaciones porcentuales están en formato decimal (0.05 en vez de 5).

**Solución:** Ya manejado en el service - usa `Math.abs(desviacion_pct)` directamente.

---

## 📚 Referencias

- **Epic:** Épica 2 - Cálculo de Parámetros Óptimos e Indicadores
- **US-2.1:** Cálculo automático de parámetros óptimos
- **US-2.2:** Cálculo de indicadores de desempeño
- **US-2.3:** Visualización consolidada

---

## 👥 Soporte

Si tienes dudas sobre la implementación, revisa:
1. `docs/parametros/API_ENDPOINTS.md` - Documentación completa de API
2. `docs/parametros/COMPONENT_EXAMPLE.md` - Ejemplos de componentes
3. `src/hooks/useParametros.ts` - Implementación de hooks

---

**Última actualización:** 2024-12-01
**Versión:** 1.0.0

