import React from 'react';
import { 
  ShieldAlert, 
  Wifi, 
  Radio, 
  WifiOff, 
  Sparkles, 
  LogOut, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { RoleService } from '../../services/roleService';

export const TopSystemBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    currentUser,
    authStatus, 
    networkMode, 
    setNetworkMode, 
    logout, 
    setIsDemoSwitcherOpen 
  } = useDhostAuth();

  const isOffline = networkMode !== 'ONLINE';

  const toggleNetworkMode = () => {
    if (networkMode === 'ONLINE') {
      setNetworkMode('OFFLINE_MESH');
    } else if (networkMode === 'OFFLINE_MESH') {
      setNetworkMode('CELLULAR_DEGRADED');
    } else {
      setNetworkMode('ONLINE');
    }
  };

  return (
    <div className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 z-40 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Brand & Disaster Network Badge */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 group-hover:scale-105 transition">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs tracking-wider text-white">DISASTER DHOST</span>
              <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-extrabold">RESCUE-NETWORK</span>
            </div>
            <p className="text-[10px] text-slate-400">No Login Between a Person and Help</p>
          </div>
        </div>

        {/* Center: Network Mode Simulator Toggle */}
        <button
          onClick={toggleNetworkMode}
          title="Click to toggle Network Mode (Online / Offline Mesh / Blackout)"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition active:scale-95 ${ 
            networkMode === 'ONLINE'
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900/80'
              : networkMode === 'OFFLINE_MESH'
              ? 'bg-amber-950/80 border-amber-700 text-amber-300 hover:bg-amber-900/80'
              : 'bg-rose-950/80 border-rose-700 text-rose-300 hover:bg-rose-900/80'
          }`}
        >
          <div className="flex items-center gap-1.5">
            {networkMode === 'ONLINE' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">ONLINE</span>
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
          </div>
          <span className="text-[10px] opacity-70 hidden md:inline">(Click to Switch)</span>
        </button>

        {/* Right: Session Badge & Actions */}
        <div className="flex items-center gap-2">
          
          {/* Session Status Pill */}
          {currentUser ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                <span className="font-mono text-xs font-bold text-white">{currentUser.responderId}</span>
              </div>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${RoleService.getRoleBadgeColor(currentUser.role).bg} ${RoleService.getRoleBadgeColor(currentUser.role).text} hidden sm:inline`}>
                {RoleService.getRoleLabel(currentUser.role)}
              </span>
              <span className={`text-[10px] font-mono ${isOffline ? 'text-amber-400 font-bold' : 'text-emerald-400'} hidden md:inline`}>
                {isOffline ? 'OFFLINE TRUSTED' : 'ONLINE'}
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[11px] font-medium">Guest SOS Mode (Zero Login)</span>
            </div>
          )}

          {/* Quick Demo Switcher Button */}
          <button
            onClick={() => setIsDemoSwitcherOpen(true)}
            title="Open Quick Role & Network Switcher"
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
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
            !(location.pathname.includes('/responder/login')) && (
              <button
                onClick={() => navigate('/responder/login')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-extrabold flex items-center gap-1.5 transition"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Responder Access</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
};

