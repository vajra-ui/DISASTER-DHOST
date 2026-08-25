import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  CheckCircle2, 
  HeartHandshake, 
  ArrowRight,
  Mic,
  MicOff,
  Waves,
  HeartPulse,
  Building2,
  Flame,
  Battery,
  Navigation,
  Radio,
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { IncidentType } from '../../types/dhostAuth';

export const EmergencyHomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    networkMode, 
    incidents, 
    openPacketInspector,
    addIncident,
    getLiveCoordinates,
    getBatteryLevel,
    playRescueSiren,
    stopRescueSiren,
    startVoiceSos
  } = useDhostAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [stopVoiceFn, setStopVoiceFn] = useState<(() => void) | null>(null);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [batteryPct, setBatteryPct] = useState<number>(85);

  useEffect(() => {
    // Read real battery & coordinates
    setBatteryPct(getBatteryLevel());
    getLiveCoordinates().then((loc) => {
      setLiveLocation({
        lat: loc.lat,
        lng: loc.lng,
        address: loc.address
      });
    });
  }, []);

  // Quick 1-Tap SOS Dispatcher (Zero friction, real GPS)
  const handleQuickSos = async (type: IncidentType = 'FLOOD_TRAPPED', text?: string) => {
    setIsSubmitting(true);
    try {
      const loc = await getLiveCoordinates();
      const newPacket = addIncident({
        incidentType: type,
        requestText: text || (
          type === 'FLOOD_TRAPPED' ? 'Rapid Floodwater Surge - Stranded & Immediate Evacuation Required' :
          type === 'MEDICAL_CRITICAL' ? 'Severe Medical Emergency - Urgent Paramedic / First Aid Required' :
          type === 'STRUCTURAL_COLLAPSE' ? 'Building / Roof Collapse - Trapped under debris' :
          type === 'FIRE_HAZARD' ? 'Active Fire Hazard / Live High Voltage Wires' :
          'Life Safety Emergency Assistance Request'
        ),
        peopleCount: 1,
        location: loc,
        batteryLevel: batteryPct
      });
      // Navigate to live beacon tracker
      navigate('/victim', { state: { activeIncident: newPacket } });
    } catch {
      navigate('/victim');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Voice SOS Toggle
  const toggleVoiceSos = () => {
    if (isListeningVoice) {
      if (stopVoiceFn) stopVoiceFn();
      setIsListeningVoice(false);
      if (voiceText.trim()) {
        handleQuickSos('FLOOD_TRAPPED', voiceText.trim());
      }
    } else {
      setVoiceText('');
      setIsListeningVoice(true);
      const stop = startVoiceSos(
        (text, isFinal) => {
          setVoiceText(text);
          if (isFinal && text.trim().length > 5) {
            setIsListeningVoice(false);
            handleQuickSos('FLOOD_TRAPPED', text.trim());
          }
        },
        (err) => {
          console.warn(err);
          setIsListeningVoice(false);
        }
      );
      setStopVoiceFn(() => stop);
    }
  };

  const recentIncidents = incidents.slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto space-y-5 select-none animate-in fade-in duration-200">
      
      {/* Top Device Live Telemetry Bar */}
      <div className="space-y-4">
        
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>{liveLocation ? `${liveLocation.lat.toFixed(4)}, ${liveLocation.lng.toFixed(4)}` : 'Acquiring GPS...'}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 font-mono text-slate-300">
            <div className="flex items-center gap-1">
              <Battery className={`w-3.5 h-3.5 ${batteryPct < 25 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`} />
              <span>{batteryPct}%</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
              {networkMode === 'ONLINE' ? 'CELL 4G' : 'LORA MESH'}
            </span>
          </div>
        </div>

        {/* Core Question & Zero-Auth Banner */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-xs font-black">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>DISASTER LIFELINE • ZERO AUTH PROTOCOL</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white pt-1">
            DO YOU NEED HELP?
          </h1>
          <p className="text-xs text-slate-400">
            No login or password. 1-Tap transmits your live GPS across the disaster mesh.
          </p>
        </div>

        {/* 1. GIANT 1-TAP BIG PANIC BEACON BUTTON */}
        <div className="pt-1">
          <button
            onClick={() => handleQuickSos('FLOOD_TRAPPED')}
            disabled={isSubmitting}
            className="w-full py-7 rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white shadow-2xl shadow-red-900/80 border-2 border-red-400/60 flex flex-col items-center justify-center gap-2 transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition shadow-inner">
                <AlertOctagon className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-2xl sm:text-3xl font-black tracking-wider block">🆘 I NEED HELP</span>
                <span className="text-[11px] text-red-100 font-bold block">1-Tap Instant Rescue Dispatch</span>
              </div>
            </div>
          </button>
        </div>

        {/* 2. REAL VOICE DISTRESS SOS MIC */}
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className={`w-4 h-4 ${isListeningVoice ? 'text-red-400 animate-bounce' : 'text-amber-400'}`} />
              <span className="text-xs font-black text-white">Voice Distress Mic (Tamil / Hindi / English)</span>
            </div>
            <button
              onClick={toggleVoiceSos}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                isListeningVoice 
                  ? 'bg-red-600 text-white animate-pulse' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              {isListeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              <span>{isListeningVoice ? 'Stop & Send SOS' : 'Tap to Speak'}</span>
            </button>
          </div>
          {isListeningVoice && (
            <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs font-mono text-red-200">
              {voiceText ? `🎙️ "${voiceText}"` : 'Listening... Speak your emergency (e.g. "Trapped in flood with 3 family members")'}
            </div>
          )}
        </div>

        {/* 3. FOUR 1-TAP VISUAL SCENARIO TILES */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
            OR CHOOSE SPECIFIC SITUATION:
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            
            <button
              onClick={() => handleQuickSos('FLOOD_TRAPPED')}
              className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/60 border border-blue-500/40 active:scale-95 text-left transition flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">🌊 Flood Water</p>
                <p className="text-[10px] text-blue-200/70">Rising / Stranded</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickSos('MEDICAL_CRITICAL')}
              className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 active:scale-95 text-left transition flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">🩺 Medical Injury</p>
                <p className="text-[10px] text-rose-200/70">Critical / Trauma</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickSos('STRUCTURAL_COLLAPSE')}
              className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 active:scale-95 text-left transition flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">🏚️ Collapse</p>
                <p className="text-[10px] text-amber-200/70">Trapped in debris</p>
              </div>
            </button>

            <button
              onClick={() => handleQuickSos('FIRE_HAZARD')}
              className="p-3 rounded-2xl bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/40 active:scale-95 text-left transition flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">⚡ Fire / Wires</p>
                <p className="text-[10px] text-orange-200/70">Hazard / Sparking</p>
              </div>
            </button>

          </div>
        </div>

        {/* 4. CITIZEN SAFE & COMMUNITY REPORT BUTTONS */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => navigate('/safe')}
            className="py-3.5 px-3 rounded-2xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/20 text-left flex items-center gap-2.5 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white">🟢 I'M SAFE</p>
              <p className="text-[10px] text-slate-400">Mark yourself safe</p>
            </div>
          </button>

          <button
            onClick={() => navigate('/help-others')}
            className="py-3.5 px-3 rounded-2xl bg-slate-900 border border-purple-500/40 hover:bg-purple-950/20 text-left flex items-center gap-2.5 active:scale-95 transition"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-white">🤝 HELP OTHERS</p>
              <p className="text-[10px] text-slate-400">Report stranded people</p>
            </div>
          </button>
        </div>

        {/* Nearby Mesh Beacons Live Stream */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-400 text-[11px]">ACTIVE LOCAL MESH RELAYS:</span>
            <span className="text-[10px] font-mono text-emerald-400">REAL-TIME BUS</span>
          </div>

          <div className="space-y-1.5">
            {recentIncidents.map((inc) => (
              <div 
                key={inc.incidentId}
                onClick={() => openPacketInspector(inc)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{inc.incidentCategoryLabel}</p>
                    <p className="text-[10px] text-slate-500">{inc.location?.address || 'Disaster Zone'} • <span className="font-mono">{inc.hopCount}-Hop</span></p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {inc.incidentId}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* UNOBTRUSIVE RESPONDER ACCESS AT BOTTOM */}
      <div className="pt-2 pb-1 text-center">
        <div className="w-12 h-0.5 rounded-full bg-slate-800 mb-2 mx-auto" />
        <button
          onClick={() => navigate('/responder/login')}
          className="inline-flex items-center gap-1.5 py-1.5 px-3 text-slate-500 hover:text-slate-300 text-xs font-bold transition"
        >
          <span>Authorized Responder Access →</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

    </div>
  );
};
