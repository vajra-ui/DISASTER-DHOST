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
  Smartphone
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
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">DHOST Decentralized Mesh Topology</h1>
            <p className="text-xs text-slate-400">
              Zero-Infrastructure Ad-Hoc Emergency Packet Routing & Cryptographic Relay
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
            <span>Simulate Node Failover / Dynamic Reroute</span>
          </button>
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
            <h2 className="text-sm font-bold text-white">Active Mesh Transceivers</h2>
            <span className="text-xs text-slate-400">Click node to inspect telemetry</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {meshNodes.map(node => (
              <div
                key={node.nodeId}
                onClick={() => setSelectedNodeId(node.nodeId)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                  selectedNodeId === node.nodeId
                    ? 'bg-blue-600/10 border-blue-500 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className={`w-4 h-4 ${node.status === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'}`} />
                    <span className="font-mono text-xs font-black text-white">{node.nodeId}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                    node.nodeType === 'BASE_STATION' ? 'bg-purple-500/20 text-purple-300' :
                    node.nodeType === 'DRONE_RELAY' ? 'bg-blue-500/20 text-blue-300' :
                    node.nodeType === 'MOBILE_RESPONDER' ? 'bg-amber-500/20 text-amber-300' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {node.nodeType.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-semibold mt-2">{node.name}</p>

                <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
                  <span>📶 {node.signalDbm} dBm</span>
                  <span>🔋 {node.batteryLevel}%</span>
                  <span>🔗 {node.connectedPeers.length} Peers</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Node Deep Telemetry */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Transceiver Telemetry</h2>

          {selectedNode && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Node Identification</span>
                <p className="font-mono font-bold text-white text-sm">{selectedNode.nodeId}</p>
                <p className="text-slate-300">{selectedNode.name}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Hardware Specifications</span>
                <div className="flex justify-between">
                  <span className="text-slate-400">Radio Module:</span>
                  <span className="font-mono text-slate-200">Semtech SX1262 LoRa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transmission Power:</span>
                  <span className="font-mono text-slate-200">+22 dBm (160mW)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Battery Reserve:</span>
                  <span className="font-mono text-emerald-400">{selectedNode.batteryLevel}% (LiFePO4)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">GPS Coordinates:</span>
                  <span className="font-mono text-slate-200">{selectedNode.coordinates.lat.toFixed(4)}, {selectedNode.coordinates.lng.toFixed(4)}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Linked Mesh Peers</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.connectedPeers.map(p => (
                    <span key={p} className="px-2 py-1 rounded bg-slate-800 text-[10px] font-mono text-blue-300">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

