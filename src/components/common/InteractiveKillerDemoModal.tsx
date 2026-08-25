import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  ShieldAlert, 
  Users, 
  Compass, 
  Brain, 
  Check, 
  Volume2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveKillerDemoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { playDispatchChime } = useDhostAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = [
    {
      step: 1,
      title: 'Grid Blackout: Internet & Cellular Severed',
      subtitle: 'Zero Infrastructure Available',
      badge: 'OFFLINE CRISIS',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      actionTitle: 'No Network ≠ No Status Matrix Active',
      actionBody: 'Subsea fiber cut and base stations destroyed. DHOST activates offline LoRa 868MHz mesh and local cryptographic buffer automatically.',
      targetRoute: '/network'
    },
    {
      step: 2,
      title: 'Victim Speaks Messy Regional Dialect (Tamil)',
      subtitle: 'Zero-Input & Voice Intake',
      badge: 'INTAKE',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      actionTitle: 'Raw Input: "Bridge pakkathula 6 peru irukom, orutharukku adi..."',
      actionBody: 'Citizen injured and trapped in 4ft surging floodwater speaks local Tamil dialect into phone.',
      targetRoute: '/'
    },
    {
      step: 3,
      title: 'DHOST Emergency Compiler™ Synthesizes Intelligence',
      subtitle: '7-Stage NLP & Trust Layer',
      badge: 'AI COMPILER',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      actionTitle: 'Compiled: FLOOD + RESCUE • 6 People • 1 Injured • Near Bridge',
      actionBody: 'Compiler transforms raw speech into an ED25519-signed emergency packet with location confidence (±12m) and battery allocation.',
      targetRoute: '/victim'
    },
    {
      step: 4,
      title: 'Store-and-Forward Mesh Discovery & Multi-Hop Relay',
      subtitle: 'Decentralized Propagation',
      badge: 'LORA MESH',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
      actionTitle: 'Bluetooth LE ➔ Wi-Fi Direct ➔ Drone Mesh 868MHz',
      actionBody: 'Packet hops from victim device across neighboring citizen nodes and rooftop drone relay without cellular service.',
      targetRoute: '/network'
    },
    {
      step: 5,
      title: 'Self-Healing Reroute: Relay Severed & Path Recovered',
      subtitle: 'Resilient Failure Recovery',
      badge: 'SELF-HEALING',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      actionTitle: 'Relay A Lost ➔ Mesh Auto-Reroutes via Relay C & D',
      actionBody: 'When a citizen relay moves out of range, DHOST dynamic routing instantly recovers the packet path within 140ms.',
      targetRoute: '/network'
    },
    {
      step: 6,
      title: 'Commander EOC Receives Packet & AI Triage Match',
      subtitle: 'Tactical Decision Picture',
      badge: 'EOC COMMAND',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      actionTitle: 'AI Urgency Score: 94% ➔ Recommends Boat Unit RSC-1088',
      actionBody: 'Commander Center sounds audible dispatch chime. AI matches flood depth with specialized motorized Zodiac boat unit.',
      targetRoute: '/command'
    },
    {
      step: 7,
      title: 'Rescue Route Intelligence: Safe vs Flood-Exposed',
      subtitle: 'GIS Terrain Navigation',
      badge: 'SAFE ROUTE',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      actionTitle: 'Selected Safe Route (4.8km, 12 min) Avoiding Downed 11kV Wires',
      actionBody: 'Responders receive GIS safe navigation path avoiding unpassable debris and submerged roads.',
      targetRoute: '/rescue'
    },
    {
      step: 8,
      title: 'Incident Acknowledged & 6 Victims Rescued',
      subtitle: 'Full Lifecycle Complete',
      badge: 'RESCUED SAFE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      actionTitle: 'Victim Screen Updates to "RESCUED" via Mesh Acknowledgment',
      actionBody: 'Complete end-to-end loop: From offline Tamil speech to coordinated rescue extraction without internet or cellular towers!',
      targetRoute: '/victim'
    }
  ];

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          if (next === 5) playDispatchChime();
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!isOpen) return null;

  const current = demoSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100 font-sans animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>10/10 KILLER DEMO WALKTHROUGH</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  JUDGING STORY
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End Autonomous Emergency Infrastructure Story
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Step Badge */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-amber-400 font-bold">
              STEP {current.step} OF {demoSteps.length}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${(current.step / demoSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Story Focus Card */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 shadow-inner">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">
              {current.subtitle}
            </span>
            <h3 className="text-base font-black text-white leading-tight mt-0.5">
              {current.title}
            </h3>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 text-amber-200 font-mono text-xs space-y-1">
            <span className="font-bold block text-white">{current.actionTitle}</span>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{current.actionBody}</p>
          </div>
        </div>

        {/* Controller Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40 transition"
            >
              Previous
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-amber-950/40"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Auto-Play Story'}</span>
            </button>

            <button
              onClick={() => setCurrentStep(prev => Math.min(demoSteps.length - 1, prev + 1))}
              disabled={currentStep === demoSteps.length - 1}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              navigate(current.targetRoute);
            }}
            className="px-3 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center gap-1 transition"
          >
            <span>Jump to View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
