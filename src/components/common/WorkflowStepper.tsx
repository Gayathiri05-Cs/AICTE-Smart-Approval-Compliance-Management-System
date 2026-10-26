import React from 'react';
import { WorkflowStageKey, ApplicationStatus } from '../../types';
import { WORKFLOW_STAGES_CONFIG } from '../../services/storage';
import { Check, Clock, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface WorkflowStepperProps {
  currentStage: WorkflowStageKey;
  status: ApplicationStatus;
  daysInCurrentStage: number;
  slaDays: number;
  onSelectStage?: (stage: WorkflowStageKey) => void;
}

export const WorkflowStepper: React.FC<WorkflowStepperProps> = ({
  currentStage,
  status,
  daysInCurrentStage,
  slaDays,
  onSelectStage
}) => {
  const currentStageIndex = WORKFLOW_STAGES_CONFIG.findIndex((s) => s.key === currentStage);
  const isOverdue = daysInCurrentStage > slaDays && status === 'IN_PROGRESS';

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800/80 gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Statutory Approval Pipeline
          </span>
          <h3 className="text-base font-semibold text-slate-100 mt-0.5">
            Stage {currentStageIndex + 1} of {WORKFLOW_STAGES_CONFIG.length}: {WORKFLOW_STAGES_CONFIG[currentStageIndex]?.label}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Time in Stage: <strong className="text-slate-100">{daysInCurrentStage}d</strong> / SLA: {slaDays}d</span>
          </div>

          {isOverdue && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>SLA Breached ({daysInCurrentStage - slaDays}d overdue)</span>
            </div>
          )}

          {status === 'CORRECTION_REQUESTED' && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Correction Pending</span>
            </div>
          )}

          {status === 'APPROVED' && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-medium">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Approved</span>
            </div>
          )}
        </div>
      </div>

      {/* Stepper horizontal flow */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="min-w-[760px] grid grid-cols-8 gap-2 relative">
          {WORKFLOW_STAGES_CONFIG.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;

            let circleBg = 'bg-slate-800 border-slate-700 text-slate-400';
            let titleColor = 'text-slate-400';

            if (isCompleted) {
              circleBg = 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
              titleColor = 'text-slate-200';
            } else if (isCurrent) {
              if (status === 'CORRECTION_REQUESTED') {
                circleBg = 'bg-amber-500/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/20';
                titleColor = 'text-amber-300 font-semibold';
              } else if (status === 'APPROVED') {
                circleBg = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/20';
                titleColor = 'text-emerald-300 font-semibold';
              } else if (status === 'REJECTED') {
                circleBg = 'bg-rose-500/20 border-rose-500 text-rose-400 ring-2 ring-rose-500/20';
                titleColor = 'text-rose-300 font-semibold';
              } else {
                circleBg = isOverdue
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400 ring-2 ring-rose-500/20'
                  : 'bg-indigo-600/30 border-indigo-400 text-indigo-300 ring-2 ring-indigo-500/30';
                titleColor = isOverdue ? 'text-rose-300 font-semibold' : 'text-indigo-200 font-semibold';
              }
            }

            return (
              <button
                key={stage.key}
                type="button"
                onClick={() => onSelectStage && onSelectStage(stage.key)}
                className={`flex flex-col items-start p-2.5 rounded-lg border text-left transition-all relative ${
                  isCurrent
                    ? 'border-indigo-500/40 bg-indigo-950/20 shadow-sm'
                    : 'border-transparent hover:border-slate-800 hover:bg-slate-800/40'
                }`}
              >
                {/* Connecting arrow if not last */}
                {idx < WORKFLOW_STAGES_CONFIG.length - 1 && (
                  <ArrowRight className="hidden sm:block absolute -right-2 top-4 w-3.5 h-3.5 text-slate-700 z-10" />
                )}

                <div className="flex items-center gap-2 mb-1.5 w-full">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono shrink-0 transition-colors ${circleBg}`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent && status === 'REJECTED' ? (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">SLA: {stage.defaultSlaDays}d</span>
                </div>

                <div className={`text-xs leading-tight line-clamp-2 ${titleColor}`}>
                  {stage.label}
                </div>

                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                  {stage.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
