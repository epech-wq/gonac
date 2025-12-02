"use client";

import { useState, useMemo, useCallback } from "react";
import { vemioMockData } from "@/data/vemio-mock-data";
import VemioHeader from "./VemioHeader";
import VemioTabs from "./VemioTabs";
import ResumenView from "./views/ResumenView";
import AccionesView from "./views/AccionesView";
import HistorialView from "./views/HistorialView";
import VemioAnalysisChat from "./VemioAnalysisChat";
import { VemioFilters, NavigationBreadcrumb } from "@/components/vemio-dashboard";
import type { NavigationState, BreadcrumbItem } from "@/components/vemio-dashboard/types";

export type TabType = "resumen" | "acciones" | "historial";

interface VemioDashboardProps {
  onChatStateChange?: (isOpen: boolean) => void;
}

export default function VemioDashboard({ onChatStateChange }: VemioDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);
  const [navigationState, setNavigationState] = useState<NavigationState>({});

  const handleCardClick = (cardData: any) => {
    setSelectedCardData(cardData);
    setChatOpen(true);
    onChatStateChange?.(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
    setSelectedCardData(null);
    onChatStateChange?.(false);
  };

  const handleNavigationChange = (newState: NavigationState) => {
    setNavigationState(newState);
  };

  const handleBreadcrumbNavigate = useCallback((level: string, value: string) => {
    if (level === "root") {
      setNavigationState({});
      return;
    }
    
    setNavigationState((prevState) => {
      // Remove the clicked level and all subsequent levels
      const newState = { ...prevState };
      const levelOrder: (keyof NavigationState)[] = ["canal", "geografia", "arbol", "cadena", "cliente"];
      const clickedIndex = levelOrder.indexOf(level as keyof NavigationState);
      
      if (clickedIndex !== -1) {
        // Remove clicked level and all subsequent levels
        for (let i = clickedIndex; i < levelOrder.length; i++) {
          delete newState[levelOrder[i]];
        }
      }
      
      return newState;
    });
  }, []);

  const handleExport = () => {
    console.log("Exporting data with filters:", { navigationState });
    // TODO: Implement export functionality
  };

  // Build breadcrumb items from navigation state (only first section: Eje Cliente)
  const breadcrumbItems: BreadcrumbItem[] = useMemo(() => {
    // Helper function to capitalize first letter of each word
    const toTitleCase = (str: string): string => {
      return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
    const items: BreadcrumbItem[] = [];
    
    if (navigationState.canal) {
      items.push({
        label: `Canal: ${toTitleCase(navigationState.canal)}`,
        level: "canal",
        value: navigationState.canal,
        onClick: () => handleBreadcrumbNavigate("canal", navigationState.canal!),
      });
    }
    
    if (navigationState.geografia) {
      items.push({
        label: `Geografía: ${toTitleCase(navigationState.geografia)}`,
        level: "geografia",
        value: navigationState.geografia,
        onClick: () => handleBreadcrumbNavigate("geografia", navigationState.geografia!),
      });
    }
    
    if (navigationState.arbol) {
      items.push({
        label: `Árbol: ${toTitleCase(navigationState.arbol)}`,
        level: "arbol",
        value: navigationState.arbol,
        onClick: () => handleBreadcrumbNavigate("arbol", navigationState.arbol!),
      });
    }
    
    if (navigationState.cadena) {
      items.push({
        label: `Cadena: ${toTitleCase(navigationState.cadena)}`,
        level: "cadena",
        value: navigationState.cadena,
        onClick: () => handleBreadcrumbNavigate("cadena", navigationState.cadena!),
      });
    }
    
    if (navigationState.cliente) {
      items.push({
        label: `Cliente: ${toTitleCase(navigationState.cliente)}`,
        level: "cliente",
        value: navigationState.cliente,
        onClick: () => handleBreadcrumbNavigate("cliente", navigationState.cliente!),
      });
    }
    
    return items;
  }, [navigationState, handleBreadcrumbNavigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "resumen":
        return <ResumenView chatOpen={chatOpen} onCardClick={handleCardClick} />;
      case "acciones":
        return <AccionesView data={vemioMockData.acciones} />;
      case "historial":
        return <HistorialView />;
      default:
        return <ResumenView chatOpen={chatOpen} onCardClick={handleCardClick} />;
    }
  };

  return (
    <>
      <div className={`space-y-6 transition-all duration-300 ${chatOpen ? 'pr-[372px]' : ''}`}>
        <VemioHeader projectInfo={vemioMockData.projectInfo} />
        
        {/* Vemio Filters */}
        <VemioFilters
          navigationState={navigationState}
          onNavigationChange={handleNavigationChange}
          onExport={handleExport}
        />

        {/* Breadcrumb - Only show if there are filters from first section */}
        {breadcrumbItems.length > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
            <NavigationBreadcrumb
              items={breadcrumbItems}
              onNavigate={handleBreadcrumbNavigate}
            />
          </div>
        )}

        <VemioTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="min-h-[600px]">
          {renderTabContent()}
        </div>
      </div>

      {/* Vemio Analysis Chat - Sticky positioned, persists across tabs */}
      {chatOpen && (
        <VemioAnalysisChat
          isOpen={chatOpen}
          onClose={handleChatClose}
          cardData={selectedCardData}
          onCardDataChange={setSelectedCardData}
        />
      )}
    </>
  );
}