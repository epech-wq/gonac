"use client";

import { ListIcon, CheckCircleIcon, TimeIcon, DollarLineIcon, ShootingStarIcon } from "@/icons";

export default function HistorialStatsCards() {
  // Mock data - replace with real data later
  const stats = {
    totalTareas: 10,
    completadas: 6,
    activas: 3,
    valorCapturado: 59400,
    roiPromedio: 21.4
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-5">
      {/* Total Tareas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          <ListIcon className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Total Tareas</p>
        <h4 className="mt-2 text-3xl font-bold text-gray-800 dark:text-white/90">
          {stats.totalTareas}
        </h4>
      </div>

      {/* Completadas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400">
          <CheckCircleIcon className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Completadas</p>
        <h4 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
          {stats.completadas}
        </h4>
      </div>

      {/* Activas */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          <TimeIcon className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Activas</p>
        <h4 className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
          {stats.activas}
        </h4>
      </div>

      {/* Valor Capturado */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400">
          <DollarLineIcon className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Valor Capturado</p>
        <h4 className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
          ${stats.valorCapturado.toLocaleString()}
        </h4>
      </div>

      {/* ROI Promedio */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
          <ShootingStarIcon className="h-6 w-6" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">ROI Promedio</p>
        <h4 className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
          {stats.roiPromedio}x
        </h4>
      </div>
    </div>
  );
}

