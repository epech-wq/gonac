"use client";
import React, { useState } from "react";
import { GridIcon, ShootingStarIcon } from "@/icons";

interface TabItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface ReabastecimientoLayoutProps {
  dashboardContent: React.ReactNode;
  oportunidadesContent: React.ReactNode;
}

const ReabastecimientoLayout: React.FC<ReabastecimientoLayoutProps> = ({
  dashboardContent,
  oportunidadesContent,
}) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const tabs: TabItem[] = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: <GridIcon />,
      content: dashboardContent,
    },
    {
      key: "oportunidades",
      title: "Oportunidades",
      icon: <ShootingStarIcon />,
      content: oportunidadesContent,
    },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          VEMIO
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Agente para Optimización CPFR
        </p>
      </header>

      {/* Navigation Tabs */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <nav className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out rounded-lg relative ${
                activeTab === tab.key
                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {/* Color indicator for active tab */}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t-full"></span>
              )}
              <span className={`flex-shrink-0 flex items-center justify-center min-w-[1rem] min-h-[1rem] ${activeTab === tab.key ? "text-brand-600 dark:text-brand-400" : ""}`}>
                {tab.icon}
              </span>
              <span className="whitespace-nowrap">{tab.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {tabs.map(
          (tab) =>
            activeTab === tab.key && (
              <div key={tab.key} className="w-full">
                {tab.content}
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default ReabastecimientoLayout;

