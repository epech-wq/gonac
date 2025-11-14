# Dashboard Agéntico - Documentación

## Descripción General

El Dashboard Agéntico es una vista principal tipo SaaS diseñada para proporcionar un monitoreo inteligente de alertas y KPIs principales en tiempo real. Esta vista combina un diseño moderno y limpio con funcionalidad práctica para la gestión de inventarios y oportunidades de negocio.

## Características Principales

### 1. Sección de Alertas Inteligentes

La sección superior presenta tres cards horizontales con alertas críticas:

#### 🔴 Agotado (Out of Stock)
- **Color**: Rojo (error-600)
- **Muestra**: Impacto total en MXN y número de tiendas afectadas
- **CTA**: Botón "Resolver ahora" con acción directa
- **Propósito**: Alertar sobre productos agotados que requieren reabasto inmediato

#### 🟡 Caducidad (Expiration Risk)
- **Color**: Amarillo/Naranja (warning-600)
- **Muestra**: Impacto económico y tiendas con productos próximos a caducar
- **CTA**: Botón "Resolver ahora" para gestionar productos
- **Propósito**: Prevenir pérdidas por productos vencidos

#### 🔵 Sin Venta (No Sales)
- **Color**: Azul claro (blue-light-600)
- **Muestra**: Impacto de productos sin movimiento y tiendas afectadas
- **CTA**: Botón "Resolver ahora" para promocionar productos
- **Propósito**: Identificar oportunidades de optimización de inventario

### 2. Chips de Filtrado Interactivos

Ubicados en la parte superior derecha de la sección de alertas:

- **Todas**: Muestra todas las alertas sin filtrar
- **🔥 HOT**: Alertas de alta prioridad y urgencia
- **Balanceadas**: Alertas con equilibrio entre urgencia e impacto
- **Slow**: Alertas de productos de baja rotación
- **⚡ Críticas**: Alertas que requieren atención inmediata

Cada chip tiene:
- Estados visuales claros (activo/inactivo)
- Colores diferenciados según el tipo
- Animación de transición suave
- Ring effect cuando están activos

### 3. Gráfico de Impacto por Categoría

Ubicado en el lateral derecho de las alertas (o como componente separado):

- **Tipo**: Gráfico de barras horizontales
- **Datos**: Muestra el impacto económico por categoría de producto
- **Categorías incluidas**:
  - Papas: $45,000
  - Totopos: $38,000
  - Botanas: $29,000
  - Dulces: $22,000
  - Bebidas: $18,000
- **Interactividad**: Tooltips con valores formateados en MXN

### 4. Sección de KPI Cards

Cuatro cards grandes que muestran métricas clave:

#### 💰 Ventas Totales
- **Valor principal**: $178,923
- **Subtítulo**: 12,788 unidades vendidas
- **Variación**: +0.6% (tendencia positiva)
- **Color**: Verde (success-600)
- **Información adicional**: Datos en vivo

#### 📊 Sell-Through
- **Valor principal**: 20.0%
- **Subtítulo**: vs 15% objetivo
- **Variación**: +5.0% (tendencia positiva)
- **Color**: Azul claro (blue-light-600)
- **Información adicional**: Inventario inicial $1,300,000

#### ⚠️ Riesgo Total
- **Valor principal**: 47 oportunidades
- **Subtítulo**: 23 Detectadas • 8 Críticas
- **Variación**: -12.5% (mejora, tendencia negativa es buena)
- **Color**: Rojo (error-600)
- **Visualización**: Muestra el total de riesgos identificados

#### 📦 Días de Inventario
- **Valor principal**: 83.5 días
- **Subtítulo**: vs 45 objetivo
- **Variación**: -2.3% (mejora, reducción de días)
- **Color**: Naranja (orange-600)
- **Información adicional**: Cobertura Numérica 93.4%

Cada KPI card incluye:
- Icon con gradiente de color
- Badge de variación porcentual con indicador de tendencia (↑/↓)
- Mini gráfico de tendencia en la parte inferior (decorativo)
- Diseño responsive con grid adaptativo

### 5. Sección de Acciones Sugeridas

Panel inferior con fondo degradado que presenta:

#### 📦 Reabasto Urgente
- **Prioridad**: Alta (rojo)
- **Descripción**: 47 tiendas con productos agotados
- **Acción**: Gestión inmediata de reabasto

#### ⏰ Gestión Caducidad
- **Prioridad**: Media (amarillo)
- **Descripción**: 23 productos próximos a vencer
- **Acción**: Planificación de promociones o devoluciones

#### 📢 Promoción Productos
- **Prioridad**: Optimización (azul)
- **Descripción**: 31 SKUs sin movimiento
- **Acción**: Estrategias de marketing y promoción

## Diseño y Estilos

### Paleta de Colores

El dashboard utiliza la paleta de colores definida en Tailwind CSS v4:

- **Success (Verde)**: #12b76a - Para ventas positivas
- **Error (Rojo)**: #F04438 - Para alertas críticas
- **Warning (Amarillo/Naranja)**: #F79009 - Para advertencias
- **Blue Light (Azul claro)**: #0BA5EC - Para información
- **Brand (Azul marca)**: #465fff - Para acciones principales
- **Gray**: Tonos variados para fondos y textos

### Modo Oscuro

Todos los componentes incluyen soporte completo para modo oscuro:
- Fondos oscuros con opacidad
- Colores ajustados para mejor contraste
- Bordes sutiles pero visibles
- Transiciones suaves entre modos

### Responsive Design

El layout es completamente responsive:
- **Mobile**: Cards apiladas verticalmente
- **Tablet**: Grid de 2 columnas para KPIs
- **Desktop**: Grid completo con todas las columnas visibles
- **Large screens**: Optimización del espacio disponible

## Características Técnicas

### Tecnologías Utilizadas

- **React 19**: Componentes funcionales con hooks
- **Next.js 15**: Renderizado del lado del cliente con "use client"
- **TypeScript**: Tipado fuerte para mayor confiabilidad
- **Tailwind CSS v4**: Estilos utility-first
- **ApexCharts**: Visualización de datos interactiva
- **Dynamic Import**: Carga optimizada de ApexCharts

### Rendimiento

- **Dynamic Import**: ApexCharts se carga dinámicamente sin SSR
- **Animaciones optimizadas**: Transiciones CSS hardware-accelerated
- **Estados locales**: Gestión eficiente con useState
- **Responsive images**: Optimización de recursos visuales

### Accesibilidad

- Etiquetas semánticas apropiadas
- Contraste de colores WCAG AA compliant
- Estados hover y focus claramente visibles
- Iconos descriptivos con emojis accesibles

## Integración

### Ubicación en el Proyecto

```
src/
  components/
    vemio/
      views/
        AgenticoView.tsx          <- Componente principal
      VemioDashboard.tsx          <- Dashboard principal (actualizado)
      VemioTabs.tsx               <- Tabs de navegación (actualizado)
```

### Uso

El dashboard se activa automáticamente como la vista por defecto en el VemioDashboard:

```typescript
const [activeTab, setActiveTab] = useState<TabType>("agentico");
```

### Navegación

Los usuarios pueden acceder al dashboard mediante:
1. Tab "Agéntico" en la navegación principal
2. URL directa si está configurada en el routing

## Datos y API

### Estructura de Datos

```typescript
interface AlertCardData {
  type: "agotado" | "caducidad" | "sinventa";
  title: string;
  icon: string;
  impacto: number;
  tiendas: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface KPICardData {
  title: string;
  value: string;
  unit: string;
  subtitle: string;
  variation: number;
  trend: "up" | "down";
  color: string;
  bgGradient: string;
  icon: string;
}
```

### Integración con API Real

Para conectar con datos reales, reemplazar los datos mock en el componente con hooks personalizados:

```typescript
// Ejemplo:
const { data: alertsData } = useAlertsData();
const { data: kpisData } = useKPIsData();
```

## Futuras Mejoras

### Funcionalidades Pendientes

1. **Filtrado Real**: Implementar lógica de filtrado con los chips interactivos
2. **Navegación Directa**: Hacer que los botones "Resolver ahora" naveguen a las vistas correspondientes
3. **Actualización en Tiempo Real**: Integrar WebSockets para datos en vivo
4. **Exportación de Datos**: Permitir exportar KPIs y alertas a PDF/Excel
5. **Configuración Personalizada**: Permitir al usuario personalizar qué KPIs ver
6. **Alertas Push**: Notificaciones del navegador para alertas críticas
7. **Histórico**: Gráficos de tendencia histórica para cada KPI

### Optimizaciones Técnicas

1. Memoización de componentes con React.memo
2. Lazy loading de secciones no críticas
3. Service Worker para cache de datos
4. Prefetching de datos relacionados
5. Skeleton loaders durante carga inicial

## Mantenimiento

### Testing

Para probar el dashboard:

```bash
npm run dev
# Navegar a la vista Vemio
# Seleccionar tab "Agéntico"
```

### Actualización de Datos

Los datos mock se encuentran en el componente. Para actualizarlos:

1. Modificar los arrays `alerts` y `kpis`
2. Ajustar los valores del gráfico en `categoryImpactSeries`
3. Guardar y observar hot-reload

### Modificación de Estilos

Todos los estilos usan Tailwind CSS v4. Para modificar:

1. Consultar `src/app/globals.css` para variables de color
2. Usar clases de Tailwind directamente en el JSX
3. Mantener consistencia con el diseño system existente

## Soporte

Para dudas o problemas:
- Consultar la documentación de Tailwind CSS v4
- Revisar ejemplos de ApexCharts
- Consultar guías de React 19 y Next.js 15

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0  
**Autor**: Vemio Development Team

