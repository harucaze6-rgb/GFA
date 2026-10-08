import React, { useState } from 'react';
import { GoldUnit, Currency, GoldPriceData } from '../../types/market';
import { calculateIndianGoldTransmission } from '../../services/factorEngine';
import { 
  Calculator, 
  Flag, 
  ArrowRight, 
  Percent, 
  DollarSign, 
  Coins, 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { DataStatusBadge } from '../common/DataStatusBadge';

interface IndiaTransmissionViewProps {
  priceData: GoldPriceData;
  selectedUnit: GoldUnit;
  onUnitChange: (unit: GoldUnit) => void;
  selectedCurrency: Currency;
  customsDutyPct: number;
  onCustomsDutyChange: (pct: number) => void;
  aidcPct: number;
  onAidcChange: (pct: number) => void;
  gstPct: number;
  onGstChange: (pct: number) => void;
  localPremiumInr: number;
  onLocalPremiumChange: (val: number) => void;
}

export const IndiaTransmissionView: React.FC<IndiaTransmissionViewProps> = ({
  priceData,
  selectedUnit,
  onUnitChange,
  selectedCurrency,
  customsDutyPct,
  onCustomsDutyChange,
  aidcPct,
  onAidcChange,
  gstPct,
  onGstChange,
  localPremiumInr,
  onLocalPremiumChange
}) => {
  const [simXauUsd, setSimXauUsd] = useState<number>(priceData.xauUsd.value);
  const [simUsdInr, setSimUsdInr] = useState<number>(priceData.usdInr.value);

  // Compute live transmission
  const transmission = calculateIndianGoldTransmission(
    simXauUsd,
    simUsdInr,
    customsDutyPct,
    aidcPct,
    gstPct,
    localPremiumInr,
    selectedUnit
  );

  const resetToMarket = () => {
    setSimXauUsd(priceData.xauUsd.value);
    setSimUsdInr(priceData.usdInr.value);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                LAYER 2 & 3 • CURRENCY & DOMESTIC TRANSMISSION
              </span>
              <DataStatusBadge status="LIVE" />
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-400" />
              <span>USD/INR & Indian Domestic Gold Transmission Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Models the exact mechanical chain from global spot bullion (XAU/USD) through Rupee currency transmission, customs duty tariffs, AIDC cess, GST (3%), and domestic dealer premiums.
            </p>
          </div>

          <button
            onClick={resetToMarket}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 shrink-0"
          >
            Reset to Market Spot
          </button>
        </div>
      </div>

      {/* Visual Transmission Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
        {/* Stage 1: Global Spot */}
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 relative">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>STAGE 1: GLOBAL</span>
            <span className="text-slate-500">1 Troy Oz</span>
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">
            ${simXauUsd.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            XAU/USD London Fix / NY
          </div>
          <div className="mt-3 text-[10px] text-slate-500">
            Base International Benchmark
          </div>
        </div>

        {/* Stage 2: USD/INR Transmission */}
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 relative">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>STAGE 2: CURRENCY</span>
            <span className="text-amber-400">× USD/INR</span>
          </div>
          <div className="text-xl font-bold text-amber-300 font-mono">
            ₹{(transmission.landedCostInrPerGramBase * 10).toFixed(0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Raw INR/10g (Pre-Tax)
          </div>
          <div className="mt-3 text-[10px] text-slate-500">
            FX Rate: ₹{simUsdInr.toFixed(2)} / USD
          </div>
        </div>

        {/* Stage 3: Duties & Cess */}
        <div className="p-4 rounded-xl bg-[#121824] border border-slate-800 relative">
          <div className="text-slate-400 mb-1 flex items-center justify-between">
            <span>STAGE 3: TARIFFS</span>
            <span className="text-orange-400">+{customsDutyPct + aidcPct}%</span>
          </div>
          <div className="text-xl font-bold text-orange-300 font-mono">
            +₹{transmission.dutyAmountInrPer10g.toFixed(0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Duty ({customsDutyPct}%) + AIDC ({aidcPct}%)
          </div>
          <div className="mt-3 text-[10px] text-slate-500">
            Govt. Landed Revenue
          </div>
        </div>

        {/* Stage 4: Domestic Landed Price */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 relative shadow-lg">
          <div className="text-amber-300/80 mb-1 flex items-center justify-between">
            <span>FINAL LANDED</span>
            <span className="text-emerald-400 font-bold">+GST {gstPct}%</span>
          </div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            ₹{transmission.finalInrPerUnit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-slate-300 mt-1">
            Final Domestic (per {selectedUnit})
          </div>
          <div className="mt-3 text-[10px] text-amber-400/80">
            IBJA / Retail 24K Benchmark
          </div>
        </div>
      </div>

      {/* Interactive Transmission Calculator Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Param Sliders (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#0e131d] p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                Transmission Parameter Simulation
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Real-time Recalculation</span>
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Slider 1: XAU/USD */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>International Spot (XAU/USD):</span>
                <span className="font-bold text-amber-400">${simXauUsd.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="2000"
                max="3200"
                step="5"
                value={simXauUsd}
                onChange={(e) => setSimXauUsd(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>$2,000</span>
                <span>Market: ${priceData.xauUsd.value.toFixed(2)}</span>
                <span>$3,200</span>
              </div>
            </div>

            {/* Slider 2: USD/INR */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>USD/INR Exchange Rate:</span>
                <span className="font-bold text-amber-400">₹{simUsdInr.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="78"
                max="95"
                step="0.05"
                value={simUsdInr}
                onChange={(e) => setSimUsdInr(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>₹78.00</span>
                <span>Market: ₹{priceData.usdInr.value.toFixed(2)}</span>
                <span>₹95.00</span>
              </div>
            </div>

            {/* Grid of Taxes & Premiums */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              {/* Basic Customs Duty */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Basic Customs Duty:</span>
                  <span className="font-bold text-slate-100">{customsDutyPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  value={customsDutyPct}
                  onChange={(e) => onCustomsDutyChange(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Post-Budget Baseline: 6.0%</span>
              </div>

              {/* AIDC Cess */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>AIDC Cess:</span>
                  <span className="font-bold text-slate-100">{aidcPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.25"
                  value={aidcPct}
                  onChange={(e) => onAidcChange(Number(e.target.value))}
                  className="w-full accent-blue-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Agri Infra Dev Cess: 5.35%</span>
              </div>

              {/* GST */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>GST Rate:</span>
                  <span className="font-bold text-slate-100">{gstPct}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={gstPct}
                  onChange={(e) => onGstChange(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Statutory 3.0% applied on landed</span>
              </div>

              {/* Local Premium / Discount */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Local Premium/Discount:</span>
                  <span className="font-bold text-amber-300">
                    {localPremiumInr >= 0 ? `+₹${localPremiumInr}` : `-₹${Math.abs(localPremiumInr)}`}/10g
                  </span>
                </div>
                <input
                  type="range"
                  min="-1000"
                  max="1500"
                  step="50"
                  value={localPremiumInr}
                  onChange={(e) => onLocalPremiumChange(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500">Physical festive dealer premium</span>
              </div>
            </div>

            {/* Target Unit Selector */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-300 font-medium">Display Gold Unit:</span>
              <div className="flex items-center gap-1">
                {(['10g', '1g', '1kg', 'tola', 'oz'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => onUnitChange(unit)}
                    className={`px-2.5 py-1 rounded uppercase font-semibold transition-colors ${
                      selectedUnit === unit 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Exact Attribution Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0e131d] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide">
                  Transmission Attribution
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Driver: <b className="text-amber-400">{transmission.attribution.dominantDriver}</b>
              </span>
            </div>

            {/* Mathematical Cost Stack Table */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">1. Global Gold Equivalent (INR Base):</span>
                <span className="text-slate-200 font-bold">
                  ₹{(transmission.landedCostInrPerGramBase * 10).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">2. Customs Duty ({customsDutyPct}%):</span>
                <span className="text-slate-200">
                  +₹{((transmission.landedCostInrPerGramBase * 10 * customsDutyPct) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">3. AIDC Cess ({aidcPct}%):</span>
                <span className="text-slate-200">
                  +₹{((transmission.landedCostInrPerGramBase * 10 * aidcPct) / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">4. Local Premium / Discount:</span>
                <span className={localPremiumInr >= 0 ? 'text-amber-400' : 'text-rose-400'}>
                  {localPremiumInr >= 0 ? `+₹${localPremiumInr}` : `-₹${Math.abs(localPremiumInr)}`}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">5. GST ({gstPct}%):</span>
                <span className="text-slate-200">
                  +₹{transmission.gstAmountInrPer10g.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>

              <div className="flex justify-between py-2.5 bg-[#141b2b] px-3 rounded-lg border border-amber-500/30 text-amber-300 font-bold text-sm">
                <span>Calculated Landed (per 10g 24K):</span>
                <span>₹{transmission.finalInrPer10g.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            </div>

            {/* Unit conversion readout if unit != 10g */}
            {selectedUnit !== '10g' && (
              <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-400">Converted to {selectedUnit}:</span>
                <span className="text-base font-bold text-slate-100">
                  ₹{transmission.finalInrPerUnit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          {/* Qualitative Attribution Insight */}
          <div className="mt-5 p-3 rounded-lg bg-[#121824] border border-slate-800 text-xs font-mono">
            <span className="text-amber-400 font-semibold block mb-1">
              Quantitative Driver Summary:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {transmission.attribution.dominantDriver === 'RUPEE_DEPRECIATION'
                ? `Domestic gold returns are strongly boosted by USD/INR depreciation (+${transmission.attribution.currencyEffectPct.toFixed(1)}%), providing independent purchasing power protection even if international spot gold pauses.`
                : transmission.attribution.dominantDriver === 'GLOBAL_GOLD'
                ? `International dollar spot momentum (+${transmission.attribution.globalGoldEffectPct.toFixed(1)}%) is the overwhelming driver of Indian gold appreciation, surpassing currency effects.`
                : 'Balanced transmission: International bullion gains and exchange rate friction are moving in tandem.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
