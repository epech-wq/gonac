"use client";

import VemioDashboard from "@/components/VemioDashboard";
import ProtectedRoute from "@/components/lib/auth/ProtectedRoute";

export default function RootPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen dark:bg-gray-900 transition-all duration-300">
        <VemioDashboard />
      </div>
    </ProtectedRoute>
  );
}