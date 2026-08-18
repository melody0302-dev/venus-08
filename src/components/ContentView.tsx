import React from 'react';
import { NavItem, Region, UserProfile } from '../types';
import { NAVIGATION_GROUPS } from '../data/navigation';
import { OverviewDashboard } from './OverviewDashboard';
import { Layers, RefreshCw, CheckCircle } from 'lucide-react';

interface ContentViewProps {
  activeNavItemId: string;
  activeRegion: Region;
  user: UserProfile;
  onSelectNavItem: (id: string) => void;
}

export const ContentView: React.FC<ContentViewProps> = ({
  activeNavItemId,
  activeRegion,
  user,
}) => {
  // Find current nav item details
  let activeItem: NavItem | undefined;

  for (const group of NAVIGATION_GROUPS) {
    const found = group.items.find(i => i.id === activeNavItemId);
    if (found) {
      activeItem = found;
      break;
    }
  }

  const pageTitle = activeItem ? activeItem.label : '概览';

  return (
    <div className="flex-1 overflow-y-auto bg-[#f4f6f9] p-6 space-y-6">
      {/* Top Welcome / Header Banner matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          {/* Page Title */}
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs flex items-center space-x-1 cursor-pointer transition-colors shadow-2xs"
            title="刷新数据"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render Overview Dashboard if on Overview menu, otherwise render blank content slot */}
      {activeNavItemId === 'overview' ? (
        <OverviewDashboard activeRegion={activeRegion} user={user} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-8 min-h-[520px] flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

          <div className="relative z-10 max-w-md space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-sm">
              <Layers className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 mb-1">
                页面视图空置槽 (Content Slot)
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                「{pageTitle}」模块内容区
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                当前菜单项已锁定，页面主体内容留空，可随时根据业务需求填充具体表格、图表或算力控制组件。
              </p>
            </div>

            <div className="pt-2 grid grid-cols-3 gap-3 text-left">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div className="text-slate-400 text-[10px]">当前菜单</div>
                <div className="font-semibold text-slate-800 mt-0.5">{pageTitle}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div className="text-slate-400 text-[10px]">控制平面</div>
                <div className="font-semibold text-emerald-600 mt-0.5 flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>已就绪</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <div className="text-slate-400 text-[10px]">响应状态</div>
                <div className="font-semibold text-indigo-600 mt-0.5">200 OK</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
