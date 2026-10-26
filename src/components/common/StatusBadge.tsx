import React from 'react';
import { ApplicationStatus, ComplianceStatus, DocumentVerificationStatus, WorkflowStageKey } from '../../types';
import { WORKFLOW_STAGES_CONFIG } from '../../services/storage';

interface StatusBadgeProps {
  status: ApplicationStatus | ComplianceStatus | DocumentVerificationStatus | WorkflowStageKey | string;
  type?: 'application' | 'compliance' | 'document' | 'stage';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'application', size = 'md' }) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs font-medium';

  // Application Status
  if (status === 'IN_PROGRESS') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-indigo-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        In Progress
      </span>
    );
  }
  if (status === 'CORRECTION_REQUESTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-amber-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Correction Requested
      </span>
    );
  }
  if (status === 'APPROVED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-emerald-400 font-semibold`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Approved (Granted)
      </span>
    );
  }
  if (status === 'REJECTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-rose-400 font-semibold`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Rejected
      </span>
    );
  }
  if (status === 'DEFICIENCY_NOTED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-amber-300`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        Deficiency Noted
      </span>
    );
  }

  // Compliance Status
  if (status === 'COMPLIANT') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-emerald-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Compliant
      </span>
    );
  }
  if (status === 'DUE_SOON') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-amber-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Due Soon
      </span>
    );
  }
  if (status === 'PENDING_VERIFICATION') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-sky-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
        Pending Verification
      </span>
    );
  }
  if (status === 'OVERDUE') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-rose-400 font-semibold`}>
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        Overdue
      </span>
    );
  }
  if (status === 'EXPIRED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-red-400 font-semibold`}>
        <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
        Expired
      </span>
    );
  }

  // Document verification
  if (status === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-emerald-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Verified
      </span>
    );
  }
  if (status === 'PENDING') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-slate-400`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
        Pending Review
      </span>
    );
  }

  // Workflow Stage Key
  const stageConfig = WORKFLOW_STAGES_CONFIG.find((s) => s.key === status);
  if (stageConfig) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${textSize} text-violet-300`}>
        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
        {stageConfig.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${textSize} text-slate-400`}>
      {String(status)}
    </span>
  );
};
