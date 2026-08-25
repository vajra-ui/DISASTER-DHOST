import React, { useState } from 'react';
import { CheckCircle2, ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const SafeCheckInScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createSafeCheckIn } = useDhostAuth();

  const [name, setName] = useState('');
  const [message, setMessage] = useState('Safe at General Community Shelter, with family (3 people).');
  const [landmark, setLandmark] = useState('Relief Camp, Anna Nagar');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSubmit = () => {
    createSafeCheckIn({
      name,
      message,
      location: {
        lat: 11.6685,
        lng: 78.1420,
        accuracyMeters: 6.5,
        address: landmark || 'Fairlands Relief Shelter, Salem',
        landmark: landmark || 'Fairlands Relief Shelter'
      }
    });

    setBroadcastSent(true);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 p-4 max-w-md mx-auto space-y-5 animate-in fade-in">
      
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Emergency Home</span>
        </button>

        <div className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-black text-emerald-400 tracking-wide">SAFETY CHECK-IN</span>
        </div>
      </div>

      {!broadcastSent ? (
        <div className="space-y-5">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white transition">🟢 I'm Safe Check-In</h2>
            <p className="text-xs text-slate-400">
              Broadcast your safety status across the DHOST mesh network to alert rescue authorities and community searchers.
            </p>
          </div>

          {/* Name optional */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">YOUR NAME / HEAD OF FAMILY (optional):</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Sundaram & Family"
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Current Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">CURRENT LOCATION / SHELTER:</label>
            <div className="relative">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Anna Nagar Relief Shelter"
                className="w-full py-2.5 px-3 pl-8 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
              <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Status Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">SAFETY NOTE:</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-950/80 flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>BROADCAST 'I'M SAFE' STATUS</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-white">Safe Status Broadcasted!</h3>
            <p className="text-xs text-slate-400">
              Your safety status has been recorded on the local DHOST mesh and synced with emergency commanders.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <p className="font-bold text-white">{name || 'Anonymous Citizen'}</p>
            <p className="text-slate-400">{landmark}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
          >
            Return to Emergency Home
          </button>
        </div>
      )}

    </div>
  );
};

