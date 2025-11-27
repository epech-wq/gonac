"use client";

import { useState } from "react";
import {
  DashboardContent,
  OportunidadesContent,
  AnalisisCausasContent,
  ReabastecimientoLayout,
  NavigationFilters,
  NavigationBreadcrumb,
  CoDisenoModal,
  DatePicker,
} from "@/components/vemio-dashboard";
import type { NavigationState, TimePeriod } from "@/components/vemio-dashboard/types";
import { GridIcon, ShootingStarIcon, AlertIcon, PieChartIcon } from "@/icons";

type TabType = "dashboard" | "oportunidades" | "analisis-causas" | "reabastecimiento" | "filters" | "breadcrumb" | "modal" | "datepicker";

export default function ComponentsShowcasePage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [navigationState, setNavigationState] = useState<NavigationState>({});
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("mes");

  const tabs = [
    {
      id: "dashboard" as TabType,
      label: "Dashboard",
      icon: <GridIcon className="h-4 w-4" />,
    },
    {
      id: "oportunidades" as TabType,
      label: "Oportunidades",
      icon: <ShootingStarIcon className="h-4 w-4" />,
    },
    {
      id: "analisis-causas" as TabType,
      label: "Análisis Causas",
      icon: <AlertIcon className="h-4 w-4" />,
    },
    {
      id: "reabastecimiento" as TabType,
      label: "Reabastecimiento",
      icon: <PieChartIcon className="h-4 w-4" />,
    },
    {
      id: "filters" as TabType,
      label: "Filtros",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      ),
    },
    {
      id: "breadcrumb" as TabType,
      label: "Breadcrumb",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      ),
    },
    {
      id: "modal" as TabType,
      label: "Modal",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "datepicker" as TabType,
      label: "Date Picker",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />;
      
      case "oportunidades":
        return <OportunidadesContent />;
      
      case "analisis-causas":
        return <AnalisisCausasContent onVolver={() => setActiveTab("oportunidades")} />;
      
      case "reabastecimiento":
        return (
          <ReabastecimientoLayout
            dashboardContent={<DashboardContent />}
            oportunidadesContent={<OportunidadesContent />}
          />
        );
      
      case "filters":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Navigation Filters Component
              </h3>
              <NavigationFilters
                navigationState={navigationState}
                onNavigationChange={(state) => {
                  setNavigationState(state);
                  console.log("Navigation changed:", state);
                }}
                onExport={() => console.log("Export clicked")}
                timePeriod={timePeriod}
                onTimePeriodChange={(period) => {
                  setTimePeriod(period);
                  console.log("Time period changed:", period);
                }}
              />
            </div>
          </div>
        );
      
      case "breadcrumb":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Navigation Breadcrumb Component
              </h3>
              <NavigationBreadcrumb
                items={[
                  { label: "Canal: Auto Servicio", level: "canal", value: "auto-servicio" },
                  { label: "Geografía: Centro", level: "geografia", value: "centro" },
                  { label: "Árbol: Walmart", level: "arbol", value: "walmart" },
                ]}
                onNavigate={(level, value) => {
                  console.log("Breadcrumb navigate:", level, value);
                  // Update navigation state based on breadcrumb click
                  const newState: NavigationState = {};
                  if (level === "canal") newState.canal = value;
                  if (level === "geografia") newState.geografia = value;
                  if (level === "arbol") newState.arbol = value;
                  setNavigationState(newState);
                }}
              />
            </div>
          </div>
        );
      
      case "modal":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Co-Diseño Modal Component
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Abrir Modal
              </button>
              <CoDisenoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(data) => {
                  console.log("Modal data saved:", data);
                  setIsModalOpen(false);
                }}
              />
            </div>
          </div>
        );
      
      case "datepicker":
        return (
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Date Picker Component
              </h3>
              <div className="space-y-4">
                <DatePicker
                  value={new Date().toISOString().split("T")[0]}
                  onChange={(date) => console.log("Date selected:", date)}
                  placeholder="Seleccionar fecha"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a date using the date picker above
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Vemio Dashboard Components Showcase
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore all available components from the vemio-dashboard library
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-6 rounded-lg bg-white shadow-sm dark:bg-gray-800">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-4 overflow-x-auto overflow-y-hidden px-4 md:space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap border-b-2 py-4 px-2 text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px] rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

