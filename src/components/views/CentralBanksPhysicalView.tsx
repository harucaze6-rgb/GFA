import React from 'react';
import { CentralBankDemand, PhysicalMarketBalance } from '../../types/market';
import { MetricCard } from '../common/MetricCard';
import { Landmark, Compass, TrendingUp, ShieldCheck, Scale, ArrowUpRight } from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface CentralBanksPhysicalViewProps {
  centralBanks: CentralBankDemand;
  physical: PhysicalMarketBalance;
}

export const CentralBanksPhysicalView: React.FC<CentralBanksPhysicalViewProps> = ({
  centralBanks,
  physical
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                STRUCTURAL PILLARS • SOVEREIGN RESERVES & PHYSICAL BALANCE
              </span>
              <DataStatusBadge status="HISTORICAL" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-400" />
              <span>Central Bank Accumulation & Physical Balance</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Monitors official sovereign gold reserves from the World Gold Council and IMF alongside global physical mine production, recycling, jewellery, and institutional investment deficits.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Structural Demand: {centralBanks.structuralDemandContribution}</span>
          </div>
        </div>
      </div>

      {/* Central Bank Demand Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Quarterly CB Purchases"
          dataPoint={centralBanks.quarterlyPurchasesTonnes}
          formatDecimals={1}
          suffix=" t"
          highlight
          subValue="World Gold Council Benchmark"
        />

        <MetricCard
          label="Annual Net Sovereign Demand"
          dataPoint={centralBanks.annualNetDemandTonnes}
          formatDecimals={0}
          suffix=" t"
          highlight
          subValue="Record >1,000 Tonnes Run-Rate"
        />

        <MetricCard
          label="Global Official Reserves"
          dataPoint={{
            value: centralBanks.officialReservesGlobalTonnes,
            timestamp: new Date().toISOString(),
            source: 'IMF Financial Statistics (IFS)',
            frequency: 'Quarterly',
            status: 'HISTORICAL'
          }}
          formatDecimals={0}
          suffix=" t"
          subValue="All Central Banks Combined"
        />

        <MetricCard
          label="Historical Demand Percentile"
          dataPoint={{
            value: centralBanks.historicalPercentile,
            timestamp: new Date().toISOString(),
            source: '50-Year Sovereign Flow Distribution',
            frequency: 'Annual',
            status: 'HISTORICAL'
          }}
          suffix="%"
          formatDecimals={0}
          subValue="Highest Since 1968"
        />
      </div>

      {/* Top Sovereign Buyers Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Major Sovereign Central Bank Buyers (Past 12 Months)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Source: World Gold Council</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {centralBanks.topBuyers.map((b) => (
            <div key={b.country} className="p-3 rounded-lg bg-[#121824] border border-slate-800">
              <div className="text-xs font-semibold text-slate-200 truncate">{b.country}</div>
              <div className="text-lg font-bold font-mono text-amber-300 mt-1">
                +{b.purchasesTonnes.toFixed(1)} t
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                Share: {b.sharePct}% of net buying
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Supply vs Demand Balance Sheet */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
              Global Physical Balance Sheet (Supply vs Demand)
            </h3>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold border border-rose-500/30">
            Market State: {physical.trend} (-{physical.netBalanceTonnes.value} tonnes)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          {/* Supply Column */}
          <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 text-sm block border-b border-slate-800 pb-2">
              Total Supply: {physical.totalSupplyTonnes.value} tonnes
            </span>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Mine Production:</span>
              <span className="text-slate-200 font-bold">{physical.mineProductionTonnes.value} t</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Recycled Gold Scrap:</span>
              <span className="text-slate-200 font-bold">{physical.recyclingTonnes.value} t</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 text-slate-400 text-[11px]">
              Mine supply growth remains structurally constrained by declining ore grades and protracted 15-year discovery-to-production cycles.
            </div>
          </div>

          {/* Demand Column */}
          <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 text-sm block border-b border-slate-800 pb-2">
              Total Demand: {physical.totalDemandTonnes.value} tonnes
            </span>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Jewellery Fabrication:</span>
              <span className="text-slate-200 font-bold">{physical.jewelleryDemandTonnes.value} t</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bars & Coins (Retail Investment):</span>
              <span className="text-slate-200 font-bold">{physical.barsAndCoinsTonnes.value} t</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Industrial & Technology:</span>
              <span className="text-slate-200 font-bold">{physical.technologyDemandTonnes.value} t</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Net Physical Deficit:</span>
              <span className="text-rose-400 font-bold">-{physical.netBalanceTonnes.value} t</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
