import React from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Pause,
  Play,
  Share2,
  AlertOctagon,
  Users,
  SunMedium,
  Wifi,
  CornerUpLeft,
  CornerUpRight,
  ArrowUp,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';
import { CleanLightMap } from '../map/CleanLightMap';
import { TurnInstruction } from '../../types/safety';

export const LiveSafeJourneyScreen: React.FC = () => {
  const {
    journeyState,
    pauseJourney,
    resumeJourney,
    endJourney,
    setActiveView,
    triggerSafetyCheckModal
  } = useSafety();

  const currentInstruction: TurnInstruction =
    journeyState.selectedRoute?.instructions[journeyState.currentStepIndex] || {
      text: 'Turn left onto Main Road',
      maneuver: 'turn-left',
      distanceMeters: 450,
      streetName: 'Main Road',
      lat: 11.6643,
      lng: 78.1460
    };

  return (
    <div className="flex flex-col h-[100dvh] max-w-md mx-auto bg-slate-50 relative select-none animate-in fade-in duration-200">
      
      {/* 1. TOP CALM STATUS BAR */}
      <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 p-2 px-3.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-sm border border-slate-200 pointer-events-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-900">
                SAFE JOURNEY ACTIVE
              </span>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                AI Monitoring
              </span>
            </div>
          </div>
        </div>

        {/* Safety Score Pill */}
        <div className="flex items-center gap-1.5 p-2 px-3 rounded-2xl bg-emerald-600 text-white shadow-sm font-bold text-xs pointer-events-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>Score {journeyState.liveSafetyScore}</span>
        </div>
      </div>

      {/* 2. SUPPORTING LIGHT MAP CANVAS */}
      <div className="flex-1 w-full relative">
        <CleanLightMap showAllRoutes={false} className="w-full h-full rounded-none" />
      </div>

      {/* 3. CALM COMPACT BOTTOM SHEET */}
      <div className="bg-white rounded-t-[32px] -mt-6 z-20 shadow-[0_-6px_25px_rgba(0,0,0,0.08)] border-t border-slate-200/80 p-5 space-y-4">
        
        {/* Next Turn Instruction */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-xs">
              {currentInstruction.maneuver === 'turn-left' ? (
                <CornerUpLeft className="w-6 h-6" />
              ) : currentInstruction.maneuver === 'turn-right' ? (
                <CornerUpRight className="w-6 h-6" />
              ) : (
                <ArrowUp className="w-6 h-6" />
              )}
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Next
              </span>
              <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                {currentInstruction.text}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-slate-900">
              {currentInstruction.distanceMeters}
            </span>
            <span className="text-xs font-bold text-slate-500 ml-1">m</span>
          </div>
        </div>

        {/* Live Safety Indicators Grid */}
        <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-700 text-xs font-bold">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>High</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">👥 Crowd</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-700 text-xs font-bold">
              <SunMedium className="w-3.5 h-3.5 text-amber-500" />
              <span>Good</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">💡 Lighting</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Low</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">🚨 Risk</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-center gap-1 text-slate-700 text-xs font-bold">
              <Wifi className="w-3.5 h-3.5 text-slate-600" />
              <span>Strong</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">📶 Network</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center gap-2 pt-1">
          {/* Pause / Resume */}
          <button
            onClick={() => journeyState.isPaused ? resumeJourney() : pauseJourney()}
            className="flex-1 py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {journeyState.isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-slate-600" />}
            <span>{journeyState.isPaused ? 'Resume' : 'Pause Journey'}</span>
          </button>

          {/* Share Live Location */}
          <button
            onClick={() => alert('Live location link copied! Trusted contacts are notified.')}
            className="py-3 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Share2 className="w-4 h-4 text-slate-600" />
            <span>Share</span>
          </button>

          {/* End Journey */}
          <button
            onClick={endJourney}
            className="py-3 px-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition active:scale-95"
          >
            Done
          </button>

          {/* Prominent but compact SOS Button */}
          <button
            onClick={() => setActiveView('emergency')}
            className="py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs flex items-center justify-center gap-1 shadow-sm shadow-red-600/30 transition active:scale-95"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
