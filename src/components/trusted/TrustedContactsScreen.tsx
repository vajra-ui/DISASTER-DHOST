import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  Trash2,
  Bell,
  ShieldCheck,
  Check,
  Plus
} from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';

export const TrustedContactsScreen: React.FC = () => {
  const {
    userProfile,
    addTrustedContact,
    removeTrustedContact,
    toggleAutoAlert
  } = useSafety();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Family');
  const [phone, setPhone] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addTrustedContact({
      name,
      relation,
      phone,
      status: 'Available',
      autoAlertOnEmergency: true,
      notifyOnStart: true,
      notifyOnArrival: true
    });

    setName('');
    setPhone('');
    setIsAdding(false);
  };

  return (
    <div className="min-h-full pb-24 px-4 pt-6 max-w-md mx-auto space-y-5 animate-in fade-in duration-200 select-none">
      
      {/* 1. HEADER */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your Trusted Circle</h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          People who can watch over your journey
        </p>
      </div>

      {/* 2. AUTO-ALERT EMERGENCY TOGGLE CARD */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Auto-alert during emergencies</h4>
            <p className="text-[11px] text-slate-500">Notifies guardians automatically on SOS</p>
          </div>
        </div>

        {/* Modern Switch */}
        <button
          onClick={toggleAutoAlert}
          className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 ease-in-out ${
            userProfile.autoAlertEmergencies ? 'bg-emerald-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
              userProfile.autoAlertEmergencies ? 'translate-x-5.5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 3. ADD CONTACT ACTION / INLINE MODAL */}
      {isAdding ? (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-3xl bg-white border border-emerald-300 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
            Add New Guardian
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
              required
            />
            <select
              value={relation}
              onChange={(e) => setRelation(e.target.value)}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none"
            >
              <option value="Family">Family</option>
              <option value="Sister">Sister</option>
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Friend">Friend</option>
              <option value="Partner">Partner</option>
            </select>
          </div>

          <input
            type="tel"
            placeholder="Phone number (+91 ...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold transition shadow-xs"
            >
              Save Contact
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-white border border-dashed border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 text-xs font-extrabold flex items-center justify-center gap-2 transition active:scale-98 shadow-2xs"
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>+ Add Trusted Contact</span>
        </button>
      )}

      {/* 4. CONTACTS LIST */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-xs text-slate-500 uppercase tracking-wider px-1">
          Active Guardians ({userProfile.trustedCircle.length})
        </h3>

        {userProfile.trustedCircle.map((contact) => (
          <div
            key={contact.id}
            className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-between group transition hover:border-slate-300"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <img
                  src={contact.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80'}
                  alt={contact.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-2xs"
                />
                <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5"></span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-slate-900">{contact.name}</h4>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {contact.relation}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{contact.phone}</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  ● Available
                </span>
              </div>
            </div>

            {/* Actions: Call & Remove */}
            <div className="flex items-center gap-1.5">
              <a
                href={`tel:${contact.phone}`}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition"
                title="Call"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => removeTrustedContact(contact.id)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-400 hover:text-red-600 transition"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
