"use client";

export default function HistorialMetricsCards() {
  // Mock data - replace with real data later
  const metrics = {
    tasaExito: {
      porcentaje: 85.7,
      completadas: 6,
      finalizadas: 7
    },
    tiempoPromedio: {
      dias: 4.4,
      tareasBase: 6
    },
    distribucion: {
      reabasto: 3,
      exhibicion: 2,
      promocion: 2,
      visita: 2
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
      {/* Tasa de Éxito */}
      <div className="rounded-2xl border border-gray-200 bg-blue-50 p-6 dark:border-gray-800 dark:bg-blue-500/10">
        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
          Tasa de Éxito
        </h3>
        
        <div className="mb-4">
          <h2 className="text-5xl font-bold text-blue-600 dark:text-blue-400">
            {metrics.tasaExito.porcentaje}%
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {metrics.tasaExito.completadas} completadas de {metrics.tasaExito.finalizadas} finalizadas
        </p>
      </div>

      {/* Tiempo Promedio de Ejecución */}
      <div className="rounded-2xl border border-gray-200 bg-green-50 p-6 dark:border-gray-800 dark:bg-green-500/10">
        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
          Tiempo Promedio de Ejecución
        </h3>
        
        <div className="mb-4">
          <h2 className="text-5xl font-bold text-green-600 dark:text-green-400">
            {metrics.tiempoPromedio.dias} días
          </h2>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          Basado en {metrics.tiempoPromedio.tareasBase} tareas completadas
        </p>
      </div>

      {/* Distribución por Tipo */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h3 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
          Distribución por Tipo
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Reabasto:</span>
            <span className="text-base font-semibold text-gray-800 dark:text-white/90">
              {metrics.distribucion.reabasto}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Exhibición:</span>
            <span className="text-base font-semibold text-gray-800 dark:text-white/90">
              {metrics.distribucion.exhibicion}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Promoción:</span>
            <span className="text-base font-semibold text-gray-800 dark:text-white/90">
              {metrics.distribucion.promocion}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Visita:</span>
            <span className="text-base font-semibold text-gray-800 dark:text-white/90">
              {metrics.distribucion.visita}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

