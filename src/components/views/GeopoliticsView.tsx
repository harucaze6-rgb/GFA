import React, { useState } from 'react';
import { GeopoliticalIndex, GeopoliticalEvent } from '../../types/market';
import { AlertTriangle, ShieldAlert, Globe2, Filter, Info, Calendar } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface GeopoliticsViewProps {
  geopolitics: GeopoliticalIndex;
}

export const GeopoliticsView: React.FC<GeopoliticsViewProps> = ({ geopolitics }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredEvents = filterSeverity === 'ALL'
    ? geopolitics.events
    : geopolitics.events.filter((e) => e.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                RISK TRANSMISSION • MODEL-GENERATED INDEX
              </span>
              <DataStatusBadge status="ESTIMATED" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Geopolitical Risk & Sovereign Conflict Monitor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Quantitative Geopolitical Risk Index (GPR). Events are taxonomically classified into Conflict, Sanctions, Trade Disruption, and Energy Shocks with empirical safe-haven sensitivity weighting.
            </p>
          </div>

          {/* GPR Index Score Card */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/40 min-w-[170px] shrink-0">
            <div className="text-xs text-amber-400/90 font-mono">Geopolitical Risk (GPR)</div>
            <div className="text-3xl font-bold font-mono text-amber-300 mt-1">
              {geopolitics.gprScore.toFixed(1)}
              <span className="text-xs text-amber-500/70 font-normal"> / 100</span>
            </div>
            <div className="text-[10px] text-amber-400/80 mt-1 font-mono uppercase">
              Trend: {geopolitics.trend}
            </div>
          </div>
        </div>
      </div>

      {/* Severity Breakdown Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
          <span className="text-slate-400 block mb-1">Systemic Risks</span>
          <span className="text-xl font-bold text-rose-400">{geopolitics.severityBreakdown.systemic}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Sovereign settlement shifts</span>
        </div>

        <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
          <span className="text-slate-400 block mb-1">High Severity</span>
          <span className="text-xl font-bold text-orange-400">{geopolitics.severityBreakdown.high}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Maritime / transit alerts</span>
        </div>

        <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
          <span className="text-slate-400 block mb-1">Moderate Impact</span>
          <span className="text-xl font-bold text-amber-300">{geopolitics.severityBreakdown.moderate}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Export controls & tariffs</span>
        </div>

        <div className="p-3 rounded-lg bg-[#121824] border border-slate-800">
          <span className="text-slate-400 block mb-1">Low Impact</span>
          <span className="text-xl font-bold text-slate-300">{geopolitics.severityBreakdown.low}</span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Localized political shifts</span>
        </div>
      </div>

      {/* Underlying Events Inspector */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Underlying Geopolitical Event Ledger ({filteredEvents.length})
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            {['ALL', 'SYSTEMIC', 'HIGH', 'MODERATE', 'LOW'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  filterSeverity === s
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredEvents.map((evt) => (
            <div 
              key={evt.id}
              className="p-4 rounded-lg bg-[#121824] border border-slate-800 hover:border-slate-700 transition-colors text-xs font-mono"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">{evt.date}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-bold">{evt.region}</span>
                  <span className="text-slate-600">•</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-amber-400">
                    {evt.category}
                  </span>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  evt.severity === 'SYSTEMIC'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : evt.severity === 'HIGH'
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {evt.severity} IMPACT
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
                {evt.headline}
              </div>

              <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 mb-2">
                <span className="text-amber-400 font-semibold">Gold Market Relevance: </span>
                {evt.marketRelevance}
              </div>

              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Source: {evt.source}</span>
                <span>Logged: {new Date(evt.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
