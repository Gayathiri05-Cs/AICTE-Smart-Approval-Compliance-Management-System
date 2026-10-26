import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  ShieldAlert,
  CalendarDays,
  Bell,
  History,
  TrendingUp,
  Users,
  Settings,
  AlertTriangle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  collapsed,
  setCollapsed
}) => {
  const { currentUser, applications, complianceTasks, unreadNotificationCount } = useApp();

  // Pending items computation
  const pendingAppsCount = applications.filter((a) => {
    if (currentUser.role === 'INSTITUTION') {
      return a.status === 'CORRECTION_REQUESTED';
    }
    if (currentUser.role === 'REGIONAL_OFFICER') {
      return a.status === 'IN_PROGRESS' && (a.currentStage === 'INITIAL_SCRUTINY' || a.currentStage === 'RE_SCRUTINY');
    }
    return a.status === 'IN_PROGRESS';
  }).length;

  const dueComplianceCount = complianceTasks.filter((c) =>
    c.status === 'DUE_SOON' || c.status === 'OVERDUE'
  ).length;

  const navGroups = [
    {
      title: 'Workflow & Approvals',
      items: [
        {
          id: 'dashboard',
          label: 'Overview Dashboard',
          icon: LayoutDashboard,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'applications',
          label: 'Applications Directory',
          icon: FileText,
          badge: pendingAppsCount > 0 ? pendingAppsCount : undefined,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'new-application',
          label: 'Submit Application',
          icon: PlusCircle,
          roles: ['INSTITUTION', 'BUREAU_ADMIN']
        }
      ]
    },
    {
      title: 'Compliance & Visits',
      items: [
        {
          id: 'compliance',
          label: 'Compliance Tracker',
          icon: ShieldAlert,
          badge: dueComplianceCount > 0 ? dueComplianceCount : undefined,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'evc',
          label: 'EVC Schedules',
          icon: CalendarDays,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'escalations',
          label: 'SLA Escalations',
          icon: AlertTriangle,
          roles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
        }
      ]
    },
    {
      title: 'Accountability & Setup',
      items: [
        {
          id: 'notifications',
          label: 'Alerts & Messages',
          icon: Bell,
          badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'audit',
          label: 'Digital Audit Trail',
          icon: History,
          roles: ['INSTITUTION', 'REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'reports',
          label: 'Reports & Analytics',
          icon: TrendingUp,
          roles: ['REGIONAL_OFFICER', 'BUREAU_ADMIN']
        },
        {
          id: 'users',
          label: 'Users & Roles',
          icon: Users,
          roles: ['BUREAU_ADMIN']
        },
        {
          id: 'settings',
          label: 'Workflow Settings',
          icon: Settings,
          roles: ['BUREAU_ADMIN']
        }
      ]
    }
  ];

  return (
    <aside
      className={`shrink-0 bg-slate-900 border-r border-slate-800 transition-all duration-200 flex flex-col justify-between ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="py-4 flex flex-col gap-6">
        {navGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) =>
            item.roles.includes(currentUser.role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="px-3">
              {!collapsed && (
                <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                  {group.title}
                </div>
              )}

              <div className="flex flex-col gap-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left group ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      {!collapsed && (
                        <span className="flex-1 truncate">{item.label}</span>
                      )}

                      {!collapsed && item.badge !== undefined && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-slate-800">
        {!collapsed ? (
          <div className="p-3 rounded-lg bg-slate-850 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-semibold mb-1">
              <span>National Portal</span>
              <span className="text-[10px] font-mono text-emerald-400">Live SLA Engine</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              AICTE Approval Process Handbook (APH 2026-27) Compliance Standard.
            </p>
          </div>
        ) : (
          <div className="flex justify-center text-slate-500 text-xs">
            APH
          </div>
        )}
      </div>
    </aside>
  );
};
