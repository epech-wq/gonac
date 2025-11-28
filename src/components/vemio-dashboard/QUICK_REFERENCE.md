# Quick Reference Card

## Component Overview

| Component | Purpose | Key Props |
|-----------|---------|-----------|
| `ReabastecimientoLayout` | Main container with tabs | `dashboardContent`, `oportunidadesContent` |
| `DashboardContent` | KPIs and parameters display | None (self-contained) |
| `OportunidadesContent` | Opportunity cards list | None (self-contained) |
| `AnalisisCausasContent` | Cause analysis detail view | `onVolver` |
| `NavigationFilters` | Filter controls | `navigationState`, `onNavigationChange`, `timePeriod`, `onTimePeriodChange`, `onExport` |
| `NavigationBreadcrumb` | Breadcrumb navigation | `items`, `onNavigate` |
| `CoDisenoModal` | Action plan modal | `isOpen`, `onClose` |
| `DatePicker` | Date selection input | `value`, `onChange`, `minDate`, `maxDate` |

## Common Import Patterns

```typescript
// Import all components
import {
  ReabastecimientoLayout,
  DashboardContent,
  OportunidadesContent,
  NavigationFilters,
  DatePicker,
} from '@/components/vemio-dashboard';

// Import hooks
import {
  useParametrosOptimos,
} from '@/components/vemio-dashboard';

// Import types
import type {
  NavigationState,
  TimePeriod,
  BreadcrumbItem,
  OportunidadCard,
  ParametrosOptimosData,
} from '@/components/vemio-dashboard';
```

## Quick Setup

```bash
# 1. Install dependencies
npm install flatpickr

# 2. Add to global CSS
@import "flatpickr/dist/flatpickr.min.css";

# 3. Use in your page
import { ReabastecimientoLayout, DashboardContent, OportunidadesContent } 
  from '@/components/vemio-dashboard';

export default function Page() {
  return (
    <ReabastecimientoLayout
      dashboardContent={<DashboardContent />}
      oportunidadesContent={<OportunidadesContent />}
    />
  );
}
```

## Key Types

```typescript
// Navigation State
interface NavigationState {
  canal?: string;
  geografia?: string;
  categoria?: string;
  marca?: string;
  segmentacion?: "Hot" | "Balanceadas" | "Slow" | "Críticas";
}

// Time Period
type TimePeriod = "mes" | "trimestre" | "3meses" | "6meses" | "año";

// KPI Data
interface KPIData {
  id: number;
  title: string;
  value: number;
  previousPeriod: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
}

// Opportunity Card
interface OportunidadCard {
  id: number;
  prioridad: "Alta" | "Media" | "Critica";
  titulo: string;
  valor: string;
  numTiendas: number;
  numSKUs: number;
  porcTotal: number;
  causaPrincipal: {
    tipo: string;
    correlacion: number;
    desvio: string;
    detalle: string;
  };
  color: "error" | "warning" | "success";
}
```

## Tailwind Classes Used

### Colors
- `brand-*` - Primary brand colors (blue)
- `success-*` - Success states (green)
- `error-*` - Error states (red)
- `warning-*` - Warning states (yellow)
- `gray-*` - Neutral colors

### Common Utilities
- `rounded-2xl` - Large border radius for cards
- `dark:` - Dark mode variants
- `space-y-*` - Vertical spacing
- `gap-*` - Grid/flex gaps

## Required External Components

1. **Badge** (`@/components/ui/badge/Badge`)
   ```typescript
   <Badge color="success" size="sm">+5.2%</Badge>
   ```

2. **Button** (`@/components/ui/button/Button`)
   ```typescript
   <Button variant="primary" size="md">Action</Button>
   ```

3. **Select** (`@/components/form/Select`)
   ```typescript
   <Select options={[...]} onChange={handler} />
   ```

4. **ProgressBar** (`@/components/progress-bar/ProgressBar`)
   ```typescript
   <ProgressBar progress={75} size="md" />
   ```

## Icon List

Icons needed from `@/icons`:
- AlertIcon, AngleLeftIcon, BoltIcon, BoxIconLine, BoxTapped
- CalenderIcon, CheckCircleIcon, CloseIcon, DollarLineIcon
- DownloadIcon, InfoIcon, PieChartIcon, TimeIcon

## Data Hooks

### useParametrosOptimos

Fetches optimal parameters from database.

**Source:** `gonac.tab_parametros_optimos`

```typescript
const { data, loading, error } = useParametrosOptimos();

// Data structure
interface ParametrosOptimosData {
  dias_inventario_optimo: number;
  dias_inventario_real: number;
  punto_reorden_optimo: number;
  punto_reorden_real: number;
  tamano_pedido_optimo: number;
  tamano_pedido_real: number;
  frecuencia_optima: number;
  frecuencia_real: number;
}
```

**Features:**
- ✅ Automatic loading state
- ✅ Error handling
- ✅ Used by DashboardContent component

## File Structure

```
vemio-dashboard/
├── README.md                      # Overview and usage
├── DEPENDENCIES.md                # Detailed dependency list
├── MIGRATION_GUIDE.md             # Step-by-step migration
├── DATA_INTEGRATION.md            # Database integration guide
├── QUICK_REFERENCE.md             # This file
├── types.ts                       # All TypeScript types
├── index.tsx                      # Exports
├── hooks/
│   └── useParametrosOptimos.ts    # Data fetching hook
├── ReabastecimientoLayout.tsx     # Main layout
├── DashboardContent.tsx           # Dashboard view (connected to DB)
├── OportunidadesContent.tsx       # Opportunities view
├── AnalisisCausasContent.tsx      # Analysis view
├── NavigationFilters.tsx          # Filters
├── NavigationBreadcrumb.tsx       # Breadcrumbs
├── CoDisenoModal.tsx              # Modal
└── DatePicker.tsx                 # Date picker
```

## Common Customizations

### Change colors
```typescript
// Update in component or types.ts
const colors = {
  primary: "brand",
  success: "green",
  error: "red",
  warning: "orange"
};
```

### Adjust grid columns
```typescript
// In component JSX
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
```

### Replace icons
```typescript
// Use your icon library
import { IconName } from 'your-icon-library';
```

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| Components not rendering | Check UI component paths exist |
| Styles broken | Verify Tailwind config has theme colors |
| Icons missing | Replace icon imports with your library |
| DatePicker not working | Install flatpickr and import CSS |
| TypeScript errors | Check types.ts matches your interfaces |

## Documentation Files

- **README.md** - Start here for overview
- **DEPENDENCIES.md** - Full dependency details
- **MIGRATION_GUIDE.md** - Step-by-step setup
- **DATA_INTEGRATION.md** - Database integration guide
- **QUICK_REFERENCE.md** - This cheat sheet

## Support Resources

1. Check component source code for implementation details
2. Review types.ts for data structures
3. Use IDE intellisense for prop autocomplete
4. Check browser console for runtime errors


