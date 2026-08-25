import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  SunMedium, 
  Share2, 
  MessageSquare, 
  Navigation, 
  Phone,
  Battery,
  ShieldCheck,
  Truck,
  Anchor,
  Clock,
  Compass,
  Users,
  Sparkles,
  Camera,
  Layers,
  Zap,
  Lock,
  Heart,
  Activity
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { EmergencyPacket } from '../../types/dhostAuth';
import { EmergencyPacketCard } from '../common/EmergencyPacketCard';
import { DhostPathVisualizer } from '../common/DhostPathVisualizer';
import { DhostSurvivalClock } from '../common/DhostSurvivalClock';
import { DhostNetworkRadar } from '../common/DhostNetworkRadar';

export const VictimEmergencyFlow: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { 
    addIncident, 
    incidents,
    getLiveCoordinates,
    getBatteryLevel,
    playRescueSiren,
    stopRescueSiren,
    generateSmsDistressUri,
    generateWhatsAppDistressUri,
    triggerNativeShare,
    updateIncidentStatus
  } = useDhostAuth();

  const locationPassedId = (locationState.state as any)?.activeIncident?.incidentId;
  const activePacket = incidents.find(i => 
    i.incidentId === locationPassedId || 
    (i.status !== 'RESOLVED' && i.status !== 'RESCUED')
  ) || incidents[0] || null;

  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'white' | 'red'>('white');
  const [activeTab, setActiveTab] = useState<'RADAR' | 'SURVIVAL_CLOCK' | 'PACKET' | 'MESH_RADAR'>('RADAR');

  // Simulated Live Real-Time Distance & ETA Countdown
  const [liveDistanceMeters, setLiveDistanceMeters] = useState(580);
  const [etaMinutes, setEtaMinutes] = useState(4);

  // Battery Survival State
  const batteryPct = getBatteryLevel();
  const [lastGaspSent, setLastGaspSent] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // Micro-Alive Beacon State
  const [alivePulseCount, setAlivePulseCount] = useState(0);
  const [lastAliveTimestamp, setLastAliveTimestamp] = useState<number | null>(null);

  // Automatic Instant SOS Creation on Mount if no packet exists
  useEffect(() => {
    if (!activePacket) {
      getLiveCoordinates().then((loc) => {
        addIncident({
          incidentType: 'FLOOD_TRAPPED',
          requestText: 'Emergency Assistance Beacon - Live GPS Broadcasted',
          peopleCount: 1,
          location: loc,
          batteryLevel: batteryPct
        });
      });
    }
  }, []);

  // Distance Countdown Simulation
  useEffect(() => {
    if (!activePacket) return;
    const interval = setInterval(() => {
      setLiveDistanceMeters(prev => {
        if (prev <= 40) return 35;
        const next = prev - Math.floor(Math.random() * 15 + 8);
        return Math.max(35, next);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [activePacket?.assignedTeamId]);

  // Update ETA based on distance
  useEffect(() => {
    if (liveDistanceMeters > 400) setEtaMinutes(4);
    else if (liveDistanceMeters > 250) setEtaMinutes(3);
    else if (liveDistanceMeters > 100) setEtaMinutes(2);
    else setEtaMinutes(1);
  }, [liveDistanceMeters]);

  // Clean up siren on unmount
  useEffect(() => {
    return () => {
      stopRescueSiren();
    };
  }, []);

  // Screen Strobe Effect
  useEffect(() => {
    if (!isStrobeActive) return;
    const interval = setInterval(() => {
      setStrobeColor(c => c === 'white' ? 'red' : 'white');
    }, 200);
    return () => clearInterval(interval);
  }, [isStrobeActive]);

  const handleToggleSiren = () => {
    if (isSirenPlaying) {
      stopRescueSiren();
      setIsSirenPlaying(false);
    } else {
      const ok = playRescueSiren();
      if (ok) setIsSirenPlaying(true);
    }
  };

  const handleMarkRescued = () => {
    if (activePacket) {
      updateIncidentStatus(activePacket.incidentId, 'RESOLVED', 'Victim confirmed safe and rescued');
    }
    stopRescueSiren();
    navigate('/');
  };

  const handleSendLastGaspLocation = () => {
    setLastGaspSent(true);
    if ('vibrate' in navigator) navigator.vibrate([100, 100, 100]);
  };

  const handleSendMicroAliveBeacon = () => {
    setAlivePulseCount(c => c + 1);
    setLastAliveTimestamp(Date.now());
    if ('vibrate' in navigator) navigator.vibrate([50, 50]);
  };

  const handleSimulatePhotoAttach = () => {
    setCapturedPhoto('📷 Floodwater Surging Around Landmark Bridge Pillar');
  };

  const getStepIndex = (status?: string) => {
    switch (status) {
      case 'REPORTED': return 1;
      case 'ACKNOWLEDGED': return 2;
      case 'EN_ROUTE': return 3;
      case 'ON_SCENE': return 4;
      case 'RESCUED':
      case 'RESOLVED': return 5;
      default: return 2;
    }
  };

  const currentStep = getStepIndex(activePacket?.status);

  // Full Screen Strobe Overlay
  if (isStrobeActive) {
    return (
      <div 
        onClick={() => setIsStrobeActive(false)}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer select-none transition duration-75 ${
          strobeColor === 'white' ? 'bg-white text-black' : 'bg-red-600 text-white'
        }`}
      >
        <div className="text-center p-6 space-y-4">
          <SunMedium className="w-24 h-24 mx-auto animate-spin" />
          <h1 className="text-4xl font-black tracking-wider">SOS RESCUE STROBE</h1>
          <p className="text-sm font-extrabold uppercase">Wave high for search boats, drones & rescue teams</p>
          <div className="py-2.5 px-6 rounded-full bg-black/50 text-white font-mono text-xs font-bold inline-block">
            Tap anywhere to turn off
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-slate-100 p-4 max-w-md mx-auto space-y-4 animate-in fade-in select-none">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopRescueSiren();
            navigate('/');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="px-3 py-1 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-[11px] font-black text-red-400 tracking-wider">LIVE SOS BEACON</span>
        </div>
      </div>

      {/* 1-Tap "I AM STILL HERE" Micro-Alive Beacon */}
      <div className="p-3.5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 shadow-lg">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-white flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>"I AM STILL HERE" MICRO-BEACON</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">12-Byte Pulse</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSendMicroAliveBeacon}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition"
          >
            <Activity className="w-4 h-4" />
            <span>I'M STILL HERE (TAP TO CHIRP)</span>
          </button>
        </div>

        {lastAliveTimestamp && (
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <span>✓ Alive Pulse #{alivePulseCount} Latched</span>
            <span>{new Date(lastAliveTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-2xl bg-slate-900 border border-slate-800 text-[10px] font-bold">
        <button
          onClick={() => setActiveTab('RADAR')}
          className={`py-2 rounded-xl transition ${activeTab === 'RADAR' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
        >
          🧭 Radar
        </button>
        <button
          onClick={() => setActiveTab('SURVIVAL_CLOCK')}
          className={`py-2 rounded-xl transition ${activeTab === 'SURVIVAL_CLOCK' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
        >
          ⏱️ Survival
        </button>
        <button
          onClick={() => setActiveTab('PACKET')}
          className={`py-2 rounded-xl transition ${activeTab === 'PACKET' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
        >
          📜 Packet
        </button>
        <button
          onClick={() => setActiveTab('MESH_RADAR')}
          className={`py-2 rounded-xl transition ${activeTab === 'MESH_RADAR' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
        >
          📡 Mesh
        </button>
      </div>

      {/* TAB 1: LIVE RESCUE RADAR */}
      {activeTab === 'RADAR' && (
        <div className="space-y-4 animate-in zoom-in-95">
          
          <div className="p-5 rounded-3xl bg-slate-900 border-2 border-amber-500/60 space-y-3.5 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                  {activePacket?.assignedTeamName?.includes('Boat') ? (
                    <Anchor className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Truck className="w-5 h-5 animate-pulse" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">
                    ASSIGNED RESCUE TEAM
                  </span>
                  <h3 className="text-base font-black text-white">
                    {activePacket?.assignedTeamName || 'Rescue Alpha (Sgt. Sen)'}
                  </h3>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                  {activePacket?.status === 'ON_SCENE' ? 'ON SCENE' : 'EN ROUTE'}
                </span>
              </div>
            </div>

            {/* Live Distance & ETA Countdown Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] text-slate-500 block font-mono">DISTANCE TO YOU</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {liveDistanceMeters <= 50 ? 'ARRIVING NOW' : `${liveDistanceMeters}m`}
                </span>
              </div>
              
              <div className="w-px h-8 bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-500 block font-mono">ESTIMATED ETA</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {liveDistanceMeters <= 50 ? '0 mins' : `~${etaMinutes} mins`}
                </span>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div>
                <span className="text-[10px] text-slate-500 block font-mono">LOCATION CONFIDENCE</span>
                <span className="text-xs font-black text-emerald-400 block mt-1">
                  🟢 ±12m (HIGH)
                </span>
              </div>
            </div>

            {/* 5-Step Live Progress Indicator */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span className={currentStep >= 1 ? 'text-emerald-400' : ''}>1. SOS Sent</span>
                <span className={currentStep >= 2 ? 'text-emerald-400' : ''}>2. Assigned</span>
                <span className={currentStep >= 3 ? 'text-amber-400 font-black animate-pulse' : ''}>3. En Route</span>
                <span className={currentStep >= 4 ? 'text-blue-400' : ''}>4. On Scene</span>
                <span className={currentStep >= 5 ? 'text-emerald-400' : ''}>5. Rescued</span>
              </div>

              <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-blue-400 transition-all duration-700 ease-out"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>

          </div>

          {/* Visual SOS (Photo Clue Attachment) */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-400" />
                <span>Visual SOS Landmark Clue</span>
              </span>
            </div>
            {capturedPhoto ? (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-center justify-between">
                <span>{capturedPhoto}</span>
                <span className="text-emerald-400 font-bold text-[10px]">Attached</span>
              </div>
            ) : (
              <button
                onClick={handleSimulatePhotoAttach}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Snap 1 Photo of Surroundings for Rescuers</span>
              </button>
            )}
          </div>

          {/* Survival Tools Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleToggleSiren}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 active:scale-95 transition ${
                isSirenPlaying 
                  ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-lg shadow-red-950' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                {isSirenPlaying ? <VolumeX className="w-7 h-7 text-white" /> : <Volume2 className="w-7 h-7 text-amber-400" />}
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isSirenPlaying ? 'bg-black/40 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {isSirenPlaying ? 'PLAYING' : 'OFF'}
                </span>
              </div>
              <div>
                <p className="text-xs font-black">{isSirenPlaying ? 'Stop Siren' : 'Loud Rescue Siren'}</p>
                <p className="text-[10px] opacity-75">Acoustic sweep for search teams</p>
              </div>
            </button>

            <button
              onClick={() => setIsStrobeActive(true)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between gap-3 active:scale-95 transition"
            >
              <div className="flex items-center justify-between">
                <SunMedium className="w-7 h-7 text-amber-400" />
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  READY
                </span>
              </div>
              <div>
                <p className="text-xs font-black text-white">Screen Strobe Torch</p>
                <p className="text-[10px] text-slate-400">Visual night beacon</p>
              </div>
            </button>
          </div>

          {/* 1-Tap Mark Safe & Rescued */}
          <button
            onClick={handleMarkRescued}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I AM SAFE & RESCUED (CLOSE SOS)</span>
          </button>

        </div>
      )}

      {/* TAB 2: DHOST SURVIVAL CLOCK */}
      {activeTab === 'SURVIVAL_CLOCK' && (
        <div className="space-y-3 animate-in fade-in">
          <DhostSurvivalClock batteryPct={batteryPct} />
          
          <button
            onClick={handleSendLastGaspLocation}
            className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
          >
            {lastGaspSent ? '✓ Last Known GPS Latched to Relays' : '📍 SEND LAST KNOWN LOCATION (BEFORE SHUTDOWN)'}
          </button>
        </div>
      )}

      {/* TAB 3: EMERGENCY PACKET CARD */}
      {activeTab === 'PACKET' && activePacket && (
        <div className="space-y-3 animate-in fade-in">
          <EmergencyPacketCard packet={activePacket} />
        </div>
      )}

      {/* TAB 4: SELF-HEALING MESH RADAR */}
      {activeTab === 'MESH_RADAR' && activePacket && (
        <div className="space-y-3 animate-in fade-in">
          <DhostNetworkRadar packet={activePacket} />
        </div>
      )}

    </div>
  );
};
