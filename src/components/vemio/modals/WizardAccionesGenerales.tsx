"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReabastoUrgenteCard from "../cards/ReabastoUrgenteCard";
import ExhibicionesAdicionalesCard from "../cards/ExhibicionesAdicionalesCard";
import PromocionEvacuarCard from "../cards/PromocionEvacuarCard";
import VisitaPromotoriaCard from "../cards/VisitaPromotoriaCard";

export type TipoAccionGeneral = 
  | "reabasto_urgente"
  | "exhibiciones_adicionales"
  | "promocion_evacuar"
  | "visita_promotoria";

export interface ParametrosAccionGeneral {
  // Reabasto Urgente
  diasCobertura?: number;
  nivelStockObjetivo?: number;
  
  // Exhibiciones Adicionales
  costoExhibicion?: number;
  incrementoVentasEsperado?: number;
  
  // Promoción Evacuar
  porcentajeDescuento?: number;
  elasticidadPrecio?: number;
  duracionDias?: number;
  
  // Visita Promotoría
  objetivoVisita?: string;
  duracionHoras?: number;
}

export interface DatosAccionGeneral {
  accionSeleccionada: TipoAccionGeneral | null;
  parametros: ParametrosAccionGeneral;
  
  // Métricas calculadas
  costoEstimado: number;
  roiProyectado: number;
  impactoMonetario: number;
  tiendasAfectadas: number;
  unidadesAfectadas: number;
}

interface AccionInfo {
  id: TipoAccionGeneral;
  title: string;
  tipo: string;
  description: string;
  tiendas: number;
}

interface WizardAccionesGeneralesProps {
  accionInfo: AccionInfo;
  onClose: () => void;
  onComplete?: (datos: DatosAccionGeneral) => void;
}

export default function WizardAccionesGenerales({
  accionInfo,
  onClose,
  onComplete
}: WizardAccionesGeneralesProps) {
  const [pasoActual, setPasoActual] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [datos, setDatos] = useState<DatosAccionGeneral>({
    accionSeleccionada: accionInfo.id,
    parametros: {},
    costoEstimado: 0,
    roiProyectado: 0,
    impactoMonetario: 0,
    tiendasAfectadas: accionInfo.tiendas,
    unidadesAfectadas: 0
  });

  const totalPasos = 1; // Wizard de un solo paso

  const handleCerrar = () => {
    if (onClose) onClose();
  };

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCerrar();
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSiguiente = () => {
    if (pasoActual < totalPasos) {
      setPasoActual(pasoActual + 1);
    }
  };

  const handleAnterior = () => {
    if (pasoActual > 1) {
      setPasoActual(pasoActual - 1);
    }
  };

  const handleActualizarDatos = (nuevosDatos: Partial<DatosAccionGeneral>) => {
    setDatos(prev => ({ ...prev, ...nuevosDatos }));
  };

  const handleEjecutarAccion = () => {
    console.log("Ejecutando acción...", datos);
    if (onComplete) {
      onComplete(datos);
    }
    // Aquí se puede agregar lógica adicional para ejecutar la acción
    // Por ejemplo, enviar a un API, actualizar estado global, etc.
    handleCerrar();
  };

  const renderPaso = () => {
    return <Paso1Configuracion datos={datos} accionInfo={accionInfo} onActualizar={handleActualizarDatos} onEjecutar={handleEjecutarAccion} />;
  };

  if (!mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 99999
      }}
      onClick={handleCerrar}
    >
      <div 
        className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-blue-600 rounded-t-xl">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-brand-100 mb-1">
                  Plan de Acción / {accionInfo.tipo}
                </div>
                <h1 className="text-2xl font-bold text-white">
                  {accionInfo.title}
                </h1>
                <p className="text-sm text-brand-50 mt-1">
                  {accionInfo.description}
                </p>
              </div>
              <button
                onClick={handleCerrar}
                className="text-white hover:text-brand-100 transition-colors"
                type="button"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {accionInfo.id === 'reabasto_urgente' 
                  ? 'Análisis y Ejecución de Reabasto Urgente' 
                  : 'Configurar y Ejecutar Acción'}
              </span>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2.5 py-1 rounded-full font-medium">
                Listo para ejecutar
              </span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="px-6 py-8">
            {renderPaso()}
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// ========================= PASO 1: CONFIGURACIÓN =========================
interface Paso1ConfiguracionProps {
  datos: DatosAccionGeneral;
  accionInfo: AccionInfo;
  onActualizar: (datos: Partial<DatosAccionGeneral>) => void;
  onEjecutar: () => void;
}

function Paso1Configuracion({ datos, accionInfo, onActualizar, onEjecutar }: Paso1ConfiguracionProps) {
  const [parametros, setParametros] = useState<ParametrosAccionGeneral>(datos.parametros);

  const handleParametroChange = (key: keyof ParametrosAccionGeneral, value: any) => {
    const nuevosParametros = { ...parametros, [key]: value };
    setParametros(nuevosParametros);
  };

  const handleEjecutarAccion = () => {
    onActualizar({ parametros });
    onEjecutar();
  };

  const renderFormulario = () => {
    switch (accionInfo.id) {
      case 'reabasto_urgente':
        return (
          <div className="space-y-6">
            <ReabastoUrgenteCard showTitle={false} showButtons={true} />
            
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Datos en Tiempo Real
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Las métricas mostradas se calculan automáticamente basándose en el estado actual del inventario, 
                    ventas promedio y nivel de stock en las {accionInfo.tiendas} tiendas HOT y Balanceadas con inventario crítico.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'exhibiciones_adicionales':
        return (
          <div className="space-y-6">
            <ExhibicionesAdicionalesCard showTitle={false} showConfig={true} />
            
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Datos Calculados en Tiempo Real
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Las métricas mostradas se calculan automáticamente basándose en el costo y el incremento esperado en ventas. 
                    Los datos se actualizan al modificar los parámetros para mostrar las oportunidades viables en tiempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'promocion_evacuar':
        return (
          <div className="space-y-6">
            <PromocionEvacuarCard showTitle={false} showConfig={true} />
            
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Datos Calculados en Tiempo Real
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Las métricas se calculan automáticamente con base en categorías en riesgo de caducidad, 
                    descuento configurado y elasticidad de precio. Los datos se actualizan al modificar los parámetros.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'visita_promotoria':
        return (
          <div className="space-y-6">
            <VisitaPromotoriaCard showTitle={false} showPhoneMockup={true} />
            
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">
                    Datos en Tiempo Real
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Los datos mostrados provienen de tiendas críticas con productos sin venta. 
                    El mockup muestra la app móvil que usarán los promotores en campo para ejecutar la visita.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {accionInfo.id === 'reabasto_urgente' 
            ? 'Análisis de Reabasto Urgente'
            : accionInfo.id === 'exhibiciones_adicionales'
            ? 'Análisis de Exhibiciones Adicionales'
            : accionInfo.id === 'promocion_evacuar'
            ? 'Análisis de Promoción para Evacuar Inventario'
            : accionInfo.id === 'visita_promotoria'
            ? 'Análisis de Visita Promotoría'
            : 'Configurar Parámetros de Acción'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {accionInfo.id === 'reabasto_urgente'
            ? 'Revisión de métricas calculadas automáticamente con datos en tiempo real'
            : accionInfo.id === 'exhibiciones_adicionales'
            ? 'Configuración y análisis de oportunidades viables con ROI positivo'
            : accionInfo.id === 'promocion_evacuar'
            ? 'Configuración y cálculo de descuentos estratégicos para evacuar inventario en riesgo'
            : accionInfo.id === 'visita_promotoria'
            ? 'Revisión de tiendas críticas y planificación de visitas de promotoría en campo'
            : 'Define los parámetros específicos para esta acción prescriptiva'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {renderFormulario()}
      </div>

      {/* Botón de Acción */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Datos validados y listos para ejecutar</span>
        </div>
        
        <button
          onClick={handleEjecutarAccion}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl font-medium transform hover:scale-105"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Ejecutar Acción
        </button>
      </div>
    </div>
  );
}

// ========================= PASO 2: REVISIÓN =========================
interface Paso2RevisionProps {
  datos: DatosAccionGeneral;
  accionInfo: AccionInfo;
  onActualizar: (datos: Partial<DatosAccionGeneral>) => void;
  onAnterior: () => void;
}

function Paso2Revision({ datos, accionInfo, onActualizar, onAnterior }: Paso2RevisionProps) {
  const [calculando, setCalculando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const metricas = calcularMetricas();
      onActualizar(metricas);
      setCalculando(false);
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calcularMetricas = (): Partial<DatosAccionGeneral> => {
    const tiendas = accionInfo.tiendas;
    let costoEstimado = 0;
    let impactoMonetario = 0;
    let unidadesAfectadas = 0;

    switch (accionInfo.id) {
      case 'reabasto_urgente':
        costoEstimado = tiendas * 250; // Costo logístico
        impactoMonetario = tiendas * 4500; // Venta incremental
        unidadesAfectadas = tiendas * (datos.parametros.nivelStockObjetivo || 500);
        break;
        
      case 'exhibiciones_adicionales':
        costoEstimado = tiendas * (datos.parametros.costoExhibicion || 1500);
        impactoMonetario = tiendas * 8500;
        unidadesAfectadas = tiendas * 450;
        break;
        
      case 'promocion_evacuar':
        const descuento = datos.parametros.porcentajeDescuento || 35;
        costoEstimado = tiendas * 180 * (descuento / 100);
        impactoMonetario = tiendas * 3800;
        unidadesAfectadas = tiendas * 350;
        break;
        
      case 'visita_promotoria':
        const horas = datos.parametros.duracionHoras || 3;
        costoEstimado = tiendas * horas * 200;
        impactoMonetario = tiendas * 4200;
        unidadesAfectadas = tiendas * 280;
        break;
        
      default:
        costoEstimado = tiendas * 200;
        impactoMonetario = tiendas * 3000;
        unidadesAfectadas = tiendas * 300;
    }

    const roiProyectado = ((impactoMonetario - costoEstimado) / costoEstimado) * 100;

    return {
      costoEstimado,
      impactoMonetario,
      roiProyectado,
      unidadesAfectadas
    };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(Math.round(num));
  };

  if (calculando) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Calculando métricas del plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Revisar y Confirmar Plan
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Análisis consolidado de costos, impacto y ROI proyectado
        </p>
      </div>

      {/* Métricas Consolidadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 rounded-lg shadow-sm border border-red-200 dark:border-red-800 p-6">
          <div className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
            Costo Total Estimado
          </div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">
            {formatCurrency(datos.costoEstimado)}
          </div>
          <div className="text-xs text-red-600 dark:text-red-400 mt-1">
            Inversión requerida
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg shadow-sm border border-green-200 dark:border-green-800 p-6">
          <div className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            Impacto Monetario
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {formatCurrency(datos.impactoMonetario)}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Retorno proyectado
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800 p-6">
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
            ROI Proyectado
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {datos.roiProyectado.toFixed(0)}%
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            Retorno sobre inversión
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-lg shadow-sm border border-purple-200 dark:border-purple-800 p-6">
          <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            Unidades Afectadas
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatNumber(datos.unidadesAfectadas)}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
            Total unidades
          </div>
        </div>
      </div>

      {/* Resumen del Plan */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resumen del Plan
          </h3>
        </div>

        <div className="p-6 space-y-6">
          {/* Alcance */}
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Alcance de la Acción
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tiendas Afectadas</span>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{formatNumber(datos.tiendasAfectadas)}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Tipo de Tiendas</span>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{accionInfo.tipo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parámetros Configurados */}
          <div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Parámetros Configurados
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {Object.entries(datos.parametros).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-white">
                      {typeof value === 'number' ? value : value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis de Viabilidad */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Plan Altamente Viable
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Este plan tiene un ROI proyectado de <strong>{datos.roiProyectado.toFixed(0)}%</strong>, 
              con un impacto monetario estimado de <strong>{formatCurrency(datos.impactoMonetario)}</strong> y 
              utilidad neta de <strong>{formatCurrency(datos.impactoMonetario - datos.costoEstimado)}</strong>.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Estimaciones basadas en datos históricos y parámetros configurados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

