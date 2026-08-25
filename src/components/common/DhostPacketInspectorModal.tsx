import React, { useState } from 'react';
import { X, Copy, Check, FileText, Lock } from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const DhostPacketInspectorModal: React.FC = () => {
  const { 
    isPacketInspectorOpen,
    closePacketInspector, 
    selectedIncident 
  } = useDhostAuth();

  const [copied, setCopied] = useState(false);

  if (!isPacketInspectorOpen || !selectedIncident) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedIncident, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4 mx-auto animate-in zoom-in-95">
        
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">DHOST Emergency Packet Inspector</h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[10px] font-mono font-bold">
                  {selectedIncident.incidentId}
                </span>
              </div>
              <p className="text-xs text-slate-400">Asynchronous, Zero-Auth, Offline Mesh Encrypted Payload</p>
            </div>
          </div>
          <button
            onClick={closePacketInspector}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Zero-Auth Principle Banner */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-white">Anonymous Device Session: <span className="font-mono text-emerald-400">{selectedIncident.sessionToken}</span></p>
              <p className="text-[10px] text-slate-400">Generated locally without requiring email, password, or OTP.</p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            ZERO AUTH
          </span>
        </div>

        {/* DHOST Relay Path Visualizer */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300">DHOST Mesh Relay Path:</span>
            <span className="text-[11px] font-mono text-blue-400">{selectedIncident.hopCount} Hops ({selectedIncident.relayStatus})</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedIncident.dhostPath.map((node, i) => (
              <React.Fragment key={i}>
                <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono font-bold whitespace-nowrap ${
                  i === 0
                    ? 'bg-red-500/10 border-red-500/40 text-red-300'
                    : i === selectedIncident.dhostPath.length - 1
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {node}
                </div>
                {i < selectedIncident.dhostPath.length - 1 && (
                  <span className="text-slate-600 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Packet Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">AI Triage Classification</span>
            <p className="font-bold text-white">{selectedIncident.aiTriageCategory}</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-bold">Battery & GPS Accuracy</span>
            <p className="font-mono font-bold text-slate-200">
              {selectedIncident.batteryLevel}% Battery • ±{selectedIncident.location.accuracyMeters}m Accuracy
            </p>
          </div>
        </div>

        {/* Message Translation Panel */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Original ({selectedIncident.originalLanguage}):</span>
            <span className="text-xs font-bold text-blue-400">Auto-Translated (English)</span>
          </div>
          <p className="text-xs font-semibold text-white">{selectedIncident.translatedText}</p>
        </div>

        {/* Transmission & Audit Logs */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-slate-400">Transmission & Assignment Audit Log:</span>
          <div className="space-y-1 max-h-28 overflow-y-auto p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px]">
            {selectedIncident.logs.map((log, i) => (
              <div key={i} className="flex items-start justify-between gap-2 py-1 border-b border-slate-900 last:border-0">
                <div>
                  <span className="font-bold text-slate-200">{log.action}</span>
                  <p className="text-[10px] text-slate-500">Actor: {log.actor} {log.note && `• ${log.note}`}</p>
                </div>
                <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopyJSON}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Raw JSON!' : 'Copy Packet JSON'}</span>
          </button>

          <button
            onClick={closePacketInspector}
            className="py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
