"use client";
import React from 'react'
import UserDropdown from '../lib/header/UserDropdown'
import { useSidebar } from '../../context/SidebarContext'

export function Navbar() {
  const { toggleSidebar, toggleMobileSidebar } = useSidebar()

  return (
    <div className='w-full flex justify-between items-center sticky top-0 z-50 bg-white dark:bg-gray-900 p-2 border-b border-gray-200 dark:border-gray-800'>
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:block hidden text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button onClick={toggleMobileSidebar} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden block text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <UserDropdown />
    </div>
  )
}
