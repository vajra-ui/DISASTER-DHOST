import React from 'react';
import { ShieldCheck, AlertOctagon, Heart, Clock } from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';

export const SafetyCheckModal: React.FC = () => {
  const {
    isSafetyCheckOpen,
    safetyCheckCountdown,
    handleCheckInSafe,
    handleCheckInEmergency,
    userProfile
  } = useSafety();

  if (!isSafetyCheckOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
      <div className="w-full max-w-sm rounded-[32px] bg-white border border-slate-200 p-6 text-center space-y-4 shadow-xl">
        
        {/* Heart Pulse Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-xs">
          <Heart className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            AI Safety Check
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-1.5">
            Hey Dosth, everything okay?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Confirm your status to keep your route monitored.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>Auto-alerting in:</span>
          <span className="text-sm font-black text-red-600">{safetyCheckCountdown}s</span>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleCheckInSafe}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-600/20 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>I'M SAFE & ON TRACK</span>
          </button>

          <button
            onClick={handleCheckInEmergency}
            className="w-full py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-extrabold text-xs flex items-center justify-center gap-2 transition active:scale-98"
          >
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span>NEED HELP</span>
          </button>
        </div>
      </div>
    </div>
  );
};
