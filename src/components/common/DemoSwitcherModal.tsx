import React from 'react';
import { 
  X, 
  Shield, 
  Ambulance, 
  Sparkles, 
  Flame, 
  HeartHandshake, 
  Wifi, 
  WifiOff, 
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { UserRole } from '../../types/dhostAuth';

export const DemoSwitcherModal: React.FC = () => {
  const navigate = useNavigate();
  const { 
    isDemoSwitcherOpen, 
    setIsDemoSwitcherOpen, 
    currentUser,
    networkMode, 
    setNetworkMode, 
    quickSwitchDemo,
    logout 
  } = useDhostAuth();

  if (!isDemoSwitcherOpen) return null;

  const handleSelectRole = (role: UserRole | 'VICTIM' | 'VOLUNTEER' | 'SAFE') => {
    if (role === 'VICTIM') {
      logout(true);
      navigate('/');
    } else if (role === 'VOLUNTEER') {
      logout(true);
      navigate('/help-others');
    } else if (role === 'SAFE') {
      logout(true);
      navigate('/safe');
    } else {
      quickSwitchDemo(role);
      if (role === 'COMMANDER') navigate('/command');
      else if (role === 'RESCUE_TEAM') navigate('/rescue');
      else if (role === 'MEDICAL') navigate('/medical');
    }
    setIsDemoSwitcherOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-lg w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-5 shadow-2xl space-y-5 animate-in zoom-in-95">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">Quick Demo & Role Switcher</h3>
              <p className="text-[11px] text-slate-400">Instantly test all disaster user flows and offline states</p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoSwitcherOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network Mode Selector */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Network Simulation Environment:</span>
            <span className="text-[10px] font-mono text-amber-400">{networkMode}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setNetworkMode('ONLINE')}
              className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                networkMode === 'ONLINE' 
                  ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
              }`}
            >
              <Wifi className="w-3.5 h-3.5" />
              <span>Online Cellular</span>
            </button>
            <button
              onClick={() => setNetworkMode('OFFLINE_MESH')}
              className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                networkMode === 'OFFLINE_MESH' 
                  ? 'bg-amber-500/20 border-amber-500/80 text-amber-300' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Offline Mesh</span>
            </button>
            <button
              onClick={() => setNetworkMode('CELLULAR_DEGRADED')}
              className={`px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                networkMode === 'CELLULAR_DEGRADED' 
                  ? 'bg-rose-500/20 border-rose-500/80 text-rose-300' 
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
              }`}
            >
              <WifiOff className="w-3.5 h-3.5" />
              <span>Blackout</span>
            </button>
          </div>
        </div>

        {/* Role Switcher Area */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400">Select User Role / Perspective:</p>

          <div className="space-y-2">
            
            {/* 1. Victim (no auth) */}
            <button
              onClick={() => handleSelectRole('VICTIM')}
              className="w-full p-3 rounded-2xl bg-red-950/40 border border-red-500/30 hover:border-red-500 flex items-center justify-between text-left transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">Victim / General Citizen</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[10px] font-bold">ZERO LOGIN</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Instant SOS, Anonymous Session (DD-XXXXXX), Mesh Broadcast</p>
                </div>
              </div>
              <span className="text-xs text-red-400 font-bold">Launch →</span>
            </button>

            {/* 2. Commander */}
            <button
              onClick={() => handleSelectRole('COMMANDER')}
              className={`w-full p-3 rounded-2xl bg-slate-800/60 border ${
                currentUser?.role === 'COMMANDER' ? 'border-amber-500' : 'border-slate-700/80'
              } hover:border-amber-500/80 flex items-center justify-between text-left transition`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">CMD-001 | Capt. Rajesh Varma</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 text-[10px] font-bold">COMMANDER</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Command Center, all incidents, team dispatch, mesh topology</p>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-bold">Login →</span>
            </button>

            {/* 3. Rescue Team */}
            <button
              onClick={() => handleSelectRole('RESCUE_TEAM')}
              className={`w-full p-3 rounded-2xl bg-slate-800/60 border ${
                currentUser?.role === 'RESCUE_TEAM' ? 'border-blue-500' : 'border-slate-700/80'
              } hover:border-blue-500/80 flex items-center justify-between text-left transition`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">RSC-1042 | Sgt. Ananya Sen</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-bold">RESCUE TEAM</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Mobile dispatch, Tamil-English translation, status progression</p>
                </div>
              </div>
              <span className="text-xs text-blue-400 font-bold">Login →</span>
            </button>

            {/* 4. Medical Team */}
            <button
              onClick={() => handleSelectRole('MEDICAL')}
              className={`w-full p-3 rounded-2xl bg-slate-800/60 border ${
                currentUser?.role === 'MEDICAL' ? 'border-emerald-500' : 'border-slate-700/80'
              } hover:border-emerald-500/80 flex items-center justify-between text-left transition`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Ambulance className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-white">MED-204 | Dr. K. Raghavan</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">MEDICAL</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Color triage (Red/Yellow/Green), casualty logs, medevac escalation</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold">Login →</span>
            </button>

            {/* 5. Safe Broadcast & Volunteer */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSelectRole('SAFE')}
                className="p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-left transition"
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white">I'm Safe Check-In</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Zero-auth citizen beacon</p>
              </button>

              <button
                onClick={() => handleSelectRole('VOLUNTEER')}
                className="p-2.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 hover:border-purple-500 text-left transition"
              >
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Community Report</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Volunteer hazard tagger</p>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

