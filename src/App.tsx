import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ContentView } from './components/ContentView';
import { REGIONS_LIST } from './data/navigation';
import { Region, UserProfile } from './types';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [activeNavItemId, setActiveNavItemId] = useState<string>('overview');
  const [activeRegion, setActiveRegion] = useState<Region>(REGIONS_LIST[0]);

  // User profile matching screenshot details (admin, -¥94,736 balance)
  const [user] = useState<UserProfile>({
    name: 'admin',
    role: '超级管理员',
    balance: '-¥94,736'
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Header Navigation */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeRegion={activeRegion}
        onSelectRegion={setActiveRegion}
        user={user}
      />

      {/* Main Body Layout: Sidebar + Blank Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          activeId={activeNavItemId}
          onSelectNavItem={setActiveNavItemId}
        />

        {/* Content View Area */}
        <ContentView
          activeNavItemId={activeNavItemId}
          activeRegion={activeRegion}
          user={user}
          onSelectNavItem={setActiveNavItemId}
        />
      </div>
    </div>
  );
}
