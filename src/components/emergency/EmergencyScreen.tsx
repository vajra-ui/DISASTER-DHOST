import React, { useState, useRef } from 'react';
import {
  X,
  AlertOctagon,
  Phone,
  Share2,
  CheckCircle2,
  Users,
  ShieldAlert,
  ArrowLeft,
  PhoneCall
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';

export const EmergencyScreen: React.FC = () => {
  const {
    isEmergencyActive,
    triggerEmergencyAlert,
    cancelEmergencyAlert,
    setActiveView,
    userProfile
  } = useSafety();

  const [holdProgress, setHoldProgress] = useState(0);
  const holdIntervalRef = useRef<any>(null);

  const handleMouseDown = () => {
    if (isEmergencyActive) return;
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        triggerEmergencyAlert();
      }
    }, 40);
  };

  const handleMouseUp = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    if (!isEmergencyActive) {
      setHoldProgress(0);
    }
  };

  return (
    <div className="min-h-full pb-24 px-4 pt-6 max-w-md mx-auto space-y-6 animate-in fade-in duration-200 select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveView('main')}
          className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 active:scale-95 transition shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-lg text-slate-900">Emergency Assistance</h2>
        <div className="w-9" />
      </div>

      {!isEmergencyActive ? (
        /* IDLE / READY STATE WITH PRESS-AND-HOLD BUTTON */
        <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center">
          
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900">Need Immediate Help?</h3>
            <p className="text-xs text-slate-500 max-w-xs">
              Activating SOS instantly shares your live coordinates and notifies all trusted contacts.
            </p>
          </div>

          {/* Central Press-and-Hold SOS Button */}
          <div className="relative flex items-center justify-center p-6">
            
            {/* SVG Circular Progress Ring */}
            <svg className="w-56 h-56 -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="#FEE2E2"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="#DC2626"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={628}
                strokeDashoffset={628 - (628 * holdProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear"
              />
            </svg>

            {/* Inner SOS Button */}
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-xl shadow-red-600/30 flex flex-col items-center justify-center select-none active:scale-95 transition"
            >
              <AlertOctagon className="w-12 h-12 mb-1" />
              <span className="text-2xl font-black tracking-wider">SOS</span>
            </button>
          </div>

          {/* Prompt text under button */}
          <div className="space-y-1">
            <p className="text-sm font-extrabold text-slate-800">
              {holdProgress > 0 ? `Holding... ${Math.round(holdProgress)}%` : 'Press and hold for 3 seconds'}
            </p>
            <p className="text-xs text-slate-400">
              Prevents accidental emergency triggers
            </p>
          </div>

          {/* Quick Direct Dial 112 */}
          <div className="w-full pt-4">
            <a
              href="tel:112"
              className="w-full py-3.5 px-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-extrabold text-xs shadow-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Direct Dial Emergency (112)</span>
            </a>
          </div>
        </div>
      ) : (
        /* ACTIVATED / ALERT SENT STATE */
        <div className="space-y-5 animate-in zoom-in-95 duration-300">
          
          {/* Status Alert Banner */}
          <div className="p-5 rounded-3xl bg-red-50 border border-red-200 text-center space-y-1.5 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-md animate-bounce">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-red-800 tracking-tight">Alert Sent</h3>
            <p className="text-xs font-semibold text-red-700">
              Your location is being shared in real-time
            </p>
          </div>

          {/* Trusted Contacts receiving alert */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
              <span>Trusted Contacts Notified</span>
              <span className="text-emerald-600">● 3/3 Active</span>
            </div>

            <div className="space-y-2">
              {userProfile.trustedCircle.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={c.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'}
                      alt={c.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{c.name}</p>
                      <p className="text-[10px] text-slate-500">{c.relation} • {c.phone}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    Alerted
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <a
              href="tel:112"
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md shadow-red-600/20 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Call Emergency Services (112)</span>
            </a>

            <button
              onClick={() => alert('Live emergency location broadcasted!')}
              className="w-full py-3.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs shadow-xs flex items-center justify-center gap-2 transition"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>Share Live Location Link</span>
            </button>

            {/* Cancel Alert Button */}
            <button
              onClick={cancelEmergencyAlert}
              className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>I'm Safe — Cancel Alert</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
