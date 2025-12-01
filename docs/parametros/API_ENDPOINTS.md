# 🔌 API Endpoints - Parámetros Óptimos

Documentación completa de todos los endpoints disponibles para el módulo de Parámetros Óptimos.

---

## 📍 Base URL

```
http://localhost:3000/api/parametros
```

---

## 🎯 Endpoints

### 1. Vista Detallada con Status

Obtiene comparación detallada por SKU-Tienda con código de colores.

```http
GET /api/parametros?view=detalle
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | No | `detalle` (default) |
| `id_store` | number | No | ID de tienda |
| `sku` | number | No | SKU específico |
| `category` | string | No | Categoría de producto |
| `brand` | string | No | Marca |
| `segment` | string | No | Segmento (Hot, Balanceadas, Slow) |
| `region` | string | No | Región geográfica |
| `ranking_limit` | number | No | Limitar resultados |
| `min_impacto` | number | No | Impacto mínimo en MXN |
| `tendencia` | string | No | Tendencia específica |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_store": 123,
      "sku": 456,
      "category": "Lacteos",
      "brand": "Marca X",
      "store_name": "Supercito Centro",
      "region": "Norte",
      "segment": "Hot",
      "fecha_ultimo_calculo": "2024-11-30",
      
      "optimo_dias_inventario": 12.5,
      "real_dias_inventario": 15.8,
      "desviacion_dias_inventario": 3.3,
      "desviacion_dias_inventario_pct": 26.4,
      "status_dias_inventario": "red",
      
      "optimo_punto_reorden": 50,
      "real_punto_reorden": 45,
      "desviacion_punto_reorden": -5,
      "desviacion_punto_reorden_pct": -10.0,
      "status_punto_reorden": "yellow",
      
      "impacto": 12500,
      "impacto_formatted": "$12,500",
      "valor_oportunidad_dias_inventario": 5000,
      "valor_oportunidad_tamano_pedido": 4500,
      "valor_oportunidad_frecuencia": 3000,
      "valor_oportunidad_total_formatted": "$12,500",
      
      "ventas_totales_pesos": 45000,
      "ventas_totales_pesos_formatted": "$45,000",
      "sell_through_pct": 85.5,
      
      "ranking_desviacion": 1
    }
  ],
  "resumen": {
    "total": 100,
    "green": 60,
    "yellow": 25,
    "red": 15,
    "green_pct": 60,
    "yellow_pct": 25,
    "red_pct": 15
  },
  "total": 100,
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Ejemplos:**

```bash
# Top 10 SKUs críticos
curl "http://localhost:3000/api/parametros?view=detalle&ranking_limit=10"

# SKUs Hot con impacto > $5000
curl "http://localhost:3000/api/parametros?view=detalle&segment=Hot&min_impacto=5000"

# Categoría Lacteos en región Norte
curl "http://localhost:3000/api/parametros?view=detalle&category=Lacteos&region=Norte"
```

---

### 2. Dashboard Consolidado

Obtiene vista ejecutiva completa con todas las agregaciones.

```http
GET /api/parametros?view=dashboard
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | Sí | `dashboard` |

**Response:**

```json
{
  "global": {
    "total_tiendas": 127,
    "total_skus": 9,
    "total_combinaciones_sku_tienda": 1143,
    "optimo_dias_inventario": 12.5,
    "real_dias_inventario": 15.2,
    "desviacion_dias_inventario_pct": 21.6,
    "impacto": 450000,
    "ventas_totales_pesos": 1300000,
    "sell_through_pct": 78.5
  },
  "porTienda": [
    {
      "id_store": 101,
      "store_name": "Supercito Centro",
      "segment": "Hot",
      "region": "Norte",
      "total_skus": 9,
      "impacto": 25000,
      "desviacion_total_promedio": 18.5
    }
  ],
  "topDesviaciones": [
    {
      "id_store": 123,
      "sku": 456,
      "store_name": "Supercito Norte",
      "ranking_desviacion": 1,
      "desviacion_dias_inventario_pct": 45.2,
      "impacto": 18000
    }
  ],
  "topImpacto": [
    {
      "id_store": 105,
      "sku": 789,
      "store_name": "Supercito Sur",
      "impacto": 22000,
      "valor_oportunidad_dias_inventario": 12000
    }
  ],
  "resumenStatus": {
    "total": 1143,
    "green": 686,
    "yellow": 286,
    "red": 171,
    "green_pct": 60,
    "yellow_pct": 25,
    "red_pct": 15
  },
  "ultimaActualizacion": "2024-11-30"
}
```

**Ejemplos:**

```bash
curl "http://localhost:3000/api/parametros?view=dashboard"
```

---

### 3. Vista por Tienda

Obtiene comparación agregada a nivel tienda.

```http
GET /api/parametros?view=tienda
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | Sí | `tienda` |
| `id_store` | number | No | Tienda específica |
| `segment` | string | No | Segmento (Hot, Balanceadas, Slow) |
| `region` | string | No | Región geográfica |
| `ranking_limit` | number | No | Top N tiendas |
| `min_impacto` | number | No | Impacto mínimo |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_store": 101,
      "store_name": "Supercito Centro",
      "region": "Norte",
      "segment": "Hot",
      "total_skus": 9,
      "optimo_dias_inventario": 12.3,
      "real_dias_inventario": 15.7,
      "desviacion_dias_inventario_pct": 27.6,
      "impacto": 25000,
      "ventas_totales_pesos": 120000,
      "sell_through_pct": 82.3
    }
  ],
  "total": 10,
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Ejemplos:**

```bash
# Top 10 tiendas por impacto
curl "http://localhost:3000/api/parametros?view=tienda&ranking_limit=10"

# Tiendas Hot en región Norte
curl "http://localhost:3000/api/parametros?view=tienda&segment=Hot&region=Norte"

# Tienda específica
curl "http://localhost:3000/api/parametros?view=tienda&id_store=101"
```

---

### 4. Vista Global

Obtiene métricas consolidadas globales.

```http
GET /api/parametros?view=global
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | Sí | `global` |

**Response:**

```json
{
  "success": true,
  "data": {
    "total_tiendas": 127,
    "total_skus": 9,
    "total_combinaciones_sku_tienda": 1143,
    "optimo_dias_inventario": 12.5,
    "real_dias_inventario": 15.2,
    "desviacion_dias_inventario": 2.7,
    "desviacion_dias_inventario_pct": 21.6,
    "optimo_punto_reorden": 48.5,
    "real_punto_reorden": 52.3,
    "desviacion_punto_reorden_pct": 7.8,
    "optimo_tamano_pedido": 125.0,
    "real_tamano_pedido": 110.5,
    "desviacion_tamano_pedido_pct": -11.6,
    "optimo_frecuencia": 7.5,
    "real_frecuencia": 8.2,
    "desviacion_frecuencia_pct": 9.3,
    "impacto": 450000,
    "ventas_totales_pesos": 1300000,
    "ventas_totales_unidades": 45000,
    "sell_through_pct": 78.5,
    "fecha_ultimo_calculo": "2024-11-30"
  },
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Ejemplos:**

```bash
curl "http://localhost:3000/api/parametros?view=global"
```

---

### 5. Distribución por Segmento

Obtiene agregación por segmento de tienda.

```http
GET /api/parametros?view=segmento
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | Sí | `segmento` |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "segment": "Hot",
      "count": 45,
      "impacto_total": 250000
    },
    {
      "segment": "Balanceadas",
      "count": 60,
      "impacto_total": 150000
    },
    {
      "segment": "Slow",
      "count": 22,
      "impacto_total": 50000
    }
  ],
  "total": 3,
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Ejemplos:**

```bash
curl "http://localhost:3000/api/parametros?view=segmento"
```

---

### 6. Tabla Base de Parámetros

Obtiene datos de la tabla base sin agregaciones.

```http
GET /api/parametros?view=base
```

**Query Parameters:**

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `view` | string | Sí | `base` |
| `id_store` | number | No | ID de tienda |
| `sku` | number | No | SKU específico |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id_store": 101,
      "sku": 456,
      "dias_inventario_optimo": 12.5,
      "dias_inventario_real": 15.8,
      "punto_reorden": 50,
      "punto_reorden_real": 45,
      "tamano_pedido_optimo": 125,
      "tamano_pedido_real": 110,
      "frecuencia_optima": 7.5,
      "frecuencia_real": 8.2,
      "demanda_promedio_diaria": 15.5,
      "desviacion_estandar_diaria": 3.2,
      "stock_seguridad": 25,
      "stock_exhibicion": 10,
      "lead_time": 10,
      "z_score": 1.65,
      "dias_exhibicion": 5,
      "fecha_calculo": "2024-11-30",
      "inserted_at": "2024-11-30T08:00:00",
      "updated_at": "2024-11-30T08:00:00"
    }
  ],
  "total": 1143,
  "timestamp": "2024-12-01T10:30:00.000Z"
}
```

**Ejemplos:**

```bash
# Todos los parámetros
curl "http://localhost:3000/api/parametros?view=base"

# Parámetros de tienda específica
curl "http://localhost:3000/api/parametros?view=base&id_store=101"

# Parámetros de SKU específico
curl "http://localhost:3000/api/parametros?view=base&sku=456"
```

---

## 🎨 Código de Status

Los endpoints con `view=detalle` incluyen campos de status con código de colores:

```typescript
type StatusColor = 'green' | 'yellow' | 'red';

// Lógica:
if (Math.abs(desviacion_pct) <= 5) return 'green';
if (Math.abs(desviacion_pct) <= 10) return 'yellow';
return 'red';
```

**Campos de status:**
- `status_dias_inventario`
- `status_punto_reorden`
- `status_tamano_pedido`
- `status_frecuencia`

---

## 📊 Campos Formateados

Los endpoints incluyen versiones formateadas de valores clave:

```json
{
  "ventas_totales_pesos": 45000,
  "ventas_totales_pesos_formatted": "$45,000",
  
  "impacto": 12500,
  "impacto_formatted": "$12,500",
  
  "desviacion_dias_inventario_pct": 26.4,
  "desviacion_dias_inventario_pct_formatted": "26.4%"
}
```

---

## 🚨 Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid parameter: ranking_limit must be a number"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Error fetching comparacion optimo real: [error message]"
}
```

---

## 💡 Tips de Uso

### 1. Combinar filtros para drill-down

```bash
# Nivel 1: Ver todas las tiendas Hot
/api/parametros?view=tienda&segment=Hot

# Nivel 2: Ver detalle de tienda específica
/api/parametros?view=detalle&id_store=101

# Nivel 3: Ver SKU específico en esa tienda
/api/parametros?view=base&id_store=101&sku=456
```

### 2. Usar min_impacto para priorizar

```bash
# Solo oportunidades > $10K
/api/parametros?view=detalle&min_impacto=10000&ranking_limit=20
```

### 3. Dashboard + Drill-down

```bash
# 1. Obtener dashboard
/api/parametros?view=dashboard

# 2. Usuario hace click en tienda del top 10
/api/parametros?view=detalle&id_store=101

# 3. Usuario hace click en SKU específico
/api/parametros?view=base&id_store=101&sku=456
```

---

## 🔄 Refresh de Datos

Los datos se actualizan mediante el ETL de Airflow. Para obtener la última fecha de actualización:

```bash
curl "http://localhost:3000/api/parametros?view=global"

# Response incluye:
{
  "data": {
    "fecha_ultimo_calculo": "2024-11-30"
  }
}
```

O desde el dashboard:

```bash
curl "http://localhost:3000/api/parametros?view=dashboard"

# Response incluye:
{
  "ultimaActualizacion": "2024-11-30"
}
```

---

## 📚 Referencias

- **Repository:** `src/repositories/parametros.repository.ts`
- **Service:** `src/services/parametros.service.ts`
- **Types:** `src/types/parametros.ts`
- **Hooks:** `src/hooks/useParametros.ts`

---

**Última actualización:** 2024-12-01

