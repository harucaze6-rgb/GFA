import React from 'react';
import { CorrelationHeatmap } from '../charts/CorrelationHeatmap';
import { ASSET_CORRELATION_MATRIX, LEAD_LAG_DATA } from '../../services/regimeEngine';
import { ArrowRightLeft, Layers, AlertCircle, Info, Activity, Clock } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

export const CorrelationsLeadLagView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                QUANTITATIVE RISK & DYNAMICS • CORRELATION & LEAD-LAG
              </span>
              <DataStatusBadge status="LIVE" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-400" />
              <span>Multi-Asset Correlations & Lead-Lag Transmission</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Evaluates rolling cross-asset statistical co-movement across 20D, 60D, 120D, and 1-year windows. Examines empirical lead-lag offsets to identify leading macro signals.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 max-w-xs shrink-0">
            <span className="text-amber-400 font-bold block mb-0.5">Methodological Axiom:</span>
            Correlation is not causation. Correlations represent temporary market regimes, not immutable natural laws.
          </div>
        </div>
      </div>

      {/* Dynamic Correlation Matrix */}
      <CorrelationHeatmap correlations={ASSET_CORRELATION_MATRIX} />

      {/* Lead-Lag Empirical Regression Table (Section 15) */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Empirical Lead-Lag Analysis Matrix vs Gold Price
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Testing cross-correlation coefficients across -1D, -3D, -5D, -10D, and -20D lag horizons.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Sample: <b className="text-slate-200">1,250 Trading Days</b> (5-Year Rolling)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">Macro Asset / Factor</th>
                <th className="pb-2 font-semibold">1-Day Lag</th>
                <th className="pb-2 font-semibold">3-Day Lag</th>
                <th className="pb-2 font-semibold">5-Day Lag</th>
                <th className="pb-2 font-semibold">10-Day Lag</th>
                <th className="pb-2 font-semibold">20-Day Lag</th>
                <th className="pb-2 font-semibold">Optimal Horizon</th>
                <th className="pb-2 font-semibold">Empirical Direction</th>
                <th className="pb-2 font-semibold">Statistical Sig.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {LEAD_LAG_DATA.map((row) => (
                <tr key={row.factor} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-2.5 font-bold text-slate-200">
                    {row.factor}
                  </td>
                  <td className={`py-2.5 ${row.lag1D < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.lag1D > 0 ? `+${row.lag1D.toFixed(2)}` : row.lag1D.toFixed(2)}
                  </td>
                  <td className={`py-2.5 ${row.lag3D < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.lag3D > 0 ? `+${row.lag3D.toFixed(2)}` : row.lag3D.toFixed(2)}
                  </td>
                  <td className={`py-2.5 ${row.lag5D < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.lag5D > 0 ? `+${row.lag5D.toFixed(2)}` : row.lag5D.toFixed(2)}
                  </td>
                  <td className={`py-2.5 ${row.lag10D < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.lag10D > 0 ? `+${row.lag10D.toFixed(2)}` : row.lag10D.toFixed(2)}
                  </td>
                  <td className={`py-2.5 ${row.lag20D < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {row.lag20D > 0 ? `+${row.lag20D.toFixed(2)}` : row.lag20D.toFixed(2)}
                  </td>
                  <td className="py-2.5 text-amber-300 font-bold">
                    {row.optimalLag}
                  </td>
                  <td className="py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                      row.direction === 'LEADS_GOLD' 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : row.direction === 'LAGS_GOLD' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {row.direction.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5">
                    <span className={`font-semibold ${
                      row.significance === 'HIGH' ? 'text-emerald-400' : row.significance === 'MODERATE' ? 'text-amber-400' : 'text-slate-500'
                    }`}>
                      {row.significance}
                    </span>
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
