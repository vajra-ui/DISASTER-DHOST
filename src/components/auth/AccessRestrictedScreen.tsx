import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDhostAuth } from '../../store/DhostAuthContext';
import { RoleService } from '../../services/roleService';
import { UserRole } from '../../types/dhostAuth';

interface AccessRestrictedProps {
  requiredRole?: UserRole;
  attemptedPath?: string;
}

export const AccessRestrictedScreen: React.FC<AccessRestrictedProps> = ({
  requiredRole = 'COMMANDER',
  attemptedPath
}) => {
  const navigate = useNavigate();
  const { currentUser, authStatus } = useDhostAuth();

  const handleReturnToAllowedDashboard = () => {
    if (currentUser) {
      navigate(RoleService.getDefaultRouteForRole(currentUser.role));
    } else {
      navigate('/responder/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-955 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-red-500/40 rounded-3xl p-6 shadow-2xl shadow-red-950/50 space-y-6 text-center animate-in zoom-in-95 duration-200">
        
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-black tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>ACCESS RESTRICTED</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Security Clearance Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            This sector is strictly restricted to <span className="text-amber-400 font-bold">{RoleService.getRoleLabel(requiredRole)}</span> credentials under National Emergency Operations protocols.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-400">
            <span>Your Session:</span>
            <span className="font-mono text-slate-200 font-bold">{currentUser ? currentUser.responderId : 'Unauthenticated Guest'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Active Role:</span>
            <span className="font-bold text-blue-400">{currentUser ? RoleService.getRoleLabel(currentUser.role) : 'None'}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Status:</span>
            <span className="font-mono text-emerald-400">{authStatus}</span>
          </div>
          {attemptedPath && (
            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/80">
              <span>Attempted Route:</span>
              <span className="font-mono text-rose-400">{attemptedPath}</span>
            </div>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleReturnToAllowedDashboard}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-blue-950/30 flex items-center justify-center gap-2 active:scale-98 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Authorized Dashboard</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700/50 transition"
          >
            Emergency Home (Public SOS)
          </button>
        </div>

      </div>
    </div>
  );
};
