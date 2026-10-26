import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginModal } from './components/auth/LoginModal';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { NewApplicationPage } from './pages/NewApplicationPage';
import { CompliancePage } from './pages/CompliancePage';
import { EVCSchedulePage } from './pages/EVCSchedulePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { EscalationsPage } from './pages/EscalationsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ReportsPage } from './pages/ReportsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';
import { ChevronRight, Home, Shield, Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string>('APP-2026-8812');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { currentUser } = useApp();

  const handleOpenAppDetail = (appId: string) => {
    setSelectedAppId(appId);
    setCurrentTab('application-detail');
  };

  const getBreadcrumbLabel = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Overview Dashboard';
      case 'applications':
        return 'Applications Registry';
      case 'application-detail':
        return `Dossier: ${selectedAppId}`;
      case 'new-application':
        return 'Submit New Application';
      case 'compliance':
        return 'Statutory Compliance Tracker';
      case 'evc':
        return 'Expert Visiting Committee (EVC) Schedules';
      case 'notifications':
        return 'Notification Center & Adapters';
      case 'escalations':
        return 'SLA Overdue Escalations';
      case 'audit':
        return 'Digital Audit Trail';
      case 'reports':
        return 'Reports & Analytics';
      case 'users':
        return 'User & Role Access (RBAC)';
      case 'settings':
        return 'Workflow Engine Settings & Architecture';
      default:
        return 'AICTE Approval System';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-950 px-4 sm:px-8 py-6">
          {/* Breadcrumb Bar */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>AICTE Portal</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-200 font-medium">{getBreadcrumbLabel()}</span>

            <div className="ml-auto hidden md:flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">Current Role:</span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase font-mono ${
                  currentUser.role === 'INSTITUTION'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : currentUser.role === 'REGIONAL_OFFICER'
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Page Routing */}
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenAppDetail={handleOpenAppDetail}
            />
          )}

          {currentTab === 'applications' && (
            <ApplicationsPage
              onOpenAppDetail={handleOpenAppDetail}
              onNavigateNewApp={() => setCurrentTab('new-application')}
            />
          )}

          {currentTab === 'application-detail' && (
            <ApplicationDetailPage
              applicationId={selectedAppId}
              onBack={() => setCurrentTab('applications')}
              onOpenEVC={() => setCurrentTab('evc')}
            />
          )}

          {currentTab === 'new-application' && (
            <NewApplicationPage
              onSuccess={(newAppId) => {
                setSelectedAppId(newAppId);
                setCurrentTab('application-detail');
              }}
              onCancel={() => setCurrentTab('applications')}
            />
          )}

          {currentTab === 'compliance' && <CompliancePage />}

          {currentTab === 'evc' && <EVCSchedulePage />}

          {currentTab === 'notifications' && <NotificationsPage />}

          {currentTab === 'escalations' && <EscalationsPage />}

          {currentTab === 'audit' && <AuditLogsPage />}

          {currentTab === 'reports' && <ReportsPage />}

          {currentTab === 'users' && <UserManagementPage />}

          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* RBAC Login / Persona Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
