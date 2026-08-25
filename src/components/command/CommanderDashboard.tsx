import React, { useState } from 'react';
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
  Network
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
    openPacketInspector
  } = useDhostAuth();

  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'FLOOD' | 'MEDICAL' | 'COMMUNITY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const totalActive = incidents.filter(i => i.status !== 'COMPLETED' && i.status !== 'SAFE_BROADCAST').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'COMPLETED').length;
  const inProgressCount = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'ON_SCENE').length;
  const communityCount = incidents.filter(i => i.isCommunityReport).length;

  const filteredIncidents = incidents.filter(inc => {
    if (filter === 'CRITICAL' && inc.priority !== 'CRITICAL') return false;
    if (filter === 'FLOOD' && inc.incidentType !== 'FLOOD_TRAPPED') return false;
    if (filter === 'MEDICAL' && inc.incidentType !== 'MEDICAL_CRITICAL') return false;
    if (filter === 'COMMUNITY' && !inc.isCommunityReport) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.incidentId.toLowerCase().includes(q) ||
        inc.location.address.toLowerCase().includes(q) ||
        inc.requestText.toLowerCase().includes(q) ||
        inc.incidentCategoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Banner with Commander Credentials & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">EOC Tactical Command Center</h1>
              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                {currentUser?.responderId || 'CMD-001'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.name || 'Capt. Rajesh Varma'} • {currentUser?.organization || 'NDRF'} Operation Division
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/network')}
            className="px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Network className="w-4 h-4" />
            <span>DHOST Mesh Topology</span>
          </button>
          <button
            onClick={() => navigate('/simulation')}
            className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Play className="w-4 h-4" />
            <span>Disaster Simulation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Active Incidents</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalActive}</span>
            <span className="text-[10px] text-slate-500">In Queue</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/30 bg-red-950/20 space-y-1">
          <span className="text-[11px] font-bold text-red-400 uppercase">Critical / Immediate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-400">{criticalCount}</span>
            <span className="text-[10px] text-red-300/70">Life-Threat</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 bg-blue-950/20 space-y-1">
          <span className="text-[11px] font-bold text-blue-400 uppercase">Rescues In Progress</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400">{inProgressCount}</span>
            <span className="text-[10px] text-blue-300/70">Teams Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 bg-purple-950/20 space-y-1">
          <span className="text-[11px] font-bold text-purple-400 uppercase">Community Reports</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400">{communityCount}</span>
            <span className="text-[10px] text-purple-300/70">Crowd-Sourced</span>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Incidents' },
              { id: 'CRITICAL', label: '🔴 Critical' },
              { id: 'FLOOD', label: '🏊 Flood Trapped' },
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
              placeholder="Search by ID, landmark, text..."
              className="w-full sm:w-64 py-1.5 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredIncidents.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No emergency incidents match this filter.
            </div>
          ) : (
            filteredIncidents.map(inc => (
              <div
                key={inc.incidentId}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-white">
                      {inc.incidentId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      inc.priority === 'CRITICAL'
                        ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                        : inc.priority === 'HIGH'
                        ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                        : 'bg-blue-500/20 border border-blue-500/50 text-blue-400'
                    }`}>
                      {inc.priority}
                    </span>
                    {inc.isCommunityReport && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/50 text-purple-300 text-[10px] font-bold">
                        COMMUNITY REPORT
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-slate-300">
                      {inc.incidentCategoryLabel} ({inc.peopleCount} People)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    {inc.translatedText || inc.requestText}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 flex-wrap">
                    <span>📍 {inc.location.address}</span>
                    <span>🔋 {inc.batteryLevel}% Battery</span>
                    <span>📡 {inc.hopCount} Hops via {inc.dhostPath[0]}</span>
                    <span>🕒 {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={inc.priority}
                    onChange={e => updateIncidentPriority(inc.incidentId, e.target.value as IncidentPriority)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                  >
                    <option value="CRITICAL">Priority: CRITICAL</option>
                    <option value="HIGH">Priority: HIGH</option>
                    <option value="MEDIUM">Priority: MEDIUM</option>
                    <option value="LOW">Priority: LOW</option>
                  </select>

                  <select
                    value={inc.assignedTeam?.teamId || ''}
                    onChange={e => {
                      if (e.target.value === 'RSC-1042') assignTeam(inc.incidentId, 'RSC-1042', 'Rescue Alpha (Sgt. Sen)');
                      else if (e.target.value === 'RSC-1088') assignTeam(inc.incidentId, 'RSC-1088', 'Rescue Bravo (Insp. Murugan)');
                      else if (e.target.value === 'MED-204') assignTeam(inc.incidentId, 'MED-204', 'Medical Rapid (Dr. Raghavan)');
                      else if (e.target.value === 'AIR-01') assignTeam(inc.incidentId, 'AIR-01', 'Coast Guard Air Medevac');
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                  >
                    <option value="">Assign Team...</option>
                    <option value="RSC-1042">🚒 Rescue Alpha (RSC-1042)</option>
                    <option value="RSC-1088">🚤 Rescue Bravo (RSC-1088)</option>
                    <option value="MED-204">🩺 Medical Rapid (MED-204)</option>
                    <option value="AIR-01">🚁 Air Medevac (AIR-01)</option>
                  </select>

                  <select
                    value={inc.status}
                    onChange={e => updateIncidentStatus(inc.incidentId, e.target.value as IncidentStatus)}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none"
                  >
                    <option value="PENDING_DISPATCH">Status: Pending</option>
                    <option value="ACKNOWLEDGED">Status: Acknowledged</option>
                    <option value="EN_ROUTE">Status: En Route</option>
                    <option value="ON_SCENE">Status: On Scene</option>
                    <option value="RESCUED">Status: Rescued</option>
                    <option value="COMPLETED">Status: Completed</option>
                  </select>

                  <button
                    onClick={() => openPacketInspector(inc)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
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

    </div>
  );
};
