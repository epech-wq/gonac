/**
 * TiendasConsolidadas Component
 * Main component for displaying consolidated store data with metrics, opportunities, and actions
 * Refactored following SOLID principles for better maintainability and reusability
 */

"use client";

interface TiendasConsolidadasProps {
  chatOpen?: boolean;
  onCardClick?: (cardData: unknown) => void;
}

export default function TiendasConsolidadas({ }: TiendasConsolidadasProps) {

  return (
    <div className="relative">
      {/* Main Card - Consolidated View */}
      <div className="dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Todas las Tiendas
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Resumen general del universo de tiendas y oportunidades detectadas
              </p>
            </div>
          </div>
        </div>

        {/* Opportunities Section */}
        {/* <OpportunitiesSection opportunities={opportunities} onChatOpen={onCardClick} /> */}
      </div>
    </div>
  );
}
