import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight, 
  ShieldAlert, 
  Truck, 
  Anchor, 
  CheckCircle2, 
  RefreshCw,
  Compass,
  Zap,
  Activity
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { playDispatchChime, assignTeam, incidents } = useDhostAuth();

  const [selectedScenarioId, setSelectedScenarioId] = useState('BLOCKED_BOAT');
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'BLOCKED_BOAT',
      title: 'What If: Team Bravo (Boat) gets blocked by bridge collapse debris?',
      desc: 'Simulate physical waterway obstruction cutting off boat access to 14 trapped victims near Old Bridge.',
      currentTeam: 'Team Bravo (Boat Unit)',
      alternativeTeam: 'Team Delta (Coast Guard Helo AIR-01)',
      etaChange: '+4 min (ETA 12 min)',
      riskLevel: 'MEDIUM (Rooftop Winch Required)',
      confidence: '92%'
    },
    {
      id: 'RELAY_BLACKOUT',
      title: 'What If: Rooftop Drone Relay 02 suffers sudden power loss?',
      desc: 'Simulate losing the primary 868MHz relay connecting North Sector to Command HQ.',
      currentTeam: 'Direct LoRa Hop',
      alternativeTeam: 'Peer-to-Peer BLE Multi-Hop via Citizen Cluster',
      etaChange: '+180ms Latency',
      riskLevel: 'LOW (Dynamic Mesh Self-Heals)',
      confidence: '96%'
    }
  ];

  const currentScen = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleApplyPlan = () => {
    playDispatchChime();
    if (incidents.length > 0) {
      assignTeam(incidents[0].incidentId, 'AIR-01', 'Coast Guard Helo Air-1');
    }
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>"WHAT IF?" COMMAND FAILURE SIMULATOR</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  AI PREDICTIVE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Simulate infrastructure bottlenecks and test contingency response plans
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

        {/* Scenario Selector */}
        <div className="space-y-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
            SELECT DISASTER FAILURE SCENARIO:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {scenarios.map(scen => (
              <div
                key={scen.id}
                onClick={() => setSelectedScenarioId(scen.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition space-y-1 ${
                  selectedScenarioId === scen.id
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <h4 className="text-xs font-bold text-white">{scen.title}</h4>
                <p className="text-[10px] text-slate-400 leading-snug">{scen.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Predictive Impact & Alternative Comparison */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase">PREDICTED SYSTEM IMPACT:</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
              AI CONFIDENCE: {currentScen.confidence}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-red-500/30 space-y-1">
              <span className="text-[10px] text-red-400 font-bold uppercase block">CURRENT ALLOCATION</span>
              <p className="font-black text-white text-xs">{currentScen.currentTeam}</p>
              <span className="text-[10px] text-slate-500">Status: Vulnerable to blockage</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">RECOMMENDED BACKUP</span>
              <p className="font-black text-emerald-400 text-xs">{currentScen.alternativeTeam}</p>
              <span className="text-[10px] text-slate-400 font-mono">Impact: {currentScen.etaChange}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
            <span>Operational Risk Assessment:</span>
            <strong className="text-amber-400 font-bold">{currentScen.riskLevel}</strong>
          </div>
        </div>

        {/* Apply Contingency Action */}
        <div className="space-y-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleApplyPlan}
            disabled={applied}
            className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 active:scale-95 transition"
          >
            {applied ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>✓ CONTINGENCY PLAN DISPATCHED TO UNITS</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>APPLY PREDICTIVE CONTINGENCY PLAN</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
