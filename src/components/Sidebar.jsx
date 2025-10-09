import { Home, CalendarCheck, Bot, Hospital, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import React from 'react';
const navItems = [
  { name: 'Home', icon: <Home size={18} />, path: '/' },
  { name: 'ChatBot', icon: <Bot size={18} />, path: '/chatbot' },
  { name: 'Appointments', icon: <CalendarCheck size={18} />, path: '/appointment' },
  { name: 'NearByHospitals', icon: <Hospital size={18} />, path: '/nearByHospitals' },
];

export default function Sidebar({ isSidebarVisible }) {
  if (!isSidebarVisible) return null;

  return (
    <aside className="w-64 h-100% bg-white shadow-lg p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-8 text-secondary">MediAssistAI</h2>
        <nav className="space-y-3">
          {navItems.map(item => (
            <NavLink
              to={item.path}
              key={item.name}
className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-dark-900'
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      {/* <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-100">
        <LogOut size={18} /> Logout
      </button> */}
    </aside>
  );
}