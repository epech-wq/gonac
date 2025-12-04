import TiendasConsolidadas from "@/components/TiendasConsolidadas";

interface ResumenViewProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: any) => void;
}

export default function ResumenView({ chatOpen, onCardClick }: ResumenViewProps) {
  return <TiendasConsolidadas chatOpen={chatOpen} onCardClick={onCardClick} />;
}