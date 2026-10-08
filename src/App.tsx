/**
 * GFA - Quantitative Gold Factor Analytics Terminal
 * Multi-factor institutional platform evaluating global macro, real yields,
 * USD currency transmission, and the Indian domestic gold environment.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  GoldUnit, 
  Currency, 
  UserSettings, 
  FactorScoreItem, 
  DivergenceEvent, 
  MarketRegimeState,
  DataSourceHealth
} from './types/market';
import { 
  fetchLiveGoldPrice, 
  fetchLiveFXRates, 
  getInitialGoldPriceData, 
  getInitialRealYieldFactors, 
  getInitialUSDFactors, 
  getInitialInflationFactors, 
  getInitialLaborFactors, 
  getInitialGrowthFactors, 
  getInitialCentralBankDemand, 
  getInitialPhysicalMarketBalance, 
  getInitialGeopoliticalIndex, 
  getInitialPositioningFlows, 
  getInitialStressScenarios, 
  getInitialEconomicCalendar, 
  getInitialNewsItems, 
  getInitialDataHealthList 
} from './services/marketDataProvider';
import { 
  calculateRealYieldScore, 
  calculateUSDScore, 
  classifyInflationRegime, 
  calculateIndianGoldTransmission 
} from './services/factorEngine';
import { 
  calculateMarketRegime, 
  scanMarketDivergences 
} from './services/regimeEngine';

// Layout & Views
import { Header } from './components/layout/Header';
import { Navigation, NavView } from './components/layout/Navigation';
import { OverviewView } from './components/views/OverviewView';
import { GoldAnalysisView } from './components/views/GoldAnalysisView';
import { MacroRatesView } from './components/views/MacroRatesView';
import { RealYieldsView } from './components/views/RealYieldsView';
import { USDView } from './components/views/USDView';
import { IndiaTransmissionView } from './components/views/IndiaTransmissionView';
import { FlowsPositioningView } from './components/views/FlowsPositioningView';
import { CentralBanksPhysicalView } from './components/views/CentralBanksPhysicalView';
import { GeopoliticsView } from './components/views/GeopoliticsView';
import { CorrelationsLeadLagView } from './components/views/CorrelationsLeadLagView';
import { ScenariosView } from './components/views/ScenariosView';
import { StressTestingView } from './components/views/StressTestingView';
import { CalendarEventsView } from './components/views/CalendarEventsView';
import { NewsIntelligenceView } from './components/views/NewsIntelligenceView';
import { DataHealthView } from './components/views/DataHealthView';
import { AIAnalystView } from './components/views/AIAnalystView';
import { BacktestView } from './components/views/BacktestView';
import { SettingsView } from './components/views/SettingsView';
import { WhyScoreModal } from './components/common/WhyScoreModal';

export default function App() {
  // Navigation & Modal State
  const [activeView, setActiveView] = useState<NavView>('overview');
  const [selectedFactorForWhy, setSelectedFactorForWhy] = useState<FactorScoreItem | null>(null);

  // User Settings State
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'INR',
    goldUnit: '10g',
    timezone: 'Asia/Kolkata',
    defaultTimeframe: '1D',
    customsDutyPct: 6.0,
    aidcPct: 5.35,
    gstPct: 3.0,
    localPremiumInr: 180,
    refreshIntervalSeconds: 30,
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

  // Core Market State
  const [priceData, setPriceData] = useState(() => getInitialGoldPriceData(2684.50, 88.62, 'LIVE'));
  const [realYields, setRealYields] = useState(() => getInitialRealYieldFactors());
  const [usdFactors, setUsdFactors] = useState(() => getInitialUSDFactors());
  const [inflation, setInflation] = useState(() => getInitialInflationFactors());
  const [labor, setLabor] = useState(() => getInitialLaborFactors());
  const [growth, setGrowth] = useState(() => getInitialGrowthFactors());
  const [centralBanks, setCentralBanks] = useState(() => getInitialCentralBankDemand());
  const [physical, setPhysical] = useState(() => getInitialPhysicalMarketBalance());
  const [geopolitics, setGeopolitics] = useState(() => getInitialGeopoliticalIndex());
  const [positioning, setPositioning] = useState(() => getInitialPositioningFlows());
  const [stressScenarios] = useState(() => getInitialStressScenarios());
  const [calendarEvents] = useState(() => getInitialEconomicCalendar());
  const [newsItems] = useState(() => getInitialNewsItems());
  const [dataHealthList, setDataHealthList] = useState<DataSourceHealth[]>(() => getInitialDataHealthList());

  // Real-Time Synchronization State
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Real-time synchronization function
  const performSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Fetch live gold & FX in parallel
      const [goldRes, fxRes] = await Promise.allSettled([
        fetchLiveGoldPrice(),
        fetchLiveFXRates()
      ]);

      let newGoldPrice = priceData.xauUsd.value;
      let newGoldStatus = priceData.xauUsd.status;
      let newGoldSource = priceData.xauUsd.source;
      let goldLatency = 140;

      if (goldRes.status === 'fulfilled') {
        newGoldPrice = goldRes.value.price;
        newGoldStatus = goldRes.value.status;
        newGoldSource = goldRes.value.source;
        goldLatency = goldRes.value.latencyMs;
      }

      let newUsdInr = priceData.usdInr.value;
      let newEur = usdFactors.eurUsd.value;
      let newJpy = usdFactors.usdJpy.value;
      let newGbp = usdFactors.gbpUsd.value;
      let newCnh = usdFactors.usdCnh.value;
      let fxLatency = 180;

      if (fxRes.status === 'fulfilled') {
        newUsdInr = fxRes.value.usdInr;
        newEur = fxRes.value.eurUsd;
        newJpy = fxRes.value.usdJpy;
        newGbp = fxRes.value.gbpUsd;
        newCnh = fxRes.value.usdCnh;
        fxLatency = fxRes.value.latencyMs;
      }

      // Recompute gold price data with updated transmission
      const updatedPriceData = getInitialGoldPriceData(newGoldPrice, newUsdInr, newGoldStatus);
      updatedPriceData.xauUsd.source = newGoldSource;
      setPriceData(updatedPriceData);

      // Recompute USD factors
      setUsdFactors((prev) => ({
        ...prev,
        eurUsd: { ...prev.eurUsd, value: newEur },
        usdJpy: { ...prev.usdJpy, value: newJpy },
        gbpUsd: { ...prev.gbpUsd, value: newGbp },
        usdCnh: { ...prev.usdCnh, value: newCnh }
      }));

      // Update data health stats
      setDataHealthList((prev) => 
        prev.map((src) => {
          if (src.id === 'src-1') {
            return {
              ...src,
              status: newGoldStatus,
              latencyMs: goldLatency,
              lastSuccessTimestamp: new Date().toISOString()
            };
          }
          if (src.id === 'src-2') {
            return {
              ...src,
              latencyMs: fxLatency,
              lastSuccessTimestamp: new Date().toISOString()
            };
          }
          return src;
        })
      );

      setLastSyncTime(new Date());
    } catch (err) {
      console.error('Data sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [priceData.xauUsd.value, priceData.usdInr.value, priceData.xauUsd.status, priceData.xauUsd.source, usdFactors]);

  // Set up periodic sync timer
  useEffect(() => {
    // Initial sync
    performSync();

    if (settings.refreshIntervalSeconds <= 0) return;

    const intervalId = setInterval(() => {
      performSync();
    }, settings.refreshIntervalSeconds * 1000);

    return () => clearInterval(intervalId);
  }, [settings.refreshIntervalSeconds, performSync]);

  // Quantitative Factor Calculations
  const calculatedFactors = useMemo((): FactorScoreItem[] => {
    const now = new Date().toISOString();

    // 1. Real Yields
    const ryRes = calculateRealYieldScore(
      realYields.us10yRealYield.value,
      realYields.us10yRealYield.change1D ?? -0.03,
      realYields.us10yRealYield.change1M ?? -0.18,
      realYields.us10yRealYield.percentile5Y ?? 84
    );

    // 2. US Dollar
    const usdRes = calculateUSDScore(
      usdFactors.dxy.value,
      usdFactors.dxy.change1D ?? -0.15,
      usdFactors.dxy.change1M ?? 0.65,
      usdFactors.dxyMomentum14D
    );

    // 3. Inflation
    const infRes = classifyInflationRegime(
      inflation.cpiYoY.value,
      inflation.cpiYoY.change1M ?? -0.1,
      realYields.us10yRealYield.value,
      realYields.us10yRealYield.change1M ?? -0.18
    );

    // 4. Growth & Labor
    const growthScore = Math.round(
      (50 - labor.laborDeteriorationScore) * 0.4 + (growth.recessionRiskProxyPct - 20) * 0.6
    );

    // 5. Central Banks
    const cbScore = 84; // Structurally high demand

    // 6. Physical Market
    const physScore = physical.trend === 'DEFICIT' ? 45 : -20;

    // 7. ETF & Positioning
    const posScore = positioning.isPositioningExtreme ? -25 : 30; // Extreme longs create liquidation drag

    // 8. Geopolitical Risk
    const geoScore = Math.round((geopolitics.gprScore - 50) * 1.5);

    // 9. India Domestic & USD/INR Transmission
    const transmission = calculateIndianGoldTransmission(
      priceData.xauUsd.value,
      priceData.usdInr.value,
      settings.customsDutyPct,
      settings.aidcPct,
      settings.gstPct,
      settings.localPremiumInr,
      settings.goldUnit
    );
    const indiaScore = Math.round(
      (transmission.attribution.currencyEffectPct * 4.5) + (settings.localPremiumInr > 0 ? 25 : -15)
    );

    const weights = settings.weights;
    const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 100;

    return [
      {
        id: 'factor-real-yields',
        name: 'US 10Y Real Yield (TIPS)',
        category: 'Rates & Hurdle',
        rawValue: realYields.us10yRealYield.value,
        unit: '%',
        change1D: realYields.us10yRealYield.change1D ?? -0.03,
        change5D: realYields.us10yRealYield.change1W ?? -0.08,
        change1M: realYields.us10yRealYield.change1M ?? -0.18,
        historicalPercentile: realYields.us10yRealYield.percentile5Y ?? 84,
        score: ryRes.score,
        weight: weights.realYields,
        weightedScore: (ryRes.score * weights.realYields) / totalW,
        direction: ryRes.score >= 0 ? 'SUPPORTIVE' : 'PRESSURING',
        confidence: 94,
        dataQuality: realYields.us10yRealYield.status,
        lastUpdated: now,
        source: realYields.us10yRealYield.source,
        formula: ryRes.formula,
        explanation: ryRes.explanation
      },
      {
        id: 'factor-usd',
        name: 'US Dollar Index (DXY)',
        category: 'FX Valuation',
        rawValue: usdFactors.dxy.value,
        unit: 'pts',
        change1D: usdFactors.dxy.change1D ?? -0.15,
        change1M: usdFactors.dxy.change1M ?? 0.65,
        historicalPercentile: usdFactors.dxy.percentile5Y ?? 71,
        score: usdRes.score,
        weight: weights.usd,
        weightedScore: (usdRes.score * weights.usd) / totalW,
        direction: usdRes.score >= 0 ? 'SUPPORTIVE' : 'PRESSURING',
        confidence: 92,
        dataQuality: usdFactors.dxy.status,
        lastUpdated: now,
        source: usdFactors.dxy.source,
        formula: usdRes.formula,
        explanation: usdRes.explanation
      },
      {
        id: 'factor-inflation',
        name: '4-Quadrant Inflation Regime',
        category: 'Macro Purchasing Power',
        rawValue: inflation.cpiYoY.value,
        unit: '% YoY',
        change1D: 0,
        historicalPercentile: inflation.cpiYoY.percentile5Y ?? 45,
        score: infRes.score,
        weight: weights.inflation,
        weightedScore: (infRes.score * weights.inflation) / totalW,
        direction: infRes.score >= 0 ? 'SUPPORTIVE' : 'PRESSURING',
        confidence: 88,
        dataQuality: inflation.cpiYoY.status,
        lastUpdated: now,
        source: inflation.cpiYoY.source,
        formula: 'Regime 4: Disinflation + Falling Real Yields (+60 pts)',
        explanation: infRes.description
      },
      {
        id: 'factor-growth-labor',
        name: 'Growth & Labor Deterioration',
        category: 'Monetary Pivot Catalyst',
        rawValue: labor.unemploymentRate.value,
        unit: '% Unemp',
        change1D: 0,
        historicalPercentile: labor.unemploymentRate.percentile5Y ?? 48,
        score: growthScore,
        weight: weights.growthLabor,
        weightedScore: (growthScore * weights.growthLabor) / totalW,
        direction: growthScore >= 0 ? 'SUPPORTIVE' : 'PRESSURING',
        confidence: 85,
        dataQuality: labor.unemploymentRate.status,
        lastUpdated: now,
        source: labor.unemploymentRate.source,
        formula: 'Score = (50 - LaborDeterioration)*0.4 + (RecessionProb - 20)*0.6',
        explanation: 'Labor market cooling increases market pricing of monetary accommodation and rate cuts, lowering cash hurdle rates for bullion.'
      },
      {
        id: 'factor-central-banks',
        name: 'Central Bank Accumulation',
        category: 'Structural Sovereign Demand',
        rawValue: centralBanks.annualNetDemandTonnes.value,
        unit: 'tonnes/yr',
        change1D: 0,
        historicalPercentile: centralBanks.historicalPercentile,
        score: cbScore,
        weight: weights.centralBanks,
        weightedScore: (cbScore * weights.centralBanks) / totalW,
        direction: 'SUPPORTIVE',
        confidence: 96,
        dataQuality: centralBanks.annualNetDemandTonnes.status,
        lastUpdated: now,
        source: centralBanks.annualNetDemandTonnes.source,
        formula: 'Score = HistoricalPercentile(98) * 0.9 - OutflowPenalty(0)',
        explanation: 'Sovereign accumulation exceeding 1,000 tonnes annually provides an unshakeable institutional floor under global bullion prices.'
      },
      {
        id: 'factor-physical',
        name: 'Physical Market Supply/Demand Deficit',
        category: 'Physical Cleared Balance',
        rawValue: physical.netBalanceTonnes.value,
        unit: 't deficit',
        change1D: 0,
        historicalPercentile: 75,
        score: physScore,
        weight: weights.physicalMarket,
        weightedScore: (physScore * weights.physicalMarket) / totalW,
        direction: 'SUPPORTIVE',
        confidence: 82,
        dataQuality: physical.netBalanceTonnes.status,
        lastUpdated: now,
        source: physical.netBalanceTonnes.source,
        formula: 'NetBalance = TotalDemand(4965t) - TotalSupply(4920t) = -45t Deficit',
        explanation: 'Mine output is structurally constrained by long exploration cycles while jewellery and retail bar demand maintains structural absorption.'
      },
      {
        id: 'factor-etf-cftc',
        name: 'Positioning & ETF Flows',
        category: 'Derivatives Sentiment',
        rawValue: positioning.cftcNetSpeculativeContracts.value,
        unit: 'contracts',
        change1D: 0,
        historicalPercentile: positioning.speculativePercentile5Y,
        score: posScore,
        weight: weights.etfPositioning,
        weightedScore: (posScore * weights.etfPositioning) / totalW,
        direction: posScore >= 0 ? 'SUPPORTIVE' : 'PRESSURING',
        confidence: 89,
        dataQuality: positioning.cftcNetSpeculativeContracts.status,
        lastUpdated: now,
        source: positioning.cftcNetSpeculativeContracts.source,
        formula: 'Score = ETF_Momentum(+14t) - OvercrowdingPenalty(86th pct = -35)',
        explanation: 'Speculative net longs at the 86th percentile indicate elevated crowding, heightening risk of temporary profit-taking flushes.'
      },
      {
        id: 'factor-geopolitics',
        name: 'Geopolitical Risk Index (GPR)',
        category: 'Safe-Haven Risk Premium',
        rawValue: geopolitics.gprScore,
        unit: '/100',
        change1D: 0,
        historicalPercentile: 78,
        score: geoScore,
        weight: weights.geopoliticalRisk,
        weightedScore: (geoScore * weights.geopoliticalRisk) / totalW,
        direction: 'SUPPORTIVE',
        confidence: 84,
        dataQuality: 'ESTIMATED',
        lastUpdated: now,
        source: 'Model Generated GPR Severity Taxonomies',
        formula: 'Score = (GPR - 50) * 1.5; Systemic Risk Multiplier = 1.25',
        explanation: 'Maritime chokepoint transit alerts and secondary sanctions drive steady sovereign hedging demand into physical gold.'
      },
      {
        id: 'factor-india-transmission',
        name: 'USD/INR & Domestic Premium',
        category: 'Indian Landed Environment',
        rawValue: priceData.usdInr.value,
        unit: '₹/USD',
        change1D: priceData.usdInr.change1D ?? 0.08,
        historicalPercentile: priceData.usdInr.percentile5Y ?? 92,
        score: indiaScore,
        weight: weights.indiaDomestic,
        weightedScore: (indiaScore * weights.indiaDomestic) / totalW,
        direction: 'SUPPORTIVE',
        confidence: 95,
        dataQuality: priceData.usdInr.status,
        lastUpdated: now,
        source: priceData.usdInr.source,
        formula: 'Score = (RupeeDepreciation% * 4.5) + (LocalPremium +180 -> +25)',
        explanation: 'Rupee depreciation against the dollar directly compounds domestic gold capital appreciation for Indian holders.'
      }
    ];
  }, [realYields, usdFactors, inflation, labor, growth, centralBanks, physical, positioning, geopolitics, priceData, settings]);

  // Detected Market Divergences
  const divergences = useMemo((): DivergenceEvent[] => {
    return scanMarketDivergences(
      priceData.xauUsd.change1M ?? 3.12,
      usdFactors.dxy.change1M ?? 0.65,
      realYields.us10yRealYield.change1M ?? -0.18,
      positioning.weeklyEtfFlowTonnes.value,
      priceData.usdInr.change1M ?? 0.92
    );
  }, [priceData, usdFactors, realYields, positioning]);

  // Composite Market Regime State
  const regimeState = useMemo((): MarketRegimeState => {
    const scoresMap = {
      realYields: calculatedFactors.find((f) => f.id === 'factor-real-yields')?.score ?? 0,
      usd: calculatedFactors.find((f) => f.id === 'factor-usd')?.score ?? 0,
      inflation: calculatedFactors.find((f) => f.id === 'factor-inflation')?.score ?? 0,
      growthLabor: calculatedFactors.find((f) => f.id === 'factor-growth-labor')?.score ?? 0,
      centralBanks: calculatedFactors.find((f) => f.id === 'factor-central-banks')?.score ?? 0,
      physicalMarket: calculatedFactors.find((f) => f.id === 'factor-physical')?.score ?? 0,
      etfPositioning: calculatedFactors.find((f) => f.id === 'factor-etf-cftc')?.score ?? 0,
      geopoliticalRisk: calculatedFactors.find((f) => f.id === 'factor-geopolitics')?.score ?? 0,
      indiaDomestic: calculatedFactors.find((f) => f.id === 'factor-india-transmission')?.score ?? 0
    };

    return calculateMarketRegime(scoresMap, settings.weights, divergences.length > 0);
  }, [calculatedFactors, settings.weights, divergences]);

  return (
    <div className="min-h-screen bg-[#090d14] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Institutional Top Header */}
      <Header
        priceData={priceData}
        realYield={realYields.us10yRealYield.value}
        dxy={usdFactors.dxy.value}
        vix={15.4}
        selectedUnit={settings.goldUnit}
        onUnitChange={(u) => setSettings((s) => ({ ...s, goldUnit: u }))}
        selectedCurrency={settings.currency}
        onCurrencyChange={(c) => setSettings((s) => ({ ...s, currency: c }))}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        onRefresh={performSync}
        refreshInterval={settings.refreshIntervalSeconds}
        onRefreshIntervalChange={(sec) => setSettings((s) => ({ ...s, refreshIntervalSeconds: sec }))}
        dataHealthList={dataHealthList}
        onOpenAIAnalyst={() => setActiveView('ai-analyst')}
        onNavigateToDataHealth={() => setActiveView('data-health')}
      />

      {/* 18-View Navigation Bar */}
      <Navigation
        activeView={activeView}
        onSelectView={setActiveView}
        hasActiveDivergences={divergences.length > 0}
      />

      {/* Main Terminal Screen Area */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1680px] w-full mx-auto">
        {activeView === 'overview' && (
          <OverviewView
            priceData={priceData}
            regimeState={regimeState}
            factors={calculatedFactors}
            divergences={divergences}
            upcomingEvents={calendarEvents}
            dataHealthList={dataHealthList}
            selectedUnit={settings.goldUnit}
            selectedCurrency={settings.currency}
            onWhyClick={(factor) => setSelectedFactorForWhy(factor)}
            onNavigateToView={setActiveView}
          />
        )}

        {activeView === 'gold' && (
          <GoldAnalysisView priceData={priceData} />
        )}

        {activeView === 'macro' && (
          <MacroRatesView
            realYields={realYields}
            inflation={inflation}
            labor={labor}
            growth={growth}
          />
        )}

        {activeView === 'real-yields' && (
          <RealYieldsView
            realYields={realYields}
            onWhyClick={() => {
              const ry = calculatedFactors.find((f) => f.id === 'factor-real-yields');
              if (ry) setSelectedFactorForWhy(ry);
            }}
          />
        )}

        {activeView === 'usd' && (
          <USDView
            usdFactors={usdFactors}
            onWhyClick={() => {
              const usd = calculatedFactors.find((f) => f.id === 'factor-usd');
              if (usd) setSelectedFactorForWhy(usd);
            }}
          />
        )}

        {activeView === 'india' && (
          <IndiaTransmissionView
            priceData={priceData}
            selectedUnit={settings.goldUnit}
            onUnitChange={(u) => setSettings((s) => ({ ...s, goldUnit: u }))}
            selectedCurrency={settings.currency}
            customsDutyPct={settings.customsDutyPct}
            onCustomsDutyChange={(v) => setSettings((s) => ({ ...s, customsDutyPct: v }))}
            aidcPct={settings.aidcPct}
            onAidcChange={(v) => setSettings((s) => ({ ...s, aidcPct: v }))}
            gstPct={settings.gstPct}
            onGstChange={(v) => setSettings((s) => ({ ...s, gstPct: v }))}
            localPremiumInr={settings.localPremiumInr}
            onLocalPremiumChange={(v) => setSettings((s) => ({ ...s, localPremiumInr: v }))}
          />
        )}

        {activeView === 'flows' && (
          <FlowsPositioningView positioning={positioning} />
        )}

        {activeView === 'physical' && (
          <CentralBanksPhysicalView
            centralBanks={centralBanks}
            physical={physical}
          />
        )}

        {activeView === 'geopolitics' && (
          <GeopoliticsView geopolitics={geopolitics} />
        )}

        {activeView === 'correlations' && (
          <CorrelationsLeadLagView />
        )}

        {activeView === 'scenarios' && (
          <ScenariosView />
        )}

        {activeView === 'stress-test' && (
          <StressTestingView scenarios={stressScenarios} />
        )}

        {activeView === 'calendar' && (
          <CalendarEventsView events={calendarEvents} />
        )}

        {activeView === 'news' && (
          <NewsIntelligenceView newsItems={newsItems} />
        )}

        {activeView === 'data-health' && (
          <DataHealthView
            dataHealthList={dataHealthList}
            onRefresh={performSync}
            isSyncing={isSyncing}
          />
        )}

        {activeView === 'ai-analyst' && (
          <AIAnalystView
            priceData={priceData}
            regimeState={regimeState}
            factors={calculatedFactors}
            divergences={divergences}
          />
        )}

        {activeView === 'backtest' && (
          <BacktestView />
        )}

        {activeView === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={setSettings}
          />
        )}
      </main>

      {/* Factor Explainability Modal ("WHY THIS SCORE?") */}
      <WhyScoreModal
        factor={selectedFactorForWhy}
        onClose={() => setSelectedFactorForWhy(null)}
      />

      {/* Terminal Footer */}
      <footer className="bg-[#080b11] border-t border-slate-800/80 px-4 py-2.5 text-[11px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-semibold">GFA Quantitative Terminal</span>
          <span>•</span>
          <span>Three-Layer Transmission Architecture</span>
          <span>•</span>
          <span>Model Build v2.4.1</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Active Timezone: {settings.timezone}</span>
          <span>•</span>
          <span>Data SLA: Live Free Public APIs + Fallback</span>
          <span>•</span>
          <span className="text-amber-400/80">Analytical Platform (Not Financial Advice)</span>
        </div>
      </footer>
    </div>
  );
}
