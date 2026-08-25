import React from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const EmergencyHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { networkMode, incidents, openPacketInspector } = useDhostAuth();

  const recentIncidents = incidents.slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
      
      {/* Top Emergency Status Header */}
      <div className="space-y-5">
        
        <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <p className="text-xs font-extrabold text-white tracking-wide">DISASTER MESH NODE: SEACTI-AL1</p>
              <p className="text-[10px] text-slate-400">Direct Peer-Assistance Channel Open</p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
            {networkMode === 'ONLINE' ? 'ONLINE' : 'OFFLINE MESH'}
          </span>
        </div>

        {/* Core PEOPLE QUESTION */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-extrabold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>NETFREE EMERGENCY RESPONSE</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            DO YOU NEED HELP?
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            No login, no password, no internet required. Tap below to transmit your live SOS packet.
          </p>
        </div>

        {/* PRIMARY EMERGENCY ACTION - LARGE RED BEACON */}
        <div className="pt-2">
          <button
            onClick={() => navigate('/victim')}
            className="w-full py-6 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-red-500 text-white shadow-2xl shadow-red-950/90 border border-red-400/40 flex flex-col items-center justify-center gap-2 active:scale-98 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition">
                <AlertOctagon className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-wider">🆘 I NEED HELP</span>
            </div>
            <p className="text-[11px] text-red-100/95 font-medium">
              Instant Emergency Dispatch • Shares GPS & Mesh Packet
            </p>
          </button>
        </div>

        {/* SECONDARY ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/safe')}
            className="py-4 px-3.5 rounded-2xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/20 text-left flex flex-col justify-between gap-3 active:scale-98 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">🟢 I'M SAFE</p>
              <p className="text-[10px] text-slate-400">Broadcast safe status</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/help-others')}
            className="py-4 px-3.5 rounded-2xl bg-slate-900 border border-purple-500/40 hover:bg-purple-950/20 text-left flex flex-col justify-between gap-3 active:scale-98 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">🤝 HELP OTHERS</p>
              <p className="text-[10px] text-slate-400">Community Hazard Report</p>
            </div>
          </button>
        </div>

        {/* Nearby Recent Incidents Preview */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">Active Disaster Mesh Beacons:</span>
            <span className="text-[10px] text-slate-500">Real-Time EOC</span>
          </div>

          <div className="space-y-1.5">
            {recentIncidents.map((inc) => (
              <div 
                key={inc.incidentId}
                onClick={() => openPacketInspector(inc)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{inc.incidentCategoryLabel}</p>
                    <p className="text-[10px] text-slate-500">{inc.location.address} • <span className="font-mono">{inc.hopCount}-HopMesh</span></p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {inc.incidentId}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM: UNOBTRUSIVE RESPONDER ACCESS */}
      <div className="pt-4 pb-2 text-center">
        <div className="w-16 h-0.5 rounded-full bg-slate-800 my-3 mx-auto" />
        <button
          onClick={() => navigate('/responder/login')}
          className="inline-flex items-center gap-1.5 py-2 px-4 text-slate-400 hover:text-white text-xs font-bold transition"
        >
          <span>Responder Access →</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
