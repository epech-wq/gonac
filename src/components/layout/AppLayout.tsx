"use client";

import { usePathname } from "next/navigation";
import { Navbar, Sidebar } from "@/components/navbar";
import { useSidebar } from "@/context/SidebarContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isExpanded, isHovered } = useSidebar();

  // Define auth routes where Sidebar and Navbar should NOT be shown
  const isAuthRoute = pathname?.startsWith("/login") || pathname?.startsWith("/signup");

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <Sidebar />
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
          }`}
      >
        <Navbar />
        <div className="p-4 mx-auto w-full max-w-7xl transition-all duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
