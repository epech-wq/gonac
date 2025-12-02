/**
 * Impacto Total Banner Component
 */

import { formatCurrency, formatNumber } from '@/utils/formatters';

interface ImpactoTotalBannerProps {
  impactoTotal: number;
  tiendasConOportunidades: number;
  porcentajeTiendasConOportunidades: number;
}

export default function ImpactoTotalBanner({
  impactoTotal,
  tiendasConOportunidades,
  porcentajeTiendasConOportunidades,
}: ImpactoTotalBannerProps) {
  const porcentajeFormatted = Math.trunc(porcentajeTiendasConOportunidades).toString();

  return (
    <div className="mt-8 rounded-lg bg-gradient-to-r from-green-500 via-blue-500 to-blue-600 p-6 text-white shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm font-medium opacity-90 mb-2">
            Impacto Total
          </div>
          <div className="text-4xl font-bold mb-1">
            {formatCurrency(impactoTotal)}
          </div>
          <div className="text-sm opacity-90">
            Suma de todas las oportunidades detectadas
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full">
            <div className="text-sm font-medium opacity-90 mb-2">
              Tiendas con Oportunidades
            </div>
            <div className="text-4xl font-bold mb-1">
              {formatNumber(tiendasConOportunidades)}
            </div>
            <div className="text-sm opacity-90">
              {porcentajeFormatted}% del total requiere acción
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

