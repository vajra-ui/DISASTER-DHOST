import React, { useState } from 'react';
import {
  User,
  Shield,
  Phone,
  Heart,
  Lock,
  CheckCircle2,
  Save,
  Bell,
  Sparkles,
  LogOut,
  LogIn
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';

export const ProfileScreen: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    currentUser,
    openAuthModal,
    logout
  } = useSafety();

  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [bloodGroup, setBloodGroup] = useState(userProfile.bloodGroup);
  const [emergencyNotes, setEmergencyNotes] = useState(userProfile.emergencyNotes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      bloodGroup,
      emergencyNotes
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="min-h-full pb-24 px-4 pt-6 max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200 select-none">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Emergency credentials & account settings
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-white p-0.5">
          <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      {/* 2. AUTHENTICATION SESSION CARD */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            {userProfile.name[0] || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-slate-900">{userProfile.name}</h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                {currentUser?.isGuest ? 'Guest Session' : 'Active Account'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{currentUser?.email || 'guest@safetydosth.app'}</p>
          </div>
        </div>

        {currentUser && !currentUser.isGuest ? (
          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 transition text-xs font-bold flex items-center gap-1"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        ) : (
          <button
            onClick={openAuthModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition"
          >
            Sign In / Register
          </button>
        )}
      </div>

      {/* 3. PROFILE EDIT FORM */}
      <form onSubmit={handleSave} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Personal & Emergency Medical Details
          </h3>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Emergency Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-500 block mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 block mb-1">Emergency Medical Notes</label>
            <textarea
              value={emergencyNotes}
              onChange={(e) => setEmergencyNotes(e.target.value)}
              rows={2}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
        >
          <Save className="w-4 h-4 text-emerald-400" />
          <span>Save Changes</span>
        </button>
      </form>

      {/* 4. PRIVACY & SECURITY BADGE */}
      <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
          <Lock className="w-4 h-4 text-emerald-600" />
          <span>Privacy-First Architecture</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Your live GPS telemetry is only shared with authorized Trusted Contacts during an active trip or SOS alert. Zero continuous tracking.
        </p>
      </div>

    </div>
  );
};
