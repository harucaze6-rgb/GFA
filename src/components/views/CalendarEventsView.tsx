import React from 'react';
import { EconomicCalendarEvent } from '../../types/market';
import { Calendar, Clock, Globe2, AlertCircle } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface CalendarEventsViewProps {
  events: EconomicCalendarEvent[];
}

export const CalendarEventsView: React.FC<CalendarEventsViewProps> = ({ events }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
            MACRO CATALYST MONITOR • REACTION PROFILES
          </span>
          <DataStatusBadge status="HISTORICAL" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>Economic Calendar & Multi-Asset Reaction Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
          Key central bank announcements, inflation prints (CPI/PCE), labor releases, and RBI policy decisions with historical transmission reactions across Gold, DXY, and real yields.
        </p>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-semibold">Date & Time</th>
                <th className="pb-2.5 font-semibold">Jurisdiction</th>
                <th className="pb-2.5 font-semibold">Economic Event</th>
                <th className="pb-2.5 font-semibold">Previous</th>
                <th className="pb-2.5 font-semibold">Consensus</th>
                <th className="pb-2.5 font-semibold">Actual</th>
                <th className="pb-2.5 font-semibold">Historical Gold Reaction</th>
                <th className="pb-2.5 font-semibold">DXY Reaction</th>
                <th className="pb-2.5 font-semibold">Yield Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 text-slate-300">
                    <div className="font-bold text-slate-200">{evt.date}</div>
                    <div className="text-[10px] text-slate-500">{evt.time}</div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      evt.country === 'USA' ? 'bg-blue-500/20 text-blue-300' : 'bg-orange-500/20 text-orange-300'
                    }`}>
                      {evt.country}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="font-bold text-slate-100">{evt.event}</div>
                    <span className={`text-[9px] uppercase font-bold ${
                      evt.importance === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {evt.importance} Impact
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{evt.previous}</td>
                  <td className="py-3 text-amber-300 font-bold">{evt.consensus}</td>
                  <td className="py-3 text-slate-300 font-bold">{evt.actual}</td>
                  <td className="py-3 text-slate-300 max-w-xs">{evt.goldHistoricalReaction}</td>
                  <td className="py-3 text-slate-400">{evt.dxyHistoricalReaction}</td>
                  <td className="py-3 text-slate-400">{evt.yieldReaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
