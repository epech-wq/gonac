import type { Metadata } from "next";
import VemioDashboard from "@/components/vemio/VemioDashboard";

export const metadata: Metadata = {
  title: "GONAC | Dashboard Comercial",
  description: "Dashboard de inteligencia comercial VEMIO para gestión de cuentas críticas",
};

export default function RootPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4 mx-auto max-w-7xl md:p-6">
        <VemioDashboard />
      </div>
    </div>
  );
}