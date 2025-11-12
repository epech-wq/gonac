import type { Metadata } from "next";
import PriorizacionOportunidadesView from "@/components/vemio/views/PriorizacionOportunidadesView";

export const metadata: Metadata = {
  title: "Centro de Priorización de Oportunidades | GONAC",
  description: "Vista de priorización de oportunidades con cards apiladas y diseño minimalista",
};

export default function PriorizacionDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 mx-auto max-w-7xl md:p-6 lg:p-8">
        <PriorizacionOportunidadesView />
      </div>
    </div>
  );
}

