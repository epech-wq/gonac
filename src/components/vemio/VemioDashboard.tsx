"use client";

import { useState } from "react";
import { vemioMockData } from "@/data/vemio-mock-data";
import VemioHeader from "./VemioHeader";
import VemioTabs from "./VemioTabs";
import ResumenView from "./views/ResumenView";
import AccionesView from "./views/AccionesView";
import HistorialView from "./views/HistorialView";
import VemioAnalysisChat from "./VemioAnalysisChat";

export type TabType = "resumen" | "acciones" | "historial";

interface VemioDashboardProps {
  onChatStateChange?: (isOpen: boolean) => void;
}

export default function VemioDashboard({ onChatStateChange }: VemioDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<any>(null);

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