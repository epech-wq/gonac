"use client";

import { useState, useEffect } from "react";
import { DatosWizard, Tienda, SKU } from "../WizardPlanPrescriptivo";

interface Paso1AlcanceProps {
  datos: DatosWizard;
  onActualizar: (datos: Partial<DatosWizard>) => void;
  onSiguiente: () => void;
  oportunidadId?: string;
  oportunidadType?: string;
}

// Mock data - TODO: conectar con API real
const tiendasMock: Tienda[] = [
  { id: "T001", nombre: "Supercito Centro", ubicacion: "Centro Histórico", segmento: "Hot" },
  { id: "T002", nombre: "Supercito Norte", ubicacion: "Zona Norte", segmento: "Slow" },
  { id: "T003", nombre: "Supercito Sur", ubicacion: "Zona Sur", segmento: "Hot" },
  { id: "T004", nombre: "Supercito Oriente", ubicacion: "Zona Oriente", segmento: "Critica" },
  { id: "T005", nombre: "Supercito Poniente", ubicacion: "Zona Poniente", segmento: "Balanceada" },
];

const skusMock: SKU[] = [
  { id: "SKU001", nombre: "Producto A Premium", categoria: "Premium", inventario: 250, precio: 45.00 },
  { id: "SKU002", nombre: "Producto B Estándar", categoria: "Estándar", inventario: 500, precio: 32.00 },
  { id: "SKU003", nombre: "Producto C Económico", categoria: "Económico", inventario: 800, precio: 18.50 },
  { id: "SKU004", nombre: "Producto D Premium Plus", categoria: "Premium", inventario: 150, precio: 65.00 },
  { id: "SKU005", nombre: "Producto E Familiar", categoria: "Familiar", inventario: 600, precio: 28.00 },
];

export default function Paso1Alcance({ datos, onActualizar, onSiguiente, oportunidadId, oportunidadType }: Paso1AlcanceProps) {
  const [activeTab, setActiveTab] = useState<'stores' | 'products'>('stores');
  const [filtroTiendas, setFiltroTiendas] = useState("");
  const [filtroSKUs, setFiltroSKUs] = useState("");
  const [tiendasSeleccionadas, setTiendasSeleccionadas] = useState<Tienda[]>(
    datos.tiendasSeleccionadas || []
  );
  const [skusSeleccionados, setSkusSeleccionados] = useState<SKU[]>(
    datos.skusSeleccionados || []
  );

  // Pre-seleccionar tiendas y SKUs basados en la oportunidad
  useEffect(() => {
    if (oportunidadId && tiendasSeleccionadas.length === 0 && skusSeleccionados.length === 0) {
      // Aquí se cargarían los datos reales de la API basados en oportunidadId
      // Por ahora, pre-seleccionamos algunos según el tipo de oportunidad
      
      if (oportunidadType === 'agotado') {
        // Para agotado, seleccionar tiendas Hot
        const tiendasHot = tiendasMock.filter(t => t.segmento === 'Hot');
        setTiendasSeleccionadas(tiendasHot);
        // Pre-seleccionar algunos SKUs
        setSkusSeleccionados([skusMock[0], skusMock[2]]);
      } else if (oportunidadType === 'caducidad') {
        // Para caducidad, seleccionar tiendas Slow y Críticas
        const tiendasSlow = tiendasMock.filter(t => t.segmento === 'Slow' || t.segmento === 'Critica');
        setTiendasSeleccionadas(tiendasSlow);
        setSkusSeleccionados([skusMock[3], skusMock[4]]);
      } else if (oportunidadType === 'sinVenta') {
        // Para sin venta, seleccionar tiendas críticas
        const tiendasCriticas = tiendasMock.filter(t => t.segmento === 'Critica');
        setTiendasSeleccionadas(tiendasCriticas);
        setSkusSeleccionados([skusMock[1]]);
      } else if (oportunidadType === 'bajoSellThrough') {
        // Para bajo sell-through, seleccionar varias tiendas
        setTiendasSeleccionadas([tiendasMock[0], tiendasMock[2], tiendasMock[4]]);
        setSkusSeleccionados([skusMock[0], skusMock[2], skusMock[4]]);
      } else {
        // Por defecto, pre-seleccionar algunos elementos
        setTiendasSeleccionadas([tiendasMock[0]]);
        setSkusSeleccionados([skusMock[0]]);
      }
    }
  }, [oportunidadId, oportunidadType]);

  const toggleTienda = (tienda: Tienda) => {
    const yaSeleccionada = tiendasSeleccionadas.find(t => t.id === tienda.id);
    if (yaSeleccionada) {
      setTiendasSeleccionadas(tiendasSeleccionadas.filter(t => t.id !== tienda.id));
    } else {
      setTiendasSeleccionadas([...tiendasSeleccionadas, tienda]);
    }
  };

  const toggleSKU = (sku: SKU) => {
    const yaSeleccionado = skusSeleccionados.find(s => s.id === sku.id);
    if (yaSeleccionado) {
      setSkusSeleccionados(skusSeleccionados.filter(s => s.id !== sku.id));
    } else {
      setSkusSeleccionados([...skusSeleccionados, sku]);
    }
  };

  const handleContinuar = () => {
    onActualizar({
      tiendasSeleccionadas,
      skusSeleccionados
    });
    onSiguiente();
  };

  const tiendasFiltradas = tiendasMock.filter(t =>
    t.nombre.toLowerCase().includes(filtroTiendas.toLowerCase()) ||
    t.ubicacion.toLowerCase().includes(filtroTiendas.toLowerCase())
  );

  const skusFiltrados = skusMock.filter(s =>
    s.nombre.toLowerCase().includes(filtroSKUs.toLowerCase()) ||
    s.categoria.toLowerCase().includes(filtroSKUs.toLowerCase())
  );

  const getSegmentoColor = (segmento: string) => {
    switch (segmento.toLowerCase()) {
      case 'hot':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'balanceada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'slow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'critica':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const puedeAvanzar = tiendasSeleccionadas.length > 0 && skusSeleccionados.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Paso 1: Seleccionar Alcance
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Selecciona las tiendas y SKUs que serán incluidos en este plan prescriptivo
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-400 mb-1">
            Tiendas Seleccionadas
          </div>
          <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">
            {tiendasSeleccionadas.length}
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
          <div className="text-sm text-purple-700 dark:text-purple-400 mb-1">
            SKUs Seleccionados
          </div>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-300">
            {skusSeleccionados.length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tab Headers */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('stores')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'stores'
                  ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Stores
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'products'
                  ? 'text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Products
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'stores' ? (
            <div>
              {/* Búsqueda y filtro */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for a store by name or ID"
                    value={filtroTiendas}
                    onChange={(e) => setFiltroTiendas(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>

              {/* Tabla de tiendas */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={tiendasSeleccionadas.length === tiendasFiltradas.length && tiendasFiltradas.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTiendasSeleccionadas(tiendasFiltradas);
                            } else {
                              setTiendasSeleccionadas([]);
                            }
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Store Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Opportunity Score</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiendasFiltradas.map((tienda, index) => {
                      const seleccionada = tiendasSeleccionadas.find(t => t.id === tienda.id);
                      const opportunityScore = 92 - (index * 5); // Mock score
                      return (
                        <tr 
                          key={tienda.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={!!seleccionada}
                              onChange={() => toggleTienda(tienda)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">{tienda.nombre}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-600 dark:text-gray-400">{tienda.ubicacion}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900 dark:text-white">{opportunityScore}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSegmentoColor(tienda.segmento)}`}>
                              {tienda.segmento}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div>
              {/* Búsqueda y filtro para productos */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search for a product by name or ID"
                    value={filtroSKUs}
                    onChange={(e) => setFiltroSKUs(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>

              {/* Tabla de productos */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="py-3 px-4 text-left">
                        <input
                          type="checkbox"
                          checked={skusSeleccionados.length === skusFiltrados.length && skusFiltrados.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSkusSeleccionados(skusFiltrados);
                            } else {
                              setSkusSeleccionados([]);
                            }
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">SKU</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Category</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Price</th>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skusFiltrados.map((sku) => {
                      const seleccionado = skusSeleccionados.find(s => s.id === sku.id);
                      return (
                        <tr 
                          key={sku.id}
                          className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <input
                              type="checkbox"
                              checked={!!seleccionado}
                              onChange={() => toggleSKU(sku)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900 dark:text-white">{sku.nombre}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-600 dark:text-gray-400">{sku.id}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-600 dark:text-gray-400">{sku.categoria}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-900 dark:text-white">${sku.precio.toFixed(2)}</div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-gray-600 dark:text-gray-400">{sku.inventario} units</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer con contador de selecciones */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {tiendasSeleccionadas.length} Store{tiendasSeleccionadas.length !== 1 ? 's' : ''}, {skusSeleccionados.length} Product{skusSeleccionados.length !== 1 ? 's' : ''} Selected
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleContinuar}
          disabled={!puedeAvanzar}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            puedeAvanzar
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

