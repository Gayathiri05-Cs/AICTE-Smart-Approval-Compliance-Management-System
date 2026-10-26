import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { exportToCsv } from '../services/export';
import { WORKFLOW_STAGES_CONFIG } from '../services/storage';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  Eye,
  AlertTriangle,
  ArrowUpDown,
  Building2,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ApplicationStatus, WorkflowStageKey } from '../types';

interface ApplicationsPageProps {
  onOpenAppDetail: (appId: string) => void;
  onNavigateNewApp: () => void;
}

export const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  onOpenAppDetail,
  onNavigateNewApp
}) => {
  const { applications, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'stageTime' | 'institution'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter based on role constraints
  const roleScopedApps = useMemo(() => {
    if (currentUser.role === 'INSTITUTION') {
      return applications.filter((a) => a.institutionId === currentUser.institutionId);
    }
    return applications;
  }, [applications, currentUser]);

  // Filter and sort
  const filteredApps = useMemo(() => {
    return roleScopedApps
      .filter((app) => {
        const matchesSearch =
          app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.institutionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.applicationType.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStage = stageFilter === 'ALL' || app.currentStage === stageFilter;
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        const matchesRegion = regionFilter === 'ALL' || app.region === regionFilter;

        return matchesSearch && matchesStage && matchesStatus && matchesRegion;
      })
      .sort((a, b) => {
        let compare = 0;
        if (sortBy === 'date') {
          compare = new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
        } else if (sortBy === 'stageTime') {
          compare = a.daysInCurrentStage - b.daysInCurrentStage;
        } else if (sortBy === 'institution') {
          compare = a.institutionName.localeCompare(b.institutionName);
        }
        return sortOrder === 'asc' ? compare : -compare;
      });
  }, [roleScopedApps, searchQuery, stageFilter, statusFilter, regionFilter, sortBy, sortOrder]);

  const handleExportCsv = () => {
    const rows = filteredApps.map((a) => ({
      ApplicationID: a.id,
      InstitutionName: a.institutionName,
      InstitutionCode: a.institutionCode,
      Type: a.applicationType,
      Region: a.region,
      State: a.state,
      AcademicYear: a.academicYear,
      SubmissionDate: a.submissionDate,
      CurrentStage: a.currentStage,
      Status: a.status,
      AssignedOfficer: a.assignedOfficerName,
      DaysInStage: a.daysInCurrentStage,
      SlaDays: a.slaDays,
      IsOverdue: a.isOverdue ? 'YES' : 'NO'
    }));
    exportToCsv('AICTE_Applications_Register', rows);
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Applications Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete dossier lifecycle, stage tracking, verification memos, and statutory approvals.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          {(currentUser.role === 'INSTITUTION' || currentUser.role === 'BUREAU_ADMIN') && (
            <button
              onClick={onNavigateNewApp}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Application</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, institute name, code, or program..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Quick Clear */}
          {(searchQuery || stageFilter !== 'ALL' || statusFilter !== 'ALL' || regionFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStageFilter('ALL');
                setStatusFilter('ALL');
                setRegionFilter('ALL');
              }}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg shrink-0 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Dropdowns row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
              Workflow Stage
            </label>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Stages ({roleScopedApps.length})</option>
              {WORKFLOW_STAGES_CONFIG.map((stage) => (
                <option key={stage.key} value={stage.key}>
                  {stage.order}. {stage.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
              Decision Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CORRECTION_REQUESTED">Correction Requested</option>
              <option value="APPROVED">Approved (Granted)</option>
              <option value="REJECTED">Rejected</option>
              <option value="DEFICIENCY_NOTED">Deficiency Noted</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
              Regional Office
            </label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Regions</option>
              <option value="Northern">Northern Region</option>
              <option value="Western">Western Region</option>
              <option value="Southern">Southern Region</option>
              <option value="Eastern">Eastern Region</option>
              <option value="South-Western">South-Western Region</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
              Sort By
            </label>
            <div className="flex gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="date">Submission Date</option>
                <option value="stageTime">Stage Days</option>
                <option value="institution">Institution Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 hover:text-white"
                title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            Showing <strong className="text-white font-mono">{filteredApps.length}</strong> of{' '}
            <strong className="text-slate-300 font-mono">{roleScopedApps.length}</strong> applications
          </span>
          <span className="text-[11px] font-mono text-indigo-400">
            Current Academic Year: 2026-27
          </span>
        </div>

        {filteredApps.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <Building2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-slate-300 font-medium">No applications match your filter criteria.</p>
            <p className="text-slate-500 mt-1">Try resetting the filters or searching with another keyword.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Application ID</th>
                  <th className="py-3 px-4">Institution & Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Approval Stage</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4">Stage Days / SLA</th>
                  <th className="py-3 px-4">Assigned Officer</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredApps.map((app) => {
                  const isBreached =
                    app.isOverdue || (app.daysInCurrentStage > app.slaDays && app.status === 'IN_PROGRESS');

                  return (
                    <tr
                      key={app.id}
                      onClick={() => onOpenAppDetail(app.id)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono font-medium text-indigo-300 whitespace-nowrap">
                        {app.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 group-hover:text-indigo-200">
                          {app.institutionName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                          <span>{app.institutionCode}</span>
                          <span>·</span>
                          <span>{app.state}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <span className="text-xs">{app.applicationType}</span>
                        <div className="text-[10px] text-slate-500 font-mono">
                          Submitted: {new Date(app.submissionDate).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={app.currentStage} type="stage" size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={app.status} type="application" size="sm" />
                      </td>

                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isBreached && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                          <span
                            className={
                              isBreached
                                ? 'text-rose-400 font-semibold'
                                : 'text-slate-200'
                            }
                          >
                            {app.daysInCurrentStage}d
                          </span>
                          <span className="text-slate-500">/ {app.slaDays}d SLA</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        <div className="text-xs truncate max-w-[150px]">{app.assignedOfficerName}</div>
                        <div className="text-[10px] text-slate-500">{app.region} Region</div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAppDetail(app.id);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white rounded text-[11px] font-medium transition-colors"
                        >
                          View Dossier
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
    </div>
  );
};
