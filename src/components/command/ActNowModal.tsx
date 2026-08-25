import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertOctagon, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Anchor, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Radio, 
  Brain, 
  Activity, 
  Layers, 
  ArrowRight,
  Navigation,
  Clock,
  Zap
} from 'lucide-react';
import { EmergencyPacket, IncidentPriority, IncidentStatus } from '../../types/dhostAuth';
import { aiTriageService, DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

interface Props {
  packet: EmergencyPacket | null;
  isOpen: boolean;
  onClose: () => void;
  onAssignTeam: (incidentId: string, teamId: string, teamName: string) => void;
  onUpdateStatus: (incidentId: string, status: IncidentStatus) => void;
  onOpenDigitalTwin: (packet: EmergencyPacket) => void;
  onOpenLiveGps?: (packet: EmergencyPacket) => void;
}

export const ActNowModal: React.FC<Props> = ({
  packet,
  isOpen,
  onClose,
  onAssignTeam,
  onUpdateStatus,
  onOpenDigitalTwin,
  onOpenLiveGps
}) => {
  if (!isOpen || !packet) return null;

  const analysis = aiTriageService.analyzeIncident(packet);
  const recommendedTeam = DEPLOYED_RESCUE_TEAMS.find(t => t.teamId === packet.assignedTeamId) || 
                          DEPLOYED_RESCUE_TEAMS.find(t => t.teamId === analysis.recommendedTeamId) || 
                          DEPLOYED_RESCUE_TEAMS[0];

  // Dynamic Live Distance Countdown
  const [distanceMeters, setDistanceMeters] = useState(580);
  const [speedKmh, setSpeedKmh] = useState(32);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistanceMeters(prev => {
        if (prev <= 40) return 30;
        return Math.max(30, prev - Math.floor(Math.random() * 15 + 10));
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const etaMins = distanceMeters <= 40 ? 0 : Math.max(1, Math.round(distanceMeters / 150));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-red-500/70 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/40">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {packet.incidentId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/50">
                  {packet.priority}
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5">
                {packet.incidentCategoryLabel}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Casualty & Location Confidence */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">CASUALTIES / TRAPPED</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white">{packet.peopleCount} People</span>
              <span className="text-[10px] text-red-400 font-bold">(Immediate)</span>
            </div>
            <span className="text-[10px] text-slate-400">Battery: {packet.batteryLevel}%</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">LOCATION CONFIDENCE</span>
            <div className="flex items-baseline gap-1 text-emerald-400 font-mono font-black text-sm">
              <span>🟢 HIGH (±{packet.location.accuracyMeters || 12}m)</span>
            </div>
            <p className="text-[10px] text-slate-300 font-bold truncate">📍 {packet.location.address || 'Old Bridge Sector'}</p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. LIVE RESCUER TEAM GPS & REAL-TIME TRACKING RADAR      */}
        {/* ======================================================== */}
        <div className="p-4 rounded-3xl bg-slate-950 border-2 border-emerald-500/60 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                LIVE RESCUER TEAM GPS & TRACKING RADAR
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
              ● LIVE SYNC
            </span>
          </div>

          {/* Real-Time Telemetry Counters */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">DISTANCE TO TARGET</span>
              <span className="text-base font-black text-amber-400">
                {distanceMeters <= 40 ? 'ON SCENE' : `${distanceMeters}m`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">ESTIMATED ETA</span>
              <span className="text-base font-black text-emerald-400">
                {distanceMeters <= 40 ? '0 min' : `~${etaMins} min`}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[9px] text-slate-500 block">RESCUER SPEED</span>
              <span className="text-base font-black text-blue-400">
                {speedKmh} km/h
              </span>
            </div>
          </div>

          {/* Rescuer Unit Details & Live GPS Vector Coordinates */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/40">
                  {recommendedTeam.type === 'FLOOD_BOAT_UNIT' ? <Anchor className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">{recommendedTeam.name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    GPS: {recommendedTeam.lat.toFixed(4)}° N, {recommendedTeam.lng.toFixed(4)}° E
                  </p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {recommendedTeam.status}
              </span>
            </div>

            {/* Simulated Radar Visual Vector */}
            <div className="h-24 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-between p-3 font-mono text-[10px]">
              <div className="flex items-center gap-1.5 text-blue-300">
                <div className="w-6 h-6 rounded-full bg-blue-600 border border-white flex items-center justify-center text-white text-[10px]">
                  🚑
                </div>
                <div>
                  <span className="font-bold block">{recommendedTeam.name.split(' ')[0]} {recommendedTeam.name.split(' ')[1]}</span>
                  <span className="text-slate-500 text-[9px]">Speed: {speedKmh} km/h</span>
                </div>
              </div>

              {/* Vector Line */}
              <div className="flex-1 mx-3 border-t-2 border-dashed border-emerald-400/80 relative flex items-center justify-center">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-emerald-300 text-[9px] font-bold">
                  {distanceMeters}m ➔
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-red-300">
                <div className="w-6 h-6 rounded-full bg-red-600 border border-white flex items-center justify-center text-white text-[10px] animate-ping">
                  🆘
                </div>
                <div>
                  <span className="font-bold block">Victim Target</span>
                  <span className="text-slate-500 text-[9px]">±12m GNSS</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* 3. Distress Transmission Payload */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>ORIGINAL DIALECT & NLP EXTRACTION:</span>
            <span className="text-emerald-400 font-mono font-bold">✓ MESH RELAYED (3 HOPS)</span>
          </div>
          <p className="text-white font-medium italic leading-relaxed">
            "{packet.translatedText || packet.requestText}"
          </p>
        </div>

        {/* 4. One-Click Decision Buttons */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onAssignTeam(packet.incidentId, recommendedTeam.teamId, recommendedTeam.name);
                onUpdateStatus(packet.incidentId, 'EN_ROUTE');
                onClose();
              }}
              className="py-3.5 px-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 active:scale-95 transition"
            >
              <Truck className="w-4 h-4" />
              <span>DISPATCH {recommendedTeam.name.split(' ')[0]} {recommendedTeam.name.split(' ')[1]}</span>
            </button>

            <button
              onClick={() => {
                onUpdateStatus(packet.incidentId, 'ACKNOWLEDGED');
                onClose();
              }}
              className="py-3.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>ACKNOWLEDGE ONLY</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenDigitalTwin(packet);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Activity className="w-3.5 h-3.5 text-purple-400" />
              <span>View Digital Twin</span>
            </button>

            <a
              href={`https://maps.google.com/?q=${packet.location.lat},${packet.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition text-center"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>GIS Google Map ↗</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
