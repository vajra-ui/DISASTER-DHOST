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
  Check,
  Compass,
  AlertOctagon,
  LifeBuoy
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentStatus } from '../../types/dhostAuth';
import { EmergencyPacketCard } from '../common/EmergencyPacketCard';
import { DhostPathVisualizer } from '../common/DhostPathVisualizer';

export const RescueTeamDashboard: React.FC = () => {
  const { 
    currentUser, 
    incidents, 
    updateIncidentStatus, 
    openPacketInspector,
    networkMode 
  } = useDhostAuth();

  const [fieldNote, setFieldNote] = useState('');
  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'ROUTE' | 'PACKET' | 'PATH'>('DISPATCH');
  const [selectedRoute, setSelectedRoute] = useState<'SAFE' | 'FLOOD' | 'BLOCKED'>('SAFE');
  const [rescuerStatus, setRescuerStatus] = useState<'SAFE' | 'BACKUP' | 'CRISIS'>('SAFE');

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
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 max-w-lg mx-auto space-y-4 animate-in fade-in select-none">
      
      {/* 1. TEAM HEADER & RESCUER SAFETY STATUS */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
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

        {/* Rescuer Safety Status Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <span className="text-[10px] text-slate-400 font-bold uppercase">TEAM SAFETY:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setRescuerStatus('SAFE')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                rescuerStatus === 'SAFE' ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              🟢 SAFE
            </button>
            <button
              onClick={() => setRescuerStatus('BACKUP')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                rescuerStatus === 'BACKUP' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              🟠 NEED BACKUP
            </button>
            <button
              onClick={() => setRescuerStatus('CRISIS')}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                rescuerStatus === 'CRISIS' ? 'bg-red-500 text-white font-black animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}
            >
              🔴 MAYDAY
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-[10px] font-bold">
        <button
          onClick={() => setActiveTab('DISPATCH')}
          className={`py-1.5 rounded-xl transition ${activeTab === 'DISPATCH' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
        >
          🚨 Target
        </button>
        <button
          onClick={() => setActiveTab('ROUTE')}
          className={`py-1.5 rounded-xl transition ${activeTab === 'ROUTE' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
        >
          🚦 Route AI
        </button>
        <button
          onClick={() => setActiveTab('PACKET')}
          className={`py-1.5 rounded-xl transition ${activeTab === 'PACKET' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
        >
          📜 Packet
        </button>
        <button
          onClick={() => setActiveTab('PATH')}
          className={`py-1.5 rounded-xl transition ${activeTab === 'PATH' ? 'bg-blue-600 text-white font-black' : 'text-slate-400 hover:text-white'}`}
        >
          📡 Hops
        </button>
      </div>

      {/* TAB 1: ACTIVE PRIMARY DISPATCH */}
      {activeTab === 'DISPATCH' && activeIncident && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-blue-500/40 shadow-2xl space-y-4 animate-in fade-in">
          
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider">PRIMARY TARGET DISPATCH</span>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-lg font-black text-white">{activeIncident.incidentCategoryLabel}</h2>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  activeIncident.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {activeIncident.priority}
                </span>
              </div>
            </div>

            <button
              onClick={() => openPacketInspector(activeIncident)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[10px] font-mono">{activeIncident.incidentId}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Distress Payload:</span>
              <span className="text-blue-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-Translated
              </span>
            </div>
            <p className="text-xs font-semibold text-white leading-relaxed">
              "{activeIncident.translatedText || activeIncident.requestText}"
            </p>
          </div>

          {/* Location & Fusion */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">GPS Landmark</span>
              <p className="font-bold text-slate-200">{activeIncident.location?.address || 'Disaster Area'}</p>
              <span className="text-[10px] text-emerald-400 font-mono">🟢 ±{activeIncident.location?.accuracyMeters || 12}m (HIGH)</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Casualty Count</span>
              <p className="text-base font-black text-white">{activeIncident.peopleCount} People</p>
              <span className="text-[10px] text-amber-400 font-mono">Battery: {activeIncident.batteryLevel}%</span>
            </div>
          </div>

          {/* Progression Actions */}
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
                1. Accept
              </button>

              <button
                onClick={() => handleStatusChange('EN_ROUTE')}
                className={`py-2.5 px-2 rounded-xl text-[11px] font-black border transition ${
                  activeIncident.status === 'EN_ROUTE'
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg'
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

            <button
              onClick={() => handleStatusChange('RESCUED')}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 mt-2 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>4. MARK RESCUE COMPLETE / VICTIM EVACUATED</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: RESCUE ROUTE SAFETY INTELLIGENCE */}
      {activeTab === 'ROUTE' && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Rescue Route Safety Intelligence</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">GIS TERRAIN SCAN</span>
          </div>

          <div className="space-y-2.5">
            
            {/* Route 1: Safe Route */}
            <div 
              onClick={() => setSelectedRoute('SAFE')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                selectedRoute === 'SAFE' ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-emerald-400">🟢 SAFE ROUTE (RECOMMENDED)</span>
                <span className="text-xs font-mono font-bold text-white">4.8 km • 12 min</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Via Fairlands High Ground Boulevard. Zero flood inundation, cleared power lines.
              </p>
            </div>

            {/* Route 2: Flood-Exposed */}
            <div 
              onClick={() => setSelectedRoute('FLOOD')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                selectedRoute === 'FLOOD' ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20' : 'bg-slate-950 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-amber-400">🟠 FLOOD-EXPOSED ROUTE</span>
                <span className="text-xs font-mono font-bold text-white">3.1 km • 8 min</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Via Lakeview Causeway. Waterlogged ~2.5 ft. Requires inflatable boat or high-clearance truck.
              </p>
            </div>

            {/* Route 3: Blocked */}
            <div 
              className="p-3.5 rounded-2xl bg-slate-950 border border-red-500/30 opacity-70 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xs text-red-400">🔴 BLOCKED / IMPASSABLE</span>
                <span className="text-xs font-mono font-bold text-slate-500">2.2 km • CLOSED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Downed 11kV electrical wire and bridge structural debris.
              </p>
            </div>

          </div>

          <a
            href={`https://maps.google.com/?q=${activeIncident?.location?.lat},${activeIncident?.location?.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition mt-2"
          >
            <Navigation className="w-4 h-4" />
            <span>Launch Google Maps GPS Turn-by-Turn</span>
          </a>
        </div>
      )}

      {/* TAB 3: PACKET INTEL */}
      {activeTab === 'PACKET' && activeIncident && (
        <div className="animate-in fade-in">
          <EmergencyPacketCard packet={activeIncident} />
        </div>
      )}

      {/* TAB 4: HOPS */}
      {activeTab === 'PATH' && activeIncident && (
        <div className="animate-in fade-in">
          <DhostPathVisualizer packet={activeIncident} />
        </div>
      )}

    </div>
  );
};
