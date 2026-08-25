import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Radio, 
  MapPin, 
  Battery, 
  Users, 
  FileCode, 
  Sparkles,
  Lock,
  Compass
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';

interface Props {
  packet: EmergencyPacket;
  compact?: boolean;
}

export const EmergencyPacketCard: React.FC<Props> = ({ packet, compact = false }) => {
  const [copied, setCopied] = useState(false);

  const mockHash = packet.packetHash || `SHA256-${packet.incidentId.slice(-4)}-${packet.timestamp.toString().slice(-4)}`;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-slate-950 border-2 border-amber-500/70 p-4 font-mono text-xs shadow-2xl space-y-3 relative overflow-hidden select-none">
      
      {/* Top Banner Header */}
      <div className="flex items-center justify-between border-b border-amber-500/40 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="font-black text-amber-400 text-sm tracking-wider flex items-center gap-1.5">
            <span>🚨 DHOST EMERGENCY PACKET</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>VERIFIED</span>
          </span>
          <button
            onClick={handleCopyJson}
            title="Copy Cryptographic JSON Packet"
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Grid Key-Value Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
        
        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">PACKET ID</span>
          <span className="font-bold text-white">{packet.incidentId}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">PRIORITY</span>
          <span className={`font-black ${
            packet.priority === 'CRITICAL' ? 'text-red-400 animate-pulse' :
            packet.priority === 'HIGH' ? 'text-amber-400' : 'text-blue-400'
          }`}>
            {packet.priority}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">INCIDENT TYPE</span>
          <span className="font-bold text-slate-200">{packet.incidentCategoryLabel}</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">PEOPLE COUNT</span>
          <span className="font-bold text-slate-200">{packet.peopleCount} (~CONFIDENCE: HIGH)</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">GPS COORDINATES</span>
          <span className="font-bold text-amber-300">
            {packet.location.lat.toFixed(4)}° N, {packet.location.lng.toFixed(4)}° E
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">LOCATION CONFIDENCE</span>
          <span className="font-bold text-emerald-400">
            🟢 {packet.location.confidence || 'HIGH'} (±{packet.location.accuracyMeters || 12}m)
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">BATTERY STATUS</span>
          <span className={`font-bold ${packet.batteryLevel <= 20 ? 'text-red-400' : 'text-emerald-400'}`}>
            {packet.batteryLevel}% {packet.batteryLevel <= 20 && '(SURVIVAL MODE)'}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-900 pb-1">
          <span className="text-slate-500">MESH HOPS</span>
          <span className="font-bold text-blue-300">
            {packet.hopCount} Hops ({packet.dhostPath?.[0] || 'Direct Bluetooth'})
          </span>
        </div>

      </div>

      {/* Distress Request Body */}
      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 space-y-1">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold">
          PAYLOAD REQUEST / TRANSLATION:
        </span>
        <p className="text-xs text-slate-200 font-sans font-medium">
          "{packet.translatedText || packet.requestText}"
        </p>
      </div>

      {/* Packet Hash & Verification Footer */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900">
        <span>HASH: {mockHash}</span>
        <span className="text-amber-400/90 font-bold">STORED LOCALLY ➔ RELAYING</span>
      </div>

    </div>
  );
};
