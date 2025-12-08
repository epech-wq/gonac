import React from 'react'

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div className="h-[600px] w-full flex items-center justify-center gap-2 text-center">
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Error al cargar datos: {error.message}</p>
    </div>
  )
}
