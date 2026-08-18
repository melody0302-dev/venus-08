import React from 'react';
import {
  LayoutDashboard,
  ListTodo,
  Box,
  KeyRound,
  Monitor,
  Cpu,
  Activity,
  HardDrive,
  Building2,
  Sliders,
  SlidersHorizontal,
  Receipt,
  Wallet,
  FileText,
  Settings,
  Flame,
  Boxes,
  GitFork,
  HelpCircle
} from 'lucide-react';
import { NAVIGATION_GROUPS } from '../data/navigation';
import { NavItem } from '../types';

interface SidebarProps {
  collapsed: boolean;
  activeId: string;
  onSelectNavItem: (id: string) => void;
}

// Icon helper renderer matching exact icons from reference screenshot
const renderNavIcon = (iconName: string, className = "w-4 h-4") => {
  switch (iconName) {
    case 'LayoutDashboard': return <LayoutDashboard className={className} />;
    case 'ListTodo': return <ListTodo className={className} />;
    case 'Box': return <Box className={className} />;
    case 'KeyRound': return <KeyRound className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Cpu': return <Cpu className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'HardDrive': return <HardDrive className={className} />;
    case 'Building2': return <Building2 className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'SlidersHorizontal': return <SlidersHorizontal className={className} />;
    case 'Receipt': return <Receipt className={className} />;
    case 'Wallet': return <Wallet className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Settings': return <Settings className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Boxes': return <Boxes className={className} />;
    case 'GitFork': return <GitFork className={className} />;
    default: return <HelpCircle className={className} />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  activeId,
  onSelectNavItem
}) => {
  return (
    <aside
      className={`bg-[#f8fafc] border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 select-none z-30 shrink-0 ${
        collapsed ? 'w-14' : 'w-52'
      }`}
      style={{ height: 'calc(100vh - 3rem)' }}
    >
      {/* Navigation Scrollable Body */}
      <div className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3 custom-scrollbar">
        {NAVIGATION_GROUPS.map((group) => (
          <div key={group.id} className="space-y-0.5">
            {/* Section Header */}
            {group.title && !collapsed && (
              <div className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {group.title}
              </div>
            )}
            {group.title && collapsed && (
              <div className="w-full my-1 border-t border-slate-200/60" />
            )}

            {/* Menu Items */}
            {group.items.map((item: NavItem) => {
              const isActive = activeId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectNavItem(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all group relative cursor-pointer ${
                    isActive
                      ? 'bg-blue-50/90 text-blue-600 font-semibold shadow-2xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  id={`nav-item-${item.id}`}
                >
                  <span className={`shrink-0 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'}`}>
                    {renderNavIcon(item.iconName, 'w-4 h-4')}
                  </span>

                  {!collapsed && (
                    <span className="truncate tracking-tight leading-tight">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip on collapsed hover */}
                  {collapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[11px] font-normal rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer info inside sidebar */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-200/60 bg-slate-100/50 text-[11px] text-slate-400">
          <div className="flex items-center justify-between">
            <span>Venus OS v2.4</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="控制平面正常" />
          </div>
        </div>
      )}
    </aside>
  );
};
