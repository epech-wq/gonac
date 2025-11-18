"use client";

import TaskCard from "./TaskCard";
import { Task } from "@/types/historial";

// Mock data - replace with real data later
const mockTasks: Task[] = [
  {
    id: 1,
    tipo: "Reabasto",
    titulo: "Reabasto Urgente",
    folio: "TSK-2025-001",
    tienda: "Tienda Centro #101",
    responsable: "Juan Pérez",
    fechaCreacion: "2025-11-11 08:00",
    tiempoEjecucion: "5.25 hrs",
    skus: 3,
    montoEstimado: 4580,
    impactoReal: 4580,
    roiReal: 12.5,
    evidencias: 3,
    estado: "completada" as const,
    prioridad: "critica" as const,
    notas: "Reabasto completado sin incidencias. Stock verificado.",
    fechas: {
      creada: "2025-11-11 08:00",
      iniciada: "2025-11-11 09:30",
      completada: "2025-11-11 14:45"
    }
  },
  {
    id: 2,
    tipo: "Exhibición",
    titulo: "Exhibición Adicional",
    folio: "TSK-2025-002",
    tienda: "Tienda Norte #045",
    responsable: "María González",
    fechaCreacion: "2025-11-10 14:30",
    tiempoEjecucion: "19 hrs (en proceso)",
    skus: 2,
    montoEstimado: 28700,
    impactoReal: null,
    roiReal: null,
    evidencias: 2,
    estado: "activa" as const,
    prioridad: "alta" as const,
    notas: "Material POP instalado. Pendiente stock inicial.",
    fechas: {
      creada: "2025-11-10 14:30",
      iniciada: null,
      completada: null
    }
  },
  {
    id: 3,
    tipo: "Promoción",
    titulo: "Promoción Slow Movers",
    folio: "TSK-2025-003",
    tienda: "Tienda Sur #089",
    responsable: "Carlos Ramírez",
    fechaCreacion: "2025-11-09 10:15",
    tiempoEjecucion: "3.8 días",
    skus: 5,
    montoEstimado: 12300,
    impactoReal: 13450,
    roiReal: 18.2,
    evidencias: 4,
    estado: "completada" as const,
    prioridad: "media" as const,
    notas: "Promoción aplicada con éxito. Ventas por encima del estimado.",
    fechas: {
      creada: "2025-11-09 10:15",
      iniciada: "2025-11-09 11:00",
      completada: "2025-11-13 08:30"
    }
  },
  {
    id: 4,
    tipo: "Visita",
    titulo: "Visita Promotoría",
    folio: "TSK-2025-004",
    tienda: "Tienda Este #123",
    responsable: "Ana Martínez",
    fechaCreacion: "2025-11-08 09:00",
    tiempoEjecucion: "4.2 días",
    skus: 8,
    montoEstimado: 15600,
    impactoReal: 16200,
    roiReal: 22.8,
    evidencias: 5,
    estado: "completada",
    prioridad: "alta",
    notas: "Visita completada. Stock reorganizado y productos reubicados.",
    fechas: {
      creada: "2025-11-08 09:00",
      iniciada: "2025-11-08 10:30",
      completada: "2025-11-12 13:45"
    }
  },
  {
    id: 5,
    tipo: "Reabasto",
    titulo: "Reabasto Preventivo",
    folio: "TSK-2025-005",
    tienda: "Tienda Oeste #067",
    responsable: "Roberto Silva",
    fechaCreacion: "2025-11-07 14:20",
    tiempoEjecucion: "6.5 hrs",
    skus: 4,
    montoEstimado: 7200,
    impactoReal: 7200,
    roiReal: 15.3,
    evidencias: 3,
    estado: "completada" as const,
    prioridad: "media" as const,
    notas: "Stock repuesto según planificación. Sin desviaciones.",
    fechas: {
      creada: "2025-11-07 14:20",
      iniciada: "2025-11-07 15:00",
      completada: "2025-11-07 21:30"
    }
  },
  {
    id: 6,
    tipo: "Exhibición",
    titulo: "Exhibición Especial",
    folio: "TSK-2025-006",
    tienda: "Tienda Plaza #156",
    responsable: "Laura Fernández",
    fechaCreacion: "2025-11-06 11:45",
    tiempoEjecucion: "2.5 días (en proceso)",
    skus: 3,
    montoEstimado: 18900,
    impactoReal: null,
    roiReal: null,
    evidencias: 3,
    estado: "activa" as const,
    prioridad: "media" as const,
    notas: "Exhibición en montaje. Esperando materiales adicionales.",
    fechas: {
      creada: "2025-11-06 11:45",
      iniciada: "2025-11-06 13:00",
      completada: null
    }
  },
  {
    id: 7,
    tipo: "Promoción",
    titulo: "Descuento por Caducidad",
    folio: "TSK-2025-007",
    tienda: "Tienda Centro #101",
    responsable: "Diego Torres",
    fechaCreacion: "2025-11-05 08:30",
    tiempoEjecucion: "5.1 días",
    skus: 6,
    montoEstimado: 9800,
    impactoReal: 10500,
    roiReal: 25.6,
    evidencias: 4,
    estado: "completada",
    prioridad: "alta",
    notas: "Productos con descuento vendidos antes de caducidad. Excelente resultado.",
    fechas: {
      creada: "2025-11-05 08:30",
      iniciada: "2025-11-05 09:15",
      completada: "2025-11-10 11:00"
    }
  },
  {
    id: 8,
    tipo: "Visita",
    titulo: "Inspección de Punto",
    folio: "TSK-2025-008",
    tienda: "Tienda Norte #045",
    responsable: "Patricia Ruiz",
    fechaCreacion: "2025-11-04 13:00",
    tiempoEjecucion: "3.7 días",
    skus: 7,
    montoEstimado: 11200,
    impactoReal: 11800,
    roiReal: 19.4,
    evidencias: 6,
    estado: "completada" as const,
    prioridad: "baja" as const,
    notas: "Inspección completa. Recomendaciones implementadas.",
    fechas: {
      creada: "2025-11-04 13:00",
      iniciada: "2025-11-04 14:30",
      completada: "2025-11-08 09:15"
    }
  },
  {
    id: 9,
    tipo: "Reabasto",
    titulo: "Reabasto Express",
    folio: "TSK-2025-009",
    tienda: "Tienda Sur #089",
    responsable: "Miguel Ángel Soto",
    fechaCreacion: "2025-11-03 16:45",
    tiempoEjecucion: "8.2 hrs (en proceso)",
    skus: 2,
    montoEstimado: 5400,
    impactoReal: null,
    roiReal: null,
    evidencias: 2,
    estado: "activa" as const,
    prioridad: "alta" as const,
    notas: "Reabasto en proceso. Productos en tránsito.",
    fechas: {
      creada: "2025-11-03 16:45",
      iniciada: "2025-11-03 17:30",
      completada: null
    }
  },
  {
    id: 10,
    tipo: "Exhibición",
    titulo: "Nueva Exhibición Temporal",
    folio: "TSK-2025-010",
    tienda: "Tienda Plaza #156",
    responsable: "Sandra López",
    fechaCreacion: "2025-11-02 12:00",
    tiempoEjecucion: "4 días",
    skus: 4,
    montoEstimado: 22100,
    impactoReal: null,
    roiReal: null,
    evidencias: 1,
    estado: "cancelada" as const,
    prioridad: "baja" as const,
    notas: "Cancelada por falta de espacio disponible en tienda.",
    fechas: {
      creada: "2025-11-02 12:00",
      iniciada: null,
      completada: null
    }
  }
];

export default function HistorialTaskList() {
  return (
    <div className="space-y-4">
      {mockTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

