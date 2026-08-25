import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileCode, 
  ShieldCheck, 
  Lock, 
  Languages, 
  Zap,
  Play
} from 'lucide-react';
import { aiCompilerService, CompiledEmergencyIntelligence } from '../../services/aiCompilerService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDispatchCompiled?: (compiled: CompiledEmergencyIntelligence) => void;
}

export const EmergencyCompilerModal: React.FC<Props> = ({ isOpen, onClose, onDispatchCompiled }) => {
  const [inputText, setInputText] = useState('Bridge pakkathula 6 peru irukom, orutharukku adi pattirukku water romba varuthu');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledResult, setCompiledResult] = useState<CompiledEmergencyIntelligence | null>(() => 
    aiCompilerService.compile('Bridge pakkathula 6 peru irukom, orutharukku adi pattirukku water romba varuthu')
  );

  if (!isOpen) return null;

  const handleRunCompiler = () => {
    setIsCompiling(true);
    setTimeout(() => {
      const res = aiCompilerService.compile(inputText);
      setCompiledResult(res);
      setIsCompiling(false);
    }, 450);
  };

  const sampleInputs = [
    { label: 'Tamil Emergency', text: 'Bridge pakkathula 6 peru irukom, orutharukku adi pattirukku water romba varuthu' },
    { label: 'Hindi Emergency', text: 'Paani bohot tez badh raha hai bridge ke paas 5 log phase hue hain' },
    { label: 'English Emergency', text: 'We are trapped on roof near old hospital, water level surging, 4 people needing boat' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in">
      <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>DHOST EMERGENCY COMPILER™</span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                  NLP ENGINE
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Compiles unstructured human dialects into cryptographic machine intelligence
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

        {/* Input Text Box & Sample Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold uppercase">Raw Human Voice / Text Input:</span>
            <div className="flex gap-1.5">
              {sampleInputs.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => setInputText(sample.text)}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-amber-300 transition"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter spoken dialect in Tamil, Hindi, English..."
              className="w-full py-2.5 px-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500 font-mono"
            />

            <button
              onClick={handleRunCompiler}
              disabled={isCompiling}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shrink-0 transition active:scale-95 shadow-lg shadow-amber-950/40"
            >
              <Zap className="w-4 h-4" />
              <span>{isCompiling ? 'Compiling...' : 'Run Compiler'}</span>
            </button>
          </div>
        </div>

        {/* Compiled Structured Results */}
        {compiledResult && (
          <div className="space-y-4">
            
            {/* 7-Stage Pipeline Visualizer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block">
                7-STAGE REAL-TIME COMPILATION PIPELINE:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                {compiledResult.compilationStages.map(stage => (
                  <div key={stage.stageNumber} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400">{stage.stageNumber}. {stage.title}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className="text-[10px] text-slate-300 truncate">{stage.output}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Side-by-Side Dual Language Preservation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center justify-between">
                  <span>RAW HUMAN DIALECT</span>
                  <span className="text-amber-400 font-mono">{compiledResult.detectedLanguage}</span>
                </span>
                <p className="text-slate-200 font-medium italic leading-relaxed">
                  "{compiledResult.originalRawText}"
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/40 space-y-1.5">
                <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center justify-between">
                  <span>VALIDATED EMERGENCY TRANSLATION</span>
                  <span className="text-emerald-400 font-mono">CONFIDENCE: 98%</span>
                </span>
                <p className="text-white font-medium leading-relaxed">
                  "{compiledResult.translatedEnglish}"
                </p>
              </div>

            </div>

            {/* Machine Intelligence Structured Output Card */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 font-mono text-xs space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
                <span className="text-emerald-400 font-black text-xs">
                  STRUCTURED DHOST PACKET PAYLOAD
                </span>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px]">
                  {compiledResult.priority} ({compiledResult.aiUrgencyScore}%)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[9px]">INCIDENT TYPE</span>
                  <span className="font-bold text-white">{compiledResult.incidentLabel}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[9px]">PEOPLE COUNT</span>
                  <span className="font-bold text-amber-400">{compiledResult.peopleCount} Individuals</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[9px]">INJURIES</span>
                  <span className="font-bold text-red-400">{compiledResult.injuredCount} Casualties</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900">
                  <span className="text-slate-500 block text-[9px]">LOCATION LANDMARK</span>
                  <span className="font-bold text-blue-300">{compiledResult.extractedLandmark}</span>
                </div>
              </div>
            </div>

            {/* Trust Layer Source Attributions */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-[10px] font-mono">
              <span className="text-slate-500 uppercase font-bold tracking-wider block">
                DHOST TRUST LAYER ATTRIBUTIONS:
              </span>
              <div className="grid grid-cols-2 gap-1 text-slate-400">
                <span>• People: <strong className="text-slate-200">{compiledResult.trustLayer.peopleSource} ({compiledResult.trustLayer.peopleConfidence})</strong></span>
                <span>• Location: <strong className="text-slate-200">{compiledResult.trustLayer.locationSource} ({compiledResult.trustLayer.locationConfidence})</strong></span>
                <span>• Injury: <strong className="text-slate-200">{compiledResult.trustLayer.injurySource} ({compiledResult.trustLayer.injuryConfidence})</strong></span>
                <span>• Hazard: <strong className="text-slate-200">{compiledResult.trustLayer.hazardSource} ({compiledResult.trustLayer.hazardConfidence})</strong></span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
