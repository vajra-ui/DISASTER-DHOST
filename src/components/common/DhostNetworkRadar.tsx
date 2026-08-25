import React, { useState } from 'react';
import { 
  Radio, 
  Wifi, 
  Bluetooth, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Activity,
  XCircle
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';

interface Props {
  packet: EmergencyPacket;
}

export const DhostNetworkRadar: React.FC<Props> = ({ packet }) => {
  const [isNodeDead, setIsNodeDead] = useState(false);
  const [isHealing, setIsHealing] = useState(false);

  const handleSimulateNodeKill = () => {
    setIsNodeDead(true);
    setIsHealing(true);
    setTimeout(() => {
      setIsHealing(false);
    }, 1200);
  };

  const handleResetMesh = () => {
    setIsNodeDead(false);
    setIsHealing(false);
  };

  const packetLifecycle = [
    { step: 'CREATED', label: '1. Created', desc: 'Zero-Auth Device Origin' },
    { step: 'UNDERSTOOD', label: '2. Understood', desc: 'NLP Dialect Parsed' },
    { step: 'CLASSIFIED', label: '3. Classified', desc: packet.incidentCategoryLabel },
    { step: 'PRIORITIZED', label: '4. Prioritized', desc: packet.priority },
    { step: 'LOCATED', label: '5. Located', desc: 'GNSS Fix ±12m' },
    { step: 'STORED', label: '6. Stored', desc: 'Encrypted Offline DB' },
    { step: 'RELAYING', label: '7. Relaying', desc: 'LoRa 868MHz Mesh' },
    { step: 'DELIVERED', label: '8. Delivered', desc: 'Rescue Node Gateway' },
    { step: 'ACKNOWLEDGED', label: '9. Acknowledged', desc: 'Command HQ Dispatched' },
    { step: 'RESOLVED', label: '10. Resolved', desc: packet.status === 'RESOLVED' ? 'Rescued Safe' : 'In Progression' }
  ];

  return (
    <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-5 font-mono text-xs select-none shadow-2xl">
      
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
          <div>
            <h3 className="font-black text-white text-xs">SELF-HEALING MESH RADAR</h3>
            <p className="text-[10px] text-slate-400">Dynamic Multi-Hop Path Discovery & Rerouting</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isNodeDead ? (
            <button
              onClick={handleSimulateNodeKill}
              className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 font-bold text-[10px] flex items-center gap-1.5 transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Kill Relay A (Simulate Loss)</span>
            </button>
          ) : (
            <button
              onClick={handleResetMesh}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Topology</span>
            </button>
          )}
        </div>
      </div>

      {/* Mesh Path Discovery Diagram */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-bold">CURRENT ACTIVE PATHWAY:</span>
          {isHealing ? (
            <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              SEARCHING ALTERNATIVE MESH PATH...
            </span>
          ) : isNodeDead ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              PATH RECOVERED (VIA RELAY C & D)
            </span>
          ) : (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PRIMARY DIRECT ROUTE OPTIMAL
            </span>
          )}
        </div>

        {/* Dynamic Node Graph Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[10px]">
          
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <Smartphone className="w-5 h-5 mx-auto text-red-400" />
            <span className="font-bold text-white block">VICTIM</span>
            <span className="text-[9px] text-slate-500 font-mono">DD-V-81A2</span>
          </div>

          <div className={`p-2.5 rounded-xl border space-y-1 transition-all ${
            isNodeDead
              ? 'bg-red-950/40 border-red-500 line-through opacity-40'
              : 'bg-slate-950 border-slate-800'
          }`}>
            {isNodeDead ? <XCircle className="w-5 h-5 mx-auto text-red-500" /> : <Wifi className="w-5 h-5 mx-auto text-blue-400" />}
            <span className="font-bold text-white block">RELAY A (Citizen)</span>
            <span className="text-[9px] text-slate-500 font-mono">{isNodeDead ? 'SEVERED' : 'BLE / P2P'}</span>
          </div>

          <div className={`p-2.5 rounded-xl border space-y-1 transition-all ${
            isNodeDead
              ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-slate-950 border-slate-800'
          }`}>
            <Radio className="w-5 h-5 mx-auto text-emerald-400 animate-pulse" />
            <span className="font-bold text-white block">{isNodeDead ? 'RELAY C (Drone)' : 'RELAY B (Base)'}</span>
            <span className="text-[9px] text-slate-500 font-mono">868 MHz LoRa</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <Server className="w-5 h-5 mx-auto text-amber-400" />
            <span className="font-bold text-white block">COMMAND HQ</span>
            <span className="text-[9px] text-slate-500 font-mono">EOC Terminal</span>
          </div>

        </div>
      </div>

      {/* "MESSAGE HAS A BRAIN" 10-STEP LIFECYCLE TRACKER */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
          MESSAGE HAS A BRAIN: 10-STAGE PACKET LIFECYCLE
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {packetLifecycle.map((stage, idx) => (
            <div
              key={idx}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5"
            >
              <span className="font-bold text-amber-400 text-[10px] block">{stage.label}</span>
              <p className="text-[9px] text-slate-400 truncate">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
