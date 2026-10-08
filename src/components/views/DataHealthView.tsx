import React from 'react';
import { DataSourceHealth } from '../../types/market';
import { ShieldCheck, Server, AlertCircle, RefreshCw, CheckCircle2, Globe, Clock, Layers } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface DataHealthViewProps {
  dataHealthList: DataSourceHealth[];
  onRefresh: () => void;
  isSyncing: boolean;
}

export const DataHealthView: React.FC<DataHealthViewProps> = ({
  dataHealthList,
  onRefresh,
  isSyncing
}) => {
  const healthyCount = dataHealthList.filter(
    (s) => s.status === 'LIVE' || s.status === 'DELAYED' || s.status === 'HISTORICAL'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                AUDITABILITY & PROVENANCE • DATA HEALTH SLA
              </span>
              <DataStatusBadge status="LIVE" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Institutional Data Lineage & API Health Monitor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Strict auditability: every dataset displays its upstream provider, update frequency, latency in milliseconds, and status (LIVE, DELAYED, HISTORICAL, SIMULATED, or UNAVAILABLE).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-mono text-slate-200 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Ping Providers</span>
            </button>

            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs">
              {healthyCount}/{dataHealthList.length} Connected
            </div>
          </div>
        </div>
      </div>

      {/* Sources Health Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-semibold">Feed Identifier</th>
                <th className="pb-2.5 font-semibold">Category</th>
                <th className="pb-2.5 font-semibold">Provider / Endpoint</th>
                <th className="pb-2.5 font-semibold">Frequency</th>
                <th className="pb-2.5 font-semibold">Status</th>
                <th className="pb-2.5 font-semibold">Latency</th>
                <th className="pb-2.5 font-semibold">24h Errors</th>
                <th className="pb-2.5 font-semibold">SLA Reliability</th>
                <th className="pb-2.5 font-semibold">Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dataHealthList.map((src) => (
                <tr key={src.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 font-bold text-slate-200">{src.name}</td>
                  <td className="py-3 text-slate-400">{src.category}</td>
                  <td className="py-3 text-slate-300 max-w-xs truncate" title={src.endpointUrl}>
                    <div className="truncate font-semibold">{src.provider}</div>
                    <div className="text-[10px] text-slate-500 truncate">{src.endpointUrl}</div>
                  </td>
                  <td className="py-3 text-slate-400">{src.frequency}</td>
                  <td className="py-3">
                    <DataStatusBadge status={src.status} />
                  </td>
                  <td className="py-3 text-emerald-400 font-bold">{src.latencyMs}ms</td>
                  <td className="py-3 text-slate-400">{src.errorCount24h}</td>
                  <td className="py-3 text-slate-300 font-bold">{src.reliabilityPct}%</td>
                  <td className="py-3">
                    {src.isOfficialSource ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        OFFICIAL
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500">Secondary</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provider Abstraction Layer Architecture Card (Section 22) */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
          <Layers className="w-4 h-4" />
          <span>Section 22 Provider Architecture Specifications:</span>
        </div>
        <p className="text-slate-300 leading-relaxed mb-3">
          The terminal implements modular interface adapters (<code className="text-amber-300">MarketDataProvider</code>, <code className="text-amber-300">MacroDataProvider</code>, <code className="text-amber-300">FXDataProvider</code>, <code className="text-amber-300">IndiaDataProvider</code>) with uniform <code className="text-slate-200">fetchCurrent()</code>, <code className="text-slate-200">fetchHistorical()</code>, <code className="text-slate-200">getStatus()</code> signatures.
        </p>
        <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-800 text-[11px] text-slate-400">
          When an upstream provider experiences transient downtime or rate limits, the system does not crash or fabricate numbers; it gracefully transitions to cached historical benchmarks with transparent <span className="text-amber-400 font-bold">DELAYED</span> or <span className="text-orange-400 font-bold">SIMULATED</span> status tagging.
        </div>
      </div>
    </div>
  );
};
