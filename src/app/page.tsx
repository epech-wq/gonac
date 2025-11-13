"use client";

import VemioDashboard from "@/components/vemio/VemioDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RootPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="p-4 mx-auto max-w-7xl md:p-6">
          <VemioDashboard />
        </div>
      </div>
    </ProtectedRoute>
  );
}