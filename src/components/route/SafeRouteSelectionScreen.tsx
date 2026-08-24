import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Users,
  SunMedium,
  CheckCircle2,
  Navigation,
  Sparkles,
  Info
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';
import { CleanLightMap } from '../map/CleanLightMap';
import { RouteOption } from '../../types/safety';

export const SafeRouteSelectionScreen: React.FC = () => {
  const {
    availableRoutes,
    selectedRoute,
    setSelectedRoute,
    startJourney,
    setActiveView,
    selectedDestination
  } = useSafety();

  const { safest, balanced, fastest } = availableRoutes;

  const handleSelectRoute = (route: RouteOption) => {
    setSelectedRoute(route);
  };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-slate-50 relative select-none animate-in fade-in duration-200">
      
      {/* Top Floating Back Bar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => setActiveView('main')}
          className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-slate-200 text-slate-700 hover:text-slate-900 active:scale-95 transition pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-slate-200 text-xs font-extrabold text-slate-800 pointer-events-auto">
          To {selectedDestination?.name || 'Destination'}
        </div>
      </div>

      {/* 1. CLEAN LIGHT MAP (45-50% SCREEN HEIGHT) */}
      <div className="h-[46%] w-full relative">
        <CleanLightMap showAllRoutes={true} className="w-full h-full rounded-none" />
      </div>

      {/* 2. ROUTE SELECTION SHEET (54% SCREEN HEIGHT) */}
      <div className="flex-1 bg-white rounded-t-[32px] -mt-6 z-20 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] border-t border-slate-200/80 p-5 flex flex-col justify-between overflow-y-auto">
        
        {/* Title */}
        <div>
          <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Choose your safest route
            </h2>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              3 Options Available
            </span>
          </div>
        </div>

        {/* 3 Route Cards */}
        <div className="space-y-2.5 my-3">
          
          {/* ROUTE A (SAFEST) */}
          <div
            onClick={() => handleSelectRoute(safest)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
              selectedRoute.id === 'safest'
                ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-900">{safest.title}</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
                  SAFEST
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500">{safest.durationMinutes} min ({safest.distanceKm} km)</span>
            </div>

            {/* Prominent Safety Score */}
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-black text-emerald-700">{safest.safetyScore}</span>
              <span className="text-xs font-bold text-emerald-700">/100 Safety Score</span>
            </div>

            {/* Indicators */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <SunMedium className="w-3.5 h-3.5 text-amber-500" /> {safest.indicators.lighting}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-500" /> {safest.indicators.crowd} crowd
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {safest.indicators.risk} risk
              </span>
            </div>
          </div>

          {/* ROUTE B (BALANCED) */}
          <div
            onClick={() => handleSelectRoute(balanced)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedRoute.id === 'balanced'
                ? 'bg-slate-50 border-slate-700 shadow-sm ring-2 ring-slate-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{balanced.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                  Balanced
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">{balanced.durationMinutes} min</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-black text-slate-800">{balanced.safetyScore}</span>
              <span className="text-xs font-semibold text-slate-500">/100 Safety Score</span>
            </div>
          </div>

          {/* ROUTE C (FASTEST) */}
          <div
            onClick={() => handleSelectRoute(fastest)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              selectedRoute.id === 'fastest'
                ? 'bg-amber-50/50 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{fastest.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Fastest
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">{fastest.durationMinutes} min</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-lg font-black text-slate-800">{fastest.safetyScore}</span>
              <span className="text-xs font-semibold text-slate-500">/100 Safety Score</span>
            </div>
          </div>
        </div>

        {/* Explainable Recommendation Note */}
        <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 font-semibold leading-relaxed">
            <span className="font-extrabold text-emerald-950">Safety Dosth recommends Route A</span> because it prioritizes safety over travel time.
          </p>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => startJourney(selectedRoute)}
          className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98 mt-2"
        >
          <Navigation className="w-4 h-4 fill-white" />
          <span>Start Safe Journey with {selectedRoute.title}</span>
        </button>
      </div>
    </div>
  );
};
