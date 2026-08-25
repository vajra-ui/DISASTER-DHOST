import React, { useState } from 'react';
import { 
  Ambulance, 
  HeartHandshake, 
  Activity, 
  AlertOctagon, 
  CheckCircle2, 
  FileText, 
  Send, 
  Plane, 
  Sparkles,
  Check
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentStatus } from '../../types/dhostAuth';

export const MedicalTeamDashboard: React.FC = () => {
  const { 
    currentUser, 
    incidents, 
    updateIncidentStatus, 
    openPacketInspector,
    networkMode 
  } = useDhostAuth();

  const [triageFilter, setTriageFilter] = useState<'ALL' | 'RED' | 'YELLOW' | 'GREEN'>('ALL');
  const [medNotes, setMedNotes] = useState<{ [id: string]: string }>({});

  const medicalIncidents = incidents.filter(
    i => i.incidentType === 'MEDICAL_CRITICAL' || i.priority === 'CRITICAL' || i.aiTriageCategory.includes('Medical') || i.aiTriageCategory.includes('Immediate')
  );

  const redCount = medicalIncidents.filter(i => i.priority === 'CRITICAL').length;
  const yellowCount = medicalIncidents.filter(i => i.priority === 'HIGH').length;
  const greenCount = medicalIncidents.filter(i => i.priority === 'MEDIUM' || i.priority === 'LOW').length;

  const handleUpdate = (id: string, status: IncidentStatus, note?: string) => {
    updateIncidentStatus(id, status, note || medNotes[id]);
    setMedNotes(prev => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-5xl mx-auto space-y-5 animate-in fade-in">
      
      {/* Medical Header */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Ambulance className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">Disaster Medical Triage Queue</h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                {currentUser?.responderId || 'MED-204'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser?.name || 'Dr. K. Raghavan'} • Rapid Casualty Triage & Medevac Division
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[11px] font-bold text-emerald-400">● Triage Protocol Active</span>
          <p className="text-[10px] text-slate-400">{networkMode !== 'ONLINE' ? 'OFFLINE TRUSTED' : 'ONLINE'}</p>
        </div>
      </div>

      {/* Triage Tag Quick Counters */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setTriageFilter(triageFilter === 'RED' ? 'ALL' : 'RED')}
          className={`p-3.5 rounded-2xl border text-left transition ${
            triageFilter === 'RED'
              ? 'bg-red-500/20 border-red-500 text-white shadow-lg'
              : 'bg-slate-900 border-red-500/30 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-red-400 uppercase">🔴 RED: Immediate</span>
            <span className="text-xl font-black text-red-400">{redCount}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Life Threat • Urgent Care</p>
        </button>

        <button
          onClick={() => setTriageFilter(triageFilter === 'YELLOW' ? 'ALL' : 'YELLOW')}
          className={`p-3.5 rounded-2xl border text-left transition ${
            triageFilter === 'YELLOW'
              ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg'
              : 'bg-slate-900 border-amber-500/30 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-400 uppercase">🟡 YELLOW: Urgent</span>
            <span className="text-xl font-black text-amber-400">{yellowCount}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Serious • Delayable</p>
        </button>

        <button
          onClick={() => setTriageFilter(triageFilter === 'GREEN' ? 'ALL' : 'GREEN')}
          className={`p-3.5 rounded-2xl border text-left transition ${
            triageFilter === 'GREEN'
              ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg'
              : 'bg-slate-900 border-emerald-500/30 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-400 uppercase">🟢 GREEN: Minor</span>
            <span className="text-xl font-black text-emerald-400">{greenCount}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Walking Wounded • Stable</p>
        </button>
      </div>

      {/* Casualty Cases List */}
      <div className="space-y-3">
        {medicalIncidents.map(inc => (
          <div
            key={inc.incidentId}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-white">{inc.incidentId}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                  inc.priority === 'CRITICAL'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400'
                    : 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                }`}>
                  {inc.priority === 'CRITICAL' ? '🔴 RED TAG (IMMEDIATE)' : '🟡 YELLOW TAG (URGENT)'}
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {inc.peopleCount} Casualties • {inc.location.address}
                </span>
              </div>

              <button
                onClick={() => openPacketInspector(inc)}
                className="self-start sm:self-auto px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 flex items-center gap-1.5 transition"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span>Inspect Packet</span>
              </button>
            </div>

            {/* Medical Description */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Patient Symptoms / Condition:</span>
                <span className="text-blue-400 font-bold">{inc.aiTriageCategory}</span>
              </div>
              <p className="text-xs text-white leading-relaxed">
                "{inc.translatedText || inc.requestText}"
              </p>
            </div>

            {/* Medical Response Progression Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleUpdate(inc.incidentId, 'ACKNOWLEDGED', 'Medical Triage Commenced')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                  inc.status === 'ACKNOWLEDGED' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                1. Triaged
              </button>

              <button
                onClick={() => handleUpdate(inc.incidentId, 'ON_SCENE', 'Administering Emergency First Aid / Oxygen')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                  inc.status === 'ON_SCENE' ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                2. Stabilizing
              </button>

              <button
                onClick={() => handleUpdate(inc.incidentId, 'EN_ROUTE', 'AIR / BOAT MEDEVAC ESCALATED - CRITICAL TRANSPORT')}
                className="py-1.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition"
              >
                <Plane className="w-3.5 h-3.5" />
                <span>3. ESCALATE MEDEVAC</span>
              </button>

              <button
                onClick={() => handleUpdate(inc.incidentId, 'COMPLETED', 'Patient Handed Over to Regional Trauma Hospital')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition ${
                  inc.status === 'COMPLETED' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-emerald-400'
                }`}
              >
                4. Handed Over / Safe
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

