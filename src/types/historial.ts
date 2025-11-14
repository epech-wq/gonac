export interface Task {
  id: number;
  tipo: string;
  titulo: string;
  folio: string;
  tienda: string;
  responsable: string;
  fechaCreacion: string;
  tiempoEjecucion: string;
  skus: number;
  montoEstimado: number;
  impactoReal: number | null;
  roiReal: number | null;
  evidencias: number;
  estado: "completada" | "activa" | "cancelada";
  prioridad: "critica" | "alta" | "media" | "baja";
  notas: string;
  fechas: {
    creada: string;
    iniciada: string | null;
    completada: string | null;
  };
}

