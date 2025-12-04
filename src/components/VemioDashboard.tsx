"use client";

import { useState } from "react";
import ResumenView from "./views/ResumenView";
import VemioAnalysisChat from "./VemioAnalysisChat";

interface VemioDashboardProps {
  onChatStateChange?: (isOpen: boolean) => void;
}

export default function VemioDashboard({ onChatStateChange }: VemioDashboardProps) {
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

  return (
    <>
      <div className={`space-y-4 transition-all duration-300 ${chatOpen ? 'pr-[372px]' : ''}`}>
        <div className="min-h-[600px]">
          <ResumenView chatOpen={chatOpen} onCardClick={handleCardClick} />
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