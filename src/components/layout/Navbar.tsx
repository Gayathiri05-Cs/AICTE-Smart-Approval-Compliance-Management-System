import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  UserCheck,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronDown,
  Building2,
  Briefcase,
  Layers
} from 'lucide-react';
import { DEMO_USERS } from '../../services/storage';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenLoginModal }) => {
  const { currentUser, switchRole, unreadNotificationCount, resetAllData } = useApp();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-8 px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
      {/* Zone 1: Brand Wordmark (Single text element + clean insignia) */}
      <div className="flex items-center gap-3 shrink-0">
        <img
          src="/src/assets/images/aicte_crest_emblem_1792993976913.jpg"
          alt="AICTE Crest"
          className="w-9 h-9 rounded-full object-cover border border-amber-500/40 shadow-sm"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="text-base font-bold tracking-tight text-white hover:text-indigo-300 transition-colors whitespace-nowrap shrink-0 text-left"
          >
            AICTE Smart Approval
          </button>
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            SIH 2026 · Problem SIH26262
          </span>
        </div>
      </div>

      {/* Zone 2: 4-5 concise single-line nav links with hover underlines */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            currentTab === 'dashboard'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : 'hover:text-white'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab('applications')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            currentTab === 'applications' || currentTab === 'application-detail'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : 'hover:text-white'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setCurrentTab('compliance')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            currentTab === 'compliance'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : 'hover:text-white'
          }`}
        >
          Compliance Tracker
        </button>
        <button
          onClick={() => setCurrentTab('evc')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            currentTab === 'evc'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : 'hover:text-white'
          }`}
        >
          EVC Schedules
        </button>
        <button
          onClick={() => setCurrentTab('audit')}
          className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
            currentTab === 'audit'
              ? 'text-white border-b-2 border-indigo-400 font-semibold'
              : 'hover:text-white'
          }`}
        >
          Audit Logs
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action Area / Profile & Demo Role Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Reset Demo Data */}
        <button
          onClick={() => {
            if (confirm('Reset prototype database to initial AICTE seed state?')) {
              resetAllData();
            }
          }}
          title="Reset Demo Data"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors whitespace-nowrap"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Reset Data</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setCurrentTab('notifications')}
          className="relative p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700/80 transition-colors"
          title="Alerts and Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center font-mono">
              {unreadNotificationCount}
            </span>
          )}
        </button>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-indigo-950/40 hover:bg-indigo-900/40 border border-indigo-800/60 rounded-lg text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-semibold">
              {currentUser.role === 'INSTITUTION' ? (
                <Building2 className="w-3.5 h-3.5" />
              ) : currentUser.role === 'REGIONAL_OFFICER' ? (
                <Briefcase className="w-3.5 h-3.5" />
              ) : (
                <ShieldCheck className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="text-left hidden sm:block max-w-[140px]">
              <div className="font-semibold text-slate-200 truncate leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-indigo-300 font-mono truncate">
                {currentUser.role === 'INSTITUTION'
                  ? 'Institution User'
                  : currentUser.role === 'REGIONAL_OFFICER'
                  ? 'Regional Officer'
                  : 'Bureau Admin'}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-2 z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Switch Active Role (RBAC Demo)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Demonstrates role-specific permissions and navigation.
                </p>
              </div>

              {DEMO_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    switchRole(user.role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    currentUser.role === user.role
                      ? 'bg-indigo-900/40 text-white font-medium border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="mt-0.5">
                    {user.role === 'INSTITUTION' ? (
                      <Building2 className="w-4 h-4 text-emerald-400" />
                    ) : user.role === 'REGIONAL_OFFICER' ? (
                      <Briefcase className="w-4 h-4 text-sky-400" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{user.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{user.designation}</div>
                    <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{user.role}</div>
                  </div>
                </button>
              ))}

              <div className="pt-2 mt-1 border-t border-slate-800 flex items-center justify-between px-2">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenLoginModal();
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 py-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch Account / Modal</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
