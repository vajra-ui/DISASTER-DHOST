import React from 'react';
import {
  TrendingUp,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';

export const SafetyInsightsScreen: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', score: 94, isCurrent: false },
    { day: 'Tue', score: 91, isCurrent: false },
    { day: 'Wed', score: 96, isCurrent: false },
    { day: 'Thu', score: 88, isCurrent: false },
    { day: 'Fri', score: 92, isCurrent: false },
    { day: 'Sat', score: 95, isCurrent: false },
    { day: 'Sun', score: 92, isCurrent: true }
  ];

  return (
    <div className="min-h-full pb-24 px-4 pt-6 max-w-md mx-auto space-y-5 animate-in fade-in duration-200 select-none">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Safety Insights</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          AI safety patterns and weekly navigation trends
        </p>
      </div>

      {/* 2. LARGE SCORE HERO CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black text-slate-900 tracking-tight">92</span>
            <span className="text-sm font-bold text-slate-500">/ 100</span>
          </div>
          <div className="p-2 rounded-2xl bg-emerald-100/80 text-emerald-800">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <p className="text-sm font-bold text-emerald-800">
          You're travelling safely this week.
        </p>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Your route selection prioritized lit boulevards with verified community police checkpoints on 95% of trips.
        </p>
      </div>

      {/* 3. WEEKLY SAFETY GRAPH */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-extrabold text-slate-900">
          <span>Weekly Safety Score Trend</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4% vs last week
          </span>
        </div>

        {/* Minimal Bar Chart */}
        <div className="flex items-end justify-between h-32 pt-4 px-1">
          {weeklyData.map((item, idx) => {
            const heightPercent = Math.round((item.score / 100) * 100);
            return (
              <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-bold text-slate-600">{item.score}</span>
                <div className="w-6 bg-slate-100 rounded-t-lg h-24 flex items-end overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      item.isCurrent
                        ? 'bg-emerald-600 shadow-sm'
                        : 'bg-emerald-400/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[11px] font-bold ${item.isCurrent ? 'text-slate-900' : 'text-slate-400'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. FOUR KEY INSIGHT METRIC CARDS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Safest Time */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Safest Time
          </span>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            7:00 AM – 9:00 PM
          </p>
        </div>

        {/* Safest Route Type */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Safest Route Type
          </span>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            Main roads
          </p>
        </div>

        {/* Average Risk */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Average Risk
          </span>
          <p className="text-xs font-extrabold text-emerald-700 leading-tight">
            Low (Grade A)
          </p>
        </div>

        {/* Journeys Completed */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Journeys Completed
          </span>
          <p className="text-xs font-extrabold text-slate-900 leading-tight">
            18 Protected Trips
          </p>
        </div>
      </div>

    </div>
  );
};
