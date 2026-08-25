import React from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Battery, 
  MapPin,
  ShieldAlert,
  Brain
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';
import { aiTriageService } from '../../services/aiTriageService';

interface Props {
  packet: EmergencyPacket | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainableAiModal: React.FC<Props> = ({ packet, isOpen, onClose }) => {
  if (!isOpen || !packet) return null;

  const analysis = aiTriageService.analyzeIncident(packet);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Explainable AI (XAI) Inspector</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">Incident {packet.incidentId}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Confidence Meter */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              AI CONFIDENCE SCORE
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              {analysis.urgencyScore}%
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              ASSIGNED PRIORITY
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-black inline-block mt-1 ${
              packet.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' :
              packet.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
            }`}>
              {packet.priority}
            </span>
          </div>
        </div>

        {/* Why Critical / Heuristic Factors */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Why is this incident classified as {packet.priority}?</span>
          </h3>

          <div className="space-y-1.5">
            {analysis.keyHazards.length === 0 ? (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Standard baseline priority assigned based on proximity and general request.
              </div>
            ) : (
              analysis.keyHazards.map((hazard, index) => (
                <div 
                  key={index}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">{hazard}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Team Dispatch Recommendation */}
        <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
            RECOMMENDED RESPONSE UNIT
          </span>
          <p className="text-xs text-slate-200 font-medium leading-relaxed">
            {analysis.reasoning}
          </p>
          <div className="text-[11px] font-mono text-amber-300 font-bold pt-1">
            Unit: {analysis.recommendedTeamName}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
        >
          Dismiss Inspector
        </button>

      </div>
    </div>
  );
};
