import React, { useState } from 'react';
import { HeartHandshake, ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const CommunityReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const { createCommunityReport } = useDhostAuth();

  const [hazardType, setHazardType] = useState('STRANDED_NEIGHBORS');
  const [description, setDescription] = useState('Four elderly people stranded in first floor apartment, flood water level 6 feet.');
  const [landmark, setLandmark] = useState('Near Ganesh Temple, Maduvankarai');
  const [peopleCount, setPeopleCount] = useState(4);
  const [reportSent, setReportSent] = useState(false);

  const handleSubmit = () => {
    createCommunityReport({
      hazardType,
      description,
      peopleCount,
      location: {
        lat: 11.6685,
        lng: 78.1420,
        accuracyMeters: 8.2,
        address: landmark || 'Maduvankarai, Salem',
        landmark: landmark || 'Maduvankarai'
      }
    });

    setReportSent(true);
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

        <div className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-[10px] font-black text-purple-400 tracking-wide">COMMUNITY REPORTER</span>
        </div>
      </div>

      {!reportSent ? (
        <div className="space-y-4">
          
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white">🤝 Help Others • Community Report</h2>
            <p className="text-xs text-slate-400">
              Report people in danger or hazards you observe. This will be flagged as a <span className="text-purple-400 font-bold">COMMUNITY REPORT</span> for commanders.
            </p>
          </div>

          {/* Hazard Category */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300">OBSERVED HAZARD / SITUATION:</label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { type: 'STRANDED_NEIGHBORS', label: '👥 Stranded People', desc: 'Neighbors need evacuation' },
                { type: 'ROAD_BLOCKED', label: '🚧 Road / Bridge Blocked', desc: 'Tree fallen or deep water' },
                { type: 'POWER_HAZARD', label: '⚡ Live Power Wires', desc: 'Sparking or submerged' },
                { type: 'MEDICAL_EMERGENCY', label: '🩺 Medical Incident', desc: 'Injured person observed' }
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setHazardType(item.type)}
                  className={`p-3 rounded-2xl border text-left transition ${hazardType === item.type ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-400'}`}
                >
                  <p className="text-xs font-black">{item.label}</p>
                  <p className="text-[10px] opacity-75">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated People Count */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-300">ESTIMATED PEOPLE AFFECTED:</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, '5+'].map((num, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPeopleCount(typeof num === 'number' ? num : 5)}
                  className={`flex-1 py-2.5 rounded-xl border font-black text-xs transition ${
                    (peopleCount === num || (peopleCount >= 5 && num === '5+'))
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">HAZARD OR PERSON DETAILS:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">LOCATION / LANDMARK:</label>
            <div className="relative">
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g., Near Maduvankarai Telephone Exchange"
                className="w-full py-2.5 px-3 pl-8 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <MapPin className="w-3.5 h-3.5 text-purple-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              className="w-full py-4 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-xl shadow-purple-950/80 flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <HeartHandshake className="w-5 h-5" />
              <span>SUBMIT COMMUNITY HAZARD REPORT</span>
            </button>
          </div>

        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-slate-900 border border-purple-500/40 text-center space-y-5 shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center mx-auto text-purple-400">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-white">Community Report Broadcasted!</h3>
            <p className="text-xs text-slate-400">
              Thank you. Your report has been transmitted with the <b className="text-purple-400">COMMUNITY REPORT</b> tag to ensure rescue commanders prioritize it for field verification.
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <p className="font-bold text-white">{description}</p>
            <p className="text-slate-400">{landmark} • <span className="font-bold text-purple-400">{peopleCount} People</span></p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
          >
            Return to Emergency Home
          </button>
        </div>
      )}

    </div>
  );
};
