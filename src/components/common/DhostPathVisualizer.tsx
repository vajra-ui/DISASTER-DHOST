import React from 'react';
import { 
  Radio, 
  Smartphone, 
  Wifi, 
  Bluetooth, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowDown, 
  Activity,
  Zap
} from 'lucide-react';
import { EmergencyPacket } from '../../types/dhostAuth';

interface Props {
  packet: EmergencyPacket;
}

export const DhostPathVisualizer: React.FC<Props> = ({ packet }) => {
  const hops = [
    {
      id: 'DD-V-81A2',
      name: 'Victim Origin Device',
      role: 'DISTRESS_ORIGIN',
      protocol: 'Bluetooth LE (2.4GHz)',
      protocolIcon: Bluetooth,
      status: 'TRANSMITTED',
      latency: '0ms'
    },
    {
      id: 'DD-RL-102',
      name: 'Relay 01 (Citizen Phone)',
      role: 'PEER_RELAY',
      protocol: 'Wi-Fi Direct P2P',
      protocolIcon: Wifi,
      status: 'FORWARDED',
      latency: '24ms'
    },
    {
      id: 'DD-RL-118',
      name: 'Relay 02 (Rooftop Drone Mesh Node)',
      role: 'MESH_ROUTER',
      protocol: 'LoRa 868MHz Long-Range',
      protocolIcon: Radio,
      status: 'ROUTED',
      latency: '110ms'
    },
    {
      id: 'DD-RN-004',
      name: 'Rescue Node (Boat Unit RSC-1088)',
      role: 'RESPONDER_GATEWAY',
      protocol: 'Tactical UHF Radio',
      protocolIcon: Activity,
      status: 'DELIVERED',
      latency: '340ms'
    },
    {
      id: 'CMD-EOC-HQ',
      name: 'EOC Tactical Command Center',
      role: 'COMMAND_TERMINAL',
      protocol: 'Sat-Link / Mesh Terminal',
      protocolIcon: Server,
      status: packet.status !== 'REPORTED' ? 'ACKNOWLEDGED' : 'RECEIVING',
      latency: '420ms'
    }
  ];

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono text-xs select-none">
      
      {/* Visual Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="font-black text-white text-xs">DHOST STORE-AND-FORWARD PATHWAY</span>
        </div>
        <span className="text-[10px] text-slate-400">Total Hops: {hops.length - 1}</span>
      </div>

      {/* Vertical Hop Chain */}
      <div className="space-y-2 relative">
        {hops.map((hop, index) => {
          const ProtocolIcon = hop.protocolIcon;
          const isLast = index === hops.length - 1;

          return (
            <div key={hop.id} className="relative">
              
              {/* Node Card */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-md hover:border-slate-700 transition">
                
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    isLast ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                  }`}>
                    <ProtocolIcon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{hop.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                        {hop.id}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>Via {hop.protocol}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-emerald-400 font-bold">+{hop.latency}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{hop.status}</span>
                  </span>
                </div>

              </div>

              {/* Connecting Down Arrow */}
              {!isLast && (
                <div className="flex items-center justify-center my-1 text-slate-600">
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Check Verification Footer */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase block">
          STORE-AND-FORWARD VERIFICATION CHECKLIST:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-slate-300">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Created</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Stored Locally</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Relay 1 Verified</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Relay 2 Forwarded</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ Rescue Node Received</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">✓ EOC Acknowledged</span>
        </div>
      </div>

    </div>
  );
};
