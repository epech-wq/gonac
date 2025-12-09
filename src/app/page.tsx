"use client";

import Dashboard from "@/views/Dashboard";
import ProtectedRoute from "@/components/lib/auth/ProtectedRoute";

export default function RootPage() {
  return (
    <ProtectedRoute>
      <div className="dark:bg-gray-900 transition-all duration-300">
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}