import React from 'react';
import { DataStatus } from '../../types/market';

interface DataStatusBadgeProps {
  status: DataStatus;
  source?: string;
  timestamp?: string;
  frequency?: string;
  size?: 'xs' | 'sm' | 'md';
}

export const DataStatusBadge: React.FC<DataStatusBadgeProps> = ({
  status,
  source,
  timestamp,
  frequency,
  size = 'xs'
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'LIVE':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400 animate-pulse'
        };
      case 'DELAYED':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400'
        };
      case 'HISTORICAL':
        return {
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
          dot: 'bg-blue-400'
        };
      case 'ESTIMATED':
        return {
          bg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
          dot: 'bg-purple-400'
        };
      case 'MANUAL':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400'
        };
      case 'UNAVAILABLE':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          dot: 'bg-rose-400'
        };
      case 'SIMULATED':
      default:
        return {
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
          dot: 'bg-orange-400'
        };
    }
  };

  const { bg, dot } = getBadgeStyle();
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <div 
      className={`inline-flex items-center gap-1.5 rounded border font-mono font-medium tracking-wider uppercase ${bg} ${sizeClass}`}
      title={source ? `Source: ${source}${frequency ? ` | Freq: ${frequency}` : ''}${timestamp ? ` | Time: ${new Date(timestamp).toLocaleTimeString()}` : ''}` : undefined}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      <span>{status}</span>
    </div>
  );
};
