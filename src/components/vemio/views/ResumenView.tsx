"use client";

import { useState } from "react";
import AnalisisCausasContent from "@/components/vemio-dashboard/AnalisisCausasContent";
import TiendasConsolidadas from "../sections/TiendasConsolidadas";

interface ResumenViewProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: any) => void;
}

export default function ResumenView({ chatOpen, onCardClick }: ResumenViewProps) {
  const [showAnalisisCausas, setShowAnalisisCausas] = useState(false); // Start with TiendasConsolidadas

  const handleShowAnalisisCausas = () => {
    // Show AnalisisCausasContent, replacing the entire view
    setShowAnalisisCausas(true);
  };

  const handleVolver = () => {
    // Return to the original TiendasConsolidadas view
    setShowAnalisisCausas(false);
  };

  // Show AnalisisCausasContent when requested, otherwise show TiendasConsolidadas
  if (showAnalisisCausas) {
    return (
      <AnalisisCausasContent 
        onVolver={handleVolver}
        backButtonLabel="Volver a Agente Vemio"
        showBackButton={true}
      />
    );
  }

  return (
    <TiendasConsolidadas 
      chatOpen={chatOpen} 
      onCardClick={onCardClick}
      onVerAnalisisCompleto={handleShowAnalisisCausas}
    />
  );
}