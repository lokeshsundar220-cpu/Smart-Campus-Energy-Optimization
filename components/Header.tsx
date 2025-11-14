
import React from 'react';
import type { UserRole } from '../types';
import { UserIcon, ChevronDownIcon } from './icons';

interface HeaderProps {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, setUserRole }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <h1 className="text-xl md:text-2xl font-bold text-brand-secondary">
        Smart Campus Energy Planner
      </h1>
      <div className="relative">
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as UserRole)}
          className="appearance-none bg-brand-light border border-brand-primary text-brand-secondary text-sm rounded-lg focus:ring-brand-accent focus:border-brand-accent block w-full pl-10 pr-4 py-2"
        >
          <option>Admin</option>
          <option>Energy Manager</option>
          <option>Faculty/Staff</option>
          <option>Student</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <UserIcon className="h-5 w-5 text-brand-secondary" />
        </div>
         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <ChevronDownIcon className="h-4 w-4 text-brand-secondary" />
        </div>
      </div>
    </header>
  );
};
