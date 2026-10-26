import React from 'react';
import { useApp } from '../../context/AppContext';
import { DEMO_USERS } from '../../services/storage';
import { UserRole } from '../../types';
import { Building2, Briefcase, ShieldCheck, X, Check, Lock } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, switchRole } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Background glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AICTE Single Sign-On Demo</h2>
              <p className="text-xs text-slate-400">
                Prototype Authentication & Role-Based Access Control (RBAC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Select one of the three verified test personas to test institutional application submission,
            regional desk verification, or central bureau administrative governance.
          </p>

          <div className="space-y-3">
            {DEMO_USERS.map((user) => {
              const isSelected = currentUser.role === user.role;

              return (
                <div
                  key={user.id}
                  onClick={() => {
                    switchRole(user.role);
                    onClose();
                  }}
                  className={`cursor-pointer p-4 rounded-xl border transition-all text-left relative flex items-start gap-4 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-lg ring-1 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
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

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-slate-100 text-sm">{user.name}</div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-indigo-400">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-indigo-300 font-mono mt-0.5">{user.designation}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {user.role === 'INSTITUTION' &&
                        'Can submit applications, upload lease/cadre documents, view timelines, and resolve deficiency memos.'}
                      {user.role === 'REGIONAL_OFFICER' &&
                        'Can perform initial scrutiny, verify deeds, schedule EVC inspections, issue deficiency memos, and escalate overdue cases.'}
                      {user.role === 'BUREAU_ADMIN' &&
                        'Can view all nationwide applications, configure SLA workflow rules, monitor pendency, and record final council decisions.'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Security protocol: OAuth2 / JWT simulation</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
