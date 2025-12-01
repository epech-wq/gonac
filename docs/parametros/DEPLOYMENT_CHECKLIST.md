# ✅ Deployment Checklist - Módulo de Parámetros Óptimos

## 📦 Archivos Implementados

### ✅ Core Application Layer (5 archivos)

| # | Archivo | Tamaño | Status | Descripción |
|---|---------|--------|--------|-------------|
| 1 | `src/types/parametros.ts` | ~9 KB | ✅ | Types y interfaces completos |
| 2 | `src/repositories/parametros.repository.ts` | ~7 KB | ✅ | 8 métodos de acceso a datos |
| 3 | `src/services/parametros.service.ts` | ~6 KB | ✅ | Lógica de negocio |
| 4 | `src/app/api/parametros/route.ts` | ~3 KB | ✅ | API endpoint con 6 vistas |
| 5 | `src/hooks/useParametros.ts` | ~3 KB | ✅ | 5 React hooks |

**Total:** ~28 KB de código core

### ✅ UI Components (1 archivo)

| # | Archivo | Tamaño | Status | Descripción |
|---|---------|--------|--------|-------------|
| 6 | `src/components/parametros/ParametrosDashboard.tsx` | ~15 KB | ✅ | Dashboard completo |

### ✅ Documentation (4 archivos)

| # | Archivo | Tamaño | Status | Descripción |
|---|---------|--------|--------|-------------|
| 7 | `docs/parametros/README_PARAMETROS.md` | ~30 KB | ✅ | Guía principal |
| 8 | `docs/parametros/API_ENDPOINTS.md` | ~25 KB | ✅ | Documentación de API |
| 9 | `docs/parametros/QUICK_START.md` | ~15 KB | ✅ | Guía de inicio rápido |
| 10 | `docs/parametros/IMPLEMENTATION_SUMMARY.md` | ~25 KB | ✅ | Resumen de implementación |

**Total:** ~95 KB de documentación

---

## 🎯 Pre-Deployment Checklist

### Base de Datos

- [ ] Verificar que la tabla `gonac.tab_parametros_optimos` tiene datos
  ```sql
  SELECT COUNT(*) FROM gonac.tab_parametros_optimos;
  -- Debe retornar > 0
  ```

- [ ] Verificar que las vistas materializadas funcionan
  ```sql
  SELECT COUNT(*) FROM gonac.vw_comparacion_optimo_real;
  SELECT COUNT(*) FROM gonac.vw_comparacion_optimo_real_tienda;
  SELECT COUNT(*) FROM gonac.vw_comparacion_optimo_real_global;
  -- Todas deben retornar > 0
  ```

- [ ] Verificar permisos de Supabase
  ```sql
  GRANT SELECT ON gonac.tab_parametros_optimos TO authenticated;
  GRANT SELECT ON gonac.vw_comparacion_optimo_real TO authenticated;
  GRANT SELECT ON gonac.vw_comparacion_optimo_real_tienda TO authenticated;
  GRANT SELECT ON gonac.vw_comparacion_optimo_real_global TO authenticated;
  ```

### ETL y Datos

- [ ] ETL de Airflow está corriendo
- [ ] Última fecha de cálculo es reciente (< 7 días)
  ```sql
  SELECT MAX(fecha_calculo) FROM gonac.tab_parametros_optimos;
  ```

- [ ] Datos tienen valores reales (no nulos en campos clave)
  ```sql
  SELECT 
    COUNT(*) as total,
    COUNT(dias_inventario_optimo) as con_dias_inv,
    COUNT(impacto) as con_impacto
  FROM gonac.tab_parametros_optimos;
  -- con_dias_inv y con_impacto deben ser > 0
  ```

### Environment Variables

- [ ] `NEXT_PUBLIC_SUPABASE_URL` está configurado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` está configurado
- [ ] `SUPABASE_SERVICE_ROLE_KEY` está configurado (opcional)

Verificar en `.env.local`:
```bash
cat .env.local | grep SUPABASE
```

### API Testing

- [ ] Server de desarrollo está corriendo
  ```bash
  npm run dev
  ```

- [ ] Endpoint base funciona
  ```bash
  curl http://localhost:3000/api/parametros?view=global
  # Debe retornar JSON con success: true
  ```

- [ ] Dashboard funciona
  ```bash
  curl http://localhost:3000/api/parametros?view=dashboard
  # Debe retornar objeto con global, porTienda, etc.
  ```

- [ ] Filtros funcionan
  ```bash
  curl "http://localhost:3000/api/parametros?view=detalle&ranking_limit=5"
  # Debe retornar máximo 5 registros
  ```

### Linting y Build

- [ ] No hay errores de linting
  ```bash
  npm run lint
  ```

- [ ] Build de producción funciona
  ```bash
  npm run build
  ```

- [ ] TypeScript compila sin errores
  ```bash
  npx tsc --noEmit
  ```

### Components Testing

- [ ] Dashboard se renderiza sin errores
  - Crear página en `app/parametros/page.tsx`
  - Visitar `http://localhost:3000/parametros`

- [ ] Hooks funcionan correctamente
  ```tsx
  const { dashboard, isLoading } = useParametrosDashboard();
  // Debe retornar datos o isLoading = true
  ```

- [ ] Código de colores funciona
  - Verde para desviación ≤ 5%
  - Amarillo para desviación ≤ 10%
  - Rojo para desviación > 10%

---

## 🚀 Deployment Steps

### Step 1: Commit Changes

```bash
git add .
git status
# Verificar que todos los archivos nuevos estén incluidos

git commit -m "feat: Implementación completa del módulo de Parámetros Óptimos (Épica 2)"
```

### Step 2: Push to Repository

```bash
git push origin main
# O el branch que corresponda
```

### Step 3: Deploy to Production

```bash
# Vercel
vercel --prod

# O en tu plataforma de deployment
npm run build
npm run start
```

### Step 4: Verify in Production

```bash
# Verificar API en producción
curl https://tu-dominio.com/api/parametros?view=global

# Verificar dashboard
# Visitar: https://tu-dominio.com/parametros
```

### Step 5: Monitor Errors

- [ ] Verificar logs de API
- [ ] Verificar errores en Sentry/LogRocket (si aplica)
- [ ] Probar con usuarios reales

---

## 📊 Post-Deployment Verification

### Functional Testing

- [ ] Dashboard carga correctamente
- [ ] Métricas globales muestran datos reales
- [ ] Resumen por status muestra verde/amarillo/rojo
- [ ] Top tiendas muestra datos ordenados por impacto
- [ ] Top SKUs críticos muestra datos ordenados por desviación
- [ ] Filtros funcionan correctamente
- [ ] Hooks refrescan datos con SWR

### Performance Testing

- [ ] API responde en < 2 segundos
- [ ] Dashboard carga en < 3 segundos
- [ ] No hay memory leaks en navegador
- [ ] SWR cachea correctamente

### User Acceptance

- [ ] Usuario puede entender el dashboard
- [ ] Código de colores es claro
- [ ] Formato de números es correcto (MXN)
- [ ] Datos coinciden con expectativas

---

## 🐛 Rollback Plan

Si algo falla en producción:

### Opción 1: Rollback Completo

```bash
git revert HEAD
git push origin main
# Re-deploy
```

### Opción 2: Deshabilitar Ruta

En `app/parametros/page.tsx`:

```tsx
export default function ParametrosPage() {
  return (
    <div className="p-6">
      <h1>Módulo en mantenimiento</h1>
      <p>Volveremos pronto...</p>
    </div>
  );
}
```

### Opción 3: Feature Flag

```tsx
const ENABLE_PARAMETROS = process.env.NEXT_PUBLIC_ENABLE_PARAMETROS === 'true';

export default function ParametrosPage() {
  if (!ENABLE_PARAMETROS) {
    return <MaintenancePage />;
  }
  
  return <ParametrosDashboard />;
}
```

---

## 📈 Monitoring

### Métricas a Monitorear

1. **API Performance**
   - Response time del endpoint `/api/parametros`
   - Error rate
   - Request volume

2. **User Engagement**
   - Visitas a `/parametros`
   - Tiempo en página
   - Clicks en drill-down

3. **Data Freshness**
   - Última fecha de cálculo
   - Frecuencia de actualización del ETL

### Alertas Recomendadas

```yaml
alerts:
  - name: API Slow Response
    condition: response_time > 5s
    action: notify_team
    
  - name: API Error Rate High
    condition: error_rate > 5%
    action: notify_team
    
  - name: Stale Data
    condition: last_calculation_date > 7_days_ago
    action: notify_data_team
```

---

## 📚 Documentation Links

Para usuarios finales:
- [Quick Start](./QUICK_START.md)
- [README Principal](./README_PARAMETROS.md)

Para desarrolladores:
- [API Endpoints](./API_ENDPOINTS.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)

---

## 🎉 Success Criteria

El deployment es exitoso si:

- ✅ Todos los tests del Pre-Deployment Checklist pasan
- ✅ API responde correctamente en producción
- ✅ Dashboard se visualiza sin errores
- ✅ Código de colores funciona correctamente
- ✅ Usuario puede navegar y filtrar datos
- ✅ Performance es aceptable (< 3s de carga)
- ✅ No hay errores en logs de producción

---

## 📞 Support

Si encuentras problemas:

1. **Revisar logs:**
   ```bash
   # Logs del servidor
   tail -f logs/server.log
   
   # Logs de Supabase
   # Ver en dashboard de Supabase
   ```

2. **Verificar datos:**
   ```sql
   -- Última actualización
   SELECT MAX(fecha_calculo) FROM gonac.tab_parametros_optimos;
   
   -- Registros totales
   SELECT COUNT(*) FROM gonac.vw_comparacion_optimo_real;
   ```

3. **Contactar equipo:**
   - Data Team: Para problemas con ETL o datos
   - Dev Team: Para problemas con la aplicación
   - Product: Para preguntas de negocio

---

**Última actualización:** 2024-12-01  
**Versión:** 1.0.0  
**Status:** ✅ Ready for Deployment

