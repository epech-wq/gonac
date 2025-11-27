"use client";
import React from "react";
import type { BreadcrumbItem } from "./types";

interface NavigationBreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (level: string, value: string) => void;
}

const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  items,
  onNavigate,
}) => {
  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <ol className="flex items-center gap-1.5">
        <li>
          <button
            onClick={() => onNavigate("root", "")}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Inicio
          </button>
        </li>
        {items.map((item, index) => (
          <React.Fragment key={`${item.level}-${item.value}-${index}`}>
            <li className="text-gray-400 dark:text-gray-500" aria-hidden="true">
              /
            </li>
            <li>
              <button
                onClick={() => item.onClick?.() || onNavigate(item.level, item.value)}
                className={`${
                  index === items.length - 1
                    ? "text-gray-800 font-medium dark:text-white/90"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {item.label}
              </button>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumb;

