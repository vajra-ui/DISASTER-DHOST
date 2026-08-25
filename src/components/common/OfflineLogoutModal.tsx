import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';
import { useDhostAuth } from '../../store/DhostAuthContext';

export const OfflineLogoutModal: React.FC = () => {
  const { isOfflineLogoutModalOpen, setIsOfflineLogoutModalOpen, logout } = useDhostAuth();

  if (!isOfflineLogoutModalOpen) return null;

  const handleConfirmLogout = () => {
    logout(true);
    setIsOfflineLogoutModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-2xl shadow-amber-950/30 space-y-5 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Offline Session Warning</h3>
              <p className="text-xs text-amber-400 font-medium">Network Unavailable</p>
            </div>
          </div>
          <button
            onClick={() => setIsOfflineLogoutModalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed">
            You are currently operating in <span className="text-amber-400 font-bold">Offline Mesh Mode</span>. Logging out will remove this trusted responder session from this device.
          </p>
          <div className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 p-2.5 rounded-xl">
            ✓ Note: Local emergency packets and broadcasts will remain safely preserved on this device.
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => setIsOfflineLogoutModalOpen(false)}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmLogout}
            className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Anyway</span>
          </button>
        </div>

      </div>
    </div>
  );
};

