"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import DatePicker from "./DatePicker";
import { CloseIcon, BoltIcon, InfoIcon, CheckCircleIcon } from "@/icons";
import type { CoDisenoModalProps } from "./types";

const CoDisenoModal: React.FC<CoDisenoModalProps> = ({ isOpen, onClose }) => {
  const [diasInventario, setDiasInventario] = useState(14);
  const [tamanoPedido, setTamanoPedido] = useState(500);
  const [responsable, setResponsable] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header - Dark Blue Background */}
        <div className="bg-brand-600 dark:bg-brand-700 px-8 py-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Co-Diseño de Plan de Acción
            </h2>
            <p className="text-brand-100 text-sm">
              Venta Incremental
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-brand-100 transition"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Three Indicator Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Valor Actual
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                $250K
              </p>
            </div>
            <div className="bg-success-50 dark:bg-success-500/10 border border-success-200 dark:border-success-800 rounded-xl p-4">
              <p className="text-xs text-success-700 dark:text-success-400 mb-2">
                ROI Proyectado
              </p>
              <p className="text-2xl font-bold text-success-900 dark:text-success-300">
                150%
              </p>
            </div>
            <div className="bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-800 rounded-xl p-4">
              <p className="text-xs text-brand-700 dark:text-brand-400 mb-2">
                Correlación ML
              </p>
              <p className="text-2xl font-bold text-brand-900 dark:text-brand-300">
                85%
              </p>
            </div>
          </div>

          {/* Adjust Parameters Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BoltIcon />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Ajustar Parámetros
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                (recálculo en tiempo real)
              </span>
            </div>

            {/* Sliders */}
            <div className="space-y-6">
              {/* Dias de inventario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Dias de inventario óptimo
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={diasInventario}
                    onChange={(e) => setDiasInventario(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <input
                    type="number"
                    value={diasInventario}
                    onChange={(e) => setDiasInventario(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              {/* Tamaño de Pedido */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tamaño de Pedido
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={tamanoPedido}
                    onChange={(e) => setTamanoPedido(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <input
                    type="number"
                    value={tamanoPedido}
                    onChange={(e) => setTamanoPedido(Number(e.target.value))}
                    className="w-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Responsable (opcional)
              </label>
              <input
                type="text"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre del responsable"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha límite (Opcional)
              </label>
              <DatePicker
                value={fechaLimite}
                onChange={setFechaLimite}
                placeholder="Seleccionar fecha"
                minDate={new Date()}
              />
            </div>
          </div>

          {/* Impact Alert Card */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 mt-0.5">
                <InfoIcon />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Impacto simulado con Vemio IA
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Al ajustar los parámetros seleccionados, el valor estimado de la
                  oportunidad disminuye a $250K con un ROI del 150%. La proyección
                  considera correlaciones ML entre parámetros y el comportamiento
                  histórico en Autoservicio &gt; Centro &gt; Walmart.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" size="md" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              startIcon={<CheckCircleIcon />}
              onClick={() => {
                // Handle approval
                console.log("Plan aprobado");
                onClose();
              }}
            >
              Aprobar Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoDisenoModal;

