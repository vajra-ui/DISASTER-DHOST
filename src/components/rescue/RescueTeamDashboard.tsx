import React, { useState } from 'react';
import { 
  Shield, 
  MapPin, 
  Users, 
  Radio, 
  Navigation, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Send,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentStatus } from '../../types/dhostAuth';

export const RescueTeamDashboard: React.FC = () => {
  const { 
    currentUser, 
    incidents, 
    updateIncidentStatus, 
    openPacketInspector,
    networkMode 
  } = useDhostAuth();

  const [fieldNote, setFieldNote] = useState('');
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'ALL'>('ACTIVE');

  // Filter incidents assigned to this rescue team or in pending queue
  const assignedIncidents = incidents.filter(
    i => (i.assignedTeamId === currentUser?.responderId || i.status === 'REPORTED' || i.status === 'ACKNOWLEDGED') && i.status !== 'RESOLVED'
  );

  const activeIncident = assignedIncidents[0] || incidents[0];

  const handleStatusChange = (status: IncidentStatus) => {
    if (!activeIncident) return;
    updateIncidentStatus(activeIncident.incidentId, status, fieldNote);
    setFieldNote('');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 max-w-lg mx-auto space-y-4 animate-in fade-in">
      
      {/* Team Header & Status */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-bold text-white">{currentUser?.responderId || 'RSC-1042'}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold">RESCUE ALPHA</span>
            </div>
            <p className="text-xs text-slate-400">{currentUser?.name || 'Sgt. Ananya Sen'}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DISPATCH ACTIVE</span>
          </span>
          <p className="text-[10px] text-slate-400">{networkMode !== 'ONLINE' ? 'OFFLINE TRUSTED' : 'ONLINE'}</p>
        </div>
      </div>

      {/* Main Focus: Active Primary Dispatch */}
      {activeIncident ? (
        <div className="p-5 rounded-3xl bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4">
          
          {/* Dispatch Header */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">PRIMARY TARGET DISPATCH</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-lg font-black text-white">{activeIncident.incidentCategoryLabel}</h2>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  activeIncident.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {activeIncident.priority}
                </span>
              </div>
            </div>

            <button
              onClick={() => openPacketInspector(activeIncident)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              title="Inspect DHOST Packet"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">{activeIncident.incidentId}</span>
            </button>
          </div>

          {/* AI Auto-Translated Distress Message */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Distress Transmission ({activeIncident.originalLanguage}):</span>
              <span className="text-blue-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-Translated
              </span>
            </div>
            <p className="text-xs font-semibold text-white leading-relaxed">
              "{activeIncident.translatedText || activeIncident.requestText}"
            </p>
          </div>

          {/* Target Location & Tactical Telemetry */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">GPS Landmark</span>
              <p className="font-bold text-slate-200">{activeIncident.location?.address || 'Disaster Area'}</p>
              <span className="text-[10px] text-blue-400 font-mono">±{activeIncident.location?.accuracyMeters || 5}m Accuracy</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Casualty Count</span>
              <p className="text-base font-black text-white">{activeIncident.peopleCount} People</p>
              <span className="text-[10px] text-amber-400 font-mono">Battery: {activeIncident.batteryLevel}%</span>
            </div>
          </div>

          {/* Dispatch Step Progression Buttons */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-400">Response Progression:</span>
            
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleStatusChange('ACKNOWLEDGED')}
                className={`py-2.5 px-2 rounded-xl text-[11px] font-black border transition ${
                  activeIncident.status === 'ACKNOWLEDGED'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                1. Acknowledge
              </button>

              <button
                onClick={() => handleStatusChange('EN_ROUTE')}
                className={`py-2.5 px-2 rounded-xl text-[11px] font-black border transition ${
                  activeIncident.status === 'EN_ROUTE'
                    ? 'bg-amber-600 border-amber-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                2. En Route
              </button>

              <button
                onClick={() => handleStatusChange('ON_SCENE')}
                className={`py-2.5 px-2 rounded-xl text-[11px] font-black border transition ${
                  activeIncident.status === 'ON_SCENE'
                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                3. On Scene
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleStatusChange('RESCUED')}
                className={`py-3 px-3 rounded-2xl text-xs font-black border flex items-center justify-center gap-1.5 transition ${
                  activeIncident.status === 'RESCUED'
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>4. Victims Rescued</span>
              </button>

              <button
                onClick={() => handleStatusChange('COMPLETED')}
                className={`py-3 px-3 rounded-2xl text-xs font-black border flex items-center justify-center gap-1.5 transition ${
                  activeIncident.status === 'COMPLETED'
                    ? 'bg-slate-700 border-slate-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>5. Mission Complete</span>
              </button>
            </div>
          </div>

          {/* Add Field Note */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-400">Append Tactical Field Note:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fieldNote}
                onChange={e => setFieldNote(e.target.value)}
                placeholder="e.g., Inflatable boat deployed, 4 individuals safe"
                className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => {
                  if (fieldNote.trim()) {
                    updateIncidentStatus(activeIncident.incidentId, activeIncident.status, fieldNote);
                    setFieldNote('');
                  }
                }}
                className="py-2 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">All Assigned Missions Completed</h3>
          <p className="text-xs text-slate-400">Stand by for new mesh beacon dispatches from Command Center.</p>
        </div>
      )}

      {/* Secondary Incidents in Queue */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <span className="text-xs font-bold text-slate-300">All Nearby Unassigned Incidents:</span>
        <div className="space-y-2">
          {incidents.slice(0, 3).map(inc => (
            <div
              key={inc.incidentId}
              onClick={() => openPacketInspector(inc)}
              className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 cursor-pointer transition"
            >
              <div>
                <p className="text-xs font-bold text-white">{inc.incidentCategoryLabel} ({inc.peopleCount} People)</p>
                <p className="text-[10px] text-slate-400">{inc.location.address} • {inc.priority}</p>
              </div>
              <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300">
                {inc.incidentId}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

