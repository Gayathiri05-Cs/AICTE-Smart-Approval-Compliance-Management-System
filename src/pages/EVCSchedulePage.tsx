import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Users,
  Building,
  CheckCircle,
  Clock,
  PlusCircle,
  FileText,
  MapPin,
  ExternalLink,
  Upload,
  AlertCircle
} from 'lucide-react';
import { EVCEvent } from '../types';

export const EVCSchedulePage: React.FC = () => {
  const { evcEvents, currentUser, scheduleEVC, updateEVCStatus, applications } = useApp();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || 'APP-2026-6120');
  const [visitDate, setVisitDate] = useState('2026-11-04');
  const [teamLeader, setTeamLeader] = useState('Prof. A. S. Narayanan (IIT Delhi)');
  const [expert1, setExpert1] = useState('Prof. Meenakshi Sundaram (NIT Trichy)');
  const [expert2, setExpert2] = useState('Er. K. Venugopal (State PWD Chief Architect)');

  // Report modal
  const [reportModalEvent, setReportModalEvent] = useState<EVCEvent | null>(null);
  const [reportSummary, setReportSummary] = useState('');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const app = applications.find((a) => a.id === selectedAppId);
    if (!app) return;

    scheduleEVC({
      applicationId: selectedAppId,
      institutionName: app.institutionName,
      region: app.region,
      visitDate: new Date(visitDate).toISOString(),
      teamLeader: teamLeader.trim(),
      expertMembers: [expert1.trim(), expert2.trim()],
      status: 'SCHEDULED',
      inspectionReportSummary: 'Physical site verification of labs, workshops, land boundary and biometric attendance.'
    });

    setShowScheduleModal(false);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportModalEvent || !reportSummary.trim()) return;

    updateEVCStatus(reportModalEvent.id, 'REPORT_SUBMITTED', reportSummary.trim());
    setReportModalEvent(null);
    setReportSummary('');
    alert('Inspection report uploaded! Application advanced to EVC Conducted stage.');
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Expert Visiting Committee (EVC) Schedules
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical on-site inspections, committee rosters, geo-tagged photography, and statutory inspection reports.
          </p>
        </div>

        {currentUser.role !== 'INSTITUTION' && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Constitute & Schedule EVC</span>
          </button>
        )}
      </div>

      {/* Grid of EVC Schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {evcEvents.map((evc) => {
          const isCompleted = evc.status === 'REPORT_SUBMITTED' || evc.status === 'INSPECTION_COMPLETED';

          return (
            <div
              key={evc.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-indigo-400">{evc.id}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-xs font-mono text-slate-400">{evc.applicationId}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mt-1">{evc.institutionName}</h3>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{evc.region} Region</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium ${
                      evc.status === 'REPORT_SUBMITTED'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    }`}
                  >
                    {evc.status === 'REPORT_SUBMITTED' ? (
                      <CheckCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{evc.status.replace(/_/g, ' ')}</span>
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Inspection: {new Date(evc.visitDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Committee Members */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] uppercase font-mono text-slate-500">
                  3-Member Expert Visiting Committee:
                </span>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="font-semibold text-indigo-200">
                    Lead: {evc.teamLeader}
                  </div>
                  {evc.expertMembers.map((member, idx) => (
                    <div key={idx} className="text-slate-300 text-[11px] pl-3 border-l border-slate-800">
                      Member {idx + 1}: {member}
                    </div>
                  ))}
                </div>
              </div>

              {/* Inspection Summary */}
              {evc.inspectionReportSummary && (
                <div className="text-xs text-slate-300 bg-slate-950/30 p-3 rounded-lg border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
                    Inspection Observations:
                  </span>
                  <p className="italic text-slate-300 leading-relaxed">
                    "{evc.inspectionReportSummary}"
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  Scheduled: {new Date(evc.scheduledAt).toLocaleDateString()}
                </span>

                {currentUser.role !== 'INSTITUTION' && evc.status === 'SCHEDULED' && (
                  <button
                    onClick={() => {
                      setReportModalEvent(evc);
                      setReportSummary('');
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Upload Inspection Report
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Constitute Expert Visiting Committee</h3>
            <p className="text-xs text-slate-400 mb-4">
              Select target application and appoint three independent academic & architectural experts.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Target Application
                </label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.id} - {app.institutionName} ({app.region} Region)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Proposed Inspection Date *
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Committee Team Leader (Professor / Senior Dean) *
                </label>
                <input
                  type="text"
                  value={teamLeader}
                  onChange={(e) => setTeamLeader(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Expert Member 1 (Subject Specialist) *
                  </label>
                  <input
                    type="text"
                    value={expert1}
                    onChange={(e) => setExpert1(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                    Expert Member 2 (Architect / PWD) *
                  </label>
                  <input
                    type="text"
                    value={expert2}
                    onChange={(e) => setExpert2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg text-xs"
                >
                  Dispatch EVC Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Upload EVC Inspection Findings</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter official inspection minutes for {reportModalEvent.institutionName}.
            </p>

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Inspection Report Executive Summary *
                </label>
                <textarea
                  rows={4}
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  placeholder="Record verification of land deeds, smart classrooms, lab instruments, fire exits, and faculty availability..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setReportModalEvent(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs"
                >
                  Submit & Advance Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
