import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WORKFLOW_STAGES_CONFIG } from '../services/storage';
import {
  Settings,
  Clock,
  Layers,
  Database,
  Server,
  Code,
  Save,
  CheckCircle2,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { WorkflowStageKey } from '../types';

export const SettingsPage: React.FC = () => {
  const { resetAllData } = useApp();

  const [stages, setStages] = useState(WORKFLOW_STAGES_CONFIG);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSlaChange = (key: WorkflowStageKey, days: number) => {
    setStages(
      stages.map((s) => (s.key === key ? { ...s, defaultSlaDays: Math.max(1, days) } : s))
    );
  };

  const handleSaveStages = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Workflow Engine & Architecture Blueprint
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable statutory SLA rules, Celery scheduled workers, and production backend architecture.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset prototype storage and restore original AICTE default stages?')) {
              resetAllData();
              setStages(WORKFLOW_STAGES_CONFIG);
            }
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to AICTE Defaults</span>
        </button>
      </div>

      {/* Stage SLA Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Configurable Approval Stages & Statutory SLA Thresholds</span>
            </h3>
            <p className="text-xs text-slate-400">
              Customize maximum days allowed per stage before automated Celery alerts trigger escalations.
            </p>
          </div>

          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-4 h-4" /> Changes Applied
            </span>
          )}
        </div>

        <form onSubmit={handleSaveStages} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stages.map((stage) => (
              <div
                key={stage.key}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-200">
                    Stage {stage.order}: {stage.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {stage.description}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-[11px] text-slate-400 font-mono">SLA:</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={stage.defaultSlaDays}
                    onChange={(e) => handleSlaChange(stage.key, Number(e.target.value))}
                    className="w-14 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono text-center text-xs"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">days</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save SLA Configuration</span>
            </button>
          </div>
        </form>
      </div>

      {/* Production Architecture Blueprint */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>SIH 2026 Production Architecture & Technology Stack</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint mapping the React frontend to the specified FastAPI, PostgreSQL, Celery, and Redis backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-semibold">
              <Cpu className="w-4 h-4" />
              <span>Backend API (FastAPI)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              High-throughput async Python framework with Pydantic validation for all application schemas,
              statutory rules, and JWT OAuth2 token verification.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Endpoints: /api/v1/applications, /api/v1/compliance, /api/v1/audit
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-sky-300 font-semibold">
              <Database className="w-4 h-4" />
              <span>Database (PostgreSQL 16)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Relational schemas with ACID transaction isolation for document hashes, audit records,
              spatial GIS coordinates, and immutable event logs.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Tables: applications, status_history, compliance_tasks, audit_ledger
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <Layers className="w-4 h-4" />
              <span>Workers (Celery + Redis)</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Asynchronous task queues executing hourly cron jobs to detect overdue applications, calculate SLA
              breaches, and dispatch multi-channel reminders.
            </p>
            <div className="text-[10px] font-mono text-slate-500 pt-1">
              Tasks: check_sla_breaches(), send_statutory_reminders()
            </div>
          </div>
        </div>

        {/* Backend Code Blueprint Snippet */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
          <div className="text-slate-500 mb-2">// Celery Scheduled Task Engine (tasks.py)</div>
          <pre className="text-indigo-300">{`@celery_app.task
def evaluate_aicte_sla_deadlines():
    """Scheduled task executed hourly via Redis broker"""
    overdue_apps = db.query(Application).filter(
        Application.status == "IN_PROGRESS",
        Application.days_in_stage > Application.sla_days
    ).all()
    
    for app in overdue_apps:
        # 1. Trigger hierarchical escalation
        escalate_to_bureau(app.id, reason="SLA threshold breached")
        # 2. Record append-only audit event
        record_audit_event(action="AUTO_SLA_BREACH", target_id=app.id)
        # 3. Dispatch multi-channel alert via WhatsApp & SMS adapters
        dispatch_sms_alert(app.nodal_mobile, template="AICTE_SLA_WARNING")`}</pre>
        </div>
      </div>
    </div>
  );
};
