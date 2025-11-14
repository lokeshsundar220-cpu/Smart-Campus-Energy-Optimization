
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { OptimizationPlanner } from './components/OptimizationPlanner';
import { DeviceControl } from './components/DeviceControl';
import { Reports } from './components/Reports';
import type { View, UserRole } from './types';
import { mockBuildings, mockDevices } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Admin');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard userRole={currentUserRole} />;
      case 'planner':
        return <OptimizationPlanner userRole={currentUserRole} />;
      case 'devices':
        return <DeviceControl userRole={currentUserRole} />;
      case 'reports':
        return <Reports userRole={currentUserRole} />;
      default:
        return <Dashboard userRole={currentUserRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        userRole={currentUserRole} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userRole={currentUserRole} 
          setUserRole={setCurrentUserRole} 
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
