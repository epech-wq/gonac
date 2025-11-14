"use client";

import { useState } from "react";
import { vemioMockData } from "@/data/vemio-mock-data";
import VemioHeader from "./VemioHeader";
import VemioTabs from "./VemioTabs";
import ResumenView from "./views/ResumenView";
import AccionesView from "./views/AccionesView";

export type TabType = "resumen" | "acciones";

export default function VemioDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("resumen");

  const renderTabContent = () => {
    switch (activeTab) {
      case "resumen":
        return <ResumenView />;
      case "acciones":
        return <AccionesView data={vemioMockData.acciones} />;
      default:
        return <ResumenView />;
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