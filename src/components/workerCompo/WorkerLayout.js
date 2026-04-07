import React from 'react'
import { Outlet } from 'react-router-dom'
import WorkerNav from './WorkerNav'

export default function WorkerLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <WorkerNav />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
