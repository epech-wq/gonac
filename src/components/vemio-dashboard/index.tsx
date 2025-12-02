/**
 * Vemio Dashboard Components
 * 
 * A complete set of components for inventory optimization and opportunity management.
 * All components are self-contained and portable.
 */

// Main Components
export { default as ReabastecimientoLayout } from "./ReabastecimientoLayout";
export { default as DashboardContent } from "./DashboardContent";
export { default as OportunidadesContent } from "./OportunidadesContent";
export { default as AnalisisCausasContent } from "./AnalisisCausasContent";

// Supporting Components
export { default as NavigationFilters } from "./NavigationFilters";
export { default as NavigationBreadcrumb } from "./NavigationBreadcrumb";
export { default as VemioFilters } from "./VemioFilters";
export { default as CoDisenoModal } from "./CoDisenoModal";
export { default as DatePicker } from "./DatePicker";

// Types
export type {
  NavigationState,
  TimePeriod,
  BreadcrumbLevel,
  BreadcrumbItem,
  ParameterData,
  KPIData,
  Prioridad,
  CausaPrincipal,
  OportunidadCard,
  CausaCard,
  CoDisenoModalProps,
  AnalisisCausasContentProps,
  DatePickerProps,
} from "./types";
