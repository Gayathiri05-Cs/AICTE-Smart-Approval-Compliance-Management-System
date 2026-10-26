import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WorkflowStepper } from '../components/common/WorkflowStepper';
import { StatusBadge } from '../components/common/StatusBadge';
import { WORKFLOW_STAGES_CONFIG } from '../services/storage';
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ShieldCheck,
  History,
  FileText,
  UserCheck,
  Calendar,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApplicationStatus, DocumentVerificationStatus, WorkflowStageKey } from '../types';

interface ApplicationDetailPageProps {
  applicationId: string;
  onBack: () => void;
  onOpenEVC: () => void;
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({
  applicationId,
  onBack,
  onOpenEVC
}) => {
  const {
    applications,
    currentUser,
    updateApplicationStage,
    requestCorrection,
    resubmitCorrection,
    verifyDocument,
    triggerManualEscalation,
    auditEvents
  } = useApp();

  const app = applications.find((a) => a.id === applicationId);

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'history' | 'audit'>('overview');

  // Modals & form state
  const [showAdvanceModal, setShowAdvanceModal] = useState(false);
  const [advanceNextStage, setAdvanceNextStage] = useState<WorkflowStageKey>('INITIAL_SCRUTINY');
  const [advanceNotes, setAdvanceNotes] = useState('');
  const [advanceFinalStatus, setAdvanceFinalStatus] = useState<ApplicationStatus>('IN_PROGRESS');

  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [correctionReason, setCorrectionReason] = useState('');

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [resubmitNotes, setResubmitNotes] = useState('');

  const [docVerifyModal, setDocVerifyModal] = useState<{
    docId: string;
    docName: string;
    currentStatus: DocumentVerificationStatus;
  } | null>(null);
  const [docRemarks, setDocRemarks] = useState('');

  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');

  if (!app) {
    return (
      <div className="p-12 text-center text-slate-400">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-2" />
        <h2 className="text-base font-semibold text-slate-200">Application Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">Application ID {applicationId} does not exist in the database.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg transition-colors"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const currentStageConfig = WORKFLOW_STAGES_CONFIG.find((s) => s.key === app.currentStage);
  const currentStageIndex = WORKFLOW_STAGES_CONFIG.findIndex((s) => s.key === app.currentStage);
  const nextStageConfig = WORKFLOW_STAGES_CONFIG[currentStageIndex + 1];

  const appAuditEvents = auditEvents.filter((a) => a.relatedId === app.id);

  // Permission flags
  const canAdvanceStage =
    currentUser.role === 'BUREAU_ADMIN' ||
    (currentUser.role === 'REGIONAL_OFFICER' && currentStageConfig?.allowedRoles.includes('REGIONAL_OFFICER'));

  const canRequestCorrection =
    (currentUser.role === 'REGIONAL_OFFICER' || currentUser.role === 'BUREAU_ADMIN') &&
    app.status !== 'APPROVED' &&
    app.status !== 'REJECTED';

  const canResubmitCorrection =
    currentUser.role === 'INSTITUTION' && app.status === 'CORRECTION_REQUESTED';

  const handleAdvanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advanceNotes.trim()) {
      alert('Please provide official scrutiny notes before advancing stage.');
      return;
    }
    updateApplicationStage(app.id, advanceNextStage, advanceNotes, advanceFinalStatus);
    setShowAdvanceModal(false);
    setAdvanceNotes('');
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason.trim()) {
      alert('Mandatory deficiency reason is required by AICTE regulations.');
      return;
    }
    requestCorrection(app.id, correctionReason);
    setShowCorrectionModal(false);
    setCorrectionReason('');
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resubmitNotes.trim()) {
      alert('Please explain the rectifications made.');
      return;
    }
    resubmitCorrection(app.id, resubmitNotes);
    setShowResubmitModal(false);
    setResubmitNotes('');
  };

  const handleDocVerify = (status: DocumentVerificationStatus) => {
    if (!docVerifyModal) return;
    verifyDocument(app.id, docVerifyModal.docId, status, docRemarks);
    setDocVerifyModal(null);
    setDocRemarks('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Back button and quick actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Back to Applications"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400">{app.id}</span>
              <span className="text-slate-600">·</span>
              <StatusBadge status={app.status} type="application" size="sm" />
              <span className="text-slate-600">·</span>
              <span className="text-xs font-mono text-slate-400">AY {app.academicYear}</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {app.institutionName}
            </h1>
          </div>
        </div>

        {/* Action Buttons for Reviewers and Institutions */}
        <div className="flex flex-wrap items-center gap-2">
          {canResubmitCorrection && (
            <button
              onClick={() => setShowResubmitModal(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Resubmit Rectified Dossier</span>
            </button>
          )}

          {canRequestCorrection && (
            <button
              onClick={() => setShowCorrectionModal(true)}
              className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-800/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Request Correction</span>
            </button>
          )}

          {canAdvanceStage && app.status !== 'APPROVED' && app.status !== 'REJECTED' && (
            <button
              onClick={() => {
                if (nextStageConfig) {
                  setAdvanceNextStage(nextStageConfig.key);
                }
                setShowAdvanceModal(true);
              }}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Advance Approval Stage</span>
            </button>
          )}

          {currentUser.role !== 'INSTITUTION' && (
            <button
              onClick={() => setShowEscalationModal(true)}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950/50 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-800/80 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
              title="Escalate overdue application"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Escalate SLA</span>
            </button>
          )}
        </div>
      </div>

      {/* Deficiency Alert Banner if Correction Requested */}
      {app.status === 'CORRECTION_REQUESTED' && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-semibold text-amber-200">
              Deficiency Memo Issued by Regional Office
            </h4>
            <p className="text-amber-300/90 mt-1 leading-relaxed">
              {app.statusHistory[0]?.correctionReason ||
                'Discrepancies identified during initial desk scrutiny. Please refer to remarks below and resubmit before deadline.'}
            </p>
            <div className="mt-2 text-[11px] text-amber-400/80 font-mono">
              Issued on: {new Date(app.statusHistory[0]?.timestamp || '').toLocaleString()} by{' '}
              {app.statusHistory[0]?.changedBy}
            </div>
          </div>
        </div>
      )}

      {/* Statutory Visual Workflow Stepper */}
      <WorkflowStepper
        currentStage={app.currentStage}
        status={app.status}
        daysInCurrentStage={app.daysInCurrentStage}
        slaDays={app.slaDays}
      />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-indigo-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Institutional Profile & Details
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'documents'
              ? 'border-indigo-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Document Vault</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono">
            {app.documents.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-indigo-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Stage History ({app.statusHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-indigo-400 text-white font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Audit Events ({appAuditEvents.length})
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key metadata grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-slate-500">Institution Code</span>
              <div className="font-mono text-sm font-semibold text-white mt-1">
                {app.institutionCode}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{app.institutionType}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-slate-500">Regional Jurisdiction</span>
              <div className="text-sm font-semibold text-white mt-1">
                {app.region} Regional Office
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{app.state}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-slate-500">Application Type</span>
              <div className="text-sm font-semibold text-indigo-300 mt-1">
                {app.applicationType}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Submitted: {new Date(app.submissionDate).toLocaleDateString()}</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <span className="text-[10px] uppercase font-mono text-slate-500">Assigned Scrutiny Officer</span>
              <div className="text-sm font-semibold text-white mt-1">
                {app.assignedOfficerName}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">NRO Deputy Director</div>
            </div>
          </div>

          {/* Infrastructure Norms Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Campus Infrastructure & Land Details (AICTE APH Norms)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Land Area</span>
                <div className="font-mono font-semibold text-white text-sm mt-0.5">
                  {app.infrastructure.landAreaAcres} Acres
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">
                  Title: {app.infrastructure.landOwnershipType}
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Built-up Area</span>
                <div className="font-mono font-semibold text-white text-sm mt-0.5">
                  {app.infrastructure.builtUpAreaSqMeters.toLocaleString()} Sq.m
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Meets norms (&ge; 12,000)</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Classrooms / Labs</span>
                <div className="font-mono font-semibold text-white text-sm mt-0.5">
                  {app.infrastructure.totalClassrooms} / {app.infrastructure.totalLaboratories}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">All Smart Enabled</div>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
                <span className="text-slate-400 text-[11px]">Library Volumes</span>
                <div className="font-mono font-semibold text-white text-sm mt-0.5">
                  {app.infrastructure.centralLibraryVolumes.toLocaleString()}
                </div>
                <div className="text-[10px] text-indigo-400 mt-1">Automated RFID</div>
              </div>
            </div>
          </div>

          {/* Academic Programs & Proposed Intake */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Approved & Proposed Academic Programs</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Program Name</th>
                    <th className="py-2.5 px-3">Level</th>
                    <th className="py-2.5 px-3 font-mono">Current Intake</th>
                    <th className="py-2.5 px-3 font-mono">Proposed Intake</th>
                    <th className="py-2.5 px-3">NBA Accredited</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {app.programs.map((prog) => (
                    <tr key={prog.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-semibold text-slate-200">{prog.name}</td>
                      <td className="py-3 px-3 text-slate-400">{prog.level}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{prog.currentIntake}</td>
                      <td className="py-3 px-3 font-mono font-semibold text-indigo-300">
                        {prog.proposedIntake}
                      </td>
                      <td className="py-3 px-3">
                        {prog.nbaAccredited ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Accredited
                          </span>
                        ) : (
                          <span className="text-slate-500">Not Accredited</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Document Vault */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
            <div>
              <h3 className="text-sm font-semibold text-white">Submitted Statutory Documents</h3>
              <p className="text-xs text-slate-400">
                Official documents subject to scrutiny by Regional Scrutiny Officer
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Verified:{' '}
              <strong className="text-emerald-400">
                {app.documents.filter((d) => d.verificationStatus === 'VERIFIED').length}
              </strong>{' '}
              / {app.documents.length}
            </div>
          </div>

          <div className="space-y-3">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs">{doc.name}</span>
                      <StatusBadge status={doc.verificationStatus} type="document" size="sm" />
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Category: <strong className="text-slate-300">{doc.category}</strong> · Size: {doc.fileSize}
                    </div>
                    {doc.remarks && (
                      <div className="text-[11px] text-amber-400/90 mt-1 italic">
                        Officer Remark: "{doc.remarks}"
                      </div>
                    )}
                    {doc.verifiedBy && (
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Verified by {doc.verifiedBy} on {new Date(doc.verifiedAt || '').toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      alert(`Document preview for ${doc.name} (Stored securely in prototype storage). Size: ${doc.fileSize}`);
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                  >
                    View PDF
                  </button>

                  {currentUser.role !== 'INSTITUTION' && (
                    <button
                      onClick={() =>
                        setDocVerifyModal({
                          docId: doc.id,
                          docName: doc.name,
                          currentStatus: doc.verificationStatus
                        })
                      }
                      className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 rounded text-xs font-medium transition-colors"
                    >
                      Verify / Action
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Stage History */}
      {activeTab === 'history' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Statutory Workflow History</h3>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {app.statusHistory.map((entry, index) => (
              <div key={entry.id || index} className="relative">
                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-indigo-300">
                      Stage: {WORKFLOW_STAGES_CONFIG.find((s) => s.key === entry.stage)?.label || entry.stage}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-300 leading-relaxed">{entry.notes}</div>
                  {entry.correctionReason && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 mt-2">
                      <strong>Deficiency Reason:</strong> {entry.correctionReason}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    Recorded by: {entry.changedBy} ({entry.role})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Events */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Application Audit Trail</h3>
              <p className="text-xs text-slate-400">Append-only immutable record of all state transitions</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Integrity Verified</span>
          </div>

          <div className="space-y-3">
            {appAuditEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-slate-200">
                    {evt.action.replace(/_/g, ' ')}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>
                {evt.reason && <div className="text-slate-400 italic">"{evt.reason}"</div>}
                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-3 pt-1">
                  <span>Actor: {evt.actingUser} ({evt.userRole})</span>
                  <span>·</span>
                  <span>IP: {evt.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Advance Stage Modal */}
      {showAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Advance Workflow Stage</h3>
            <p className="text-xs text-slate-400 mb-4">
              Authorized transition for application <strong className="text-indigo-300 font-mono">{app.id}</strong>.
            </p>

            <form onSubmit={handleAdvanceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Target Stage
                </label>
                <select
                  value={advanceNextStage}
                  onChange={(e) => setAdvanceNextStage(e.target.value as WorkflowStageKey)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {WORKFLOW_STAGES_CONFIG.map((stage) => (
                    <option key={stage.key} value={stage.key}>
                      Stage {stage.order}: {stage.label} (SLA: {stage.defaultSlaDays} days)
                    </option>
                  ))}
                </select>
              </div>

              {advanceNextStage === 'FINAL_DECISION' && (
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Statutory Decision
                  </label>
                  <select
                    value={advanceFinalStatus}
                    onChange={(e) => setAdvanceFinalStatus(e.target.value as ApplicationStatus)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="APPROVED">Grant Approval (EOA Issued)</option>
                    <option value="REJECTED">Reject Application (Speaking Order)</option>
                    <option value="DEFICIENCY_NOTED">Grant with Noted Deficiencies</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Official Scrutiny Notes / Minutes
                </label>
                <textarea
                  rows={4}
                  value={advanceNotes}
                  onChange={(e) => setAdvanceNotes(e.target.value)}
                  placeholder="Enter detailed verification findings, council resolution numbers, or committee observations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdvanceModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-md shadow-indigo-600/20"
                >
                  Confirm Transition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Correction Modal */}
      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Issue Statutory Deficiency Memo</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Return dossier for correction. Under AICTE regulations, a specific and mandatory reason is required.
            </p>

            <form onSubmit={handleCorrectionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Deficiency / Discrepancy Reason (Mandatory)
                </label>
                <textarea
                  rows={4}
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="Specify missing documents, expired deeds, faculty cadre discrepancies, or structural issues..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCorrectionModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
                >
                  Dispatch Deficiency Memo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Resubmit Rectification Modal */}
      {showResubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Resubmit Rectified Application</h3>
            <p className="text-xs text-slate-400 mb-4">
              Provide clarification regarding how deficiencies have been rectified.
            </p>

            <form onSubmit={handleResubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Rectification Explanation & New File Notes
                </label>
                <textarea
                  rows={4}
                  value={resubmitNotes}
                  onChange={(e) => setResubmitNotes(e.target.value)}
                  placeholder="Explain new documents uploaded, registered deed submission, or revised faculty list..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResubmitModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
                >
                  Resubmit for Re-Scrutiny
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Document Verification Modal */}
      {docVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Verify Document Dossier</h3>
            <p className="text-xs text-slate-300 mb-4">
              File: <strong className="text-indigo-300 font-mono">{docVerifyModal.docName}</strong>
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Scrutiny Remarks
                </label>
                <input
                  type="text"
                  value={docRemarks}
                  onChange={(e) => setDocRemarks(e.target.value)}
                  placeholder="e.g., Verified with revenue sub-registrar records..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDocVerifyModal(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDocVerify('REJECTED')}
                className="px-3 py-1.5 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded text-xs hover:bg-rose-600 hover:text-white"
              >
                Mark Deficient
              </button>
              <button
                type="button"
                onClick={() => handleDocVerify('VERIFIED')}
                className="px-3 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-500 font-medium"
              >
                Verify & Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Manual Escalation Modal */}
      {showEscalationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Escalate Application SLA</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Escalate {app.id} directly to Bureau Head (AICTE HQ New Delhi) for administrative intervention.
            </p>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Escalation Reason
                </label>
                <textarea
                  rows={3}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Explain why this case requires urgent Bureau intervention..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowEscalationModal(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!escalationReason.trim()) {
                    alert('Please enter an escalation reason.');
                    return;
                  }
                  triggerManualEscalation(app.id, escalationReason);
                  setShowEscalationModal(false);
                  setEscalationReason('');
                  alert(`Case ${app.id} escalated to AICTE Bureau Head!`);
                }}
                className="px-3 py-1.5 bg-rose-600 text-white rounded text-xs hover:bg-rose-500 font-medium"
              >
                Trigger Bureau Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
