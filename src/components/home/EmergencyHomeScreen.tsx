import React, { useState, useEffect, useRef } from 'react';
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
  Volume2,
  Lock,
  Sparkles,
  Compass,
  AlertTriangle
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
    startVoiceSos
  } = useDhostAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [stopVoiceFn, setStopVoiceFn] = useState<(() => void) | null>(null);
  const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number; address: string; accuracyMeters: number } | null>(null);
  const [batteryPct, setBatteryPct] = useState<number>(85);

  // Press & Hold 2-Second State
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdIntervalRef = useRef<any>(null);

  useEffect(() => {
    setBatteryPct(getBatteryLevel());
    getLiveCoordinates().then((loc) => {
      setLiveLocation({
        lat: loc.lat,
        lng: loc.lng,
        address: loc.address,
        accuracyMeters: loc.accuracyMeters || 12
      });
    });
  }, []);

  // Quick 1-Tap SOS Dispatcher
  const handleQuickSos = async (type: IncidentType = 'FLOOD_TRAPPED', text?: string) => {
    if (isSubmitting) return;
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
          'Zero-Input SOS Broadcasted - Emergency Rescue Required'
        ),
        peopleCount: 1,
        location: loc,
        batteryLevel: batteryPct
      });
      navigate('/victim', { state: { activeIncident: newPacket } });
    } catch {
      navigate('/victim');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hold 2 Seconds Handlers
  const startHold = () => {
    setIsHolding(true);
    setHoldProgress(0);
    const startTime = Date.now();
    const duration = 1800; // 1.8 seconds hold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(progress);

      if (progress >= 100) {
        clearInterval(holdIntervalRef.current);
        setIsHolding(false);
        // Trigger haptic vibration if supported
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        handleQuickSos('FLOOD_TRAPPED', 'Zero-Input 2-Second Hold Emergency SOS');
      }
    }, 30);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    setIsHolding(false);
    setHoldProgress(0);
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

  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-slate-100 flex flex-col justify-between p-4 max-w-md mx-auto space-y-4 select-none animate-in fade-in duration-200">
      
      {/* Top Device Live Telemetry Bar */}
      <div className="space-y-3">
        
        {/* Multi-Signal Sensor Fusion Status */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {liveLocation ? `GPS ±${liveLocation.accuracyMeters}m (HIGH)` : 'Acquiring Fix...'}
              </span>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-400 text-[11px] font-black">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>ZERO-AUTH EMERGENCY PROTOCOL</span>
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            DO YOU NEED IMMEDIATE RESCUE?
          </h1>
          <p className="text-[11px] text-slate-400">
            Press once or hold 2s for Zero-Input Beacon
          </p>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 1. ZERO-INPUT SOS BUTTON WITH 2-SECOND EXPANDING RING   */}
      {/* ======================================================== */}
      <div className="flex flex-col items-center justify-center my-auto py-2">
        <div className="relative flex items-center justify-center">
          
          {/* Pulsing Backlight */}
          <div className="absolute -inset-4 rounded-full bg-red-600/30 blur-2xl animate-pulse pointer-events-none" />

          {/* SVG Progress Ring */}
          <svg className="w-56 h-56 transform -rotate-90 pointer-events-none absolute">
            <circle
              cx="112"
              cy="112"
              r="102"
              stroke="#1e293b"
              strokeWidth="6"
              fill="transparent"
            />
            {isHolding && (
              <circle
                cx="112"
                cy="112"
                r="102"
                stroke="#f59e0b"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 102}
                strokeDashoffset={2 * Math.PI * 102 * (1 - holdProgress / 100)}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
            )}
          </svg>

          {/* Main Panic Button */}
          <button
            onClick={() => handleQuickSos('FLOOD_TRAPPED')}
            onMouseDown={startHold}
            onMouseUp={cancelHold}
            onMouseLeave={cancelHold}
            onTouchStart={startHold}
            onTouchEnd={cancelHold}
            disabled={isSubmitting}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-amber-500 text-white flex flex-col items-center justify-center shadow-2xl shadow-red-950/90 active:scale-95 transition-transform duration-100 border-4 border-red-400/60 relative z-10 group"
          >
            <AlertOctagon className="w-14 h-14 animate-bounce mb-1" />
            <span className="text-xl font-black tracking-tight leading-none">
              I NEED HELP
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 mt-1">
              {isHolding ? `HOLDING... ${Math.round(holdProgress)}%` : 'TAP OR HOLD 2S'}
            </span>
          </button>
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">
          ✓ Real GPS Encrypted • ✓ Relayed over LoRa Mesh • ✓ Zero Login
        </p>
      </div>

      {/* ======================================================== */}
      {/* 2. NOISY VOICE MODE / SCENARIO TILES                     */}
      {/* ======================================================== */}
      <div className="space-y-3">
        
        {/* Voice SOS Bar */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleVoiceSos}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition flex-1 mr-2 ${
                isListeningVoice
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {isListeningVoice ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-slate-400" />}
              <span>{isListeningVoice ? 'Listening in storm... Tap when done' : '🎙️ Voice SOS in any language'}</span>
            </button>
          </div>

          {/* Noisy Voice Fallback Selector */}
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
              1-TAP NOISY VOICE FALLBACK:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => handleQuickSos('FLOOD_TRAPPED', 'Trapped by Deep Floodwater')}
                className="py-1.5 px-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-[10px] font-bold text-center"
              >
                🌊 WATER
              </button>
              <button
                onClick={() => handleQuickSos('STRUCTURAL_COLLAPSE', 'Trapped Under Collapse Debris')}
                className="py-1.5 px-2 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold text-center"
              >
                🧱 RESCUE
              </button>
              <button
                onClick={() => handleQuickSos('MEDICAL_CRITICAL', 'Medical Trauma & Bleeding')}
                className="py-1.5 px-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-[10px] font-bold text-center"
              >
                🩺 MEDICAL
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Helper Links */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate('/safe')}
            className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Myself Safe</span>
          </button>

          <button
            onClick={() => navigate('/community')}
            className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-purple-300 text-xs font-bold hover:bg-slate-800 flex items-center justify-center gap-1.5 transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>

      </div>

    </div>
  );
};
