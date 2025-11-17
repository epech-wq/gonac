"use client";

import { useState } from "react";
import VemioDashboard from "@/components/vemio/VemioDashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function RootPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className={`p-4 mx-auto md:p-6 transition-all duration-300 ${chatOpen ? 'max-w-[96rem]' : 'max-w-7xl'}`}>
          <VemioDashboard onChatStateChange={setChatOpen} />
        </div>
      </div>
    </ProtectedRoute>
  );
}