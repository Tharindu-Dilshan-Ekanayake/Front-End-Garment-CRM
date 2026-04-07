import React from 'react'
import { Outlet } from 'react-router-dom'
import ManagerNav from './ManagerNav'

export default function ManagerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <ManagerNav />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
