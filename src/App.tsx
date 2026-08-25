import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DhostAuthProvider } from './store/DhostAuthContext';
import { TopSystemBar } from './components/common/TopSystemBar';
import { DemoSwitcherModal } from './components/common/DemoSwitcherModal';
import { OfflineLogoutModal } from './components/common/OfflineLogoutModal';
import { DhostPacketInspectorModal } from './components/common/DhostPacketInspectorModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center select-none animate-in fade-in duration-300">
        <div className="space-y-4">
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-2xl shadow-red-950/80 animate-pulse">
            <span className="text-3xl">🆘</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white">DISASTER DHOST</h1>
            <p className="text-xs font-mono text-amber-400">Offline Mesh & Emergency Response</p>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-mono text-slate-400">Booting Zero-Auth SOS Engine...</span>
          </div>
        </div>
      </div>
    );
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

