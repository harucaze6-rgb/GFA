import React from 'react';
import { DataStatusBadge } from './DataStatusBadge';
import { DataPoint } from '../../types/market';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface MetricCardProps {
  label: string;
  dataPoint: DataPoint<number | string>;
  prefix?: string;
  suffix?: string;
  formatDecimals?: number;
  highlight?: boolean;
  onWhyClick?: () => void;
  subValue?: string;
  showPercentile?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  dataPoint,
  prefix = '',
  suffix = '',
  formatDecimals = 2,
  highlight = false,
  onWhyClick,
  subValue,
  showPercentile = true
}) => {
  const val = typeof dataPoint.value === 'number' 
    ? dataPoint.value.toLocaleString(undefined, { 
        minimumFractionDigits: formatDecimals, 
        maximumFractionDigits: formatDecimals 
      }) 
    : dataPoint.value;

  const change1D = dataPoint.change1D ?? 0;
  const isPositive = change1D > 0;
  const isNegative = change1D < 0;

  return (
    <div className={`p-3.5 rounded-lg border transition-all ${
      highlight 
        ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/5' 
        : 'bg-[#121722] border-slate-800/80 hover:border-slate-700'
    }`}>
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider truncate">
          {label}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <DataStatusBadge 
            status={dataPoint.status} 
            source={dataPoint.source} 
            timestamp={dataPoint.timestamp}
            frequency={dataPoint.frequency}
          />
          {onWhyClick && (
            <button
              onClick={onWhyClick}
              className="text-[10px] text-amber-400/90 hover:text-amber-300 flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-400/10 hover:bg-amber-400/20 transition-colors"
              title="Explain quantitative calculation"
            >
              <Info className="w-2.5 h-2.5" />
              <span>WHY?</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-xl font-bold font-mono tracking-tight text-slate-100 truncate">
          {prefix}{val}{suffix}
        </div>
        
        {dataPoint.change1D !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs font-mono font-medium ${
            isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : isNegative ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{dataPoint.change1D.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {subValue && (
        <div className="text-[11px] text-slate-400 mt-1 font-mono">
          {subValue}
        </div>
      )}

      {showPercentile && dataPoint.percentile5Y !== undefined && (
        <div className="mt-2 pt-2 border-t border-slate-800/60">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-1">
            <span>5Y Range Percentile</span>
            <span className="text-slate-300 font-semibold">{dataPoint.percentile5Y}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${
                dataPoint.percentile5Y > 80 ? 'bg-amber-400' : dataPoint.percentile5Y > 50 ? 'bg-blue-400' : 'bg-slate-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, dataPoint.percentile5Y))}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-2 text-[10px] text-slate-500 truncate flex items-center justify-between">
        <span className="truncate" title={dataPoint.source}>Src: {dataPoint.source}</span>
        {dataPoint.frequency && <span className="shrink-0 text-slate-400">{dataPoint.frequency}</span>}
      </div>
    </div>
  );
};
