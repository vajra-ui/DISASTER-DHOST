import React, { useState } from 'react';
import { Shield, Lock, Key, ArrowRight, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { RoleService } from '../../services/roleService';

export const ResponderLoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, demoAccounts } = useDhostAuth();

  const [organization, setOrganization] = useState('NDRF');
  const [responderId, setResponderId] = useState('CMD-001');
  const [pin, setPin] = useState('9900');
  const [trustDevice, setTrustDevice] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showRequestAccess, setShowRequestAccess] = useState(false);

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

  const handleQuickFill = (account: typeof demoAccounts[0]) => {
    setOrganization(account.organization);
    setResponderId(account.responderId);
    setPin(account.demoPin);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 animate-in fade-in">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Back to Emergency Home */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Emergency Home (SOS)</span>
          </button>

          <div className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-black text-amber-400 tracking-wide">OPS AUTH PORTAL</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">Responder Operations</h2>
          <p className="text-xs text-slate-400">
            Verified access for Rescue Teams, Medical Triage, and Commanders.
          </p>
        </div>


        {/* Quick Demo Loaders */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-300">1-Click Demo Credentials:</span>
            <span className="text-[10px] text-amber-400 font-bold">⚡ Autofill</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.responderId}
                type="button"
                onClick={() => handleQuickFill(acc)}
                className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold text-center transition ${
                  responderId === acc.responderId
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <p className="font-mono">{acc.responderId}</p>
                <span className="opacity-75">{acc.role.split('_')[0]}</span>
              </button>
            ))}
          </div>
        </div>


        {/* Offline Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/80 border border-red-500/60 text-xs space-y-2 animate-in zoom-in-95">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-extrabold text-red-400">Authentication Restriction</p>
                <p className="text-slate-300 leading-relaxed">{errorMessage}</p>
              </div>
            </div>

            {errorMessage.includes('NETWORK') && (
              <button
                type="button"
                onClick={() => setShowRequestAccess(true)}
                className="px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-[10px] transition"
              >
                ✓ Request Local Mesh Provisioning
              </button>
            )}
          </div>
        )}


        {showRequestAccess && (
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
            <p className="font-bold text-white">Local Mesh Provisioning Request</p>
            <p className="text-[10px] text-slate-400">
              Hardware Signature: <br />
              <span className="font-mono text-emerald-400">DHOST-DEV-8A7FEF4-93</span>
            </p>
            <p className="text-[10px] text-slate-400">Present this device to your Commander Base Station for offline key signing.</p>
          </div>
        )}


        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Organization Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">RESPONSE ORGANIZATION:</label>
            <select
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="NDRF">NDRF • National Disaster Response Force</option>
              <option value="SDRF">SDRF • State Disaster Response Force</option>
              <option value="TNFRS">TNFRS • Fire & Rescue Services</option>
              <option value="DPC-MED">Indian Red Cross / Medical Corps</option>
              <option value="SDMA">SDMA • Disaster Management Authority</option>
            </select>
          </div>


          {/* Responder ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">RESPONDER ID / CALL SIGN:</label>
            <div className="relative">
              <input
                type="text"
                value={responderId}
                onChange={(e) => setResponderId(e.target.value)}
                placeholder="e.g., CMD-001, RSC-1042, MED-204"
                required
                className="w-full py-2.5 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <Key className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-3" />
            </div>
          </div>


          {/* Operational PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-300">OPERATIONAL SECURITY PIN:</label>
            <div className="relative">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                required
                className="w-full py-2.5 px-3 pl-8 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <Lock className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Trust Device Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="trustDevice"
              checked={trustDevice}
              onChange={(e) => setTrustDevice(e.target.checked)}
              className="rounded border-slate-700 text-amber-500"
            />
            <label htmlFor="trustDevice" className="text-xs text-slate-300 cursor-pointer">
              Trust this device for <span className="text-amber-400 font-bold">Offline Mesh Operations</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-xl shadow-amber-950/60 flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <ArrowRight className="w-4 h-4" />
              <span>{loading ? 'Verifying Credentials...' : 'VERIFY & ACCESS DASHBOARD'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};