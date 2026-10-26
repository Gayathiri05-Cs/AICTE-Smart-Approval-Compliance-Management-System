import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, Clock, ShieldCheck, Download, Award, Building, CheckCircle2 } from 'lucide-react';
import { exportToCsv } from '../services/export';

export const ReportsPage: React.FC = () => {
  const { applications, complianceTasks } = useApp();

  // Regional workload & pendency
  const regionalMetrics = useMemo(() => {
    const regions = ['Northern', 'Western', 'Southern', 'Eastern', 'South-Western'];
    return regions.map((r) => {
      const regApps = applications.filter((a) => a.region === r);
      const total = regApps.length;
      const approved = regApps.filter((a) => a.status === 'APPROVED').length;
      const inProgress = regApps.filter((a) => a.status === 'IN_PROGRESS').length;
      const overdue = regApps.filter((a) => a.isOverdue || (a.daysInCurrentStage > a.slaDays && a.status === 'IN_PROGRESS')).length;
      const complianceTasksForReg = complianceTasks.filter((c) =>
        regApps.some((a) => a.institutionName === c.institutionName)
      );
      const compliantCount = complianceTasksForReg.filter((c) => c.status === 'COMPLIANT').length;
      const complianceRate = complianceTasksForReg.length > 0
        ? Math.round((compliantCount / complianceTasksForReg.length) * 100)
        : 85;

      return {
        region: r,
        total,
        approved,
        inProgress,
        overdue,
        complianceRate,
        avgDays: r === 'Northern' ? 8.2 : r === 'Western' ? 11.4 : r === 'Southern' ? 7.6 : 9.1
      };
    });
  }, [applications, complianceTasks]);

  // Turnaround comparison data
  const stageTurnaroundData = [
    { stage: 'Desk Scrutiny', targetSla: 7, actualAvg: 6.2 },
    { stage: 'Re-Scrutiny', targetSla: 5, actualAvg: 4.8 },
    { stage: 'EVC Inspection', targetSla: 10, actualAvg: 9.1 },
    { stage: 'SHC Committee', targetSla: 8, actualAvg: 7.4 },
    { stage: 'Final Council Decision', targetSla: 3, actualAvg: 2.1 }
  ];

  const handleExport = () => {
    exportToCsv('AICTE_Regional_Pendency_Report', regionalMetrics);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Institutional Approval & Compliance Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Regional performance benchmarking, SLA turnaround adherence, and national compliance health index.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Regional Dataset</span>
        </button>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500">
            Average Turnaround Time (TAT)
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
            18.4 Days
          </div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>22% faster than APH statutory ceiling (25 days)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500">
            National Compliance Index
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            91.6%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Across land leases, fire NOCs & faculty cadre
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-[10px] uppercase font-mono text-slate-500">
            Digital EOA Issuance Rate
          </span>
          <div className="text-2xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
            100%
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Zero physical paperwork required
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Turnaround vs SLA Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-white mb-1">
            Stage-wise Turnaround Time vs Statutory SLA
          </h3>
          <p className="text-xs text-slate-400 mb-4">Average days taken compared to prescribed SLA limit</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageTurnaroundData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="stage" stroke="#64748b" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#64748b" fontSize={11} unit="d" />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                          <div className="font-semibold text-slate-200">{data.stage}</div>
                          <div className="text-slate-400 font-mono mt-1">Target SLA: {data.targetSla} days</div>
                          <div className="text-indigo-400 font-mono font-semibold">
                            Actual Avg: {data.actualAvg} days
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="targetSla" name="Prescribed SLA Limit" fill="#475569" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualAvg" name="Actual National Average" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Regional Workload Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-white mb-1">Regional Workload & Pendency</h3>
          <p className="text-xs text-slate-400 mb-4">Active in-progress vs overdue cases by regional office</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs shadow-xl">
                          <div className="font-semibold text-slate-200">{data.region} Regional Office</div>
                          <div className="text-sky-400 font-mono mt-1">In Progress: {data.inProgress}</div>
                          <div className="text-rose-400 font-mono font-semibold">Overdue: {data.overdue}</div>
                          <div className="text-emerald-400 font-mono">Compliance Rate: {data.complianceRate}%</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="inProgress" name="In Progress" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" name="SLA Overdue" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Regional Scorecard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">Regional Office Performance League</h3>
          <p className="text-xs text-slate-400">Comprehensive scrutiny metrics across the five key jurisdictions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Regional Office</th>
                <th className="py-3 px-4">Total Received</th>
                <th className="py-3 px-4">In Scrutiny</th>
                <th className="py-3 px-4">SLA Overdue</th>
                <th className="py-3 px-4">Approved (EOA)</th>
                <th className="py-3 px-4">Avg Turnaround</th>
                <th className="py-3 px-4">Compliance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {regionalMetrics.map((r) => (
                <tr key={r.region} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                    {r.region} Regional Office
                  </td>
                  <td className="py-3 px-4 text-slate-300">{r.total}</td>
                  <td className="py-3 px-4 text-sky-400">{r.inProgress}</td>
                  <td className="py-3 px-4 text-rose-400 font-bold">{r.overdue}</td>
                  <td className="py-3 px-4 text-emerald-400 font-semibold">{r.approved}</td>
                  <td className="py-3 px-4 text-slate-300">{r.avgDays} days</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${r.complianceRate}%` }}
                        />
                      </div>
                      <span className="text-slate-200">{r.complianceRate}%</span>
                    </div>
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
