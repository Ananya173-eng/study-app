'use client';

import React from 'react';
import { ViewType, User } from '@/types';
import {
  Files,
  FileText,
  CheckSquare,
  TrendingUp,
  BookOpen,
  Sparkles,
  Settings,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

interface ActivityBarProps {
  currentView: ViewType;
  onSelectView: (view: ViewType) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  user: User;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  currentView,
  onSelectView,
  isSidebarOpen,
  onToggleSidebar,
  onOpenSettings,
  onOpenAuth,
  user,
}) => {
  const primaryNavItems: { id: ViewType; icon: React.ReactNode; label: string }[] = [
    { id: 'dashboard', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'notes', icon: <FileText className="w-5 h-5" />, label: 'Study Notes' },
    { id: 'tasks', icon: <CheckSquare className="w-5 h-5" />, label: 'Tasks' },
    { id: 'deadlines', icon: <TrendingUp className="w-5 h-5" />, label: 'Deadlines & Progress' },
    { id: 'materials', icon: <BookOpen className="w-5 h-5" />, label: 'Learning Materials' },
    { id: 'ai-assistant', icon: <Sparkles className="w-5 h-5" />, label: 'AI Study Assistant' },
  ];

  return (
    <aside className="w-12 md:w-13 bg-[#181818] border-r border-[#2b2b2b] flex flex-col justify-between items-center py-2.5 z-30 select-none shrink-0">
      {/* Top tools */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {/* Toggle Explorer Sidebar */}
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? 'Hide Explorer (Ctrl+B)' : 'Show Explorer (Ctrl+B)'}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors mb-1"
        >
          {isSidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
        </button>

        <div className="w-7 h-[1px] bg-white/10 my-1" />

        {/* Explorer shortcut */}
        <button
          onClick={() => {
            if (!isSidebarOpen) onToggleSidebar();
          }}
          title="Explorer (File Tree)"
          className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative ${
            isSidebarOpen ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {isSidebarOpen && (
            <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-blue-500 rounded-r" />
          )}
          <Files className="w-5 h-5" />
        </button>

        {/* Nav items */}
        {primaryNavItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              title={item.label}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors relative group ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-blue-500 rounded-r" />
              )}
              {item.icon}

              {/* Tooltip on hover */}
              <span className="absolute left-13 px-2 py-1 bg-black/90 text-white text-[11px] rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Profile & Settings */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & AI Keys"
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <button
          onClick={onOpenAuth}
          title={`Profile: ${user.name}`}
          className="w-8 h-8 rounded-full overflow-hidden border border-blue-500/50 hover:ring-2 hover:ring-blue-400 transition-all flex items-center justify-center bg-blue-600/30 text-xs font-bold text-blue-200"
        >
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0)
          )}
        </button>
      </div>
    </aside>
  );
};
