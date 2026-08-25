import React, { useState } from 'react';
import { Shield, Lock, Key, ArrowRight, AlertTriangle, ArrowLeft, Sparkles, Ambulance } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { RoleService } from '../../services/roleService';
import { UserRole } from '../../types/dhostAuth';

export const ResponderLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoAccounts, quickSwitchDemo, currentUser } = useDhostAuth();

  const [organization, setOrganization] = useState('NDRF');
  const [responderId, setResponderId] = useState('CMD-001');
  const [pin, setPin] = useState('9900');
  const [trustDevice, setTrustDevice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await login(organization, responderId, pin, trustDevice);
      const from = ((location.state as any)?.from?.pathname);
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate(RoleService.getDefaultRouteForRole(user.role), { replace: true });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectDemoLogin = (role: UserRole) => {
    quickSwitchDemo(role);
    if (role === 'COMMANDER') navigate('/command');
    else if (role === 'RESCUE_TEAM') navigate('/rescue');
    else if (role === 'MEDICAL') navigate('/medical');
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 animate-in fade-in select-none">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Back to Emergency Home */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Emergency Home</span>
          </button>

          <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 tracking-wide">RESPONDER PORTAL</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-950 border border-slate-700/80 p-1 flex items-center justify-center shadow-lg">
            <img src="/disaster-dhost-logo.png" alt="Disaster Dhost" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Authorized Responder Access</h2>
          <p className="text-xs text-slate-400">
            Select your response unit below or authenticate with credentials.
          </p>
        </div>

        {/* 1-CLICK INSTANT RESPONDER ACCESS TILES */}
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-white">⚡ 1-Click Direct Role Access:</span>
            <span className="text-[10px] text-amber-400 font-bold">Instant Login</span>
          </div>

          <div className="space-y-2">
            
            {/* 1. Commander */}
            <button
              type="button"
              onClick={() => handleDirectDemoLogin('COMMANDER')}
              className="w-full p-3 rounded-xl bg-slate-900 border border-amber-500/40 hover:bg-amber-950/30 hover:border-amber-500 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">EOC Command Center (CMD-001)</p>
                  <p className="text-[10px] text-slate-400">Capt. Rajesh Varma • Operations Lead</p>
                </div>
              </div>
              <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* 2. Rescue Team */}
            <button
              type="button"
              onClick={() => handleDirectDemoLogin('RESCUE_TEAM')}
              className="w-full p-3 rounded-xl bg-slate-900 border border-blue-500/40 hover:bg-blue-950/30 hover:border-blue-500 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Rescue Team Alpha (RSC-1042)</p>
                  <p className="text-[10px] text-slate-400">Sgt. Ananya Sen • Field Rescue Lead</p>
                </div>
              </div>
              <span className="text-xs text-blue-400 font-bold flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

            {/* 3. Medical Team */}
            <button
              type="button"
              onClick={() => handleDirectDemoLogin('MEDICAL')}
              className="w-full p-3 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-950/30 hover:border-emerald-500 text-left transition flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-white">Medical Triage Corps (MED-204)</p>
                  <p className="text-[10px] text-slate-400">Dr. K. Raghavan • Paramedic Triage</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>

          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/60 text-xs space-y-1 animate-in zoom-in-95">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-red-400">Authentication Failed</p>
                <p className="text-slate-300 leading-relaxed">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Manual Login Form */}
        <form onSubmit={handleLogin} className="space-y-3 pt-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            OR MANUAL PIN LOGIN:
          </p>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">ORGANIZATION:</label>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="NDRF">NDRF • National Disaster Response Force</option>
              <option value="SDRF">SDRF • State Disaster Response Force</option>
              <option value="TNFRS">TNFRS • Fire & Rescue Services</option>
              <option value="DPC-MED">Indian Red Cross / Medical Corps</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">CALL SIGN / ID:</label>
            <div className="relative">
              <input
                type="text"
                value={responderId}
                onChange={(e) => setResponderId(e.target.value)}
                placeholder="CMD-001"
                required
                className="w-full py-2 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <Key className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">SECURITY PIN:</label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="9900"
                required
                className="w-full py-2 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{loading ? 'Verifying...' : 'LOGIN TO DASHBOARD'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};