import React from 'react';
import { Clock, Battery, Zap, Shield, Activity, AlertTriangle } from 'lucide-react';

interface Props {
  batteryPct: number;
}

export const DhostSurvivalClock: React.FC<Props> = ({ batteryPct }) => {
  // Estimated minutes calculation based on low-power radio profile
  // 100% = ~240 mins in mesh standby, 10% = ~24 mins
  const estimatedSurvivalMins = Math.max(4, Math.round(batteryPct * 2.4));

  return (
    <div className="p-4 rounded-3xl bg-slate-950 border-2 border-amber-500/70 space-y-3 font-mono select-none shadow-2xl relative overflow-hidden">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400 animate-spin" />
          <span className="text-xs font-black text-white tracking-wider">
            DHOST SURVIVAL CLOCK™
          </span>
        </div>

        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
          ENERGY INTELLIGENCE
        </span>
      </div>

      {/* Main Clock Countdown Display */}
      <div className="text-center py-2 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-1">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
          ESTIMATED COMMUNICATION SURVIVAL TIME
        </span>
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-3xl font-black text-amber-400 font-mono tracking-tight">
            {estimatedSurvivalMins}
          </span>
          <span className="text-xs font-black text-white uppercase">MINUTES</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <Battery className="w-3.5 h-3.5" />
            {batteryPct}% Battery
          </span>
          <span>•</span>
          <span className="text-amber-300 font-bold">
            {batteryPct <= 20 ? 'CRITICAL LOW-POWER BUDGET' : 'OPTIMAL MESH BUDGET'}
          </span>
        </div>
      </div>

      {/* Dynamic Resource Allocation Matrix */}
      <div className="space-y-1.5 text-[10px]">
        <span className="text-slate-500 uppercase font-bold tracking-widest block">
          HARDWARE POWER ALLOCATION MATRIX:
        </span>
        
        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">🚨 SOS Broadcast</span>
            <span className="text-emerald-400 font-black">MAX PRIORITY</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">📡 LoRa Mesh Relay</span>
            <span className="text-emerald-400 font-black">PRIORITY</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">📍 GPS Satellite Fix</span>
            <span className="text-amber-400 font-black">ON-DEMAND</span>
          </div>

          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-300">🗺️ Map & Animations</span>
            <span className="text-red-400 font-black">THROTTLED</span>
          </div>
        </div>
      </div>

      <div className="text-[9px] text-slate-500 text-center pt-1 border-t border-slate-900">
        *Simulated real-time power drainage budget based on LoRa SX1262 868MHz duty cycles.
      </div>

    </div>
  );
};
