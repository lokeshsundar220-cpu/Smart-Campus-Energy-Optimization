
import React from 'react';
import type { View, UserRole } from '../types';
import { DashboardIcon, PlannerIcon, DevicesIcon, ReportsIcon, BoltIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  userRole: UserRole;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 ${
      isActive
        ? 'bg-brand-primary text-white'
        : 'text-gray-600 hover:bg-brand-light hover:text-brand-secondary'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, userRole }) => {
  const navItems = [
    { view: 'dashboard', label: 'Dashboard', icon: <DashboardIcon className="w-6 h-6" />, roles: ['Admin', 'Energy Manager', 'Faculty/Staff', 'Student'] },
    { view: 'planner', label: 'Optimization Planner', icon: <PlannerIcon className="w-6 h-6" />, roles: ['Admin', 'Energy Manager'] },
    { view: 'devices', label: 'Device Control', icon: <DevicesIcon className="w-6 h-6" />, roles: ['Admin'] },
    { view: 'reports', label: 'Reports', icon: <ReportsIcon className="w-6 h-6" />, roles: ['Admin', 'Energy Manager', 'Faculty/Staff'] },
  ];

  const visibleNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="flex flex-col w-64 bg-white border-r shadow-md">
      <div className="flex items-center justify-center h-20 border-b">
         <BoltIcon className="h-8 w-8 text-brand-primary" />
         <span className="ml-2 text-2xl font-bold text-brand-secondary">EnergyOS</span>
      </div>
      <nav className="flex-1 mt-6">
        {visibleNavItems.map(item => (
          <NavItem
            key={item.view}
            icon={item.icon}
            label={item.label}
            isActive={currentView === item.view}
            onClick={() => setCurrentView(item.view as View)}
          />
        ))}
      </nav>
      <div className="p-4 border-t">
          <p className="text-xs text-center text-gray-500">© 2024 Smart Campus Initiative</p>
      </div>
    </div>
  );
};
