import React from 'react'

export function Loading() {
  return (
    <div className="h-[600px] w-full flex items-center justify-center gap-2 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Cargando datos de tiendas...</p>
    </div>
  )
}
