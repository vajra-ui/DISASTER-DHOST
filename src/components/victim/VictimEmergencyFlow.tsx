import React, { useState } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Radio, 
  CheckCircle2, 
  ArrowLeft, 
  Check, 
  User 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { EmergencyPacket, IncidentType } from '../../types/dhostAuth';

export const VictimEmergencyFlow: React.FC = () => {
  const navigate = useNavigate();
  const { 
    createVictimEmergency, 
    openPacketInspector
  } = useDhostAuth();

  // Form State
  const [step, setStep] = useState<'form' | 'tracking'>('form');
  const [incidentType, setIncidentType] = useState<IncidentType>('FLOOD_TRAPPED');
  const [peopleCount, setPeopleCount] = useState(2);
  const [requestText, setRequestText] = useState('Thanni iduppu mattam vandhuruchi, rooftop la irukkom (Water level at waist height, trapped on rooftop)');
  const [originalLanguage, setOriginalLanguage] = useState('Tamil');
  const [landmark, setLandmark] = useState('Near Medical Center, Vadapalani');
  
  // Voluntary contact
  const [voluntaryName, setVoluntaryName] = useState('');
  const [voluntaryPhone, setVoluntaryPhone] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');

  // Active Packet State
  const [activePacket, setActivePacket] = useState<EmergencyPacket | null>(null);
  const [identitySaved, setIdentitySaved] = useState(false);

  const handleSubmitSOS = () => {
    const pk = createVictimEmergency({
      incidentType,
      requestText,
      originalLanguage,
      peopleCount,
      location: {
        latitude: 13.0499,
        longitude: 80.2115,
        accuracyMeters: 4.8,
        address: landmark || 'Auto-GPS Location, Chennai',
        landmark: landmark
      },
      batteryLevel: 86,
      voluntaryContact: {
        name: voluntaryName || undefined,
        phone: voluntaryPhone || undefined,
        medicalNotes: medicalNotes || undefined
      }
    });

    setActivePacket(pk);
    setStep('tracking');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 max-w-md mx-auto space-y-5 animate-in fade-in">
      
      {/* Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Emergency Home</span>
        </button>

        <div className="px-2.5 py-1 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-[10px] font-black text-red-400 tracking-wide">ZERO AUTH CHANNEL</span>
        </div>
      </div>

      {step === 'form' ? (
        <div className="space-y-4">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Send Instant SOS</h2>
            <p className="text-xs text-slate-400">
              Your device is generating an anonymous mesh packet. Select your situation below:
            </p>
          </div>

          {/* Emergency Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300">EMERGENCY TYPE:</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { type: 'FLOOD_TRAPPED', label: '🏊 Flood / Trapped', desc: 'Water level rising' },
                { type: 'MEDICAL_CRITICAL', label: '🩺 Medical Critical', desc: 'Urgent care needed' },
                { type: 'STRUCTURAL_COLLAPSE', label: '🏢 Rubble / Trapped', desc: 'Building damaged' },
                { type: 'FIRE_HAZARD', label: '🔥 Fire / Smoke', desc: 'Evacuation blocked' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setIncidentType(item.type as IncidentType)}
                  className={`p-3 rounded-2xl border text-left transition ${incidentType === item.type ? 'bg-red-600/20 border-red-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="text-[10px] opacity-75">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* People Count Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300">HOW MANY PEOPLE NEED HELP?</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, '5+'].map((num, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPeopleCount(typeof num === 'number' ? num : 5)}
                  className={`flex-1 py-2.5 rounded-xl border font-black text-xs transition ${
                    (peopleCount === num || (peopleCount >= 5 && num === '5+'))
                      ? 'bg-red-500 border-red-400 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Voice / Text Emergency Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-slate-300">DESCRIBE YOUR SITUATION (optional):</label>
              <span className="text-[10px] text-slate-500">Any Language</span>
            </div>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              rows={2}
              placeholder="Say or type your need (e.g., Stranded on rooftop, water rising, elderly person with me)"
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Location / Landmark */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">LOCATION / LANDMARK:</label>
            <div className="relative">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Near Medical Center, Vadapalani"
                className="w-full py-2.5 px-3 pl-8 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-red-500"
              />
              <MapPin className="w-3.5 h-3.5 text-red-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Transmit Beacon Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmitSOS}
              className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base shadow-xl shadow-red-950/80 flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <AlertOctagon className="w-5 h-5" />
              <span>BROADCAST EMERGENCY PACKET</span>
            </button>
          </div>

        </div>
      ) : (
        /* LIVE SOS TRACKING BEACON SCREEN */
        activePacket && (
          <div className="space-y-4">
            
            {/* Beacon Status Banner */}
            <div className="p-5 rounded-3xl bg-red-950/70 border border-red-500/50 shadow-2xl shadow-red-950/80 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto text-red-400">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">EMERGENCY BEACON ACTIVE</h3>
                <p className="text-xs text-red-300">
                  Transmitting over local DHOST mesh relays
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-slate-200">
                  INCIDENT: {activePacket.incidentId}
                </span>
                <button
                  onClick={() => openPacketInspector(activePacket)}
                  className="px-2.5 py-1 rounded-xl bg-blue-600/20 border border-blue-500/40 text-xs font-bold text-blue-300"
                >
                  Inspect Packet
                </button>
              </div>
            </div>

            {/* Mesh Relay Live Status */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">DHOST Live Relay Tracker</span>
                <span className="text-emerald-400 font-bold">✓ Operational</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {activePacket.dhostPath.map((node, i) => (
                  <div key={i} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-300 whitespace-nowrap">
                    {node}
                  </div>
                ))}
              </div>
            </div>

            {/* OPTIONAL Voluntary Contact Info */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div>
                <p className="text-xs font-black text-white">OPTIONAL VOLUNTARY CONTACT</p>
                <p className="text-[10px] text-slate-400">
                  Never mandatory for rescue. Providing your name helps rescuers identify your family.
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={voluntaryName}
                  onChange={(e) => setVoluntaryName(e.target.value)}
                  placeholder="Your Name (optional)"
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
                <input
                  type="tel"
                  value={voluntaryPhone}
                  onChange={(e) => setVoluntaryPhone(e.target.value)}
                  placeholder="Contact Number (optional)"
                  className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <button
                onClick={() => setIdentitySaved(true)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {identitySaved ? <Check className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4" />}
                <span>{identitySaved ? 'Contact Preserved Locally' : 'Save Contact Details'}</span>
              </button>
            </div>

            {/* Stop / I am Safe Button */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/safe')}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold text-xs flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I AM RESCUED / SAFE NOW</span>
              </button>
            </div>

          </div>
        )
      )}

    </div>
  );
};
