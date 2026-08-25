import React, { useState } from 'react';
import { 
  Network, 
  Radio, 
  Wifi, 
  Zap, 
  Shield, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Server,
  Smartphone,
  Check,
  X,
  Lock,
  Globe,
  RadioTower,
  HardDrive,
  Compass
} from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const MeshNetworkScreen: React.FC = () => {
  const { meshNodes, networkMode, simulateMeshFailover } = useDhostAuth();
  const [selectedNodeId, setSelectedNodeId] = useState<string>(meshNodes[0]?.nodeId || 'DHOST-BASE-01');
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedNode = meshNodes.find(n => n.nodeId === selectedNodeId) || meshNodes[0];

  const handleTestFailover = () => {
    setIsSimulating(true);
    simulateMeshFailover();
    setTimeout(() => setIsSimulating(false), 800);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in select-none">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">DHOST Decentralized Mesh Topology</h1>
            <p className="text-xs text-slate-400">
              Zero-Infrastructure Store-and-Forward Emergency Routing & Cryptographic Relay
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTestFailover}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition active:scale-98"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>Simulate Dynamic Node Failover</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. "NO NETWORK ≠ NO STATUS" / OFFLINE OPERATIONAL MATRIX  */}
      {/* ======================================================== */}
      <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-black text-white">NO NETWORK ≠ NO STATUS: OPERATIONAL SURVIVAL MATRIX</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
            COMMUNICATION OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
          
          <div className="p-3 rounded-2xl bg-slate-950 border border-red-500/40 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">INTERNET WAN</span>
            <div className="flex items-center gap-1.5 text-red-400 font-mono font-bold text-xs">
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>OFFLINE</span>
            </div>
            <span className="text-[9px] text-slate-500 block">Subsea link cut</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-red-500/40 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">CELLULAR TOWER</span>
            <div className="flex items-center gap-1.5 text-red-400 font-mono font-bold text-xs">
              <X className="w-4 h-4 text-red-500 shrink-0" />
              <span>GRID DOWN</span>
            </div>
            <span className="text-[9px] text-slate-500 block">Power outage</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">DHOST LORA MESH</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>18 NODES</span>
            </div>
            <span className="text-[9px] text-emerald-300/80 block">868 MHz active</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">LOCAL STORAGE</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
              <HardDrive className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% SYNCED</span>
            </div>
            <span className="text-[9px] text-emerald-300/80 block">Encrypted buffer</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">GPS SATELLITE FIX</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>±8m ACCURACY</span>
            </div>
            <span className="text-[9px] text-emerald-300/80 block">NavIC / GNSS Fix</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/50 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 block uppercase">PEER BLUETOOTH</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>6 PEERS</span>
            </div>
            <span className="text-[9px] text-emerald-300/80 block">BLE 5.3 Proximity</span>
          </div>

        </div>
      </div>

      {/* Network Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Mesh Relays</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{meshNodes.length}</span>
            <span className="text-[10px] text-emerald-400">● 100% Operational</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Radio Frequencies</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-400">868 MHz</span>
            <span className="text-[10px] text-slate-400">LoRa + BLE 5</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Average Latency</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">142 ms</span>
            <span className="text-[10px] text-slate-400">Per Hop</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Cryptographic Integrity</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-400">Ed25519</span>
            <span className="text-[10px] text-slate-400">Signed Packets</span>
          </div>
        </div>
      </div>

      {/* Topology Grid & Node Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Nodes List */}
        <div className="md:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white">Live Discovered Mesh Relays</h2>
            <span className="text-xs text-slate-400 font-mono">Store-and-Forward Enabled</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meshNodes.map(node => (
              <div
                key={node.nodeId}
                onClick={() => setSelectedNodeId(node.nodeId)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                  selectedNodeId === node.nodeId
                    ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{node.nodeId}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                    {node.status}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-200">{node.nodeName}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/80">
                  <span>🔋 {node.batteryLevel}%</span>
                  <span>📶 {node.signalStrengthRssi} dBm</span>
                  <span>📦 {node.queuedPackets} Q</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Details */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-white">Node Inspector</h2>
            <span className="text-xs font-mono text-blue-400">{selectedNode.nodeId}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Node Name</span>
              <p className="font-bold text-white">{selectedNode.nodeName}</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Hardware Specs</span>
              <p className="text-slate-300 font-mono">SX1262 LoRa 868MHz + BLE 5.3 SoC</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Power Source</span>
              <p className="text-emerald-400 font-mono">Solar Photovoltaic + {selectedNode.batteryLevel}% LiFePO4</p>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Cryptographic Key Fingerprint</span>
              <p className="text-slate-400 font-mono text-[10px] break-all">
                ed25519:8f3c7a9b2d1e0456c789a1b2c3d4e5f6
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
