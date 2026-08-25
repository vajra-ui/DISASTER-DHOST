import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertOctagon, 
  Radio, 
  Users, 
  Ambulance, 
  CheckCircle2, 
  Activity, 
  Search, 
  FileText, 
  Flame, 
  Play, 
  Network,
  RefreshCw,
  MapPin,
  Clock,
  Battery,
  Send,
  Sparkles,
  Phone,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentPriority, IncidentStatus } from '../../types/dhostAuth';

export const CommanderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    incidents, 
    assignTeam, 
    updateIncidentPriority, 
    updateIncidentStatus, 
    openPacketInspector,
    playDispatchChime,
    networkMode,
    resetIncidents
  } = useDhostAuth();

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'FLOOD' | 'MEDICAL' | 'COMMUNITY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'INCIDENTS' | 'MAP_VIEW' | 'TEAMS'>('INCIDENTS');

  // Audio chime on new incident arrivals
  useEffect(() => {
    if (incidents.length > 0) {
      playDispatchChime();
    }
  }, [incidents.length]);

  const totalActive = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'RESCUED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const inProgressCount = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'ON_SCENE').length;
  const communityCount = incidents.filter(i => i.isCommunityReport).length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'RESCUED').length;

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'CRITICAL' && inc.priority !== 'CRITICAL') return false;
    if (filter === 'FLOOD' && inc.incidentType !== 'FLOOD_TRAPPED') return false;
    if (filter === 'MEDICAL' && inc.incidentType !== 'MEDICAL_CRITICAL') return false;
    if (filter === 'COMMUNITY' && !inc.isCommunityReport) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (inc.incidentId || '').toLowerCase().includes(q) ||
        (inc.location?.address || '').toLowerCase().includes(q) ||
        (inc.location?.landmark || '').toLowerCase().includes(q) ||
        (inc.requestText || '').toLowerCase().includes(q) ||
        (inc.incidentCategoryLabel || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-7xl mx-auto space-y-5 animate-in fade-in select-none">
      
      {/* 1. TOP EOC COMMANDER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-13 h-13 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 p-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-white">EOC Tactical Command Center</h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                {currentUser?.responderId || 'CMD-001'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {networkMode === 'ONLINE' ? 'LIVE SAT 4G' : 'OFFLINE LORA MESH'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentUser?.name || 'Capt. Rajesh Varma'} • {currentUser?.organization || 'NDRF'} {currentUser?.unitDesignation || 'District Incident Command HQ'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/network')}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Network className="w-4 h-4" />
            <span>Mesh Topology</span>
          </button>

          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Play className="w-4 h-4" />
            <span>Simulation Mode</span>
          </button>

          <button
            onClick={() => resetIncidents()}
            title="Reset to default seed incidents"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Incidents</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{incidents.length}</span>
            <span className="text-[10px] text-slate-500">Tracked</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/40 bg-red-950/20 space-y-1">
          <span className="text-[11px] font-bold text-red-400 uppercase">🔴 Critical Life-Threat</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-400">{criticalCount}</span>
            <span className="text-[10px] text-red-300/70">Urgent</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/40 bg-blue-950/20 space-y-1">
          <span className="text-[11px] font-bold text-blue-400 uppercase">Rescues In Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400">{inProgressCount}</span>
            <span className="text-[10px] text-blue-300/70">Teams Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/40 bg-purple-950/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-400 uppercase">Community Reports</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400">{communityCount}</span>
            <span className="text-[10px] text-purple-300/70">Crowd-Sourced</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 bg-emerald-950/20 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-emerald-400 uppercase">Rescued / Safe</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">{resolvedCount}</span>
            <span className="text-[10px] text-emerald-300/70">Completed</span>
          </div>
        </div>

      </div>

      {/* 3. VIEW TOGGLE BAR (Incident Feed vs Field Map vs Deployed Units) */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('INCIDENTS')}
            className={`py-1.5 px-3 rounded-xl text-xs font-black transition ${
              activeTab === 'INCIDENTS' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            📋 Live Incidents Queue ({filteredIncidents.length})
          </button>
          <button
            onClick={() => setActiveTab('MAP_VIEW')}
            className={`py-1.5 px-3 rounded-xl text-xs font-black transition ${
              activeTab === 'MAP_VIEW' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🗺️ Tactical Incident Map
          </button>
          <button
            onClick={() => setActiveTab('TEAMS')}
            className={`py-1.5 px-3 rounded-xl text-xs font-black transition ${
              activeTab === 'TEAMS' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            🚒 Deployed Rescue Units (4)
          </button>
        </div>
      </div>

      {/* TAB 1: INCIDENT QUEUE */}
      {activeTab === 'INCIDENTS' && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Incidents' },
                { id: 'CRITICAL', label: '🔴 Critical' },
                { id: 'FLOOD', label: '🌊 Flood Trapped' },
                { id: 'MEDICAL', label: '🩺 Medical' },
                { id: 'COMMUNITY', label: '🤝 Community Reports' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    filter === tab.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by ID, location, details..."
                className="w-full sm:w-64 py-2 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-3" />
            </div>
          </div>

          <div className="space-y-3">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No emergency incidents match this filter.
              </div>
            ) : (
              filteredIncidents.map(inc => (
                <div
                  key={inc.incidentId}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {inc.incidentId}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        inc.priority === 'CRITICAL'
                          ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                          : inc.priority === 'HIGH'
                          ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                          : 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                      }`}>
                        {inc.priority}
                      </span>
                      {inc.isCommunityReport && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-black">
                          COMMUNITY REPORT
                        </span>
                      )}
                      <span className="text-xs font-bold text-white">
                        {inc.incidentCategoryLabel} ({inc.peopleCount} {inc.peopleCount === 1 ? 'Person' : 'People'})
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      "{inc.translatedText || inc.requestText}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap font-mono">
                      <span>📍 {inc.location?.address || 'Salem Impact Zone'}</span>
                      <span>🔋 {inc.batteryLevel}% Battery</span>
                      <span>📡 {inc.hopCount} Hops via {inc.dhostPath?.[0] || 'Mesh Relay'}</span>
                      <span>🕒 {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {inc.assignedTeamName && (
                        <span className="text-emerald-400 font-bold">🚒 Assigned: {inc.assignedTeamName}</span>
                      )}
                    </div>
                  </div>

                  {/* Operational Controls for Commander */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    
                    {/* Priority Selector */}
                    <select
                      value={inc.priority}
                      onChange={e => updateIncidentPriority(inc.incidentId, e.target.value as IncidentPriority)}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                    >
                      <option value="CRITICAL">🔴 CRITICAL</option>
                      <option value="HIGH">🟡 HIGH</option>
                      <option value="MEDIUM">🔵 MEDIUM</option>
                      <option value="LOW">⚪ LOW</option>
                    </select>

                    {/* Team Dispatch Assigner */}
                    <select
                      value={inc.assignedTeamId || ''}
                      onChange={e => {
                        if (e.target.value === 'RSC-1042') assignTeam(inc.incidentId, 'RSC-1042', 'Rescue Alpha (Sgt. Sen)');
                        else if (e.target.value === 'RSC-1088') assignTeam(inc.incidentId, 'RSC-1088', 'Rescue Bravo (Insp. Murugan)');
                        else if (e.target.value === 'MED-204') assignTeam(inc.incidentId, 'MED-204', 'Med Triage 2 (Dr. Raghavan)');
                        else if (e.target.value === 'AIR-01') assignTeam(inc.incidentId, 'AIR-01', 'Coast Guard Helo Air-1');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                    >
                      <option value="">Dispatch: Unassigned</option>
                      <option value="RSC-1042">🚒 Rescue Alpha (RSC-1042)</option>
                      <option value="RSC-1088">🚤 Rescue Bravo (RSC-1088)</option>
                      <option value="MED-204">🩺 Med Triage 2 (MED-204)</option>
                      <option value="AIR-01">🚁 Helo Air-Lift (AIR-01)</option>
                    </select>

                    {/* Status Progression */}
                    <select
                      value={inc.status}
                      onChange={e => updateIncidentStatus(inc.incidentId, e.target.value as IncidentStatus)}
                      className="py-2 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                    >
                      <option value="REPORTED">Status: Reported</option>
                      <option value="ACKNOWLEDGED">Status: Acknowledged</option>
                      <option value="EN_ROUTE">Status: En Route</option>
                      <option value="ON_SCENE">Status: On Scene</option>
                      <option value="RESCUED">Status: Rescued</option>
                      <option value="STABILIZED">Status: Stabilized</option>
                      <option value="RESOLVED">Status: Resolved</option>
                    </select>

                    {/* Packet Inspector Button */}
                    <button
                      onClick={() => openPacketInspector(inc)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                      title="Inspect DHOST Cryptographic Packet"
                    >
                      <FileText className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: TACTICAL FIELD MAP */}
      {activeTab === 'MAP_VIEW' && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">Live Tactical GIS Geospatial View</h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">● High Accuracy GPS Pins</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incidents.map(inc => (
              <div
                key={inc.incidentId}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">{inc.incidentCategoryLabel}</span>
                  <span className="text-[10px] font-mono text-amber-400">{inc.incidentId}</span>
                </div>
                <p className="text-[11px] text-slate-400">{inc.location?.address || 'Salem Impact Area'}</p>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                  <span>GPS: {inc.location?.lat.toFixed(4)}, {inc.location?.lng.toFixed(4)}</span>
                  <a
                    href={`https://maps.google.com/?q=${inc.location?.lat},${inc.location?.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline font-bold"
                  >
                    Open Google Maps ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEPLOYED RESCUE UNITS */}
      {activeTab === 'TEAMS' && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-black text-white">Field Rescue Units Status</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">🚒 Rescue Alpha (RSC-1042)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">ACTIVE FIELD</span>
              </div>
              <p className="text-xs text-slate-400">Leader: Sgt. Ananya Sen • 6 Paramedics, 2 Inflatable Boats</p>
              <p className="text-[11px] text-slate-500 font-mono">Location: Near Fairlands Junction (Mesh Hop 1)</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">🚤 Rescue Bravo (RSC-1088)</span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold">ON SCENE</span>
              </div>
              <p className="text-xs text-slate-400">Leader: Insp. Murugan • Flood Evacuation Unit 4</p>
              <p className="text-[11px] text-slate-500 font-mono">Location: Lakeview Road Submerged Area</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">🩺 Mobile Medical Triage (MED-204)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">OPERATIONAL</span>
              </div>
              <p className="text-xs text-slate-400">Leader: Dr. K. Raghavan • Red Cross Rapid Trauma Tent</p>
              <p className="text-[11px] text-slate-500 font-mono">Location: Anna Park Relief Camp</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">🚁 Coast Guard Helo Air-Lift (AIR-01)</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-bold">STANDBY</span>
              </div>
              <p className="text-xs text-slate-400">Pilot: Wing Cmdr. Joseph • Rooftop Winch Medevac</p>
              <p className="text-[11px] text-slate-500 font-mono">Helipad: Salem District Sports Complex</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
