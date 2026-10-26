import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  FileText,
  Clock,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Filter,
  Search,
  BellRing,
  Building,
  ShieldCheck,
  Send
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { WORKFLOW_STAGES_CONFIG } from '../services/storage';

interface DashboardPageProps {
  onNavigate: (tab: string, filterParams?: any) => void;
  onOpenAppDetail: (appId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate, onOpenAppDetail }) => {
  const { currentUser, applications, complianceTasks, evcEvents, auditEvents, sendTestReminder } = useApp();
  const [dateRange, setDateRange] = useState<'all' | '30d' | '7d'>('all');

  // Filter applications by role if institution
  const visibleApps = useMemo(() => {
    if (currentUser.role === 'INSTITUTION') {
      return applications.filter((a) => a.institutionId === currentUser.institutionId);
    }
    if (currentUser.role === 'REGIONAL_OFFICER' && currentUser.region) {
      return applications.filter((a) => a.region === currentUser.region || a.assignedOfficerId === currentUser.id);
    }
    return applications;
  }, [applications, currentUser]);

  // Derived KPI metrics
  const totalApps = visibleApps.length;
  const inProgressApps = visibleApps.filter((a) => a.status === 'IN_PROGRESS').length;
  const correctionRequestedApps = visibleApps.filter((a) => a.status === 'CORRECTION_REQUESTED').length;
  const overdueApps = visibleApps.filter((a) => a.isOverdue || (a.daysInCurrentStage > a.slaDays && a.status === 'IN_PROGRESS')).length;
  const approvedApps = visibleApps.filter((a) => a.status === 'APPROVED').length;

  const dueSoonCompliance = complianceTasks.filter((c) => c.status === 'DUE_SOON').length;
  const overdueCompliance = complianceTasks.filter((c) => c.status === 'OVERDUE' || c.status === 'EXPIRED').length;
  const scheduledEVCs = evcEvents.filter((e) => e.status === 'SCHEDULED').length;

  // Chart 1: Applications by Stage
  const stageChartData = useMemo(() => {
    return WORKFLOW_STAGES_CONFIG.map((stage) => {
      const count = visibleApps.filter((a) => a.currentStage === stage.key).length;
      return {
        name: stage.label.split(' ')[0] + '..',
        fullName: stage.label,
        count
      };
    });
  }, [visibleApps]);

  // Chart 2: Compliance Distribution
  const complianceData = useMemo(() => {
    const compliant = complianceTasks.filter((c) => c.status === 'COMPLIANT').length;
    const pending = complianceTasks.filter((c) => c.status === 'PENDING_VERIFICATION').length;
    const due = complianceTasks.filter((c) => c.status === 'DUE_SOON').length;
    const overdue = complianceTasks.filter((c) => c.status === 'OVERDUE' || c.status === 'EXPIRED').length;

    return [
      { name: 'Compliant', value: compliant, color: '#10B981' },
      { name: 'Pending Review', value: pending, color: '#38BDF8' },
      { name: 'Due Soon', value: due, color: '#F59E0B' },
      { name: 'Overdue/Expired', value: overdue, color: '#F43F5E' }
    ];
  }, [complianceTasks]);

  // Chart 3: Regional Distribution (Bureau/Officer view)
  const regionalData = useMemo(() => {
    const regions = ['Northern', 'Western', 'Southern', 'Eastern', 'South-Western'];
    return regions.map((reg) => ({
      region: reg,
      inProgress: applications.filter((a) => a.region === reg && a.status === 'IN_PROGRESS').length,
      overdue: applications.filter((a) => a.region === reg && (a.isOverdue || a.daysInCurrentStage > a.slaDays)).length,
      approved: applications.filter((a) => a.region === reg && a.status === 'APPROVED').length
    }));
  }, [applications]);

  // Chart 4: Monthly Submission Trend
  const trendData = [
    { month: 'Jul 2026', submitted: 12, approved: 4 },
    { month: 'Aug 2026', submitted: 28, approved: 16 },
    { month: 'Sep 2026', submitted: 45, approved: 28 },
    { month: 'Oct 2026', submitted: 62, approved: 42 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Role-Specific Context & Quick Action */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-900/40 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>National Technical Education Portal · AY 2026-27</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {currentUser.role === 'INSTITUTION' &&
                'Track your institutional Extension of Approval (EOA) pipeline, resolve deficiency memos, and submit mandatory statutory undertakings.'}
              {currentUser.role === 'REGIONAL_OFFICER' &&
                `Oversee desk scrutiny, verify land and cadre documentation for ${currentUser.region || 'assigned'} region, and coordinate Expert Visiting Committees.`}
              {currentUser.role === 'BUREAU_ADMIN' &&
                'National command view: Monitor institutional pendency across all 8 regional offices, configure SLA policies, and oversee statutory compliance.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {currentUser.role === 'INSTITUTION' && (
              <button
                onClick={() => onNavigate('new-application')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20 whitespace-nowrap"
              >
                <FileText className="w-3.5 h-3.5" />
                Submit New Application
              </button>
            )}

            {currentUser.role !== 'INSTITUTION' && (
              <button
                onClick={() => onNavigate('evc')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Schedule EVC Inspection
              </button>
            )}

            <button
              onClick={() => {
                sendTestReminder(
                  'Urgent: Mandatory Lease Document Expiry Warning',
                  'Simulated statutory reminder generated for AICTE Hackathon evaluation.',
                  'WHATSAPP',
                  'COMPLIANCE',
                  'CMP-2026-03'
                );
                alert('Test alert triggered and dispatched to Alerts & Messages center!');
              }}
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Trigger simulated multi-channel notification"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>Trigger Test Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        <div
          onClick={() => onNavigate('applications')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Apps</span>
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{totalApps}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span>All submissions</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('applications', { status: 'IN_PROGRESS' })}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-indigo-800/60 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>In Scrutiny</span>
            <Clock className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-sky-400 tabular-nums">{inProgressApps}</div>
          <div className="text-[11px] text-slate-400 mt-1">Active workflows</div>
        </div>

        <div
          onClick={() => onNavigate('applications', { status: 'CORRECTION_REQUESTED' })}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-800/60 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Correction Needed</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {correctionRequestedApps}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Deficiency memos</div>
        </div>

        <div
          onClick={() => onNavigate('escalations')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-rose-800/60 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>SLA Overdue</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{overdueApps}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Escalation active</div>
        </div>

        <div
          onClick={() => onNavigate('evc')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-indigo-800/60 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>EVC Visits</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 tabular-nums">{scheduledEVCs}</div>
          <div className="text-[11px] text-slate-400 mt-1">Inspections scheduled</div>
        </div>

        <div
          onClick={() => onNavigate('compliance')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-800/60 rounded-xl p-4 transition-all hover:bg-slate-850"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Compliance Due</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {dueSoonCompliance + overdueCompliance}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-rose-400 font-semibold">{overdueCompliance}</span> critical
          </div>
        </div>
      </div>

      {/* Visualizations Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Applications by Stage */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Applications by Approval Stage</h2>
              <p className="text-xs text-slate-400">Current active workload across statutory milestones</p>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                          <div className="font-semibold text-slate-200">{data.fullName}</div>
                          <div className="text-indigo-400 font-mono mt-1">Applications: {data.count}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Compliance Health Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Compliance Health</h2>
                <p className="text-xs text-slate-400">Statutory NOC & deed validity</p>
              </div>
              <button
                onClick={() => onNavigate('compliance')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={complianceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {complianceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs shadow-xl">
                            <span className="font-semibold text-slate-200">{data.name}: </span>
                            <span className="font-mono text-white">{data.value}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-800/80">
            {complianceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name}</span>
                <span className="ml-auto font-mono text-slate-200 font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row: Regional Workload or Monthly Trend & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Live Applications In Process</h2>
              <p className="text-xs text-slate-400">Click any row to inspect dossiers and workflow stepper</p>
            </div>
            <button
              onClick={() => onNavigate('applications')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              View directory ({visibleApps.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">App ID</th>
                  <th className="py-2.5 px-3">Institution</th>
                  <th className="py-2.5 px-3">Current Stage</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Stage Time</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visibleApps.slice(0, 4).map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => onOpenAppDetail(app.id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-3 font-mono font-medium text-indigo-300">
                      {app.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200 group-hover:text-indigo-200">
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.applicationType} · {app.region} Region
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.currentStage} type="stage" size="sm" />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={app.status} type="application" size="sm" />
                    </td>
                    <td className="py-3 px-3 font-mono">
                      <span className={app.daysInCurrentStage > app.slaDays ? 'text-rose-400 font-semibold' : 'text-slate-300'}>
                        {app.daysInCurrentStage}d / {app.slaDays}d
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-xs text-indigo-400 group-hover:text-indigo-300 font-medium">
                        Review &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audit Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Digital Audit Trail</h2>
              <p className="text-xs text-slate-400">Tamper-evident system activity</p>
            </div>
            <button
              onClick={() => onNavigate('audit')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3.5">
            {auditEvents.slice(0, 4).map((evt) => (
              <div key={evt.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{evt.action.replace(/_/g, ' ')}</span>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    By <strong className="text-slate-300">{evt.actingUser}</strong> ({evt.userRole})
                  </div>
                  {evt.reason && (
                    <div className="text-[11px] text-slate-500 italic truncate mt-0.5">
                      "{evt.reason}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Verified System Chain</span>
            <span className="text-emerald-400 font-mono">100% Traceable</span>
          </div>
        </div>
      </div>
    </div>
  );
};
