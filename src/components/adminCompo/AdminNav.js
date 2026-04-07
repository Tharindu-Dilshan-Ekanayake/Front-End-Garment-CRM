import React from 'react'
import { NavLink } from 'react-router-dom'
import PrimaryButton from '../PrimaryButton'
import { useAuthStore } from '../../store/authStore';

export default function AdminNav() {
    const logout = useAuthStore((state) => state.logout)
  const baseLinkClasses =
    'block px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150'

  return (
    <div className="flex flex-col w-64 h-screen text-white bg-gray-900 border-r border-gray-800">
      <div className="px-4 py-4 text-xl font-bold border-b border-gray-800">
        Admin Panel
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/production"
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Production
        </NavLink>

        <NavLink
          to="/admin/inventory"
          className={({ isActive }) =>
            `${baseLinkClasses} ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`
          }
        >
          Inventory Management
        </NavLink>
      </nav>
      <div className='px-8'>
        <PrimaryButton 
            label="Logout"
            color="red"
            onClick={logout}
        />
      </div>
    </div>
  )
}
