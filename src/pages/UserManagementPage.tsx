import React from 'react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../services/storage';
import {
  Users,
  ShieldCheck,
  Building2,
  Briefcase,
  Check,
  X,
  Lock,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

export const UserManagementPage: React.FC = () => {
  const { currentUser, switchRole, applications } = useApp();

  const permissions = [
    {
      feature: 'Submit Technical Institution Application',
      institution: true,
      officer: false,
      admin: true
    },
    {
      feature: 'Upload Sample Documents & Undertakings',
      institution: true,
      officer: false,
      admin: true
    },
    {
      feature: 'Conduct Desk Scrutiny & Document Verification',
      institution: false,
      officer: true,
      admin: true
    },
    {
      feature: 'Issue Statutory Deficiency Memo (Return for Correction)',
      institution: false,
      officer: true,
      admin: true
    },
    {
      feature: 'Constitute & Schedule Expert Visiting Committee (EVC)',
      institution: false,
      officer: true,
      admin: true
    },
    {
      feature: 'Verify Statutory Compliance Proof (Lease, Fire NOC)',
      institution: false,
      officer: true,
      admin: true
    },
    {
      feature: 'Trigger Authorized SLA Escalations',
      institution: false,
      officer: true,
      admin: true
    },
    {
      feature: 'Record Final Statutory Approval / Rejection (Council Order)',
      institution: false,
      officer: false,
      admin: true
    },
    {
      feature: 'Configure Workflow Stages & SLA Deadlines',
      institution: false,
      officer: false,
      admin: true
    },
    {
      feature: 'Inspect Complete Tamper-Evident Audit Ledger',
      institution: false,
      officer: true,
      admin: true
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white tracking-tight">
          User Directory & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Granular permissions matrix, designated scrutiny officers, and institutional accounts.
        </p>
      </div>

      {/* Active Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DEMO_USERS.map((user) => {
          const isSelected = currentUser.role === user.role;
          const assignedApps = applications.filter((a) =>
            user.role === 'INSTITUTION'
              ? a.institutionId === user.institutionId
              : user.role === 'REGIONAL_OFFICER'
              ? a.region === user.region
              : true
          ).length;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/20 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    user.role === 'INSTITUTION'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : user.role === 'REGIONAL_OFFICER'
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-400'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  }`}
                >
                  {user.role === 'INSTITUTION' ? (
                    <Building2 className="w-5 h-5" />
                  ) : user.role === 'REGIONAL_OFFICER' ? (
                    <Briefcase className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>

                <button
                  onClick={() => switchRole(user.role)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {isSelected ? 'Active Role' : 'Switch To'}
                </button>
              </div>

              <h3 className="font-semibold text-white text-sm">{user.name}</h3>
              <div className="text-xs text-indigo-300 font-mono mt-0.5">{user.designation}</div>
              <div className="text-xs text-slate-400 mt-1">{user.email}</div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Jurisdiction: {user.region || 'HQ'}</span>
                <span className="text-slate-300">{assignedApps} Dossiers</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Statutory RBAC Authorization Matrix</h3>
          <p className="text-xs text-slate-400">
            Enforced at the client service layer and mapped directly to FastAPI OAuth2 scope dependencies.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">System Operation / Action</th>
                <th className="py-3 px-4 text-center">Institution User</th>
                <th className="py-3 px-4 text-center">Regional Officer</th>
                <th className="py-3 px-4 text-center">Bureau Administrator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-medium text-slate-200">{perm.feature}</td>

                  <td className="py-3 px-4 text-center">
                    {perm.institution ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {perm.officer ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>

                  <td className="py-3 px-4 text-center">
                    {perm.admin ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
