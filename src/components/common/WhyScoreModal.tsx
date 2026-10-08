import React from 'react';
import { FactorScoreItem } from '../../types/market';
import { X, CheckCircle2, AlertTriangle, HelpCircle, Activity, Layers, Scale } from 'lucide-react';
import { DataStatusBadge } from './DataStatusBadge';

interface WhyScoreModalProps {
  factor: FactorScoreItem | null;
  onClose: () => void;
}

export const WhyScoreModal: React.FC<WhyScoreModalProps> = ({ factor, onClose }) => {
  if (!factor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#0f141f] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden text-slate-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#141b29]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-slate-100">{factor.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  {factor.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">Factor Transparency & Attribution Inspector</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Normalized Score</div>
              <div className={`text-2xl font-bold font-mono mt-1 ${
                factor.score > 0 ? 'text-emerald-400' : factor.score < 0 ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {factor.score > 0 ? `+${factor.score}` : factor.score}
                <span className="text-xs text-slate-500 font-normal"> / 100</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                {factor.direction}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Raw Input Value</div>
              <div className="text-2xl font-bold font-mono mt-1 text-slate-100 truncate">
                {typeof factor.rawValue === 'number' ? factor.rawValue.toFixed(2) : factor.rawValue}
                <span className="text-xs text-slate-400 font-normal ml-1">{factor.unit}</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                1D: {factor.change1D > 0 ? `+${factor.change1D}%` : `${factor.change1D}%`}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Weight Allocation</div>
              <div className="text-2xl font-bold font-mono mt-1 text-amber-400">
                {factor.weight}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                Contrib: {factor.weightedScore > 0 ? `+${factor.weightedScore.toFixed(1)}` : factor.weightedScore.toFixed(1)} pts
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-800">
              <div className="text-[11px] text-slate-400 font-mono">Confidence & Quality</div>
              <div className="text-2xl font-bold font-mono mt-1 text-blue-400">
                {factor.confidence}%
              </div>
              <div className="mt-1">
                <DataStatusBadge status={factor.dataQuality} />
              </div>
            </div>
          </div>

          {/* Qualitative Economic Explanation */}
          <div className="p-4 rounded-lg bg-[#141b2b]/60 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Economic Rationale & Factor Transmission Mechanics</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {factor.explanation}
            </p>
          </div>

          {/* Mathematical Formula Breakdown */}
          <div className="p-4 rounded-lg bg-[#0b0e14] border border-slate-800 font-mono">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Quantitative Normalization Formula</span>
            </div>
            <div className="p-3 rounded bg-[#121824] text-xs text-amber-300/90 overflow-x-auto whitespace-pre-wrap border border-slate-800">
              {factor.formula}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <div>
                <span className="text-slate-500">Historical Percentile (5Y):</span>{' '}
                <span className="font-semibold text-slate-200">{factor.historicalPercentile}%</span>
              </div>
              <div>
                <span className="text-slate-500">Last Calculation Sync:</span>{' '}
                <span className="text-slate-300">{new Date(factor.lastUpdated).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          {/* Data Lineage & Source Provenance */}
          <div className="p-3 rounded-lg bg-[#141b2b]/40 border border-slate-800 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Official Benchmark Source:</span>
              <span className="text-slate-200 font-semibold">{factor.source}</span>
            </div>
            <div className="text-slate-500 text-[11px]">
              Strict Multi-Factor Engine Model
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-[#141b29] text-xs text-slate-400">
          <span>Formula Version: v2.4.1-Institutional</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-medium font-mono"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
