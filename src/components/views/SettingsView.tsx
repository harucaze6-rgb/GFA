import React from 'react';
import { UserSettings, Currency, GoldUnit } from '../../types/market';
import { Settings as SettingsIcon, Sliders, RotateCcw, Save, ShieldCheck } from 'lucide-react';

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings
}) => {
  const handleWeightChange = (key: keyof UserSettings['weights'], val: number) => {
    onUpdateSettings({
      ...settings,
      weights: {
        ...settings.weights,
        [key]: val
      }
    });
  };

  const resetWeights = () => {
    onUpdateSettings({
      ...settings,
      weights: {
        realYields: 20,
        usd: 15,
        inflation: 10,
        growthLabor: 10,
        centralBanks: 10,
        physicalMarket: 5,
        etfPositioning: 10,
        geopoliticalRisk: 10,
        indiaDomestic: 10
      }
    });
  };

  const totalWeights = Object.values(settings.weights).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-amber-400 font-semibold uppercase tracking-wider">
                TERMINAL CONFIGURATION • FACTOR WEIGHTING
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold font-mono text-slate-100 flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
              <span>Terminal Preferences & Quantitative Weights</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl font-mono">
              Adjust factor allocation weights, statutory Indian import duty parameters, base denomination currencies, and auto-sync intervals.
            </p>
          </div>

          <button
            onClick={resetWeights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 border border-slate-700 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default Weights</span>
          </button>
        </div>
      </div>

      {/* Factor Weighting Engine (Section 13) */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide font-mono">
              Section 13 Factor Model Allocation Weights
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Configurable weights summing to 100%. Directly recalculates the Composite Macro Score in real time.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Total Weight Allocated:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${
              totalWeights === 100 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
            }`}>
              {totalWeights}% / 100%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs font-mono">
          {Object.entries(settings.weights).map(([key, val]) => (
            <div key={key} className="p-3.5 rounded-lg bg-[#121824] border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-bold capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </span>
                <span className="text-amber-400 font-bold text-sm">{val}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="5"
                value={val}
                onChange={(e) => handleWeightChange(key as keyof UserSettings['weights'], Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Disabled)</span>
                <span>40% (Dominant)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional & Denomination Preferences */}
      <div className="rounded-xl border border-slate-800 bg-[#0e131d] p-5">
        <h3 className="font-semibold text-sm text-slate-100 uppercase tracking-wide mb-4 pb-2 border-b border-slate-800 font-mono">
          Regional & Benchmark Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs font-mono">
          {/* Base Currency */}
          <div>
            <span className="text-slate-400 block mb-1.5">Primary Denomination Currency:</span>
            <div className="flex gap-2">
              {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => onUpdateSettings({ ...settings, currency: curr })}
                  className={`flex-1 py-1.5 rounded-lg border transition-colors ${
                    settings.currency === curr
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Gold Unit */}
          <div>
            <span className="text-slate-400 block mb-1.5">Default Gold Unit:</span>
            <div className="flex gap-2">
              {(['10g', '1g', '1kg', 'tola', 'oz'] as GoldUnit[]).map((unit) => (
                <button
                  key={unit}
                  onClick={() => onUpdateSettings({ ...settings, goldUnit: unit })}
                  className={`flex-1 py-1.5 rounded-lg border transition-colors uppercase ${
                    settings.goldUnit === unit
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone */}
          <div>
            <span className="text-slate-400 block mb-1.5">Terminal Timezone:</span>
            <select
              value={settings.timezone}
              onChange={(e) => onUpdateSettings({ ...settings, timezone: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="UTC">UTC (Universal Time)</option>
              <option value="America/New_York">America/New_York (EST/EDT)</option>
              <option value="Europe/London">Europe/London (GMT/BST)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
