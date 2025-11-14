"use client";

import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { BoxIcon, CalenderIcon, UserIcon, TimeIcon, FileIcon, TruckDelivery, BoxTapped, ShootingStarIcon, GroupIcon } from "@/icons";

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

interface TaskCardProps {
  task: Task;
}

// Iconos por tipo de tarea
const tipoIcons: { [key: string]: React.ReactElement } = {
  Reabasto: <TruckDelivery className="h-6 w-6" />,
  Exhibición: <BoxTapped className="h-6 w-6" />,
  Promoción: <ShootingStarIcon className="h-6 w-6" />,
  Visita: <GroupIcon className="h-6 w-6" />
};

export default function TaskCard({ task }: TaskCardProps) {
  const getEstadoBadge = () => {
    switch (task.estado) {
      case "completada":
        return <Badge color="success">Completada</Badge>;
      case "activa":
        return <Badge color="info">Activa</Badge>;
      case "cancelada":
        return <Badge color="error">Cancelada</Badge>;
      default:
        return null;
    }
  };

  const getPrioridadBadge = () => {
    switch (task.prioridad) {
      case "critica":
        return <Badge color="error">Crítica</Badge>;
      case "alta":
        return <Badge color="warning">Alta</Badge>;
      case "media":
        return <Badge color="info">Media</Badge>;
      case "baja":
        return <Badge color="light">Baja</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              task.tipo === "Reabasto" ? "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400" :
              task.tipo === "Exhibición" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" :
              task.tipo === "Promoción" ? "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400" :
              "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400"
            }`}>
              {tipoIcons[task.tipo] || <BoxIcon className="h-6 w-6" />}
            </div>
            
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  {task.titulo}
                </h3>
                {getEstadoBadge()}
                {getPrioridadBadge()}
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <span className="font-medium">Folio:</span> {task.folio}
                </div>
                <div>
                  <span className="font-medium">Tienda:</span> {task.tienda}
                </div>
              </div>
            </div>
          </div>

          <button className="shrink-0 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 dark:hover:bg-gray-700">
            Ver Detalle
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Responsable */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <UserIcon className="h-4 w-4" />
              <span>Responsable</span>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {task.responsable}
            </p>
          </div>

          {/* Fecha Creación */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <CalenderIcon className="h-4 w-4" />
              <span>Fecha Creación</span>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {task.fechaCreacion}
            </p>
          </div>

          {/* Tiempo Ejecución */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <TimeIcon className="h-4 w-4" />
              <span>Tiempo Ejecución</span>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {task.tiempoEjecucion}
            </p>
          </div>

          {/* Evidencias */}
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FileIcon className="h-4 w-4" />
              <span>Evidencias</span>
            </div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {task.evidencias}
            </p>
          </div>
        </div>

        {/* Métricas Financieras */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* SKUs */}
          <div>
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">SKUs</div>
            <p className="text-base font-semibold text-gray-800 dark:text-white/90">
              {task.skus}
            </p>
          </div>

          {/* Monto Estimado */}
          <div>
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Monto Estimado</div>
            <p className="text-base font-semibold text-red-600 dark:text-red-400">
              ${task.montoEstimado.toLocaleString()}
            </p>
          </div>

          {/* Impacto Real */}
          <div>
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">Impacto Real</div>
            <p className={`text-base font-semibold ${task.impactoReal ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {task.impactoReal ? `$${task.impactoReal.toLocaleString()}` : 'Pendiente'}
            </p>
          </div>
        </div>

        {/* ROI Real */}
        {task.roiReal !== null && (
          <div className="mt-4">
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">ROI Real</div>
            <p className="text-base font-semibold text-purple-600 dark:text-purple-400">
              {task.roiReal}x
            </p>
          </div>
        )}

        {/* Notas */}
        {task.notas && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
            <div className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400">
              Notas:
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {task.notas}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="mt-6 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Creada: {task.fechas.creada}
            </span>
          </div>
          
          {task.fechas.iniciada && (
            <>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Iniciada: {task.fechas.iniciada}
                </span>
              </div>
            </>
          )}
          
          {task.fechas.completada && (
            <>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">
                  Completada: {task.fechas.completada}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

