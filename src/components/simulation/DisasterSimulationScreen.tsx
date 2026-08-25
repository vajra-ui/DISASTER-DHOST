import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CloudRain, 
  Radio, 
  ZapOff, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Network
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const DisasterSimulationScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    networkMode, 
    setNetworkMode, 
    simulateMeshFailover, 
    resetData, 
    addIncident 
  } = useDhostAuth();

  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([
    'Simulation Engine initialized.',
    'DHOST telemetry monitors active across 4 nodes.'
  ]);

  const addLog = (msg: string) => {
    setLogMessages(prev => [ `[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 7) ]);
  };

  // Scenario 1: Flood Surge
  const triggerFloodSurge = () => {
    setActiveScenario('FLOOD_SURGE');
    addLog('⚡ Triggered Scenario: Velachery Flash Flood Breach');
    
    // Inject emergency incident
    const newInc = addIncident({
      incidentType: 'FLOOD_TRAPPED',
      requestText: 'Ground floor submerged completely in Gandhi Nagar, 3 seniors need immediate raft rescue',
      peopleCount: 3,
      location: {
        address: 'Gandhi Nagar Main Rd, Velachery',
        lat: 12.9815,
        lng: 80.2180,
        accuracyMeters: 4
      },
      preferredLanguage: 'en',
      mediaAttachments: []
    });

    addLog(`DHOST mesh beacon broadcast received: ${newInc.incidentId} (Priority: CRITICAL)`);
  };

  // Scenario 2: Blackout & Mesh Mode
  const triggerBlackout = () => {
    setActiveScenario('BLACKOUT');
    setNetworkMode('OFFLINE_MESH');
    addLog('⚡ Triggered Scenario: 100% Cellular & Grid Blackout');
    addLog('App operating in PURE DHOST OFFLINE MESH mode. Responders retaining OFFLINE_TRUSTED authentication.');
  };

  // Scenario 3: Node Failover
  const triggerNodeFailover = () => {
    setActiveScenario('NODE_FAILOVER');
    simulateMeshFailover();
    addLog('⚡ Triggered Scenario: DHOST-BASE-01 severed');
    addLog('Dynamic Mesh Rerouting active: Packets hopping via DHOST-DRONE-01 (+1 hop, 0% packet loss)');
  };

  const handleReset = () => {
    resetData();
    setActiveScenario(null);
    setNetworkMode('ONLINE');
    setLogMessages(['System reset to standard baseline.']);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-5xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Play className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Disaster Scenario Simulation</h1>
            <p className="text-xs text-slate-400">
              Interactive Testbench to Demonstrate DHOST Offline Resilience & Multi-Role Coordination
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Scenario 1: Flood Inundation */}
        <div className={`p-5 rounded-3xl border transition space-y-3 ${
          activeScenario === 'FLOOD_SURGE'
            ? 'bg-blue-950/40 border-blue-500 shadow-xl'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <CloudRain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Scenario A: Flash Flood Surge</h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulates storm water breach in Velachery. Injects live SOS packets into the mesh queue.
            </p>
          </div>
          <button
            onClick={triggerFloodSurge}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition"
          >
            Trigger Flash Flood
          </button>
        </div>

        {/* Scenario 2: Cellular Blackout */}
        <div className={`p-5 rounded-3xl border transition space-y-3 ${
          activeScenario === 'BLACKOUT'
            ? 'bg-red-950/40 border-red-500 shadow-xl'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
            <ZapOff className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Scenario B: Cellular Blackout</h2>
            <p className="text-xs text-slate-400 mt-1">
              Simulates total loss of 4G/5G/Broadband. Demonstrates zero-auth offline victim SOS.
            </p>
          </div>
          <button
            onClick={triggerBlackout}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition"
          >
            Cut All Cellular Networks
          </button>
        </div>

        {/* Scenario 3: Mesh Node Failover */}
        <div className={`p-5 rounded-3xl border transition space-y-3 ${
          activeScenario === 'NODE_FAILOVER'
            ? 'bg-amber-950/40 border-amber-500 shadow-xl'
            : 'bg-slate-900 border-slate-800'
        }`}>
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Scenario C: Drone Relay Reroute</h2>
            <p className="text-xs text-slate-400 mt-1">
              Kills central Base Station. Proves ad-hoc multi-hop packet transmission via Drone node.
            </p>
          </div>
          <button
            onClick={triggerNodeFailover}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs transition"
          >
            Fail Base Node & Reroute
          </button>
        </div>

      </div>

      {/* Live Simulation Event Logs */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Live Simulation Activity Logs</span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">● ENGINE LIVE</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5">
          {logMessages.map((log, idx) => (
            <p key={idx} className={idx === 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {log}
            </p>
          ))}
        </div>
      </div>

      {/* Direct Quick Nav to inspect effects */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-300">Inspect Simulation Results:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/command')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Commander Dashboard →
          </button>
          <button
            onClick={() => navigate('/network')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
          >
            Mesh Topology →
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold"
          >
            Emergency Home (Victim View) →
          </button>
        </div>
      </div>

    </div>
  );
};

