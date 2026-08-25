import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Radio, 
  ShieldAlert, 
  UserCheck, 
  LogIn, 
  LogOut, 
  Sparkles,
  Layers,
  Brain,
  Play
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { DemoSwitcherModal } from './DemoSwitcherModal';
import { RoleService } from '../../services/roleService';
import { InteractiveKillerDemoModal } from './InteractiveKillerDemoModal';
import { EmergencyCompilerModal } from './EmergencyCompilerModal';

export const TopSystemBar: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    networkMode, 
    toggleNetworkMode, 
    logout 
  } = useDhostAuth();

  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);
  const [isKillerDemoOpen, setIsKillerDemoOpen] = useState(false);
  const [isCompilerOpen, setIsCompilerOpen] = useState(false);

  const isOffline = networkMode === 'OFFLINE_MESH' || networkMode === 'CELLULAR_DEGRADED';

  return (
    <>
      <div className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 z-40 sticky top-0 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* Left: Brand & Disaster Network Badge */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center p-0.5 group-hover:scale-105 transition overflow-hidden">
              <img src="/disaster-dhost-logo.png" alt="Disaster Dhost" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs tracking-wider text-white">DISASTER <span className="text-amber-500">DHOST</span></span>
                <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-extrabold">EMERGENCY RESPONSE</span>
              </div>
              <p className="text-[10px] text-slate-400">Emergency Response & Recovery Lifeline</p>
            </div>
          </div>

          {/* Center: Killer Demo & Emergency Compiler Launchers */}
          <div className="flex items-center gap-1.5">
            
            <button
              onClick={() => setIsKillerDemoOpen(true)}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/50 active:scale-95 transition"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" />
              <span>🎬 10/10 Killer Demo</span>
            </button>

            <button
              onClick={() => setIsCompilerOpen(true)}
              className="px-2.5 py-1.5 rounded-full bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1 transition"
            >
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Emergency Compiler</span>
            </button>

            {/* Network Mode Simulator Toggle */}
            <button
              onClick={toggleNetworkMode}
              title="Click to toggle Network Mode (Online / Offline Mesh / Blackout)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition active:scale-95 ${ 
                networkMode === 'ONLINE'
                  ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80'
                  : networkMode === 'OFFLINE_MESH'
                  ? 'bg-amber-950/80 border-amber-700 text-amber-300 hover:bg-amber-900/80'
                  : 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900/80'
              }`}
            >
              {networkMode === 'ONLINE' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">ONLINE</span>
                </>
              )}
              {networkMode === 'OFFLINE_MESH' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <Radio className="w-3.5 h-3.5" />
                  <span>OFFLINE MESH</span>
                </>
              )}
              {networkMode === 'CELLULAR_DEGRADED' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>BLACKOUT</span>
                </>
              )}
            </button>

          </div>

          {/* Right: Session Badge & Actions */}
          <div className="flex items-center gap-2">
            
            {currentUser ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="font-mono text-xs font-bold text-white">{currentUser.responderId}</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${RoleService.getRoleBadgeColor(currentUser.role).bg} ${RoleService.getRoleBadgeColor(currentUser.role).text} hidden sm:inline`}>
                  {RoleService.getRoleLabel(currentUser.role)}
                </span>
              </div>
            ) : null}

            {/* Quick Demo Switcher Button */}
            <button
              onClick={() => setIsDemoSwitcherOpen(true)}
              title="Open Quick Role & Network Switcher"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Demo Switcher</span>
            </button>

            {/* Auth Actions */}
            {currentUser ? (
              <button
                onClick={() => logout()}
                title="Log Out"
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-red-900/60 border border-slate-700 text-slate-300 hover:text-red-300 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/responder/login')}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Responder Login</span>
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Modals */}
      <DemoSwitcherModal
        isOpen={isDemoSwitcherOpen}
        onClose={() => setIsDemoSwitcherOpen(false)}
      />

      <InteractiveKillerDemoModal
        isOpen={isKillerDemoOpen}
        onClose={() => setIsKillerDemoOpen(false)}
      />

      <EmergencyCompilerModal
        isOpen={isCompilerOpen}
        onClose={() => setIsCompilerOpen(false)}
      />
    </>
  );
};
