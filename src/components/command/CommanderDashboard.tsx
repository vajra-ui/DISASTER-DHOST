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
  Check,
  Brain,
  Layers,
  HelpCircle,
  Compass,
  AlertTriangle,
  Heart,
  Truck,
  Anchor,
  ArrowRight,
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentPriority, IncidentStatus, EmergencyPacket, IncidentCluster } from '../../types/dhostAuth';
import { aiTriageService, DEPLOYED_RESCUE_TEAMS } from '../../services/aiTriageService';
import { ActNowModal } from './ActNowModal';
import { IncidentDigitalTwinModal } from './IncidentDigitalTwinModal';
import { TacticalMapWorkspace } from './TacticalMapWorkspace';
import { WhatIfSimulatorModal } from './WhatIfSimulatorModal';
import { ExplainableAiModal } from './ExplainableAiModal';
import { RescuerLiveGpsModal } from './RescuerLiveGpsModal';
import { Dhost3DDigitalTwin } from '../digitaltwin/Dhost3DDigitalTwin';

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

  // Navigation Tabs
  const [activeNavTab, setActiveNavTab] = useState<'SITUATION' | 'QUEUE' | 'MAP' | 'TEAMS' | 'WHAT_IF'>('SITUATION');
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'UNASSIGNED' | 'FLOOD' | 'CLUSTERS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Packet Modals
  const [actNowPacket, setActNowPacket] = useState<EmergencyPacket | null>(null);
  const [digitalTwinPacket, setDigitalTwinPacket] = useState<EmergencyPacket | null>(null);
  const [selectedGpsPacket, setSelectedGpsPacket] = useState<EmergencyPacket | null>(null);
  const [isLiveGpsModalOpen, setIsLiveGpsModalOpen] = useState(false);
  const [xaiPacket, setXaiPacket] = useState<EmergencyPacket | null>(null);
  const [isXaiOpen, setIsXaiOpen] = useState(false);
  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isTacticalMapOpen, setIsTacticalMapOpen] = useState(false);
  const [is3DDigitalTwinOpen, setIs3DDigitalTwinOpen] = useState(false);

  // Mayday / Copilot State
  const [maydayDismissed, setMaydayDismissed] = useState(false);
  const [aiDispatchedNotice, setAiDispatchedNotice] = useState<string | null>(null);

  // Audio chime on new incident
  useEffect(() => {
    if (incidents.length > 0) {
      playDispatchChime();
    }
  }, [incidents.length]);

  // AI-Sorted Incidents
  const sortedIncidents = aiTriageService.sortIncidentsByUrgency(incidents);
  const clusters: IncidentCluster[] = aiTriageService.clusterIncidents(incidents, 250);

  // Metrics
  const totalActive = incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'RESCUED').length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const unassignedCount = incidents.filter(i => !i.assignedTeamId && i.status !== 'RESOLVED').length;
  const inProgressCount = incidents.filter(i => i.status === 'EN_ROUTE' || i.status === 'ON_SCENE').length;
  const totalPeopleAffected = incidents.reduce((sum, i) => sum + i.peopleCount, 0);

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

  const filteredIncidents = sortedIncidents.filter(inc => {
    if (filter === 'CRITICAL' && inc.priority !== 'CRITICAL') return false;
    if (filter === 'UNASSIGNED' && (inc.assignedTeamId || inc.status === 'RESOLVED')) return false;
    if (filter === 'FLOOD' && inc.incidentType !== 'FLOOD_TRAPPED') return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (inc.incidentId || '').toLowerCase().includes(q) ||
        (inc.location?.address || '').toLowerCase().includes(q) ||
        (inc.requestText || '').toLowerCase().includes(q) ||
        (inc.incidentCategoryLabel || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-3 md:p-5 max-w-6xl mx-auto space-y-4 animate-in fade-in select-none pb-20">
      
      {/* ======================================================== */}
      {/* 1. 3-SECOND SUMMARY & SITUATION PULSE BANNER             */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-3">
        
        {/* Mission Control Title Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-sm text-white">DISASTER OPERATIONS MISSION CONTROL</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black">
                  CMD-001 • NDRF EOC
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                District Incident Commander: Capt. Rajesh Varma • Sector: Salem Urban Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIs3DDigitalTwinOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 transition"
            >
              <Globe className="w-4 h-4" />
              <span>🌐 3D DIGITAL TWIN</span>
            </button>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 border border-emerald-500/30 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>26 MESH NODES</span>
            </span>
          </div>
        </div>

        {/* 5-Metric Situation Pulse Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-center">
          
          <div className="p-2.5 rounded-2xl bg-slate-950 border border-red-500/40 bg-red-950/20">
            <span className="text-[9px] font-bold text-red-400 block uppercase">🔴 CRITICAL P1</span>
            <span className="text-xl font-black text-red-400">{criticalCount}</span>
            <span className="text-[9px] text-slate-500 block">Life-Threat</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950 border border-amber-500/40 bg-amber-950/20">
            <span className="text-[9px] font-bold text-amber-400 block uppercase">⚠️ UNASSIGNED</span>
            <span className="text-xl font-black text-amber-400">{unassignedCount}</span>
            <span className="text-[9px] text-slate-500 block">Need Unit</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 block uppercase">👥 AFFECTED</span>
            <span className="text-xl font-black text-white">{totalPeopleAffected}</span>
            <span className="text-[9px] text-slate-500 block">Individuals</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950 border border-blue-500/40 bg-blue-950/20">
            <span className="text-[9px] font-bold text-blue-400 block uppercase">🚑 ACTIVE TEAMS</span>
            <span className="text-xl font-black text-blue-400">4</span>
            <span className="text-[9px] text-blue-300/70 block">Units in Field</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950 border border-purple-500/40 bg-purple-950/20 col-span-2 sm:col-span-1">
            <span className="text-[9px] font-bold text-purple-400 block uppercase">🔁 CLUSTERS</span>
            <span className="text-xl font-black text-purple-400">{clusters.length}</span>
            <span className="text-[9px] text-purple-300/70 block">Deduplicated</span>
          </div>

        </div>

        {/* Live Pulse Statement */}
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
            <span className="font-bold text-white">
              {criticalCount > 0 ? `⚠ ${criticalCount} critical incidents require immediate rescue dispatch.` : '✓ All high-priority distress beacons assigned to teams.'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">Updated real-time via LoRa</span>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. RESPONDER DOWN / MAYDAY EMERGENCY ALERT               */}
      {/* ======================================================== */}
      {!maydayDismissed && (
        <div className="p-4 rounded-3xl bg-red-950/80 border-2 border-red-500 text-white shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in zoom-in-95">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 animate-bounce">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black uppercase text-red-200 bg-red-900/80 px-2 py-0.5 rounded">
                🚨 RESPONDER MAYDAY ALERT
              </span>
              <h3 className="text-sm font-black text-white mt-0.5">
                RSC-1042 (Rescue Alpha) reported "NEED BACKUP" near Fairlands Junction
              </h3>
              <p className="text-[11px] text-red-200">
                Waterway blockage detected. Commander recommendation: Dispatch Backup Helo (AIR-01).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                assignTeam(incidents[0]?.incidentId || 'DD-PK-01', 'AIR-01', 'Coast Guard Helo Air-1');
                setMaydayDismissed(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-red-950 font-black text-xs shadow-lg active:scale-95 transition"
            >
              DISPATCH BACKUP (AIR-01)
            </button>
            <button
              onClick={() => setMaydayDismissed(true)}
              className="p-2 rounded-xl bg-red-900 hover:bg-red-800 text-red-200 text-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. 🧠 DHOST COMMAND COPILOT (DECISION ENGINE)            */}
      {/* ======================================================== */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border-2 border-amber-500/60 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-black text-white">DHOST COMMAND COPILOT (DECISION ENGINE)</h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black">
            AUTONOMOUS ADVICE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block">⚠ 2 Unassigned Incidents</span>
            <p className="text-[11px] text-slate-300">Flood depth &gt; 4ft requiring motorized rafts.</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-blue-400 font-bold block">⚠ Team Bravo Available</span>
            <p className="text-[11px] text-slate-300">Zodiac boat unit is 2.4km from Old Bridge.</p>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
            <span className="text-purple-400 font-bold block">⚠ Spatial Cluster Detected</span>
            <p className="text-[11px] text-slate-300">4 individual distress beacons grouped at Old Bridge.</p>
          </div>
        </div>

        {/* Recommended Action Bar */}
        <div className="p-3 rounded-2xl bg-amber-950/50 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
              COPILOT RECOMMENDED ACTION:
            </span>
            <p className="text-xs font-bold text-white">
              Assign TEAM BRAVO (Rescue Boat) ➔ Incident #DD82A1 (Old Bridge) via Safe Route (4.8km)
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (incidents.length > 0) setActNowPacket(incidents[0]);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
            >
              Review Plan
            </button>

            <button
              onClick={handleAiAutoDispatchAll}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition"
            >
              ⚡ AUTO-ASSIGN ALL
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. MAIN WORKSPACE: PRIORITY INBOX QUEUE                  */}
      {/* ======================================================== */}
      <div className="space-y-3">
        
        {/* Filter Controls & Map Workspace Launcher */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'All Incidents' },
              { id: 'CRITICAL', label: '🔴 Critical P1' },
              { id: 'UNASSIGNED', label: '⚠️ Unassigned' },
              { id: 'FLOOD', label: '🌊 Flood' },
              { id: 'CLUSTERS', label: '🔁 Spatial Clusters' }
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

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIs3DDigitalTwinOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition shrink-0"
            >
              <Globe className="w-4 h-4" />
              <span>🌐 OPEN 3D DIGITAL TWIN</span>
            </button>

            <button
              onClick={() => setIsTacticalMapOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>2D GIS Map</span>
            </button>

            <button
              onClick={() => setIsWhatIfOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>What-If Sim</span>
            </button>
          </div>

        </div>

        {/* Priority Inbox Rows Stream */}
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
              No incidents matching current filter.
            </div>
          ) : (
            filteredIncidents.map(inc => {
              const analysis = aiTriageService.analyzeIncident(inc);

              return (
                <div
                  key={inc.incidentId}
                  className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
                >
                  <div 
                    onClick={() => setActNowPacket(inc)}
                    className="space-y-2 flex-1 cursor-pointer"
                  >
                    
                    {/* Top Row Badges */}
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
                        {inc.priority} ({analysis.urgencyScore}%)
                      </span>
                      <span className="text-xs font-black text-white">
                        {inc.incidentCategoryLabel} ({inc.peopleCount} {inc.peopleCount === 1 ? 'Person' : 'People'})
                      </span>
                      {inc.assignedTeamName ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-emerald-400" />
                          <span>Assigned: {inc.assignedTeamName}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px] font-mono font-bold">
                          ⚠️ NO TEAM ASSIGNED
                        </span>
                      )}
                    </div>

                    {/* Distress Text */}
                    <p className="text-xs text-slate-200 font-medium leading-relaxed bg-slate-950 p-3 rounded-2xl border border-slate-800/80">
                      "{inc.translatedText || inc.requestText}"
                    </p>

                    {/* Telemetry Strip */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono flex-wrap gap-2">
                      <span>📍 {inc.location?.address || 'Salem Disaster Sector'} (±{inc.location.accuracyMeters || 12}m)</span>
                      <span>🔋 {inc.batteryLevel}% Battery</span>
                      <span>📡 {inc.hopCount} Hops via LoRa</span>
                      <span>🕒 {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                  </div>

                  {/* 1-Screen Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    
                    <button
                      onClick={() => {
                        setSelectedGpsPacket(inc);
                        setIsLiveGpsModalOpen(true);
                      }}
                      className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
                    >
                      <Navigation className="w-4 h-4 animate-spin" />
                      <span>LIVE GPS TRACK</span>
                    </button>

                    <button
                      onClick={() => setActNowPacket(inc)}
                      className="px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg active:scale-95 transition flex items-center gap-1.5"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>ACT NOW</span>
                    </button>

                    <button
                      onClick={() => setDigitalTwinPacket(inc)}
                      className="px-3 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs transition flex items-center gap-1"
                      title="View Digital Twin"
                    >
                      <Activity className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* ======================================================== */}
      {/* 5. MODALS & 3D DIGITAL TWIN WORKSPACE                    */}
      {/* ======================================================== */}
      
      {/* Full-Screen 3D Digital Twin Hero Workspace */}
      {is3DDigitalTwinOpen && (
        <Dhost3DDigitalTwin
          incidents={incidents}
          onSelectIncident={(pkt) => {
            setIs3DDigitalTwinOpen(false);
            setActNowPacket(pkt);
          }}
          onClose={() => setIs3DDigitalTwinOpen(false)}
        />
      )}

      {/* Rescuer Live GPS Tracker Modal */}
      <RescuerLiveGpsModal
        packet={selectedGpsPacket}
        isOpen={isLiveGpsModalOpen}
        onClose={() => setIsLiveGpsModalOpen(false)}
      />

      {/* Act Now Modal */}
      <ActNowModal
        packet={actNowPacket}
        isOpen={actNowPacket !== null}
        onClose={() => setActNowPacket(null)}
        onAssignTeam={(id, teamId, name) => assignTeam(id, teamId, name)}
        onUpdateStatus={(id, status) => updateIncidentStatus(id, status)}
        onOpenDigitalTwin={(pkt) => setDigitalTwinPacket(pkt)}
        onOpenLiveGps={(pkt) => {
          setSelectedGpsPacket(pkt);
          setIsLiveGpsModalOpen(true);
        }}
      />

      {/* Digital Twin Modal */}
      <IncidentDigitalTwinModal
        packet={digitalTwinPacket}
        isOpen={digitalTwinPacket !== null}
        onClose={() => setDigitalTwinPacket(null)}
      />

      {/* Full-Screen Tactical Map Workspace */}
      {isTacticalMapOpen && (
        <TacticalMapWorkspace
          incidents={incidents}
          onSelectIncident={(pkt) => {
            setIsTacticalMapOpen(false);
            setActNowPacket(pkt);
          }}
          onClose={() => setIsTacticalMapOpen(false)}
        />
      )}

      {/* What-If Failure Simulator Modal */}
      <WhatIfSimulatorModal
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
      />

      {/* Explainable AI Modal */}
      <ExplainableAiModal
        packet={xaiPacket}
        isOpen={isXaiOpen}
        onClose={() => setIsXaiOpen(false)}
      />

    </div>
  );
};
