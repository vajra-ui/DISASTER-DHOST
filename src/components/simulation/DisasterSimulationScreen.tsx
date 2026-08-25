import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Radio, 
  CheckCircle2, 
  Activity, 
  Zap, 
  MapPin, 
  Users, 
  Sparkles,
  Waves,
  Wind,
  Building2,
  Mountain
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const DisasterSimulationScreen: React.FC = () => {
  const { addIncident, getLiveCoordinates, playDispatchChime } = useDhostAuth();

  const [selectedScenario, setSelectedScenario] = useState<'FLOOD' | 'CYCLONE' | 'EARTHQUAKE' | 'LANDSLIDE'>('FLOOD');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scenarioTimeline = [
    { time: '00:00', title: 'Cellular & Power Grid Failure', desc: 'Monsoon flash flood knocks out 3 base transceiver stations. WAN Internet severed.', status: 'CRISIS' },
    { time: '00:10', title: 'Victim Creates Zero-Input SOS', desc: 'Citizen in 4ft water holds SOS for 2 seconds. Packet #DD-PK-8842 generated with ±8m GPS fix.', status: 'ORIGIN' },
    { time: '00:15', title: 'Encrypted Local Storage', desc: 'Emergency packet signed with SHA-256 and cached locally in offline database.', status: 'LOCAL_STORE' },
    { time: '00:21', title: 'Relay 01 Discovered (BLE 5.3)', desc: 'Neighboring citizen device receives broadcast packet over Bluetooth Low Energy.', status: 'RELAY_1' },
    { time: '00:34', title: 'Relay 02 Drone Mesh Forward', desc: 'Rooftop drone LoRa node (DD-RL-118) receives packet at 868MHz over 1.4km distance.', status: 'RELAY_2' },
    { time: '00:48', title: 'Rescue Boat Node Intercept', desc: 'Rescue Boat Unit RSC-1088 receives distress packet with victim GPS coordinates.', status: 'RESCUE_NODE' },
    { time: '01:02', title: 'Commander EOC Receives Packet', desc: 'District Command HQ screen sounds dispatch chime and calculates AI Urgency Score (94%).', status: 'COMMANDER' },
    { time: '01:10', title: 'Team Assigned & Safe Route Computed', desc: 'AI recommends RSC-1088 Boat Unit via Safe Route (4.8km, avoiding downed wires).', status: 'ASSIGNED' },
    { time: '01:45', title: 'Rescue Completed & Evacuation Logged', desc: '6 victims evacuated safely. Incident status updated to RESOLVED across mesh network.', status: 'RESOLVED' }
  ];

  // Playback timer
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= scenarioTimeline.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (next === 6) playDispatchChime();
          return next;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleRunScenario = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-5xl mx-auto space-y-5 animate-in fade-in select-none">
      
      {/* Header */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Disaster Simulation & E2E Story Room</h1>
            <p className="text-xs text-slate-400">
              Interactive Hackathon Scenario Demonstrator • Multi-Hop Propagation Timeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : handleRunScenario}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition active:scale-95"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause Timeline' : 'Run Scenario Simulation'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Reset Timeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'FLOOD', label: '🌊 Flood Inundation', icon: Waves, desc: 'Heavy monsoon storm, submerged roads' },
          { id: 'CYCLONE', label: '🌀 Super Cyclone', icon: Wind, desc: 'High velocity winds, roof destruction' },
          { id: 'EARTHQUAKE', label: '🧱 Earthquake Collapse', icon: Building2, desc: 'Structural entrapment, rubble' },
          { id: 'LANDSLIDE', label: '⛰️ Hill Landslide', icon: Mountain, desc: 'Mountain road isolated, mud blockage' }
        ].map(scen => {
          const Icon = scen.icon;
          return (
            <div
              key={scen.id}
              onClick={() => {
                setSelectedScenario(scen.id as any);
                handleReset();
              }}
              className={`p-4 rounded-2xl border cursor-pointer transition space-y-1.5 ${
                selectedScenario === scen.id
                  ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-purple-400" />
                <span className="font-black text-xs text-white">{scen.label}</span>
              </div>
              <p className="text-[10px] text-slate-400">{scen.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Interactive Timeline Player */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase font-bold block">
              SCENARIO PROGRESSION (STEP {currentStepIndex + 1} OF {scenarioTimeline.length})
            </span>
            <h2 className="text-base font-black text-white">
              {scenarioTimeline[currentStepIndex].title}
            </h2>
          </div>
          <span className="text-xl font-black font-mono text-amber-400">
            {scenarioTimeline[currentStepIndex].time}
          </span>
        </div>

        {/* Timeline Progression Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentStepIndex + 1) / scenarioTimeline.length) * 100}%` }}
          />
        </div>

        {/* Step Cards */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {scenarioTimeline.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/20'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                    : 'bg-slate-950/40 border-slate-900 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl font-mono text-xs font-black flex items-center justify-center ${
                    isCurrent ? 'bg-purple-500 text-white animate-pulse' :
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {step.time}
                  </span>

                  <div>
                    <h3 className={`text-xs font-bold ${isCurrent ? 'text-white font-black' : 'text-slate-200'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 leading-snug">{step.desc}</p>
                  </div>
                </div>

                <div>
                  {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {isCurrent && <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping block" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
