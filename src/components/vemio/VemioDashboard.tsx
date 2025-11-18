"use client";

import { useState } from "react";
import { vemioMockData } from "@/data/vemio-mock-data";
import VemioHeader from "./VemioHeader";
import VemioTabs from "./VemioTabs";
import ResumenView from "./views/ResumenView";
import TiendasView from "./views/TiendasView";
import SKUsView from "./views/SKUsView";
import OportunidadesView from "./views/OportunidadesView";
import AccionesView from "./views/AccionesView";

export type TabType = "resumen" | "tiendas" | "skus" | "oportunidades" | "acciones";

export default function VemioDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("resumen");

  const renderTabContent = () => {
    switch (activeTab) {
      case "resumen":
        return <ResumenView data={vemioMockData.resumen} />;
      case "tiendas":
        return <TiendasView data={vemioMockData} />;
      case "skus":
        return <SKUsView data={vemioMockData.skus} />;
      case "oportunidades":
        return <OportunidadesView data={vemioMockData.oportunidades} />;
      case "acciones":
        return <AccionesView data={vemioMockData.acciones} />;
      default:
        return <ResumenView data={vemioMockData.resumen} />;
    }
  };

  return (
    <div className="space-y-6">
      <VemioHeader projectInfo={vemioMockData.projectInfo} />
      <VemioTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="min-h-[600px]">
        {renderTabContent()}
      </div>
    </div>
  );
}