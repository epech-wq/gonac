"use client";

import { VemioData } from "@/data/vemio-mock-data";
import { useAuth } from "@/context/AuthContext";

interface VemioHeaderProps {
  projectInfo: VemioData["projectInfo"];
}

export default function VemioHeader({ projectInfo }: VemioHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {projectInfo.name}
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            <span className="font-semibold">{projectInfo.totalRegisters.toLocaleString()}</span> registros totales
          </p>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.name || user?.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}