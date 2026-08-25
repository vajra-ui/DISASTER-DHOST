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
  Navigation,
  Bot,
  Zap,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentPriority, IncidentStatus, EmergencyPacket } from '../../types/dhostAuth';
import { aiTriageService, DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';

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

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'FLOOD' | 'MEDICAL' | 'COMMUNITY' | 'UNASSIGNED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMapIncident, setSelectedMapIncident] = useState<EmergencyPacket | null>(null);
  const [aiDispatchedNotice, setAiDispatchedNotice] = useState<string | null>(null);

  // Audio chime on new incident
  useEffect(() => {
    if (incidents.length > 0) {
      playDispatchChime();
    }
  }, [incidents.length]);

  // AI-Sorted Incidents by Urgency
  const sortedIncidents = aiTriageService.sortIncidentsByUrgency(incidents);

  // Metrics
  const totalActive = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'RESCUED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const unassignedCount = incidents.filter(i => !i.assignedTeamId && i.status !== 'RESOLVED').length;
  const inProgressCount = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'ON_SCENE').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'RESCUED').length;

  // Filtered List
  const filteredIncidents = sortedIncidents.filter(inc => {
    if (filter === 'CRITICAL' && inc.priority !== 'CRITICAL') return false;
    if (filter === 'FLOOD' && inc.incidentType !== 'FLOOD_TRAPPED') return false;
    if (filter === 'MEDICAL' && inc.incidentType !== 'MEDICAL_CRITICAL') return false;
    if (filter === 'COMMUNITY' && !inc.isCommunityReport) return false;
    if (filter === 'UNASSIGNED' && (inc.assignedTeamId || inc.status === 'RESOLVED')) return false;
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

  // 1-Click AI Auto-Dispatch All
  const handleAiAutoDispatchAll = () => {
    let count = 0;
    incidents.forEach(inc => {
      if (!inc.assignedTeamId && inc.status !== 'RESOLVED') {
        const analysis = aiTriageService.analyzeIncident(inc);
        assignTeam(inc.incidentId, analysis.recommendedTeamId, analysis.recommendedTeamName);
        count++;
      }
    });

    if (count > 0) {
      playDispatchChime();
      setAiDispatchedNotice(`AI Auto-Dispatched ${count} units to critical incidents!`);
      setTimeout(() => setAiDispatchedNotice(null), 4000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-[1600px] mx-auto space-y-4 animate-in fade-in select-none">
      
      {/* 1. TOP EOC COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg font-black text-white">EOC Tactical Command Center</h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
                {currentUser?.responderId || 'CMD-001'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                {networkMode === 'ONLINE' ? 'LIVE SAT 4G' : 'OFFLINE LORA MESH'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.name || 'Capt. Rajesh Varma'} • {currentUser?.organization || 'NDRF'} District Operations Control
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {aiDispatchedNotice && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in zoom-in-95">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiDispatchedNotice}</span>
            </div>
          )}

          <button
            onClick={handleAiAutoDispatchAll}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Bot className="w-4 h-4" />
            <span>⚡ AI Auto-Dispatch All</span>
          </button>

          <button
            onClick={() => navigate('/network')}
            className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Mesh Topology</span>
          </button>

          <button
            onClick={() => resetIncidents()}
            title="Reset incident list to seed"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. THREE-COLUMN STRUCTURED OPERATING PICTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* ======================================================== */}
        {/* COLUMN 1: LEFT SIDEBAR (AI RADAR & DEPLOYED TEAMS) [3 COLS] */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* AI Priority Radar Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>AI Smart Triage Radar</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">REAL-TIME NLP</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              
              <div 
                onClick={() => setFilter('CRITICAL')}
                className={`p-3 rounded-2xl border cursor-pointer transition ${
                  filter === 'CRITICAL' ? 'bg-red-500/20 border-red-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-red-400 block uppercase">🔴 Critical Threat</span>
                <span className="text-xl font-black text-red-400">{criticalCount}</span>
                <span className="text-[10px] text-slate-500 block">Life-Safety P1</span>
              </div>

              <div 
                onClick={() => setFilter('UNASSIGNED')}
                className={`p-3 rounded-2xl border cursor-pointer transition ${
                  filter === 'UNASSIGNED' ? 'bg-amber-500/20 border-amber-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-amber-400 block uppercase">⚠️ Unassigned</span>
                <span className="text-xl font-black text-amber-400">{unassignedCount}</span>
                <span className="text-[10px] text-slate-500 block">Needs Unit</span>
              </div>

              <div 
                onClick={() => setFilter('ALL')}
                className={`p-3 rounded-2xl border cursor-pointer transition ${
                  filter === 'ALL' ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="text-[10px] font-bold text-blue-400 block uppercase">Active Rescues</span>
                <span className="text-xl font-black text-blue-400">{inProgressCount}</span>
                <span className="text-[10px] text-slate-500 block">In Progression</span>
              </div>

              <div 
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800"
              >
                <span className="text-[10px] font-bold text-emerald-400 block uppercase">🟢 Rescued Safe</span>
                <span className="text-xl font-black text-emerald-400">{resolvedCount}</span>
                <span className="text-[10px] text-slate-500 block">Resolved</span>
              </div>

            </div>
          </div>

          {/* Deployed Rescue Units Roster */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Deployed Rescue Units ({DEPLOYED_RESCUE_TEAMS.length})</span>
              </span>
            </div>

            <div className="space-y-2">
              {DEPLOYED_RESCUE_TEAMS.map(team => (
                <div 
                  key={team.teamId}
                  className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{team.name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      team.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-400' :
                      team.status === 'EN_ROUTE' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {team.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">{team.specialty}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>👥 {team.personnel} Personnel</span>
                    <span>📍 {team.currentLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: CENTER INCIDENT QUEUE FEED [5 COLS]            */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-3">
          
          {/* Quick Filter Tabs & Search Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-md">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                { id: 'ALL', label: 'All Incidents' },
                { id: 'CRITICAL', label: '🔴 Critical P1' },
                { id: 'UNASSIGNED', label: '⚠️ Unassigned' },
                { id: 'FLOOD', label: '🌊 Flood' },
                { id: 'MEDICAL', label: '🩺 Medical' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
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
                placeholder="Search victim ID, address, situation..."
                className="w-full py-2 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Incident Cards Stream */}
          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
                No incidents found matching this filter.
              </div>
            ) : (
              filteredIncidents.map(inc => {
                const analysis = aiTriageService.analyzeIncident(inc);

                return (
                  <div
                    key={inc.incidentId}
                    onClick={() => setSelectedMapIncident(inc)}
                    className={`p-4 rounded-3xl bg-slate-900 border transition cursor-pointer space-y-3 shadow-md ${
                      selectedMapIncident?.incidentId === inc.incidentId
                        ? 'border-amber-500 ring-2 ring-amber-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
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
                        <span className="text-xs font-black text-white">
                          {inc.incidentCategoryLabel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                          AI Urgency: {analysis.urgencyScore}%
                        </span>
                      </div>
                    </div>

                    {/* Distress Text */}
                    <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                      "{inc.translatedText || inc.requestText}"
                    </p>

                    {/* AI Smart Suggestion Pill */}
                    <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium text-[10px]">{analysis.reasoning}</span>
                      </div>
                      {!inc.assignedTeamId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            assignTeam(inc.incidentId, analysis.recommendedTeamId, analysis.recommendedTeamName);
                          }}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[10px] shrink-0"
                        >
                          Auto-Assign
                        </button>
                      )}
                    </div>

                    {/* Telemetry Strip */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono flex-wrap gap-2">
                      <span>📍 {inc.location?.address || 'Salem Disaster Sector'}</span>
                      <span>🔋 {inc.batteryLevel}% Battery</span>
                      <span>📡 {inc.hopCount} Hops</span>
                      <span>🕒 {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Action Controls Row */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80 flex-wrap" onClick={e => e.stopPropagation()}>
                      
                      {/* Priority Shift */}
                      <select
                        value={inc.priority}
                        onChange={e => updateIncidentPriority(inc.incidentId, e.target.value as IncidentPriority)}
                        className="py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-200 focus:outline-none"
                      >
                        <option value="CRITICAL">🔴 Priority: CRITICAL</option>
                        <option value="HIGH">🟡 Priority: HIGH</option>
                        <option value="MEDIUM">🔵 Priority: MEDIUM</option>
                        <option value="LOW">⚪ Priority: LOW</option>
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
                        className="py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-200 focus:outline-none"
                      >
                        <option value="">Dispatch: Unassigned</option>
                        <option value="RSC-1042">🚒 Rescue Alpha (RSC-1042)</option>
                        <option value="RSC-1088">🚤 Rescue Bravo (RSC-1088)</option>
                        <option value="MED-204">🩺 Med Triage 2 (MED-204)</option>
                        <option value="AIR-01">🚁 Helo Air-Lift (AIR-01)</option>
                      </select>

                      {/* Status Step Progression */}
                      <select
                        value={inc.status}
                        onChange={e => updateIncidentStatus(inc.incidentId, e.target.value as IncidentStatus)}
                        className="py-1.5 px-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-200 focus:outline-none"
                      >
                        <option value="REPORTED">Status: Reported</option>
                        <option value="ACKNOWLEDGED">Status: Acknowledged</option>
                        <option value="EN_ROUTE">Status: En Route</option>
                        <option value="ON_SCENE">Status: On Scene</option>
                        <option value="RESCUED">Status: Rescued</option>
                        <option value="RESOLVED">Status: Resolved</option>
                      </select>

                      {/* Packet Inspector Button */}
                      <button
                        onClick={() => openPacketInspector(inc)}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition ml-auto"
                        title="Inspect DHOST Cryptographic Packet"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: RIGHT INTERACTIVE TACTICAL GIS RADAR MAP [4 COLS] */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 space-y-3">
          
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="text-xs font-black text-white">Tactical GIS Satellite Radar</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">● LIVE TRACKING</span>
            </div>

            {/* Simulated Live Tactical Map Canvas / GIS View */}
            <div className="h-72 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3">
              
              {/* Grid Lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-60 pointer-events-none" />
              
              {/* Radar Sweep Animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-500/5 to-emerald-500/10 pointer-events-none animate-pulse" />

              {/* Map Pins */}
              <div className="relative z-10 space-y-1.5 overflow-y-auto max-h-56 pr-1">
                {incidents.slice(0, 4).map((inc, i) => (
                  <div
                    key={inc.incidentId}
                    onClick={() => setSelectedMapIncident(inc)}
                    className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                      selectedMapIncident?.incidentId === inc.incidentId
                        ? 'bg-amber-950/60 border-amber-500 text-white'
                        : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${inc.priority === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`} />
                      <div>
                        <p className="font-bold text-[11px]">{inc.incidentCategoryLabel}</p>
                        <p className="text-[9px] text-slate-400 font-mono">GPS: {inc.location?.lat.toFixed(4)}, {inc.location?.lng.toFixed(4)}</p>
                      </div>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${inc.location?.lat},${inc.location?.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded bg-slate-800 text-blue-400 font-mono text-[10px] hover:bg-slate-700"
                      onClick={e => e.stopPropagation()}
                    >
                      Maps ↗
                    </a>
                  </div>
                ))}
              </div>

              {/* Map Footer status */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
                <span>Sector: Salem Urban Emergency Grid</span>
                <span>Zoom: High Precision</span>
              </div>
            </div>

            {/* Selected Target Detail Focus */}
            {selectedMapIncident ? (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white">Focused Target Beacon:</span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedMapIncident.incidentId}</span>
                </div>
                <p className="text-xs text-slate-300">{selectedMapIncident.requestText}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Assigned: {selectedMapIncident.assignedTeamName || 'None'}</span>
                  <span>Status: {selectedMapIncident.status}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs">
                Click any incident above to inspect its live GIS coordinates.
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
