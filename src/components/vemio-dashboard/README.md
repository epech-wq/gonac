# Vemio Dashboard Components

This folder contains all custom components for the Vemio inventory optimization dashboard system. These components are designed to be portable and can be easily moved to other projects.

## Components Overview

### Main Components

1. **ReabastecimientoLayout** - Main layout wrapper with tab navigation
2. **DashboardContent** - Dashboard tab showing KPIs and optimization parameters
3. **OportunidadesContent** - Opportunities tab showing actionable insights
4. **AnalisisCausasContent** - Detailed analysis view for opportunity causes

### Supporting Components

5. **NavigationFilters** - Filter controls for data segmentation (Canal, Producto, etc.)
6. **NavigationBreadcrumb** - Breadcrumb navigation for drilldown paths
7. **CoDisenoModal** - Modal for co-designing action plans with ML projections
8. **DatePicker** - Custom date picker component using flatpickr

## Dependencies

### External Libraries
- `flatpickr` - For date picking functionality (required by DatePicker)
- `react` - ^19.0.0
- `@supabase/supabase-js` - For database connection

### Internal Dependencies
These components use the following from the host project:
- UI components: Badge, Button, Alert, ProgressBar
- Icons: Various SVG icons
- Tailwind CSS utilities and theme
- Supabase client configuration

## Data Sources

### Connected to Database
The components are now integrated with Supabase/PostgreSQL:

**Parámetros de Optimización** section pulls data from:
- **Table:** `gonac.tab_parametros_optimos`
- **Columns:** dias_inventario (optimo/real), punto_reorden (optimo/real), tamano_pedido (optimo/real), frecuencia (optima/real)

See `DATA_INTEGRATION.md` for detailed information about database integration.

## Usage

```tsx
import { ReabastecimientoLayout, DashboardContent, OportunidadesContent } from '@/components/vemio-dashboard';

function HomePage() {
  return (
    <ReabastecimientoLayout
      dashboardContent={<DashboardContent />}
      oportunidadesContent={<OportunidadesContent />}
    />
  );
}
```

## Moving to Another Project

1. Copy this entire `vemio-dashboard` folder to your new project
2. Ensure you have the required dependencies:
   - `flatpickr` and its CSS
   - Similar UI component library (Badge, Button, etc.)
   - Icon library or replace with your own icons
3. Update import paths in the components if needed
4. Customize the theme colors and styling to match your project

## Customization

### Theme Colors
The components use these Tailwind color classes that should be defined in your theme:
- `brand-*` - Primary brand colors
- `success-*` - Success states (green)
- `error-*` - Error states (red)
- `warning-*` - Warning states (yellow/orange)
- `gray-*` - Neutral colors

### Data Structure
All components currently use mock data. Replace the mock data arrays with your API calls or data providers.

## License

Proprietary - Vemio Platform Components


