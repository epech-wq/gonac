# 🚀 Quick Start - Módulo de Parámetros Óptimos

Guía rápida para empezar a usar el módulo en **5 minutos**.

---

## ✅ Paso 1: Verificar Datos en Supabase

Asegúrate de que el ETL de Airflow haya llenado las tablas:

```sql
-- Contar registros en tabla base
SELECT COUNT(*) as total_registros 
FROM gonac.tab_parametros_optimos;

-- Ver última fecha de cálculo
SELECT MAX(fecha_calculo) as ultima_actualizacion 
FROM gonac.tab_parametros_optimos;

-- Ver muestra de datos
SELECT * FROM gonac.vw_comparacion_optimo_real 
LIMIT 5;
```

**Esperado:** Deberías ver registros con fecha reciente.

---

## ✅ Paso 2: Probar el API

Arranca tu servidor de desarrollo:

```bash
npm run dev
# o
pnpm dev
```

Prueba los endpoints:

```bash
# Dashboard completo
curl http://localhost:3000/api/parametros?view=dashboard | jq

# Vista detallada (top 10 críticos)
curl "http://localhost:3000/api/parametros?view=detalle&ranking_limit=10" | jq

# Vista global
curl http://localhost:3000/api/parametros?view=global | jq
```

**Esperado:** JSON con datos estructurados.

---

## ✅ Paso 3: Crear una Página con el Dashboard

Crea una nueva página en tu app:

```tsx
// app/parametros/page.tsx
import ParametrosDashboard from '@/components/parametros/ParametrosDashboard';

export default function ParametrosPage() {
  return (
    <div className="container mx-auto p-6">
      <ParametrosDashboard />
    </div>
  );
}
```

Visita: `http://localhost:3000/parametros`

**Esperado:** Dashboard completo con métricas, tablas y códigos de color.

---

## 📊 Ejemplos de Uso

### Ejemplo 1: Dashboard Ejecutivo

```tsx
import { useParametrosDashboard } from '@/hooks/useParametros';

export default function ExecutiveDashboard() {
  const { dashboard, isLoading } = useParametrosDashboard();

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div className="space-y-6">
      {/* Métricas Globales */}
      <div className="grid grid-cols-4 gap-4">
        <KPI 
          label="Total Tiendas" 
          value={dashboard?.global.total_tiendas} 
        />
        <KPI 
          label="Total SKUs" 
          value={dashboard?.global.total_skus} 
        />
        <KPI 
          label="Impacto Total" 
          value={dashboard?.global.impacto} 
          format="currency" 
        />
        <KPI 
          label="Sell Through" 
          value={dashboard?.global.sell_through_pct} 
          format="percentage" 
        />
      </div>

      {/* Resumen por Status */}
      <div className="grid grid-cols-3 gap-4">
        <StatusCard 
          color="green" 
          count={dashboard?.resumenStatus.green} 
          percentage={dashboard?.resumenStatus.green_pct} 
        />
        <StatusCard 
          color="yellow" 
          count={dashboard?.resumenStatus.yellow} 
          percentage={dashboard?.resumenStatus.yellow_pct} 
        />
        <StatusCard 
          color="red" 
          count={dashboard?.resumenStatus.red} 
          percentage={dashboard?.resumenStatus.red_pct} 
        />
      </div>

      {/* Top Tiendas */}
      <div>
        <h2>Top 10 Tiendas por Impacto</h2>
        <table>
          <thead>
            <tr>
              <th>Tienda</th>
              <th>Impacto</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dashboard?.porTienda.map(t => (
              <tr key={t.id_store}>
                <td>{t.store_name}</td>
                <td>${t.impacto?.toLocaleString()}</td>
                <td>
                  <StatusBadge 
                    desviacion={t.desviacion_total_promedio} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

### Ejemplo 2: Vista Filtrada por Segmento

```tsx
import { useParametros } from '@/hooks/useParametros';

export default function HotStoreAnalysis() {
  const { parametros, resumen, isLoading } = useParametros({
    segment: 'Hot',
    ranking_limit: 20,
    min_impacto: 5000
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Análisis de Tiendas HOT</h1>
      
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>✅ Cumplimiento: {resumen?.green}</div>
        <div>⚠️ Alerta: {resumen?.yellow}</div>
        <div>🚨 Crítico: {resumen?.red}</div>
      </div>

      {/* Lista de SKUs críticos */}
      <table>
        <thead>
          <tr>
            <th>Tienda</th>
            <th>SKU</th>
            <th>Desviación</th>
            <th>Impacto</th>
          </tr>
        </thead>
        <tbody>
          {parametros?.map(p => (
            <tr key={`${p.id_store}-${p.sku}`}>
              <td>{p.store_name}</td>
              <td>{p.sku}</td>
              <td>
                <span className={`badge-${p.status_dias_inventario}`}>
                  {p.desviacion_dias_inventario_pct_formatted}
                </span>
              </td>
              <td>{p.impacto_formatted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

### Ejemplo 3: Drill-down por Tienda

```tsx
'use client';

import { useState } from 'react';
import { useParametrosPorTienda, useParametros } from '@/hooks/useParametros';

export default function StoreDrillDown() {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  // Nivel 1: Lista de tiendas
  const { tiendas } = useParametrosPorTienda({
    segment: 'Hot',
    ranking_limit: 10
  });

  // Nivel 2: Detalle de tienda seleccionada
  const { parametros: storeDetail } = useParametros({
    id_store: selectedStore || undefined
  });

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Panel izquierdo: Lista de tiendas */}
      <div>
        <h2>Tiendas HOT</h2>
        <ul>
          {tiendas?.map(t => (
            <li 
              key={t.id_store}
              onClick={() => setSelectedStore(t.id_store)}
              className={selectedStore === t.id_store ? 'selected' : ''}
            >
              <div>{t.store_name}</div>
              <div>Impacto: {t.impacto?.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Panel derecho: Detalle de SKUs */}
      <div>
        {selectedStore ? (
          <>
            <h2>SKUs en Tienda {selectedStore}</h2>
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Desviación</th>
                  <th>Impacto</th>
                </tr>
              </thead>
              <tbody>
                {storeDetail?.map(p => (
                  <tr key={p.sku}>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td>
                      <StatusBadge 
                        desviacion={p.desviacion_dias_inventario_pct} 
                      />
                    </td>
                    <td>{p.impacto_formatted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <div>Selecciona una tienda</div>
        )}
      </div>
    </div>
  );
}
```

---

### Ejemplo 4: Gráfico de Distribución por Segmento

```tsx
import { useDistribucionPorSegmento } from '@/hooks/useParametros';

export default function SegmentDistribution() {
  const { segmentos, isLoading } = useDistribucionPorSegmento();

  if (isLoading) return <div>Cargando...</div>;

  const total = segmentos?.reduce((sum, s) => sum + s.count, 0) || 1;

  return (
    <div>
      <h2>Distribución por Segmento</h2>
      
      {/* Barras de progreso */}
      <div className="space-y-4">
        {segmentos?.map(s => {
          const percentage = (s.count / total) * 100;
          
          return (
            <div key={s.segment}>
              <div className="flex justify-between mb-1">
                <span>{s.segment}</span>
                <span>{s.count} SKUs - ${s.impacto_total.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full" 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {percentage.toFixed(1)}% del total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## 🎨 Componentes Helper

### StatusBadge Component

```tsx
function StatusBadge({ desviacion }: { desviacion: number | null }) {
  if (desviacion === null) return null;
  
  const abs = Math.abs(desviacion);
  const color = abs <= 5 ? 'green' : abs <= 10 ? 'yellow' : 'red';
  
  const bgColor = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  }[color];

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${bgColor}`}>
      {desviacion > 0 ? '+' : ''}{desviacion.toFixed(1)}%
    </span>
  );
}
```

### KPI Card Component

```tsx
function KPI({ 
  label, 
  value, 
  format = 'number' 
}: { 
  label: string; 
  value: number | null | undefined; 
  format?: 'number' | 'currency' | 'percentage';
}) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-MX', {
          style: 'currency',
          currency: 'MXN',
          minimumFractionDigits: 0
        }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('es-MX').format(val);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {value !== null && value !== undefined ? formatValue(value) : 'N/A'}
      </p>
    </div>
  );
}
```

---

## 🔗 Navegación Sugerida

```tsx
// Layout con navegación
export default function ParametrosLayout({ children }) {
  return (
    <div>
      <nav>
        <Link href="/parametros">Dashboard</Link>
        <Link href="/parametros/tiendas">Por Tienda</Link>
        <Link href="/parametros/segmentos">Por Segmento</Link>
        <Link href="/parametros/categorias">Por Categoría</Link>
      </nav>
      
      <main>{children}</main>
    </div>
  );
}
```

---

## 🧪 Testing

### Test API con curl

```bash
# Dashboard completo
curl http://localhost:3000/api/parametros?view=dashboard

# Filtrar por segmento Hot, top 5
curl "http://localhost:3000/api/parametros?view=detalle&segment=Hot&ranking_limit=5"

# Ver tienda específica
curl "http://localhost:3000/api/parametros?view=detalle&id_store=101"

# Ver SKU específico en tienda
curl "http://localhost:3000/api/parametros?view=base&id_store=101&sku=456"
```

### Test con JavaScript

```javascript
// En la consola del navegador
fetch('/api/parametros?view=dashboard')
  .then(r => r.json())
  .then(data => {
    console.log('Total tiendas:', data.global.total_tiendas);
    console.log('Impacto total:', data.global.impacto);
    console.log('Status:', data.resumenStatus);
  });
```

---

## 🎯 Casos de Uso Comunes

### 1. Identificar Tiendas Críticas

```bash
curl "http://localhost:3000/api/parametros?view=tienda&segment=Hot&min_impacto=10000&ranking_limit=5"
```

### 2. Analizar Categoría Específica

```bash
curl "http://localhost:3000/api/parametros?view=detalle&category=Lacteos&ranking_limit=20"
```

### 3. Ver Estado de una Tienda

```bash
curl "http://localhost:3000/api/parametros?view=detalle&id_store=101"
```

### 4. Obtener Distribución por Segmento

```bash
curl "http://localhost:3000/api/parametros?view=segmento"
```

---

## 📚 Siguientes Pasos

1. **Explora el dashboard completo:** 
   - `http://localhost:3000/parametros`

2. **Lee la documentación completa:**
   - `docs/parametros/README_PARAMETROS.md`
   - `docs/parametros/API_ENDPOINTS.md`

3. **Implementa drill-down personalizado:**
   - Ver ejemplos arriba

4. **Agrega gráficos:**
   - Usar Chart.js o Recharts

5. **Exporta a Excel:**
   - Implementar export button

---

## 🐛 Troubleshooting

### Error: "No data returned"

**Solución:** Verifica que el ETL haya llenado las tablas:

```sql
SELECT COUNT(*) FROM gonac.tab_parametros_optimos;
```

### Error: "404 Not Found"

**Solución:** Asegúrate de que el servidor esté corriendo:

```bash
npm run dev
```

### Error: "useParametros is not a function"

**Solución:** Verifica el import:

```tsx
import { useParametros } from '@/hooks/useParametros';
```

---

## ✅ Checklist

- [ ] Datos en Supabase verificados
- [ ] API endpoint funciona
- [ ] Hook `useParametrosDashboard()` funciona
- [ ] Componente `ParametrosDashboard` se renderiza
- [ ] Código de colores funciona correctamente
- [ ] Filtros funcionan según lo esperado

---

¡Listo para producción! 🚀

**Documentación completa:** `docs/parametros/README_PARAMETROS.md`

