import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Globe,
  ChevronDown,
  Bell,
  User,
  CreditCard,
  LogOut,
  Settings,
  Shield,
  Check,
  ExternalLink,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Region, UserProfile } from '../types';
import { REGIONS_LIST } from '../data/navigation';

interface HeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  activeRegion: Region;
  onSelectRegion: (region: Region) => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  activeRegion,
  onSelectRegion,
  user
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotificationPopover, setShowNotificationPopover] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const regionRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) {
        setShowRegionDropdown(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotificationPopover(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-12 bg-white border-b border-slate-200/90 px-3 flex items-center justify-between sticky top-0 z-40 select-none shadow-xs">
      {/* Left side: Collapse button + Logo */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title={sidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
          id="sidebar-toggle-btn"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Logo area */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5">
            {/* Stylized Red Venus Icon */}
            <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-tr from-rose-600 to-red-500 text-white font-black text-xs shadow-xs italic">
              V
            </div>
            <span className="text-base font-bold text-red-600 tracking-tight italic font-sans">
              Venus
            </span>
          </div>
          <span className="text-xs font-medium text-slate-800 bg-slate-100/80 px-1.5 py-0.5 rounded text-[12px]">
            智算服务
          </span>
        </div>
      </div>

      {/* Right side: Region, Balance, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-4 text-xs">
        {/* Region Selector Dropdown */}
        <div className="relative" ref={regionRef}>
          <button
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className="flex items-center space-x-1 px-2 py-1 text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 rounded transition-colors cursor-pointer"
            id="region-select-btn"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono text-slate-700 font-medium">{activeRegion.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showRegionDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showRegionDropdown && (
            <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                切换调度集群/数据中心
              </div>
              {REGIONS_LIST.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    onSelectRegion(r);
                    setShowRegionDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    activeRegion.id === r.id ? 'bg-indigo-50/60 text-indigo-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-mono text-xs">{r.name}</div>
                    <div className="text-[11px] text-slate-400">{r.provider}</div>
                  </div>
                  {activeRegion.id === r.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Balance Badge (Matching Screenshot: Gold Icon + -¥94,736) */}
        <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-50/80 border border-amber-200/60 text-amber-900 font-mono font-medium">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">
            ¥
          </div>
          <span className="text-xs">{user.balance}</span>
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotificationPopover(!showNotificationPopover);
              if (showNotificationPopover) setUnreadCount(0);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors relative cursor-pointer"
            title="通知中心"
            id="notifications-btn"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotificationPopover && (
            <div className="absolute right-0 mt-1 w-72 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="font-semibold text-slate-800 text-xs">系统通知</span>
                <button
                  onClick={() => setUnreadCount(0)}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  全部标为已读
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-medium text-slate-800">集群调度通知</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">dc-aliyun 节点训练任务 Slot-14 调度完成</div>
                  <div className="text-[10px] text-slate-400 mt-1">10分钟前</div>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-100">
                  <div className="font-medium text-slate-800">算力额度变动</div>
                  <div className="text-slate-500 text-[11px] mt-0.5">后付费资源包扣费提醒已送达账单中心</div>
                  <div className="text-[10px] text-slate-400 mt-1">2小时前</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-1.5 pl-1.5 pr-2 py-0.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            id="user-profile-btn"
          >
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-medium shadow-xs">
              <User className="w-3 h-3" />
            </div>
            <span className="font-medium text-slate-700">{user.name}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="font-semibold text-slate-800">{user.name}</div>
                <div className="text-[11px] text-slate-500">{user.role}</div>
              </div>
              <button className="w-full text-left px-3 py-1.5 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>账号与安全</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span>费用中心</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>平台首选项</span>
              </button>
              <button className="w-full text-left px-3 py-1.5 flex items-center space-x-2 text-slate-700 hover:bg-slate-50 transition-colors">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>使用文档</span>
              </button>
              <div className="border-t border-slate-100 my-1" />
              <button className="w-full text-left px-3 py-1.5 flex items-center space-x-2 text-rose-600 hover:bg-rose-50 transition-colors">
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>退出登录</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
