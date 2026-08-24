import React, { useState, useEffect } from 'react';
import { ShieldCheck, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsFadingOut(true);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 12;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [onFinish]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onFinish, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-gradient-to-b from-[#F8FAFC] via-[#F1F5F9] to-white flex flex-col items-center justify-between p-6 sm:p-10 text-center select-none transition-opacity duration-400 ${
        isFadingOut ? 'opacity-0 scale-98' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Ambient Pill */}
      <div className="pt-6 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-extrabold shadow-2xs animate-in fade-in slide-in-from-top-4 duration-500">
        <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin-slow" />
        <span className="tracking-wide uppercase text-[10px]">Real-Time Safety Intelligence</span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center max-w-sm my-auto animate-in zoom-in-95 duration-500">
        {/* Radiant Logo Container */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 rounded-[36px] bg-emerald-400/20 blur-xl animate-pulse"></div>
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-[32px] overflow-hidden shadow-xl shadow-emerald-500/10 border-2 border-emerald-100 p-1 bg-white">
            <img
              src="/logo.jpg"
              alt="Safety Dosth Logo"
              className="w-full h-full object-cover rounded-[28px] transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          SAFETY DOSTH
        </h1>
        
        {/* Tagline */}
        <p className="mt-2 text-sm sm:text-base font-extrabold text-emerald-700 italic tracking-wide">
          “Your Route. Your Dosth. Your Safety.”
        </p>

        <p className="mt-3 text-xs text-slate-500 font-medium leading-relaxed max-w-xs">
          Personal safety companion that intelligently monitors your route and keeps your loved ones connected.
        </p>

        {/* Smooth Animated Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-8 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-200 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Bottom CTA / Instant Enter Button */}
      <div className="pb-6 w-full max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500">
        <button
          onClick={handleSkip}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-[11px] text-slate-400 font-medium mt-2.5">
          Intelligent Mobility & Protection
        </p>
      </div>
    </div>
  );
};
