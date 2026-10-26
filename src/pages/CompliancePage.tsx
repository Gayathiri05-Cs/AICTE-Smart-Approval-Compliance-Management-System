import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { exportToCsv } from '../services/export';
import {
  ShieldAlert,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Download,
  PlusCircle,
  FileText,
  Upload,
  Send,
  Eye,
  Check,
  X
} from 'lucide-react';
import { ComplianceStatus, ComplianceType, ComplianceTask } from '../types';

export const CompliancePage: React.FC = () => {
  const {
    complianceTasks,
    currentUser,
    submitComplianceDocument,
    verifyComplianceTask,
    createComplianceTask,
    sendTestReminder
  } = useApp();

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modals
  const [submitModalTask, setSubmitModalTask] = useState<ComplianceTask | null>(null);
  const [submitDocName, setSubmitDocName] = useState('');

  const [verifyModalTask, setVerifyModalTask] = useState<ComplianceTask | null>(null);
  const [verifyNotes, setVerifyNotes] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newInstName, setNewInstName] = useState(
    currentUser.role === 'INSTITUTION' ? 'Delhi Institute of Technology & Science' : 'Delhi Institute of Technology & Science'
  );
  const [newAppId, setNewAppId] = useState('APP-2026-8812');
  const [newType, setNewType] = useState<ComplianceType>('Institutional Undertaking');
  const [newDeadline, setNewDeadline] = useState('2026-11-15');
  const [newExpiry, setNewExpiry] = useState('');

  // Scoped tasks
  const roleScopedTasks = useMemo(() => {
    if (currentUser.role === 'INSTITUTION') {
      return complianceTasks.filter((t) => t.institutionId === currentUser.institutionId || t.institutionName.includes('Delhi'));
    }
    return complianceTasks;
  }, [complianceTasks, currentUser]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return roleScopedTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.relatedApplicationId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || task.complianceType === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [roleScopedTasks, searchQuery, statusFilter, typeFilter]);

  // Accurate date calculations
  const calculateDaysLeft = (targetDateStr: string) => {
    const target = new Date(targetDateStr).getTime();
    const now = new Date('2026-10-25T22:50:00Z').getTime(); // App current time
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExportCsv = () => {
    const rows = filteredTasks.map((t) => ({
      ComplianceID: t.id,
      InstitutionName: t.institutionName,
      ApplicationID: t.relatedApplicationId,
      ComplianceType: t.complianceType,
      Title: t.title,
      Deadline: t.submissionDeadline,
      ExpiryDate: t.documentExpiryDate || 'N/A',
      Status: t.status,
      AssignedOfficer: t.assignedOfficer,
      SubmittedDocument: t.submittedDocName || 'Pending',
      LastUpdated: t.lastUpdated
    }));
    exportToCsv('AICTE_Compliance_Tracker', rows);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createComplianceTask({
      institutionId: 'inst-1',
      institutionName: newInstName,
      relatedApplicationId: newAppId,
      complianceType: newType,
      title: newTitle.trim(),
      submissionDeadline: new Date(newDeadline).toISOString(),
      documentExpiryDate: newExpiry ? new Date(newExpiry).toISOString() : undefined,
      status: 'DUE_SOON',
      assignedOfficer: 'Dr. Rajeshwar Varma'
    });

    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Statutory Compliance & Deadline Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional undertakings, lease validity covenants, fire NOCs, and automated expiration warnings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Calendar Schedule
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {currentUser.role !== 'INSTITUTION' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Track New Obligation</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance tasks by ID, institution, application, or title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses ({roleScopedTasks.length})</option>
              <option value="COMPLIANT">Compliant</option>
              <option value="DUE_SOON">Due Soon</option>
              <option value="PENDING_VERIFICATION">Pending Verification</option>
              <option value="OVERDUE">Overdue</option>
              <option value="EXPIRED">Expired</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Compliance Categories</option>
              <option value="Institutional Undertaking">Institutional Undertaking</option>
              <option value="Land & Lease Validity">Land & Lease Validity</option>
              <option value="Building Safety Certificate">Building Safety Certificate</option>
              <option value="Fire Safety NOC">Fire Safety NOC</option>
              <option value="Faculty Cadre Ratio">Faculty Cadre Ratio</option>
              <option value="Anti-Ragging Affidavit">Anti-Ragging Affidavit</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Compliance ID</th>
                  <th className="py-3 px-4">Obligation Title & Type</th>
                  <th className="py-3 px-4">Institution / App</th>
                  <th className="py-3 px-4">Deadline & Countdown</th>
                  <th className="py-3 px-4">Deed / Cert Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTasks.map((task) => {
                  const daysLeft = calculateDaysLeft(task.submissionDeadline);
                  const isPast = daysLeft < 0;

                  return (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-300 whitespace-nowrap">
                        {task.id}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-100">{task.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{task.complianceType}</div>
                        {task.submittedDocName && (
                          <div className="text-[10px] text-sky-400 mt-1 font-mono flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            <span>Submitted: {task.submittedDocName}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-200">{task.institutionName}</div>
                        <div className="text-[11px] font-mono text-indigo-400 mt-0.5">
                          {task.relatedApplicationId}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <div className="text-slate-300">
                          {new Date(task.submissionDeadline).toLocaleDateString()}
                        </div>
                        <div className="text-[11px] mt-0.5">
                          {isPast ? (
                            <span className="text-rose-400 font-bold">
                              {Math.abs(daysLeft)} days overdue
                            </span>
                          ) : daysLeft <= 14 ? (
                            <span className="text-amber-400 font-medium">
                              {daysLeft} days remaining
                            </span>
                          ) : (
                            <span className="text-slate-400">{daysLeft} days left</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono whitespace-nowrap text-slate-400">
                        {task.documentExpiryDate ? (
                          <div>
                            <span className="text-slate-300">
                              {new Date(task.documentExpiryDate).toLocaleDateString()}
                            </span>
                            {calculateDaysLeft(task.documentExpiryDate) < 0 && (
                              <div className="text-[10px] text-red-400 font-bold">Doc Expired</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={task.status} type="compliance" size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        {/* Institution: Submit Document */}
                        {currentUser.role === 'INSTITUTION' && task.status !== 'COMPLIANT' && (
                          <button
                            onClick={() => {
                              setSubmitModalTask(task);
                              setSubmitDocName('');
                            }}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium transition-colors"
                          >
                            Upload Proof
                          </button>
                        )}

                        {/* Officer: Verify */}
                        {currentUser.role !== 'INSTITUTION' && (
                          <button
                            onClick={() => {
                              setVerifyModalTask(task);
                              setVerifyNotes(task.verificationNotes || '');
                            }}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-medium transition-colors"
                          >
                            Verify / Action
                          </button>
                        )}

                        {/* Reminder trigger */}
                        <button
                          onClick={() => {
                            sendTestReminder(
                              `Reminder: ${task.title}`,
                              `Statutory notice for ${task.institutionName}. Deadline: ${new Date(task.submissionDeadline).toLocaleDateString()}.`,
                              'SMS',
                              'COMPLIANCE',
                              task.id
                            );
                            alert(`Simulated SMS reminder dispatched for ${task.id}!`);
                          }}
                          className="px-2 py-1 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded text-[11px] transition-colors"
                          title="Send test alert"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-white">Statutory Deadlines Calendar</h3>
              <p className="text-xs text-slate-400">Quarterly statutory submission & validity timeline</p>
            </div>
            <span className="text-xs font-mono text-indigo-400">Q4 2026 - Q1 2027</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-indigo-400">{task.id}</span>
                    <StatusBadge status={task.status} type="compliance" size="sm" />
                  </div>
                  <h4 className="text-xs font-semibold text-white leading-snug">{task.title}</h4>
                  <div className="text-[11px] text-slate-400 mt-1">{task.institutionName}</div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{new Date(task.submissionDeadline).toLocaleDateString()}</span>
                  </div>
                  <span className={task.status === 'OVERDUE' ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    {calculateDaysLeft(task.submissionDeadline) < 0
                      ? `${Math.abs(calculateDaysLeft(task.submissionDeadline))}d overdue`
                      : `${calculateDaysLeft(task.submissionDeadline)}d left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Upload Compliance Proof */}
      {submitModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Submit Statutory Compliance</h3>
            <p className="text-xs text-slate-300 mb-4">
              Obligation: <strong className="text-indigo-300">{submitModalTask.title}</strong>
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!submitDocName.trim()) {
                  alert('Please enter or select a document filename.');
                  return;
                }
                submitComplianceDocument(submitModalTask.id, submitDocName.trim());
                setSubmitModalTask(null);
                setSubmitDocName('');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Document / Certificate Title
                </label>
                <input
                  type="text"
                  value={submitDocName}
                  onChange={(e) => setSubmitDocName(e.target.value)}
                  placeholder="e.g. Registered_Lease_Deed_SubRegistrar_2026.pdf"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl flex items-center justify-between">
                <span className="text-slate-400">Sample verified document template</span>
                <button
                  type="button"
                  onClick={() => setSubmitDocName(`${submitModalTask.complianceType.replace(/\s+/g, '_')}_Signed_2026.pdf`)}
                  className="text-xs text-indigo-400 hover:underline"
                >
                  Use Template
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmitModalTask(null)}
                  className="px-3.5 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Upload & Notify Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Officer Verification */}
      {verifyModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Verify Statutory Compliance</h3>
            <p className="text-xs text-slate-300 mb-4">
              Obligation: <strong className="text-indigo-300">{verifyModalTask.title}</strong>
            </p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Verification Notes / Findings
                </label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  placeholder="e.g. Scrutinized against municipal registry, clearance certificate valid..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setVerifyModalTask(null)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    verifyComplianceTask(verifyModalTask.id, false, verifyNotes || 'Deficiency noted.');
                    setVerifyModalTask(null);
                  }}
                  className="px-3 py-1.5 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded text-xs hover:bg-rose-600 hover:text-white"
                >
                  Reject Proof
                </button>
                <button
                  type="button"
                  onClick={() => {
                    verifyComplianceTask(verifyModalTask.id, true, verifyNotes || 'Compliance verified.');
                    setVerifyModalTask(null);
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-500 font-medium"
                >
                  Mark Compliant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Create New Compliance Tracking */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Track New Statutory Obligation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add a statutory requirement for automated deadline tracking and escalation.
            </p>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Obligation Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mandatory submission of structural audit certificate"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Compliance Category
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  >
                    <option value="Institutional Undertaking">Institutional Undertaking</option>
                    <option value="Land & Lease Validity">Land & Lease Validity</option>
                    <option value="Building Safety Certificate">Building Safety Certificate</option>
                    <option value="Fire Safety NOC">Fire Safety NOC</option>
                    <option value="Faculty Cadre Ratio">Faculty Cadre Ratio</option>
                    <option value="Anti-Ragging Affidavit">Anti-Ragging Affidavit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Submission Deadline *
                  </label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Deed / Certificate Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Create & Monitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
