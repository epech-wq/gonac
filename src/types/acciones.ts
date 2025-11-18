/**
 * Acciones Types
 * Types for task history and actions data
 */

export interface AccionesResumen {
  total_tareas: number;
  completadas: number;
  activas: number;
  canceladas: number;
  valor_capturado: string;
  roi_promedio: string;
  tasa_exito_pct: string;
  tiempo_promedio_ejecucion_dias: string;
  cantidad_reabasto: number;
  cantidad_exhibicion: number;
  cantidad_promocion: number;
  cantidad_visita: number;
  costo_total_completadas: string;
  total_skus: number;
  monto_total_estimado: string;
  monto_total_real: string;
  roi_promedio_calculado: string;
}

export interface AccionesResponse {
  data: AccionesResumen;
  timestamp: string;
}

/**
 * Detail record for individual actions
 */
export interface AccionDetalle {
  id_accion: number;
  folio: string;
  tipo_accion: string;
  id_store: number;
  store_name: string;
  region: string;
  cantidad_skus: number;
  monto_estimado: string;
  responsable: string;
  impacto_real: string | null;
  fecha_creacion: string;
  fecha_inicio: string | null;
  fecha_completada: string | null;
  roi_real: string | null;
  tiempo_ejecucion_horas: string | null;
  tiempo_ejecucion_dias: string | null;
  cantidad_evidencias: number;
  notas: string | null;
  status: string;
  prioridad: string;
  riesgo_potencial: string;
  costo_accion: string;
  roi_calculado: string | null;
  dias_desde_creacion: string;
  inserted_at: string;
  updated_at: string;
}

/**
 * Response for Acciones details
 */
export interface AccionesDetalleResponse {
  data: AccionDetalle[];
  total: number;
  timestamp: string;
}

