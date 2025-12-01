'use client';

import { useParametrosDashboard } from '@/hooks/useParametros';
import { ComparacionOptimoReal, ComparacionOptimoRealTienda } from '@/types/parametros';

export default function ParametrosDashboard() {
  const { dashboard, isLoading, isError } = useParametrosDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando dashboard...</div>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error al cargar el dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard de Parámetros Óptimos
        </h1>
        <p className="text-sm text-gray-600">
          Última actualización: {dashboard.ultimaActualizacion}
        </p>
      </div>

      {/* Métricas Globales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Métricas Globales</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Tiendas"
            value={dashboard.global.total_tiendas || 0}
            format="number"
          />
          <MetricCard
            label="Total SKUs"
            value={dashboard.global.total_skus || 0}
            format="number"
          />
          <MetricCard
            label="Combinaciones"
            value={dashboard.global.total_combinaciones_sku_tienda || 0}
            format="number"
          />
          <MetricCard
            label="Impacto Total"
            value={dashboard.global.impacto || 0}
            format="currency"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Días de Inventario
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {dashboard.global.real_dias_inventario?.toFixed(1) || '0.0'}
              </span>
              <span className="text-sm text-gray-500">
                vs {dashboard.global.optimo_dias_inventario?.toFixed(1) || '0.0'} óptimo
              </span>
            </div>
            <div className="mt-2">
              <DesviacionBadge 
                desviacion={dashboard.global.desviacion_dias_inventario_pct || 0} 
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Punto de Reorden
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-blue-600">
                {dashboard.global.real_punto_reorden?.toFixed(0) || '0'}
              </span>
              <span className="text-sm text-gray-500">
                vs {dashboard.global.optimo_punto_reorden?.toFixed(0) || '0'} óptimo
              </span>
            </div>
            <div className="mt-2">
              <DesviacionBadge 
                desviacion={dashboard.global.desviacion_punto_reorden_pct || 0} 
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Sell Through
            </h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-green-600">
                {dashboard.global.sell_through_pct?.toFixed(1) || '0.0'}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Rendimiento global</p>
          </div>
        </div>
      </div>

      {/* Resumen por Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen por Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatusCard
            color="green"
            label="Cumplimiento"
            count={dashboard.resumenStatus.green}
            percentage={dashboard.resumenStatus.green_pct}
            icon="✅"
          />
          <StatusCard
            color="yellow"
            label="Alerta"
            count={dashboard.resumenStatus.yellow}
            percentage={dashboard.resumenStatus.yellow_pct}
            icon="⚠️"
          />
          <StatusCard
            color="red"
            label="Crítico"
            count={dashboard.resumenStatus.red}
            percentage={dashboard.resumenStatus.red_pct}
            icon="🚨"
          />
        </div>
      </div>

      {/* Top Tiendas por Impacto */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top 10 Tiendas por Impacto</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tienda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Región
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Segmento
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  SKUs
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Impacto
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Desviación Prom.
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboard.porTienda.map((tienda) => (
                <TiendaRow key={tienda.id_store} tienda={tienda} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top SKUs Críticos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Top 20 SKUs Críticos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tienda
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Desviación
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Impacto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboard.topDesviaciones.slice(0, 10).map((item, idx) => (
                <SKURow key={`${item.id_store}-${item.sku}`} item={item} rank={idx + 1} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componentes auxiliares
function MetricCard({ 
  label, 
  value, 
  format = 'number' 
}: { 
  label: string; 
  value: number; 
  format?: 'number' | 'currency' 
}) {
  const formattedValue = format === 'currency'
    ? new Intl.NumberFormat('es-MX', { 
        style: 'currency', 
        currency: 'MXN',
        minimumFractionDigits: 0
      }).format(value)
    : new Intl.NumberFormat('es-MX').format(value);

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
    </div>
  );
}

function DesviacionBadge({ desviacion }: { desviacion: number }) {
  const abs = Math.abs(desviacion);
  const color = abs <= 5 ? 'green' : abs <= 10 ? 'yellow' : 'red';
  const bgColor = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  }[color];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}>
      {desviacion > 0 ? '+' : ''}{desviacion.toFixed(1)}%
    </span>
  );
}

function StatusCard({ 
  color, 
  label, 
  count, 
  percentage, 
  icon 
}: { 
  color: 'green' | 'yellow' | 'red'; 
  label: string; 
  count: number; 
  percentage: number; 
  icon: string;
}) {
  const bgColor = {
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    red: 'bg-red-50 border-red-200'
  }[color];

  const textColor = {
    green: 'text-green-800',
    yellow: 'text-yellow-800',
    red: 'text-red-800'
  }[color];

  return (
    <div className={`${bgColor} border rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold ${textColor}`}>{count}</span>
      </div>
      <p className={`text-sm font-medium ${textColor}`}>{label}</p>
      <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}% del total</p>
    </div>
  );
}

function TiendaRow({ tienda }: { tienda: ComparacionOptimoRealTienda }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {tienda.store_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {tienda.region}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <SegmentBadge segment={tienda.segment || ''} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
        {tienda.total_skus}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
        {new Intl.NumberFormat('es-MX', { 
          style: 'currency', 
          currency: 'MXN',
          minimumFractionDigits: 0
        }).format(tienda.impacto || 0)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        <DesviacionBadge desviacion={tienda.desviacion_total_promedio || 0} />
      </td>
    </tr>
  );
}

function SKURow({ item, rank }: { item: ComparacionOptimoReal; rank: number }) {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
        #{rank}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.store_name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {item.sku}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {item.category}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
        <DesviacionBadge desviacion={item.desviacion_dias_inventario_pct || 0} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
        {new Intl.NumberFormat('es-MX', { 
          style: 'currency', 
          currency: 'MXN',
          minimumFractionDigits: 0
        }).format(item.impacto || 0)}
      </td>
    </tr>
  );
}

function SegmentBadge({ segment }: { segment: string }) {
  const colors = {
    Hot: 'bg-red-100 text-red-800',
    Balanceadas: 'bg-blue-100 text-blue-800',
    Slow: 'bg-yellow-100 text-yellow-800',
    Dead: 'bg-gray-100 text-gray-800'
  };

  const color = colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {segment}
    </span>
  );
}

