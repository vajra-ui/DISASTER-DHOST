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
  Check, 
  Phone,
  Waves,
  HeartPulse,
  Building2,
  Flame,
  Send
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { EmergencyPacket, IncidentType } from '../../types/dhostAuth';

export const VictimEmergencyFlow: React.FC = () => {
  const navigate = useNavigate();
  const locationState = useLocation();
  const { 
    addIncident, 
    openPacketInspector,
    getLiveCoordinates,
    getBatteryLevel,
    playRescueSiren,
    stopRescueSiren,
    generateSmsDistressUri,
    generateWhatsAppDistressUri,
    triggerNativeShare,
    updateIncidentStatus
  } = useDhostAuth();

  const [activePacket, setActivePacket] = useState<EmergencyPacket | null>(() => {
    return (locationState.state as any)?.activeIncident || null;
  });

  // Form State if starting fresh
  const [incidentType, setIncidentType] = useState<IncidentType>('FLOOD_TRAPPED');
  const [peopleCount, setPeopleCount] = useState(2);
  const [requestText, setRequestText] = useState('Floodwater reaching 1st floor roof, 2 adults and 1 infant trapped');
  const [landmark, setLandmark] = useState('Near Fairlands Primary School');
  const [voluntaryName, setVoluntaryName] = useState('');
  const [voluntaryPhone, setVoluntaryPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // Hardware states
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState<'white' | 'red'>('white');
  const [voluntarySaved, setVoluntarySaved] = useState(false);

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

  const handleSubmitFreshSos = async () => {
    const loc = await getLiveCoordinates();
    const newPacket = addIncident({
      incidentType,
      requestText,
      peopleCount,
      location: {
        lat: loc.lat,
        lng: loc.lng,
        accuracyMeters: loc.accuracyMeters,
        address: landmark || loc.address,
        landmark: landmark || loc.landmark
      },
      batteryLevel: getBatteryLevel(),
      voluntaryContact: {
        name: voluntaryName || undefined,
        phone: voluntaryPhone || undefined,
        medicalNotes: medicalNotes || undefined
      }
    });

    setActivePacket(newPacket);
  };

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
      stopRescueSiren();
      navigate('/');
    }
  };

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
          <SunMedium className="w-20 h-20 mx-auto animate-spin" />
          <h1 className="text-4xl font-black tracking-wider">SOS RESCUE STROBE</h1>
          <p className="text-sm font-extrabold uppercase">Hold high above head for search boats & drones</p>
          <div className="py-2 px-6 rounded-full bg-black/40 text-white font-mono text-xs inline-block">
            Tap anywhere to turn off
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-black text-slate-100 p-4 max-w-md mx-auto space-y-4 animate-in fade-in select-none">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            stopRescueSiren();
            navigate('/');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Home</span>
        </button>

        <div className="px-2.5 py-1 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-black text-red-400 tracking-wider">LIVE RESCUE CHANNEL</span>
        </div>
      </div>

      {activePacket ? (
        /* ============================================================ */
        /* ACTIVE RESCUE BEACON & SURVIVAL TOOLS (ZERO TYPING REQUIRED) */
        /* ============================================================ */
        <div className="space-y-4 animate-in zoom-in-95">
          
          {/* Main Beacon Status Card */}
          <div className="p-5 rounded-3xl bg-slate-900 border-2 border-red-500/60 text-center space-y-3 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center mx-auto text-red-500 shadow-inner">
              <AlertOctagon className="w-9 h-9 animate-pulse" />
            </div>

            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-black tracking-widest uppercase">
                EMERGENCY BEACON ACTIVE
              </span>
              <h2 className="text-2xl font-black text-white">{activePacket.incidentCategoryLabel}</h2>
              <p className="text-xs text-slate-300 font-mono">
                Assigned Token: <span className="text-amber-400 font-bold">{activePacket.incidentId}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-around text-xs font-mono">
              <div>
                <span className="text-[10px] text-slate-500 block">STATUS</span>
                <span className="text-amber-400 font-bold">{activePacket.status}</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 block">MESH HOPS</span>
                <span className="text-emerald-400 font-bold">{activePacket.hopCount} Hops</span>
              </div>
              <div className="w-px h-6 bg-slate-800" />
              <div>
                <span className="text-[10px] text-slate-500 block">BATTERY</span>
                <span className="text-slate-200 font-bold">{activePacket.batteryLevel}%</span>
              </div>
            </div>
          </div>

          {/* ACOUSTIC SIREN & STROBE LIGHT BUTTONS (HIGH VISIBILITY) */}
          <div className="grid grid-cols-2 gap-3">
            
            <button
              onClick={handleToggleSiren}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between gap-3 active:scale-95 transition ${
                isSirenPlaying 
                  ? 'bg-red-600 border-red-400 text-white animate-pulse' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                {isSirenPlaying ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-amber-400" />}
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSirenPlaying ? 'bg-black/30' : 'bg-slate-800 text-slate-400'}`}>
                  {isSirenPlaying ? 'PLAYING' : 'OFF'}
                </span>
              </div>
              <div>
                <p className="text-xs font-black">{isSirenPlaying ? 'Stop Siren' : 'Loud Rescue Siren'}</p>
                <p className="text-[10px] opacity-75">Acoustic sweep for rescue boats</p>
              </div>
            </button>

            <button
              onClick={() => setIsStrobeActive(true)}
              className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-left flex flex-col justify-between gap-3 active:scale-95 transition"
            >
              <div className="flex items-center justify-between">
                <SunMedium className="w-6 h-6 text-amber-400" />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  READY
                </span>
              </div>
              <div>
                <p className="text-xs font-black text-white">Screen Strobe Torch</p>
                <p className="text-[10px] text-slate-400">High-power visual night beacon</p>
              </div>
            </button>

          </div>

          {/* NEAREST SHELTER GUIDANCE */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">Fairlands Relief Shelter</p>
                <p className="text-[10px] text-slate-400">Distance: <span className="text-emerald-400 font-bold">420 meters North-East</span></p>
              </div>
            </div>
            <a
              href={`https://maps.google.com/?q=${activePacket.location.lat},${activePacket.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white"
            >
              Maps
            </a>
          </div>

          {/* OFFLINE BACKUP SMS & WHATSAPP DISPATCH */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <p className="text-[11px] font-black text-slate-300">CELLULAR BACKUP DISPATCH (1-TAP):</p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={generateSmsDistressUri(activePacket)}
                className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition text-center"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send SMS to 112</span>
              </a>

              <a
                href={generateWhatsAppDistressUri(activePacket)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition text-center"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp SOS</span>
              </a>
            </div>

            <button
              onClick={() => triggerNativeShare(activePacket)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Live Beacon Link</span>
            </button>
          </div>

          {/* VOLUNTARY CONTACT (ALWAYS OPTIONAL) */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Add Optional Contact Info:</span>
              {voluntarySaved && <span className="text-[10px] text-emerald-400 font-bold">Saved!</span>}
            </div>

            <div className="space-y-1.5">
              <input
                type="text"
                value={voluntaryName}
                onChange={e => setVoluntaryName(e.target.value)}
                placeholder="Your Name (Optional)"
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
              <input
                type="tel"
                value={voluntaryPhone}
                onChange={e => setVoluntaryPhone(e.target.value)}
                placeholder="Phone Number (Optional)"
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={() => setVoluntarySaved(true)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
              >
                Save Contact Info
              </button>
            </div>
          </div>

          {/* 1-TAP I AM RESCUED / CANCEL SOS */}
          <div className="pt-2">
            <button
              onClick={handleMarkRescued}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>I AM SAFE & RESCUED (CLOSE SOS)</span>
            </button>
          </div>

        </div>
      ) : (
        /* ============================================================ */
        /* FRESH SOS FORM (FALLBACK) */
        /* ============================================================ */
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">Emergency Assistance Request</h2>
            <p className="text-xs text-slate-400">Choose situation and tap Send SOS.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { type: 'FLOOD_TRAPPED', label: '🌊 Flood Water', icon: Waves },
              { type: 'MEDICAL_CRITICAL', label: '🩺 Medical Emergency', icon: HeartPulse },
              { type: 'STRUCTURAL_COLLAPSE', label: '🏚️ Building Collapse', icon: Building2 },
              { type: 'FIRE_HAZARD', label: '⚡ Fire / Power Wire', icon: Flame },
            ].map(item => (
              <button
                key={item.type}
                type="button"
                onClick={() => setIncidentType(item.type as IncidentType)}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-2 ${
                  incidentType === item.type 
                    ? 'bg-red-600/30 border-red-500 text-white' 
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-black">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">PEOPLE AFFECTED:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((num, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPeopleCount(typeof num === 'number' ? num : 5)}
                  className={`flex-1 py-2 rounded-xl border text-xs font-black transition ${
                    peopleCount === num || (peopleCount >= 5 && num === '5+')
                      ? 'bg-red-600 border-red-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">SITUATION DETAILS:</label>
            <textarea
              value={requestText}
              onChange={e => setRequestText(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <button
            onClick={handleSubmitFreshSos}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
            <span>TRANSMIT EMERGENCY SOS BEACON</span>
          </button>
        </div>
      )}

    </div>
  );
};
