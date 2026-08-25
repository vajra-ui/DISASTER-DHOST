import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DhostAuthProvider } from './store/DhostAuthContext';
import { TopSystemBar } from './components/common/TopSystemBar';
import { DemoSwitcherModal } from './components/common/DemoSwitcherModal';
import { OfflineLogoutModal } from './components/common/OfflineLogoutModal';
import { DhostPacketInspectorModal } from './components/common/DhostPacketInspectorModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { CinematicSplashScreen } from './components/common/CinematicSplashScreen';

// Screens
import { EmergencyHomeScreen } from './components/home/EmergencyHomeScreen';
import { VictimEmergencyFlow } from './components/victim/VictimEmergencyFlow';
import { SafeCheckInScreen } from './components/victim/SafeCheckInScreen';
import { CommunityReportScreen } from './components/volunteer/CommunityReportScreen';
import { ResponderLoginScreen } from './components/auth/ResponderLoginScreen';
import { CommanderDashboard } from './components/command/CommanderDashboard';
import { RescueTeamDashboard } from './components/rescue/RescueTeamDashboard';
import { MedicalTeamDashboard } from './components/medical/MedicalTeamDashboard';
import { MeshNetworkScreen } from './components/network/MeshNetworkScreen';
import { DisasterSimulationScreen } from './components/simulation/DisasterSimulationScreen';

export function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <CinematicSplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <DhostAuthProvider>
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-amber-500 selection:text-slate-950">
          
          {/* Top Sticky System Status Bar */}
          <TopSystemBar />

          {/* Core Routes Container */}
          <main className="flex-1 w-full">
            <Routes>
              {/* Public Zero-Auth Emergency Routes (Never block with login) */}
              <Route path="/" element={<EmergencyHomeScreen />} />
              <Route path="/victim" element={<VictimEmergencyFlow />} />
              <Route path="/safe" element={<SafeCheckInScreen />} />
              <Route path="/help-others" element={<CommunityReportScreen />} />

              {/* Responder Authentication Portal */}
              <Route path="/responder/login" element={<ResponderLoginScreen />} />

              {/* Role-Protected Operations Dashboards */}
              <Route 
                path="/command" 
                element={
                  <ProtectedRoute allowedRoles={['COMMANDER']}>
                    <CommanderDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/rescue" 
                element={
                  <ProtectedRoute allowedRoles={['RESCUE_TEAM', 'COMMANDER']}>
                    <RescueTeamDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/medical" 
                element={
                  <ProtectedRoute allowedRoles={['MEDICAL', 'COMMANDER']}>
                    <MedicalTeamDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Shared Tactical Tools */}
              <Route 
                path="/network" 
                element={
                  <ProtectedRoute allowedRoles={['COMMANDER', 'RESCUE_TEAM', 'MEDICAL', 'VOLUNTEER']}>
                    <MeshNetworkScreen />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/simulation" 
                element={
                  <ProtectedRoute allowedRoles={['COMMANDER', 'RESCUE_TEAM', 'MEDICAL']}>
                    <DisasterSimulationScreen />
                  </ProtectedRoute>
                } 
              />

              {/* Fallback to Emergency Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Floating Modals */}
          <DemoSwitcherModal />
          <OfflineLogoutModal />
          <DhostPacketInspectorModal />

        </div>
      </DhostAuthProvider>
    </BrowserRouter>
  );
}

export default App;

