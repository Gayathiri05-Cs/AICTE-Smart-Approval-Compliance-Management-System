import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  Send,
  Users,
  Settings,
  CheckCircle2,
  ArrowRight,
  Flame,
  Activity
} from 'lucide-react';
import { EscalationRule } from '../types';

export const EscalationsPage: React.FC = () => {
  const {
    escalationRules,
    escalationRecords,
    applications,
    currentUser,
    triggerManualEscalation,
    updateEscalationRule
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || 'APP-2026-7934');
  const [manualReason, setManualReason] = useState('Pending scrutiny for > 9 days with no committee constitution.');

  // Find overdue applications
  const overdueApps = applications.filter(
    (a) => a.isOverdue || (a.daysInCurrentStage > a.slaDays && a.status === 'IN_PROGRESS')
  );

  const handleManualTrigger = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualReason.trim()) return;

    triggerManualEscalation(selectedAppId, manualReason.trim());
    alert(`Escalation registered and dispatched to Bureau Head for ${selectedAppId}!`);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Automated SLA Monitoring & Escalation Engine
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Hierarchical escalation rules, overdue stage detection, and alert dispatches to regional directors and council executives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-mono font-medium">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>{overdueApps.length} Overdue Cases Active</span>
          </span>
        </div>
      </div>

      {/* Overdue Cases Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Current Overdue Applications (SLA Breached)</span>
            </h3>
            <p className="text-xs text-slate-400">Applications exceeding statutory stage limits</p>
          </div>
          <span className="text-xs font-mono text-slate-400">APH 2026-27 SLAs</span>
        </div>

        {overdueApps.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-slate-200 font-semibold">Zero SLA Breaches Detected</p>
            <p className="text-slate-500 mt-0.5">All applications are progressing within prescribed turnaround times.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Application ID</th>
                  <th className="py-2.5 px-3">Institution</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Stage Time / SLA</th>
                  <th className="py-2.5 px-3">Overdue Days</th>
                  <th className="py-2.5 px-3">Assigned Officer</th>
                  <th className="py-2.5 px-3 text-right">Escalate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {overdueApps.map((app) => {
                  const overdueDays = Math.max(1, app.daysInCurrentStage - app.slaDays);

                  return (
                    <tr key={app.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-mono font-medium text-indigo-300">
                        {app.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-200">{app.institutionName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{app.region} Region</div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={app.currentStage} type="stage" size="sm" />
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {app.daysInCurrentStage}d / {app.slaDays}d
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-rose-400">
                        +{overdueDays} days
                      </td>
                      <td className="py-3 px-3 text-slate-300">{app.assignedOfficerName}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            triggerManualEscalation(
                              app.id,
                              `Manual officer escalation: SLA breached by ${overdueDays} days in ${app.currentStage}.`
                            );
                            alert(`Priority escalation sent for ${app.id}!`);
                          }}
                          className="px-2.5 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded text-[11px] font-medium transition-colors"
                        >
                          Trigger Escalation
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurable Rules Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Hierarchical Escalation Rules</h3>
              <p className="text-xs text-slate-400">Configured Celery scheduled task thresholds</p>
            </div>
            <span className="text-xs font-mono text-indigo-400">Cron: Hourly</span>
          </div>

          <div className="space-y-3">
            {escalationRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-indigo-300">
                    Stage: {rule.stage}
                  </span>
                  <button
                    onClick={() => updateEscalationRule(rule.id, { isActive: !rule.isActive })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                      rule.isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                  </button>
                </div>

                <div className="text-slate-300 leading-snug">
                  If pendency exceeds <strong className="text-white font-mono">{rule.triggerDays} days</strong>,
                  escalate to <strong className="text-indigo-200">{rule.escalateToName}</strong>.
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
                  <span>Dispatch:</span>
                  {rule.channels.map((ch) => (
                    <span key={ch} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {ch}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Incident Records */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Escalation Incident Log</h3>
              <p className="text-xs text-slate-400">Audit trail of SLA breach dispatches</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Total: {escalationRecords.length}</span>
          </div>

          <div className="space-y-3">
            {escalationRecords.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-rose-400">{rec.id}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {new Date(rec.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="font-semibold text-slate-200">
                  {rec.institutionName} ({rec.applicationId})
                </div>
                <div className="text-slate-400 leading-relaxed italic">
                  "{rec.reason}"
                </div>
                <div className="text-[10px] text-slate-500 font-mono pt-1 flex items-center justify-between">
                  <span>Escalated to: {rec.escalatedTo}</span>
                  <span className="text-amber-400 font-bold">{rec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
