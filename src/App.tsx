import React, { useState } from 'react';
import { SafetyProvider, useSafety } from './store/useSafetyStore';
import { DeviceFrameWrapper } from './components/common/DeviceFrameWrapper';
import { BottomNavigation } from './components/common/BottomNavigation';
import { HomeSafetyDashboard } from './components/home/HomeSafetyDashboard';
import { SafeRouteSelectionScreen } from './components/route/SafeRouteSelectionScreen';
import { LiveSafeJourneyScreen } from './components/navigation/LiveSafeJourneyScreen';
import { EmergencyScreen } from './components/emergency/EmergencyScreen';
import { TrustedContactsScreen } from './components/trusted/TrustedContactsScreen';
import { SafetyInsightsScreen } from './components/insights/SafetyInsightsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { SafetyCheckModal } from './components/navigation/SafetyCheckModal';
import { AuthModal } from './components/auth/AuthModal';
import { SplashScreen } from './components/splash/SplashScreen';

const MainAppLayout: React.FC = () => {
  const { currentTab, activeView, isAuthModalOpen, closeAuthModal } = useSafety();
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // If in overlay / immersive views
  if (activeView === 'route_selection') {
    return <SafeRouteSelectionScreen />;
  }

  if (activeView === 'live_journey') {
    return <LiveSafeJourneyScreen />;
  }

  if (activeView === 'emergency') {
    return <EmergencyScreen />;
  }

  return (
    <div className="relative w-full h-full min-h-full flex flex-col justify-between animate-in fade-in duration-300">
      {/* Active Tab View */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && <HomeSafetyDashboard />}
        {currentTab === 'journey' && <SafeRouteSelectionScreen />}
        {currentTab === 'safety_insights' && <SafetyInsightsScreen />}
        {currentTab === 'contacts' && <TrustedContactsScreen />}
        {currentTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Modern 5-Tab Bottom Navigation */}
      <BottomNavigation />

      {/* Safety Check Modal */}
      <SafetyCheckModal />

      {/* Real Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </div>
  );
};

export function App() {
  return (
    <SafetyProvider>
      <DeviceFrameWrapper>
        <MainAppLayout />
      </DeviceFrameWrapper>
    </SafetyProvider>
  );
}

export default App;
