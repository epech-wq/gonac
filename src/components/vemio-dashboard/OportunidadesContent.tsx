"use client";
import React, { useState } from "react";
import { AlertIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import AnalisisCausasContent from "./AnalisisCausasContent";
import type { Prioridad, OportunidadCard } from "./types";

const OportunidadesContent: React.FC = () => {
  const [showAnalisisCausas, setShowAnalisisCausas] = useState(false);

  // Mock data - replace with real data
  const oportunidades: OportunidadCard[] = [
    {
      id: 1,
      prioridad: "Critica",
      titulo: "Venta Incremental",
      valor: "$250K",
      numTiendas: 25,
      numSKUs: 28,
      porcTotal: 36.3,
      causaPrincipal: {
        tipo: "Dias Inventario",
        correlacion: 85,
        desvio: "-43%",
        detalle: "Auto servicio > Centro > Walmart",
      },
      color: "error",
    },
    {
      id: 2,
      prioridad: "Alta",
      titulo: "Riesgo de Agotados",
      valor: "$180K",
      numTiendas: 18,
      numSKUs: 22,
      porcTotal: 28.5,
      causaPrincipal: {
        tipo: "Punto de Re-orden",
        correlacion: 92,
        desvio: "-50%",
        detalle: "Bebidas > RefreshCo",
      },
      color: "warning",
    },
    {
      id: 3,
      prioridad: "Media",
      titulo: "Riesgo de Caducidad",
      valor: "$95K",
      numTiendas: 12,
      numSKUs: 15,
      porcTotal: 15.2,
      causaPrincipal: {
        tipo: "Dias Inventario",
        correlacion: 75,
        desvio: "150%",
        detalle: "Conveniencia > Norte",
      },
      color: "success",
    },
  ];

  const totalPotencial = oportunidades.reduce((sum, item) => {
    const valor = parseFloat(item.valor.replace(/[$K]/g, "")) * 1000;
    return sum + valor;
  }, 0);

  const getPrioridadColor = (prioridad: Prioridad): "error" | "warning" | "success" => {
    switch (prioridad) {
      case "Critica":
        return "error";
      case "Alta":
        return "warning";
      case "Media":
        return "success";
    }
  };

  // If showing analysis view, render that instead
  if (showAnalisisCausas) {
    return (
      <AnalisisCausasContent onVolver={() => setShowAnalisisCausas(false)} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-1">
            Oportunidades
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Potencial total ${totalPotencial.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Opportunity Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {oportunidades.map((oportunidad) => (
          <div
            key={oportunidad.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03] flex flex-col"
          >
            {/* Header with icon and badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/5 rounded-lg flex-shrink-0">
                <AlertIcon />
              </div>
              <Badge
                variant="light"
                color={getPrioridadColor(oportunidad.prioridad)}
                size="sm"
              >
                {oportunidad.prioridad}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
              {oportunidad.titulo}
            </h3>

            {/* Gap */}
            <div className="h-6" />

            {/* Info Table */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">Valor</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {oportunidad.valor}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400"># Tiendas</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {oportunidad.numTiendas}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400"># SKUs</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {oportunidad.numSKUs}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">% Total</span>
                <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {oportunidad.porcTotal}%
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-800 mb-6" />

            {/* Causa Principal */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90 mb-3">
                Causa Principal:
              </h4>
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {oportunidad.causaPrincipal.tipo}
                </span>
                <Badge variant="light" color="light" size="sm">
                  {oportunidad.causaPrincipal.correlacion}% correlación
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Desvío:</span> {oportunidad.causaPrincipal.desvio} ·{" "}
                {oportunidad.causaPrincipal.detalle}
              </p>
            </div>

            {/* Link */}
            <button
              onClick={() => setShowAnalisisCausas(true)}
              className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 mb-4 inline-block text-left"
            >
              Ver análisis completo &gt;
            </button>

            {/* Button */}
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // TODO: Implement modal for opportunity details
                console.log("Ver detalles:", oportunidad);
              }}
            >
              Ver detalles
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OportunidadesContent;
