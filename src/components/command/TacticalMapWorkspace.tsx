import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Layers, 
  MapPin, 
  Truck, 
  Radio, 
  ShieldCheck, 
  Navigation, 
  Compass, 
  Sparkles, 
  X,
  CheckCircle2,
  AlertOctagon,
  Anchor
} from 'lucide-react';
import { EmergencyPacket, IncidentPriority } from '../../types/dhostAuth';
import { DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

interface Props {
  incidents: EmergencyPacket[];
  onSelectIncident: (packet: EmergencyPacket) => void;
  onClose: () => void;
}

export const TacticalMapWorkspace: React.FC<Props> = ({
  incidents,
  onSelectIncident,
  onClose
}) => {
  const [selectedPin, setSelectedPin] = useState<EmergencyPacket | null>(incidents[0] || null);
  const [layerFilter, setLayerFilter] = useState<'ALL' | 'CRITICAL' | 'TEAMS' | 'RELAYS' | 'SHELTERS'>('ALL');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between text-slate-100 select-none animate-in fade-in">
      
      {/* Top Map Navigation Bar */}
      <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Map</span>
          </button>

          <div>
            <h2 className="text-sm font-black text-white flex items-center gap-2">
              <span>TACTICAL GIS INCIDENT MAP</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                HIGH ACCURACY GNSS
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">Sector: Salem Urban Impact Area • LoRa Mesh Overlay</p>
          </div>
        </div>

        {/* Layer Filter Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Layers' },
            { id: 'CRITICAL', label: '🔴 Critical' },
            { id: 'TEAMS', label: '🚑 Units (4)' },
            { id: 'RELAYS', label: '📡 LoRa Nodes' },
            { id: 'SHELTERS', label: '⛺ Shelters' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setLayerFilter(tab.id as any)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                layerFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Screen Simulated GIS Canvas */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-4">
        
        {/* Radar & Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-blue-500/5 pointer-events-none" />

        {/* Map Grid Vector Lines (Simulated River & Streets) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
          <path d="M 0,300 Q 400,350 800,280 T 1600,320" fill="none" stroke="#38bdf8" strokeWidth="18" />
          <path d="M 300,0 L 300,1000" fill="none" stroke="#475569" strokeWidth="4" />
          <path d="M 900,0 L 900,1000" fill="none" stroke="#475569" strokeWidth="4" />
          <path d="M 0,600 L 1600,600" fill="none" stroke="#475569" strokeWidth="4" />
        </svg>

        {/* Interactive Pins on Canvas */}
        <div className="relative z-10 w-full max-w-4xl h-full flex flex-wrap items-center justify-around gap-6 p-4">
          
          {/* Incident Pins */}
          {incidents.slice(0, 5).map((inc, i) => (
            <div
              key={inc.incidentId}
              onClick={() => setSelectedPin(inc)}
              className={`p-3 rounded-2xl border cursor-pointer transition transform hover:scale-105 shadow-2xl flex items-center gap-2.5 ${
                selectedPin?.incidentId === inc.incidentId
                  ? 'bg-amber-950 border-amber-400 ring-4 ring-amber-500/30 scale-110'
                  : 'bg-slate-900/90 border-slate-700'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full ${inc.priority === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`} />
              <div>
                <span className="font-mono font-black text-xs text-white block">{inc.incidentCategoryLabel}</span>
                <span className="text-[10px] text-slate-400 font-mono">{inc.peopleCount} People • {inc.location?.address || 'Bridge'}</span>
              </div>
            </div>
          ))}

          {/* Rescue Team Pins */}
          {DEPLOYED_RESCUE_TEAMS.map((team, idx) => (
            <div
              key={team.teamId}
              className="p-3 rounded-2xl bg-blue-950/80 border border-blue-500/60 shadow-xl flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-300 flex items-center justify-center">
                {team.type === 'FLOOD_BOAT_UNIT' ? <Anchor className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-xs text-white block">{team.name}</span>
                <span className="text-[10px] text-blue-400 font-mono">{team.status} • {team.currentLocation}</span>
              </div>
            </div>
          ))}

        </div>

      </div>

      {/* Slide-Up Bottom Sheet Inspector */}
      {selectedPin && (
        <div className="p-4 bg-slate-900 border-t border-slate-800 z-30 shadow-2xl space-y-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  {selectedPin.incidentId}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-500/20 text-red-400 border border-red-500/50">
                  {selectedPin.priority}
                </span>
                <h3 className="text-sm font-black text-white">{selectedPin.incidentCategoryLabel} ({selectedPin.peopleCount} People)</h3>
              </div>
              <p className="text-xs text-slate-300 font-medium">"{selectedPin.requestText}"</p>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                <span>📍 GPS: {selectedPin.location?.lat.toFixed(4)}, {selectedPin.location?.lng.toFixed(4)} (±12m)</span>
                <span>Assigned: <strong className="text-emerald-400">{selectedPin.assignedTeamName || 'Unassigned'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onSelectIncident(selectedPin)}
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>ACT NOW ON TARGET</span>
              </button>

              <a
                href={`https://maps.google.com/?q=${selectedPin.location?.lat},${selectedPin.location?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Google Maps ↗
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
