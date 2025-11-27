/**
 * Shared TypeScript types for Vemio Dashboard Components
 */

// Navigation State Types
export interface NavigationState {
  // Eje Cliente
  canal?: string;
  geografia?: string;
  arbol?: string;
  cadena?: string;
  cliente?: string;
  // Eje Producto
  categoria?: string;
  marca?: string;
  sku?: string;
  // Eje Segmentación
  segmentacion?: "Hot" | "Balanceadas" | "Slow" | "Críticas";
}

export type TimePeriod = "mes" | "trimestre" | "3meses" | "6meses" | "año";

// Breadcrumb Types
export type BreadcrumbLevel =
  | "canal"
  | "geografia"
  | "arbol"
  | "cadena"
  | "cliente"
  | "categoria"
  | "marca"
  | "sku"
  | "segmentacion";

export interface BreadcrumbItem {
  label: string;
  level: BreadcrumbLevel | string;
  value: string;
  onClick?: () => void;
}

// Dashboard Data Types
export interface ParameterData {
  id: number;
  title: string;
  optimized: number;
  actual: number;
  previousPeriod: number;
  unit: string;
  icon: React.ReactNode;
}

export interface KPIData {
  id: number;
  title: string;
  value: number;
  previousPeriod: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
}

// Opportunity Types
export type Prioridad = "Alta" | "Media" | "Critica";

export interface CausaPrincipal {
  tipo: string;
  correlacion: number;
  desvio: string;
  detalle: string;
}

export interface OportunidadCard {
  id: number;
  prioridad: Prioridad;
  titulo: string;
  valor: string;
  numTiendas: number;
  numSKUs: number;
  porcTotal: number;
  causaPrincipal: CausaPrincipal;
  color: "error" | "warning" | "success";
}

// Analysis Types
export interface CausaCard {
  id: number;
  titulo: string;
  subtitulo: string;
  tendencia: "up" | "down" | "neutral";
  actual: number;
  optimo: number;
  desvio: string;
  correlacion: number;
  impactoProgreso: number;
}

// Modal Types
export interface CoDisenoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AnalisisCausasContentProps {
  onVolver: () => void;
}

// DatePicker Types
export interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date | string;
  maxDate?: Date | string;
  disabled?: boolean;
}

