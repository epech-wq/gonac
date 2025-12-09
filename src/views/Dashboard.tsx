"use client";

import { useState } from "react";
import ResumenView from "../components/views/ResumenView";
import VemioAnalysisChat from "../components/VemioAnalysisChat";

interface DashboardProps {
  onChatStateChange?: (isOpen: boolean) => void;
}

export default function Dashboard({ onChatStateChange }: DashboardProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedCardData, setSelectedCardData] = useState<unknown>(null);

  const handleCardClick = (cardData: unknown) => {
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