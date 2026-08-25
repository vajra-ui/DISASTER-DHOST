import React, { useState, useEffect } from 'react';
import { 
  X, 
  Navigation, 
  MapPin, 
  Truck, 
  Anchor, 
  Radio, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Activity,
  ArrowRight,
  Phone,
  Sparkles,
  Zap,
  Users
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';
import { DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

interface Props {
  packet: EmergencyPacket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RescuerLiveGpsModal: React.FC<Props> = ({ packet, isOpen, onClose }) => {
  if (!isOpen || !packet) return null;

  const assignedTeam = DEPLOYED_RESCUE_TEAMS.find(t => t.teamId === packet.assignedTeamId) || DEPLOYED_RESCUE_TEAMS[0];

  // Dynamic simulated distance countdown towards victim
  const [distanceMeters, setDistanceMeters] = useState(620);
  const [speedKmh, setSpeedKmh] = useState(28);
  const [headingDegrees, setHeadingDegrees] = useState(48);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistanceMeters(prev => {
        if (prev <= 40) return 30; // On Scene
        const step = Math.floor(Math.random() * 18 + 12);
        return Math.max(30, prev - step);
      });

      // Realistic speed fluctuation
      setSpeedKmh(24 + Math.floor(Math.random() * 10));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const etaMins = distanceMeters <= 50 ? 0 : Math.max(1, Math.round((distanceMeters / (speedKmh * 1000 / 60))));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <Navigation className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white">LIVE RESCUER GPS TRACKING</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                  ● ACTIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Target: {packet.incidentId} • {packet.location.address || 'Old Bridge Sector'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Live Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
          
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">DISTANCE TO VICTIM</span>
            <span className="text-xl font-black text-amber-400">
              {distanceMeters <= 40 ? 'ON SCENE' : `${distanceMeters}m`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">ESTIMATED ETA</span>
            <span className="text-xl font-black text-emerald-400">
              {distanceMeters <= 40 ? '0 min' : `~${etaMins} min`}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">VEHICLE SPEED</span>
            <span className="text-xl font-black text-blue-400">
              {speedKmh} km/h
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">HEADING BEARING</span>
            <span className="text-xl font-black text-purple-400">
              {headingDegrees}° NE
            </span>
          </div>

        </div>

        {/* 2. Rescuer Unit Details */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                {assignedTeam.type === 'FLOOD_BOAT_UNIT' ? <Anchor className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-xs font-black text-white">{assignedTeam.name}</h3>
                <p className="text-[10px] text-slate-400">{assignedTeam.equipment}</p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              RADIO: MESH-TAC-01
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-slate-500 block">RESCUER GPS:</span>
              <strong className="text-white">{assignedTeam.lat.toFixed(4)}° N, {assignedTeam.lng.toFixed(4)}° E</strong>
            </div>
            <div>
              <span className="text-slate-500 block">VICTIM TARGET GPS:</span>
              <strong className="text-amber-300">{packet.location.lat.toFixed(4)}° N, {packet.location.lng.toFixed(4)}° E</strong>
            </div>
          </div>
        </div>

        {/* 3. Simulated Live Radar Vector Path */}
        <div className="h-44 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-emerald-500/10 pointer-events-none animate-pulse" />

          {/* Dynamic Vector Line SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <line x1="60" y1="120" x2="380" y2="50" stroke="#10b981" strokeWidth="3" strokeDasharray="6" className="animate-pulse" />
          </svg>

          {/* Rescuer Vehicle Dot */}
          <div className="absolute left-10 bottom-8 z-10 flex items-center gap-1.5 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-xl">
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-mono font-black text-blue-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-blue-500/40">
              {assignedTeam.name.split(' ')[0]} {assignedTeam.name.split(' ')[1]}
            </span>
          </div>

          {/* Victim Beacon Dot */}
          <div className="absolute right-10 top-6 z-10 flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-xl animate-ping" />
            <span className="text-[10px] font-mono font-black text-red-300 bg-slate-900/90 px-1.5 py-0.5 rounded border border-red-500/40">
              🆘 Victim Target ({packet.incidentId})
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 mt-auto pt-2 border-t border-slate-800/80">
            <span>High-Ground Safe Route: Navigating via LoRa Mesh</span>
            <span className="text-emerald-400 font-bold">● Live GPS Synced</span>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <a
            href={`https://maps.google.com/?q=${packet.location.lat},${packet.location.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition"
          >
            <Compass className="w-4 h-4" />
            <span>Launch Google Maps GPS</span>
          </a>

          <button
            onClick={onClose}
            className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            Close Tracker
          </button>
        </div>

      </div>
    </div>
  );
};
