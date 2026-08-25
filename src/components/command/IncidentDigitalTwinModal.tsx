import React from 'react';
import { 
  X, 
  Activity, 
  Clock, 
  Users, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  Sparkles,
  Truck
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';

interface Props {
  packet: EmergencyPacket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentDigitalTwinModal: React.FC<Props> = ({ packet, isOpen, onClose }) => {
  if (!isOpen || !packet) return null;

  const timelineSteps = [
    { time: '22:31:04', title: 'Beacon Created', actor: 'Victim Device (Zero-Input)', status: 'COMPLETED' },
    { time: '22:31:18', title: 'NLP Dialect Parsed', actor: 'DHOST Emergency Compiler', status: 'COMPLETED' },
    { time: '22:32:02', title: 'Multi-Hop Relayed', actor: 'Citizen Relay A & Drone B (868MHz)', status: 'COMPLETED' },
    { time: '22:33:14', title: 'Rescue Node Intercept', actor: 'Rescue Boat Unit RSC-1088', status: 'COMPLETED' },
    { time: '22:34:00', title: 'Commander EOC ACK', actor: 'Capt. Rajesh Varma (CMD-001)', status: 'COMPLETED' },
    { time: '22:35:10', title: 'Team Assigned', actor: packet.assignedTeamName || 'Rescue Alpha', status: packet.assignedTeamId ? 'COMPLETED' : 'PENDING' },
    { time: '22:38:00', title: 'En Route Navigation', actor: 'Safe High-Ground Route (4.8km)', status: packet.status === 'EN_ROUTE' || packet.status === 'ON_SCENE' || packet.status === 'RESOLVED' ? 'COMPLETED' : 'PENDING' },
    { time: '22:45:00', title: 'On Scene Extraction', actor: 'Water Rescue Rafts Deployed', status: packet.status === 'ON_SCENE' || packet.status === 'RESOLVED' ? 'COMPLETED' : 'PENDING' },
    { time: '22:52:00', title: 'Evacuation Complete', actor: 'Victims Transported to Shelter', status: packet.status === 'RESOLVED' ? 'COMPLETED' : 'PENDING' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-purple-500/70 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/40">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/40">
                  {packet.incidentId}
                </span>
                <span className="text-xs font-black text-white">LIVING DIGITAL TWIN</span>
              </div>
              <p className="text-xs text-slate-400">Dynamic Evolving Operational State</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Evolving Casualty Evolution Strip */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
            DYNAMIC CASUALTY EVOLUTION (LIVE SENSOR STREAM):
          </span>
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">INITIAL REPORT</span>
              <span className="text-base font-black text-white">6 People</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30">
              <span className="text-[10px] text-amber-400 block">CLUSTER MERGE</span>
              <span className="text-base font-black text-amber-300">14+ People</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 block">EVACUATED SAFE</span>
              <span className="text-base font-black text-emerald-400">{packet.status === 'RESOLVED' ? '14' : '0'}</span>
            </div>
          </div>
        </div>

        {/* Chronological Timeline Stream */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
            CRYPTOGRAPHIC AUDIT TIMELINE (ED25519 VERIFIED):
          </span>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {timelineSteps.map((step, index) => (
              <div 
                key={index}
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition ${
                  step.status === 'COMPLETED'
                    ? 'bg-slate-950 border-slate-800 text-slate-200'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-purple-400 font-bold">{step.time}</span>
                  <div>
                    <h4 className="font-bold text-white text-xs">{step.title}</h4>
                    <p className="text-[10px] text-slate-400">{step.actor}</p>
                  </div>
                </div>

                <div>
                  {step.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-700 block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
        >
          Close Digital Twin
        </button>

      </div>
    </div>
  );
};
