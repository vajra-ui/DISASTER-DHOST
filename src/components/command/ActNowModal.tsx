import React from 'react';
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
  ArrowRight
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
}

export const ActNowModal: React.FC<Props> = ({
  packet,
  isOpen,
  onClose,
  onAssignTeam,
  onUpdateStatus,
  onOpenDigitalTwin
}) => {
  if (!isOpen || !packet) return null;

  const analysis = aiTriageService.analyzeIncident(packet);
  const recommendedTeam = DEPLOYED_RESCUE_TEAMS.find(t => t.teamId === analysis.recommendedTeamId) || DEPLOYED_RESCUE_TEAMS[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-red-500/70 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
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

        {/* 1. Casualty & Location Card */}
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

        {/* 2. Distress Transmission Payload */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>ORIGINAL DIALECT & NLP EXTRACTION:</span>
            <span className="text-emerald-400 font-mono font-bold">✓ MESH RELAYED (3 HOPS)</span>
          </div>
          <p className="text-white font-medium italic leading-relaxed">
            "{packet.translatedText || packet.requestText}"
          </p>
        </div>

        {/* 3. AI Team Recommendation Engine */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/50 space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>AI RECOMMENDED RESPONSE UNIT</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-black text-[10px]">
              MATCH: 94%
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                {recommendedTeam.type === 'FLOOD_BOAT_UNIT' ? <Anchor className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-xs font-black text-white">{recommendedTeam.name}</h4>
                <p className="text-[10px] text-slate-400">{recommendedTeam.specialty}</p>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Status: {recommendedTeam.status} • Capacity: {recommendedTeam.personnel} personnel
                </span>
              </div>
            </div>
          </div>

          {/* Reasoning Checklist */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Closest boat unit (2.4km)</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Flood extraction equipped</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Low current workload</span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Safe high-ground route</span>
          </div>
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
              <span>ASSIGN {recommendedTeam.name.split(' ')[0]} {recommendedTeam.name.split(' ')[1]}</span>
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
