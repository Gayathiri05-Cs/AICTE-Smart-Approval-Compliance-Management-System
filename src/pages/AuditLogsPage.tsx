import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { exportToCsv } from '../services/export';
import {
  History,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Calendar,
  User,
  ArrowRight,
  Lock,
  Clock,
  Layers
} from 'lucide-react';
import { UserRole } from '../types';

export const AuditLogsPage: React.FC = () => {
  const { auditEvents, currentUser } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'timeline'>('table');

  const filteredEvents = useMemo(() => {
    return auditEvents.filter((evt) => {
      const matchesSearch =
        evt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.actingUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.relatedId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (evt.reason && evt.reason.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'ALL' || evt.userRole === roleFilter;
      const matchesAction = actionFilter === 'ALL' || evt.action === actionFilter;

      return matchesSearch && matchesRole && matchesAction;
    });
  }, [auditEvents, searchQuery, roleFilter, actionFilter]);

  const handleExportCsv = () => {
    const rows = filteredEvents.map((e) => ({
      EventID: e.id,
      Timestamp: e.timestamp,
      ActingUser: e.actingUser,
      UserRole: e.userRole,
      RelatedID: e.relatedId,
      Action: e.action,
      PreviousStatus: e.previousStatus || 'N/A',
      NewStatus: e.newStatus || 'N/A',
      ReasonNotes: e.reason || '',
      IPAddress: e.ipAddress
    }));
    exportToCsv('AICTE_Digital_Audit_Trail', rows);
  };

  const actionTypes = Array.from(new Set(auditEvents.map((e) => e.action)));

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Digital Audit Trail & Accountability Register
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable, append-only chronological log of all approvals, document verifications, deficiency memos, and decisions.
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
              Tabular Log
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded-md transition-colors ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Timeline View
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Security Assurance Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-200 flex items-center gap-2">
              <span>Cryptographically Traceable Audit Ledger</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                APPEND-ONLY
              </span>
            </div>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Ordinary users cannot modify or purge historical entries. Every record retains actor identity, role, timestamp, and network IP.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by event ID, officer name, application ID, or reason..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Roles</option>
              <option value="INSTITUTION">Institution User</option>
              <option value="REGIONAL_OFFICER">Regional Officer</option>
              <option value="BUREAU_ADMIN">Bureau Admin</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Action Types</option>
              {actionTypes.map((act) => (
                <option key={act} value={act}>
                  {act.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing <strong className="text-white font-mono">{filteredEvents.length}</strong> immutable audit entries
            </span>
            <span className="text-emerald-400 font-mono text-[11px]">Ledger Hash: SHA-256 Verified</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                  <th className="py-3 px-4">Event ID</th>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Acting User & Role</th>
                  <th className="py-3 px-4">Action Performed</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Status Transition</th>
                  <th className="py-3 px-4">Justification / Remarks</th>
                  <th className="py-3 px-4 font-mono">Client IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-indigo-300 font-semibold whitespace-nowrap">
                      {evt.id}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{evt.actingUser}</div>
                      <div className="text-[10px] font-mono text-indigo-400">{evt.userRole}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                      {evt.action.replace(/_/g, ' ')}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-sky-400 whitespace-nowrap">
                      {evt.relatedId}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {evt.previousStatus && evt.newStatus ? (
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          <span className="text-slate-400">{evt.previousStatus}</span>
                          <span className="text-slate-600">&rarr;</span>
                          <span className="text-emerald-400 font-semibold">{evt.newStatus}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-300 text-[11px]" title={evt.reason}>
                      {evt.reason || 'Routine automated system trigger'}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                      {evt.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {filteredEvents.map((evt) => (
              <div key={evt.id} className="relative">
                <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{evt.action.replace(/_/g, ' ')}</span>
                      <span className="font-mono text-indigo-400 font-semibold">[{evt.relatedId}]</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>

                  {evt.reason && (
                    <div className="text-slate-300 leading-relaxed italic bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/80">
                      "{evt.reason}"
                    </div>
                  )}

                  <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
                    <span>
                      Actor: <strong className="text-slate-300">{evt.actingUser}</strong> ({evt.userRole})
                    </span>
                    <span>Verified Host: {evt.ipAddress}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
