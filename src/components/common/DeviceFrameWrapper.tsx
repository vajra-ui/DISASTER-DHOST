import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

export const DeviceFrameWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFrameActive, setIsFrameActive] = useState(false); // Default to fluid responsive across all devices

  return (
    <div className="min-h-[100dvh] w-full bg-[#F8FAFC] flex flex-col items-center justify-start relative font-sans">
      
      {/* Desktop Helper Toggle (Shown only on large desktop screens > 1024px) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-2xl mt-2 px-4 text-xs font-semibold text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Safety Dosth — Live Mobility Companion</span>
        </span>

        <button
          onClick={() => setIsFrameActive(!isFrameActive)}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs transition"
          title="Toggle phone frame simulator vs responsive view"
        >
          {isFrameActive ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          <span>{isFrameActive ? 'Full Screen View' : 'Phone Bezel View'}</span>
        </button>
      </div>

      {/* Main Container: Scales fluidly for mobile, tablet, and desktop */}
      <div
        className={`w-full transition-all duration-300 ${
          isFrameActive
            ? 'max-w-[420px] h-[880px] bg-white rounded-[44px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border-[6px] border-slate-900/90 overflow-hidden relative flex flex-col my-4'
            : 'max-w-2xl min-h-[100dvh] bg-white md:border-x md:border-slate-200/80 shadow-xs relative flex flex-col'
        }`}
      >
        {/* iOS Dynamic Island / Speaker Pill when in frame mode */}
        {isFrameActive && (
          <div className="w-full pt-3 pb-1 flex items-center justify-center bg-white shrink-0 z-50">
            <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800 ml-auto mr-2" />
            </div>
          </div>
        )}

        {/* App Content Container */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-[#F8FAFC]">
          {children}
        </div>
      </div>
    </div>
  );
};
