"use client";

import { useSearchParams } from "next/navigation";
import WizardPlanPrescriptivo from "@/components/plan-wizard/WizardPlanPrescriptivo";

export default function WizardPlanPage() {
  const searchParams = useSearchParams();
  const oportunidadId = searchParams.get('oportunidadId') || undefined;
  const oportunidadType = searchParams.get('oportunidadType') || undefined;

  return (
    <WizardPlanPrescriptivo 
      oportunidadId={oportunidadId}
      oportunidadType={oportunidadType}
    />
  );
}

