import React from 'react';
import { Home, Navigation, Shield, Users, User } from 'lucide-react';
import { useSafety } from '../../store/useSafetyStore';
import { MainNavTab } from '../../types/safety';

export const BottomNavigation: React.FC = () => {
  const { currentTab, setCurrentTab, activeView, setActiveView } = useSafety();

  if (activeView === 'emergency' || activeView === 'live_journey') {
    return null; // Immersive views have their own focused layout
  }

  const tabs: { id: MainNavTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'journey', label: 'Journey', icon: Navigation },
    { id: 'safety_insights', label: 'Safety', icon: Shield },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const handleTabClick = (tabId: MainNavTab) => {
    setCurrentTab(tabId);
    if (activeView !== 'main') {
      setActiveView('main');
    }
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/80 px-4 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id && activeView === 'main';

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-emerald-50 text-emerald-600 scale-105' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
